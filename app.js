const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const useragent = require("express-useragent");

var user = require('./routes/userRoute');

mongoose.connect(process.env.MONGOURL || 'mongodb+srv://kevinstephenbiju2025:YgPEgzKU86t@ksbmcluster01.rfmkko1.mongodb.net/?retryWrites=true&w=majority&appName=KsbmCluster01',
{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Connected to Database!');
}).catch((er)=>{
    console.log(er);
});

var port = process.env.PORT || 5500;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
3});