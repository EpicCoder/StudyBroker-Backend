const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	balance: { type: Number, default: 10000 },
	avatar: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
