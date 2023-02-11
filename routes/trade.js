const express = require("express");
const Trade = require("../models/tradeModel");
const User = require("../models/userModel");
const utils = require("../utils");
const router = express.Router();

router.get("/overview", utils.isAuthenticated, async (req, res) => {
	const data = {};

	const userID = req.session.userID;
	const user = await User.findOne({ _id: userID });

	data.balance = user.balance;

	// Get Trades from DB
	const trades = await Trade.find({ userId: userID });
	data.totalPurchase = trades.reduce((a, b) => a + b.shares * b.price, 0);
	const symbols = [...new Set(trades.map((trade) => trade.name))];
	const prices = await utils.getStockPrice(symbols.join(","));

	if (prices === undefined || prices === null) {
		res.status(400).json({ error: "Failed to get stock prices!" });
		return;
	}

	const groupedTrades = trades.reduce((acc, curr) => {
		if (!acc.has(curr.name)) {
			acc.set(curr.name, {
				name: curr.name,
				shares: 0,
				price: prices[curr.name].p,
			});
		}
		acc.get(curr.name).shares += curr.shares;
		return acc;
	}, new Map());

	data.trades = Array.from(groupedTrades.values());

	res.json(data);
});

router.get("/transactions", utils.isAuthenticated, async (req, res) => {
	const transactions = await Trade.find({
		userId: req.session.userID,
	}).sort({ date: -1 });

	res.json(transactions);
});

// Transaction: Buy
router.post("/buy", utils.isAuthenticated, async (req, res) => {
	const { name, shares } = req.body;

	if (name === undefined || shares === undefined || shares <= 0) {
		res.status(400).json({ error: "Missing or invalid data!" });
		return;
	}

	const userID = req.session.userID;
	const user = await User.findOne({ _id: userID });

	// Get current price from API
	let pricePerItem = await utils.getStockPrice(name);

	if (pricePerItem === undefined || pricePerItem === null) {
		res.status(400).json({ error: "Failed to get stock price!" });
		return;
	}

	pricePerItem = pricePerItem[name].p;
	const totalPrice = pricePerItem * shares;

	// Check if user has enough money to buy
	if (user.balance < totalPrice) {
		res.status(400).json({ error: "Not enough money!" });
		return;
	}

	user.balance -= totalPrice;
	await user.save();

	// Add new trade to DB
	const newTrade = new Trade({
		userId: userID,
		name: name,
		shares: shares,
		price: pricePerItem,
	});

	await newTrade.save();

	res.json({
		message: "Buy successful!",
		name: newTrade._id,
		shares: newTrade.shares,
		price: newTrade.price,
		date: newTrade.date,
	});
});

// Transaction: Sell
router.post("/sell", utils.isAuthenticated, async (req, res) => {
	const { name, shares } = req.body;

	if (name === undefined || shares === undefined || shares <= 0) {
		res.status(400).json({ error: "Missing data!" });
		return;
	}

	const userID = req.session.userID;
	const user = await User.findOne({ _id: userID });

	// Get share from DB
	const sharesDB = await Trade.find({ userId: userID, name: name });
	const sum = sharesDB.reduce((a, b) => a + b.shares, 0);

	// Check if user has enough shares to sell
	if (sum < shares) {
		res.status(400).json({ error: "Not enough shares!" });
		return;
	}

	// Get current price from API
	let pricePerItem = await utils.getStockPrice(name);
	if (pricePerItem === undefined || pricePerItem === null) {
		res.status(400).json({ error: "Failed to get stock price!" });
		return;
	}

	pricePerItem = pricePerItem[name].p;
	const totalPrice = pricePerItem * shares;

	user.balance += totalPrice;
	await user.save();

	const newTrade = new Trade({
		userId: userID,
		name: name,
		shares: -1 * shares,
		price: pricePerItem,
	});

	await newTrade.save();

	res.json({
		message: "Transaction successful!",
		name: newTrade._id,
		shares: newTrade.shares,
		price: newTrade.price,
		date: newTrade.date,
	});
});

module.exports = router;
