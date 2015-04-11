var express = require('express');
var router = express.Router();
var controllers = require('./controller');

router.route('/')
    .post(controllers.addUser);

module.exports = router;