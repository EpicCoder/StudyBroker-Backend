const express = require("express");
const router = express.Router();
const axios = require("axios");
const utils = require("../utils");
const User = require("../models/userModel");

router.get("/", (req, res) => {
	res.status(200).json({ authenticated: req.session.user ? true : false });
});

// Callback from GitHub OAuth with code and exchange for token
router.get("/github", async (req, res) => {
	const { code } = req.query;

	if (!code) {
		res.status(400).json({ error: "No code provided" });
		return;
	}

	const getToken = await axios.post(
		"https://github.com/login/oauth/access_token",
		{
			client_id: process.env.GITHUB_CLIENT_ID,
			client_secret: process.env.GITHUB_CLIENT_SECRET,
			code,
		},
		{
			headers: {
				accept: "application/json",
			},
		}
	);

	const token = getToken.data.access_token;

	if (!token) {
		res.status(400).json({ error: "Failed to get token" });
		return;
	}

	const options = {
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	try {
		const getUserName = await axios.get(
			"https://api.github.com/user",
			options
		);

		const getUserMail = await axios.get(
			"https://api.github.com/user/emails",
			options
		);

		const username = getUserName.data.login;
		const avatar = getUserName.data.avatar_url;

		if (!getUserName || !getUserMail) {
			res.status(400).json({
				error: "Failed to get Username and Email!",
			});
			return;
		}

		const mail = getUserMail.data.filter(
			(email) => email.verified && email.primary
		)[0].email;

		const user = await User.findOne({ email: mail });

		if (user) {
			console.log("User found!");
		} else {
			console.log("Need to create User...");
			user = new User({
				name: username,
				email: mail,
				avatar: avatar,
			});
			await user.save();
			console.log("User created!");
		}
		req.session.user = username;
		req.session.userID = user._id.toString();
	} catch (error) {
		console.log("Failed: User auth!");
	}
	res.redirect(process.env.APP_URI + "/");
});

router.get("/logout", utils.isAuthenticated, (req, res) => {
	req.session.destroy();
	res.redirect(process.env.APP_URI + "/login");
});

module.exports = router;
