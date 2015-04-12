var express = require('express');
var router = express.Router();
var controllers = require('./controller');
var isUserAuthenticated = require('../core/controller').isUserAuthenticated;

router.route('/board')
    .post(controllers.addBoard)
    .get(controllers.myBoard);

module.exports = router;