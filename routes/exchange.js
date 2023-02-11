const express = require("express");
const router = express.Router();
const utils = require("../utils");

router.get("/find", utils.isAuthenticated, async (req, res) => {
	const { name } = req.query;

	if (!name) {
		res.status(400).json({ error: "No name provided" });
		return;
	}

	let price = await utils.getStockPrice(name);
	if (price === null || price === undefined) {
		res.status(400).json({ error: "No price found!" });
		return;
	}

	const bars = await utils.getStockBars(name);
	if (bars === null || bars === undefined) {
		res.status(400).json({ error: "No bars found!" });
		return;
	}

	const startPrice = bars[0].c;
	const absChange = price[name].p - startPrice;
	const percentChange = (absChange / startPrice) * 100;

	const timeinterval = bars.map((bar) => new Date(bar.t).getHours() + " Uhr");
	const barsData = bars.map((bar) => bar.c);

	const data = [
		{
			name: name,
			price: price[name].p,
			absChange: absChange,
			percentChange: percentChange,
			history: {
				timeinterval: timeinterval,
				data: barsData,
			},
		},
	];

	const result = data.filter((item) => item.name === name);

	if (result.length === 0) {
		res.status(400).json({ error: "No match found!" });
		return;
	}

	res.json(result);
});

module.exports = router;
