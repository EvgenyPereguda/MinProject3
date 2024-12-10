const express = require("express");
const app = express();
require("dotenv").config();


let dbConnect = require("./dbConnect");

app.use(express.json());

app.use('/', express.static('public'))


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}.`);
});
