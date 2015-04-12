var express = require('express');
var app = module.exports = express();
var organizer = require('./organizer/routes');
var core = require('./core/routes');

var controller = require('./core/controller');
var userAuth = controller.userAuth;
var isUserAuthenticated = controller.isUserAuthenticated;

app.use('/users', core);
app.use('/auth', userAuth);

app.use('/organizer', isUserAuthenticated, organizer);

app.use('/secret', isUserAuthenticated, function (req, res) {
    res.send('halo, ' + req.validateToken._id);
});