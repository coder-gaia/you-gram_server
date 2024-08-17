const express = require("express");
const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://alexandre_silva:ZP92zlRCyvL7LncQ@cluster0.t9rgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Successfully connected to database!");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
