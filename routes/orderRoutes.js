const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");


router.get("/", (req, res) => {
  Controllers.orderController.getOrders(req, res);
});

router.get("/:id", (req, res) => {
  Controllers.orderController.getOrderQuery(req, res);
});

router.post("/create", (req, res) => {
  Controllers.orderController.createOrder(req, res);
});

router.delete("/:id", (req, res) => {
  Controllers.orderController.deleteOrder(req, res);
});



module.exports = router;