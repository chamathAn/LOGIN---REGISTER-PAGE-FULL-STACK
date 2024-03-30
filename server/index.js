const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err));

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/authRoutes"));

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
