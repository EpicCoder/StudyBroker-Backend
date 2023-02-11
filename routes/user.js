const express = require("express");
const User = require("../models/userModel");
const utils = require("../utils");
const router = express.Router();

router.get("/info", utils.isAuthenticated, async (req, res) => {
	const userID = req.session.userID;
	const user = await User.findOne({ _id: userID });
	res.json({ name: user.name, avatar: user.avatar });
});

module.exports = router;
