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

const getCustomerQuery = (req, res) => {
  Models.Customer.read(req.params.id)
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


const updateCustomer = (req, res) => {

  console.log(req.body)

  Models.Customer.update(req.params.id, req.body)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
}


const deleteCustomer = (req, res) => {  
    Models.Customer.delete(req.params.id)
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
    getCustomerQuery,
    createCustomer,
    updateCustomer,
    deleteCustomer
};