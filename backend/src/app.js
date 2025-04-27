const express = require("express");
const helloRoute = require("./routes/hello.route");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Middleware parse body
app.use(express.json());

// Routes
app.use("/api", helloRoute);

// Handle 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
