const express = require("express");
const router = express.Router();

const dishRoutes = require("./dish.route");

// Define API routes
router.use("/dishes", dishRoutes);

// Add other user routes here

module.exports = router;
