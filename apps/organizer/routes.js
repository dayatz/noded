var express = require('express');
var router = express.Router();
var controllers = require('./controller');
var isUserAuthenticated = require('../core/controller').isUserAuthenticated;

router.route('/board')
    .post(controllers.addBoard)
    .get(controllers.myBoard);

router.route('/board/:boardId')
    .get(controllers.boardView)
    .delete(controllers.deleteBoard);

router.route('/board/:boardId/list')
    .post(controllers.addList);

module.exports = router;