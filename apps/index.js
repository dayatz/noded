var express = require('express');
var app = module.exports = express();
var organizer = require('./organizer/routes');
var core = require('./core/routes');

app.use('/users', core);

app.use('/organizer', organizer);