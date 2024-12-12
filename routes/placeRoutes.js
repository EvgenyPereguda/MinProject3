const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

// matches GET requests sent to /api/users
// (the prefix from server.js)
router.get("/", (req, res) => {
  Controllers.placeController.getPlaces(req, res);
});

module.exports = router;