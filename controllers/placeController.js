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



const getPlaceQuery = (req, res) => {
 
  if (req.query.hasOwnProperty("customers")) {
    Models.Customer.readChildren(Models.Place, req.params.id)
      .then((data) => res.send({ result: 200, data: data }))
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });

  }else {
    res.send({ result: 400, error: `Unknown query: ${req.query}` });
  }
};


module.exports = {
    getPlaces,
    getPlaceQuery
};