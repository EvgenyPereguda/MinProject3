"use strict";

const mysql = require('mysql2');
  
const connectMysql = async () => {
    try {

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
          });

          console.log(`Successful connection to MySQL`);

          const [results, fields] = await connection.promise().query({
            sql: `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`,
            rowsAsArray: true,
          });


        console.log(`Successful create database ${process.env.DB_NAME} to MySQL`);

      return connection;
    } catch (error) {
      console.error("Unable to connect to MySQL database:", error);
      process.exit(1);
    }
  };

  const connection = connectMysql();

  module.exports = {
    Сonnection: connection,
  };
  
