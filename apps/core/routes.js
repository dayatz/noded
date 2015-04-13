var express = require('express');
var router = express.Router();
var controllers = require('./controller');
var isUserAuthenticated = require('./controller').isUserAuthenticated;

router.route('/')
    .post(controllers.addUser)
    .get(isUserAuthenticated, controllers.viewUser);

module.exports = router;