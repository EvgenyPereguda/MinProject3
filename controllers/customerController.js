"use strict";
const Models = require("../models");


const getCustomer = (res) => {
    Models.Customer.do();
}


module.exports = {
    getCustomer
};