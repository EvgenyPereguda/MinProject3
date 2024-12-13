"use strict";

const {Customer} = require("./customer");
const {Place} = require("./place");
const {Dish} = require("./dish");
const {Review} = require("./review");
const {DishPlace} = require("./dishplace");



function init() {
    Customer.sync();
    Place.sync();
    Dish.sync();
    Review.sync();    
    DishPlace.sync();   
  }
  
  init();

  Place.hasMany(Customer);

  Dish.belongTo(DishPlace);

  Place.belongTo(DishPlace);

  Customer.belongTo(DishPlace);

  
module.exports = {
    Customer,
    Place,
    Dish,
    DishPlace
  };
  