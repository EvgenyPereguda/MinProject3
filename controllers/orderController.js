"use strict";
const Models = require("../models");


const getOrders = (req, res) => {
  
  if (req.query.hasOwnProperty("join")){  
    Models.DishPlace.read("join")
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
  }
  else{   
  
    Models.DishPlace.read()
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
  }
}


const getOrderQuery = (req, res) => {
  
  if (req.query.hasOwnProperty("join")){  
    Models.DishPlace.read(req.params.id, "join")
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
  }
  else{   
  
    Models.DishPlace.read()
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
  }
}


const createOrder = (req, res) => {

  Models.DishPlace.create(req.body)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
}


const deleteOrder = (req, res) => {  
    Models.DishPlace.delete(req.params.id)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
}


module.exports = {
  getOrders,
  getOrderQuery,
  createOrder,
  deleteOrder
};