"use strict";

const {Customer} = require("./customer");
const {Place} = require("./place");
const {Dish} = require("./dish");
const {Review} = require("./review");



async function init() {
    await Customer.sync();
    await Place.sync();
    await Dish.sync();
    await Review.sync();    
  }
  
  init();

  Place.hasMany(Customer);

  // Place.hasMany(Dish);

  // Customer.hasMany(Dish);

  // Customer.hasMany(Review);

  // Dish.hasMany(Review);

  // Dish.hasMany(Place);



  
module.exports = {
    Customer,
    Place,
    Dish,
    Review
  };
  