const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

router.get("/", (req, res) => {
  Controllers.placeController.getPlaces(req, res);
});

router.get("/:id", (req, res) => {
  Controllers.placeController.getPlaceQuery(req, res);
}
);

module.exports = router;