const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

router.get("/", (req, res) => {
  Controllers.customerController.getCustomers(req, res);
});

router.get("/:id", (req, res) => {
    Controllers.customerController.getCustomerQuery(req, res);
  }
);

router.post("/create", (req, res) => {
  Controllers.customerController.createCustomer(req, res);
});

router.post("/create", (req, res) => {
  Controllers.customerController.createCustomer(req, res);
});

router.put("/:id", (req, res) => {
  Controllers.customerController.updateCustomer(req, res);
});

router.delete("/:id", (req, res) => {
  Controllers.customerController.deleteCustomer(req, res);
});

module.exports = router;