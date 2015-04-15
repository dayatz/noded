var express = require('express');
var router = express.Router();
var controllers = require('./controller');

router.route('/board')
    .post(controllers.addBoard)
    .get(controllers.myBoard);

router.route('/board/:boardId')
    .get(controllers.boardView)
    .delete(controllers.deleteBoard)
    .patch(controllers.patchBoard);

router.route('/board/:boardId/collaborator')
    .post(controllers.addRemoveCollaborator);

router.route('/board/:boardId/list')
    .post(controllers.addList);

router.route('/board/:boardId/list/:listId')
    .get(controllers.viewList);

module.exports = router;