const express = require("express");
const helloRoute = require("./routes/hello.route");
const dishRoutes = require("./routes/dishRoutes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

// Gắn route
app.use("/api", helloRoute);
app.use("/api/dishes", dishRoutes); // ✅ Route danh sách món ăn

console.log("✅ Routes mounted: /api, /api/dishes");

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
