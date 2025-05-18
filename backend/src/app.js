const express = require("express");
const authRoute = require("./routes/auth/auth.route");
const userRoute = require("./routes/user");
const errorHandler = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middleware parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// Handle 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
