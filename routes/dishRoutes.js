const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

// matches GET requests sent to /api/users
// (the prefix from server.js)
router.get("/", (req, res) => {
  Controllers.dishController.getDishes(req, res);
});

router.get("/:id", (req, res) => {
    Controllers.dishController.getDishQuery(req, res);
  }
);

router.post("/create", (req, res) => {
  Controllers.dishController.createDish(req, res);
});

router.put("/:id", (req, res) => {
  Controllers.dishController.updateDish(req, res);
});

router.delete("/:id", (req, res) => {
  Controllers.dishController.deleteDish(req, res);
});

module.exports = router;