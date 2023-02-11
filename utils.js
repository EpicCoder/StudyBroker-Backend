const axios = require("axios");

module.exports = {
	isAuthenticated(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.status(401).json({ message: "Not authenticated!" });
		}
	},

	async getStockPrice(symbol) {
		let result = null;
		try {
			const response = await axios.get(
				`${process.env.ALPACA_API}/v2/stocks/trades/latest`,
				{
					headers: {
						"Apca-Api-Key-Id": process.env.ALPACA_KEY,
						"Apca-Api-Secret-Key": process.env.ALPACA_SECRET,
					},
					params: {
						currency: "EUR",
						symbols: String(symbol),
					},
				}
			);
			result = response.data.trades;
		} catch (error) {
			console.error("Failed to get stock price!");
		}
		return result;
	},

	async getStockBars(symbol) {
		let result = null;
		try {
			const response = await axios.get(
				`${process.env.ALPACA_API}/v2/stocks/${symbol}/bars`,
				{
					headers: {
						"Apca-Api-Key-Id": process.env.ALPACA_KEY,
						"Apca-Api-Secret-Key": process.env.ALPACA_SECRET,
					},
					params: {
						currency: "EUR",
						timeframe: "1Hour",
					},
				}
			);
			result = response.data.bars;
		} catch (error) {
			console.error("Failed to get stock bar!");
		}
		return result;
	},
};
