const express = require("express");
const path = require("path");
const authRoute = require("./routes/auth/auth.route");
const userRoute = require("./routes/user");
const uploadsRoute = require("./routes/uploads/upload.route");
const errorHandler = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const favoriteRoutes = require("./routes/user/favourite.route");
// Middleware parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

// Serve static files
app.use("/public", express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/uploads", uploadsRoute);

app.use("/api/favorites", favoriteRoutes);

// Handle 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
