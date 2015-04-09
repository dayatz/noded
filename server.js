var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// db config
var configDB = require('./config/db');
mongoose.connect(configDB.url); //connect to database
var db = mongoose.connection;
db.on('error', console.error);
db.on('open', function(){
    console.log('Connected to MongoDB: ' + configDB.url);
});


// run and logging with morgan
app.use(morgan('combined'));
app.listen(3000);
console.log('Server running on http://127.0.0.1:3000');