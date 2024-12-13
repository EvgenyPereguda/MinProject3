const express = require("express");
const app = express();
require("dotenv").config();

let dbConnect = require("./dbConnect");



app.use(express.json());

app.use('/', express.static('public'))

let customerRoutes  = require('./routes/customerRoutes');
let dishRoutes      = require('./routes/dishRoutes');
let placeRoutes     = require('./routes/placeRoutes');
let orderRoutes    = require('./routes/orderRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/dishes'   , dishRoutes);
app.use('/api/places'   , placeRoutes);
app.use('/api/orders'  , orderRoutes);


let init = require('./init');

init.initData();


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}.`);
});
