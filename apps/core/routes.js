var express = require('express');
var router = express.Router();
var controllers = require('./controller');

router.route('/')
    .post(controllers.addUser)
    .get(controllers.viewUser);

module.exports = router;