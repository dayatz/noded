var express = require('express');
var router = express.Router();
var boardController = require('./boardController');
var listController = require('./listController');
//var todoController = require('./todoController');

router.route('/board')
    .post(boardController.addBoard) // add new board
    .get(boardController.myBoard); // board detail

router.route('/board/:boardId')
    .get(boardController.boardView) // board detail
    .delete(boardController.deleteBoard) // delete board
    .patch(boardController.patchBoard); // edit board

router.route('/board/:boardId/collaborator') // add or remove board's collaborator
    .post(boardController.addRemoveCollaborator);

router.route('/board/:boardId/list')
    .post(listController.addList); // add a new list to board

router.route('/board/:boardId/list/:listId')
    .get(listController.viewList) // list detail
    .delete(listController.deleteList); // delete list

module.exports = router;