"use strict";
const Models = require("../models");


const getCustomers = (req, res) => {
    Models.Customer.read()
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
}

const createCustomer = (req, res) => {

    Models.Customer.create(req.body)
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
}


module.exports = {
    getCustomers,
    createCustomer
};