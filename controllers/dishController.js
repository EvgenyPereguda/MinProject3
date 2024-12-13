"use strict";
const Models = require("../models");


const getDishes = (req, res) => {
    Models.Dish.read()
      .then((data) => {
        res.send({ result: 200, data: data });
      })
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
}

const getDishQuery = (req, res) => {
  Models.Dish.read(req.params.id)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
}


const createDish = (req, res) => {
  Models.Dish.create(req.body)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
}


const updateDish = (req, res) => {
  Models.Dish.update(req.params.id, req.body)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
}


const deleteDish = (req, res) => {
  
    Models.Dish.delete(req.params.id)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
}



module.exports = {
    getDishes,
    getDishQuery,
    createDish,
    updateDish,
    deleteDish
};