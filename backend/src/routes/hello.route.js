const express = require("express");
const router = express.Router();
const helloController = require("../controllers/hello.controller");

router.get("/hello", helloController.sayHello);

module.exports = router;
