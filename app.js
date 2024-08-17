require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT;

const app = express();

//JSON and form-data config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//CORS
app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:5173", "https://you-gram-client.onrender.com"],
    optionsSuccessStatus: 200,
  })
);

app.options("*", cors());

//upload dir
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//database connection
require("./config/db.js");

//routes
const router = require("./routes/Routes.js");
app.use(router);

app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});
