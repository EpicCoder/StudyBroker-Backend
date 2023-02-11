const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	name: { type: String, required: true },
	shares: { type: Number, default: 1 },
	price: { type: Number, required: true },
	date: { type: Number, default: Date.now },
});

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
