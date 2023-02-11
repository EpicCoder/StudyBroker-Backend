require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const port = process.env.PORT;

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
		saveUninitialized: false,
		resave: false,
	})
);

app.use(
	cors({
		credentials: true,
		origin: process.env.CORS_ORIGIN,
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));
app.use("/trade", require("./routes/trade"));
app.use("/exchange", require("./routes/exchange"));

app.get("/", (req, res) => {
	res.json({ message: "Hello World!" });
});

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
