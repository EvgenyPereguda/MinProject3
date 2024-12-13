const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

router.get("/", (req, res) => {
  Controllers.customerController.getCustomers(req, res);
});

router.post("/create", (req, res) => {
  Controllers.customerController.createCustomer(req, res);
});

module.exports = router;