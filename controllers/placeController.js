"use strict";
const Models = require("../models");


const getPlaces = (req, res) => {
    Models.Place.read()
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
}


module.exports = {
    getPlaces
};