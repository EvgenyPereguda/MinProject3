"use strict";

require("dotenv").config();

const mysql = require('mysql2');

console.log("dbConnect");
  
const connectMysql = () => {
    try {
      console.log("connectMysql");

        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
          });

          console.log(`Successful connection to MySQL`);

          connection.promise().query({
            sql: `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`,
            rowsAsArray: true,
          });


        console.log(`Successful create database ${process.env.DB_NAME} to MySQL`);

        
        connection.promise().query({
            sql: `USE ${process.env.DB_NAME};`,
            rowsAsArray: true,
          });

          console.log(`${connection}`)

      return connection;
    } catch (error) {
      console.error("Unable to connect to MySQL database:", error);
      process.exit(1);
    }
  };

  let connection = connectMysql();

  module.exports = {
    connection: connection,
  };
  
