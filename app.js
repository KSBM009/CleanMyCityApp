const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const useragent = require("express-useragent");
const port = 5500;

var user = require('./routes/userRoute');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
