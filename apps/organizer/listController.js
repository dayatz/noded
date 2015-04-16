var models = require('./models');
var isInArray = require('../core/controller').isInArray;
var boardPermission = require('../core/controller').boardPermission;
var patchData = require('../core/controller').patchData;

var addList = function (req, res) {
    if (!req.body) res.sendStatus(400);

    var userId = req.validateToken._id;
    var boardId = req.params.boardId;

    models.Board.findById(boardId, function (err, board) {
        if (err) res.json(err);

        if (board._user == userId || isInArray(board._collaborators, userId)) {
            var list = new models.List(req.body);
            list._board = boardId;
            list.save(function (err, list) {
                if (err) res.json(err);
                board._lists.push(list);
                board.save();
                res.json(list);
            });
        }
    });
};

var viewList = function (req, res) {
    var userId = req.validateToken._id;
    var listId = req.params.listId;
    var boardId = req.params.boardId;

    models.List.findOne({_id: listId, _board: boardId}, function (err, list) {
        if (list) {
            list.populate('_board', '_user public _collaborators', function () {
                if (boardPermission(list._board, userId)) {
                    res.json(list);
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
};

var deleteList = function (req, res) {
    var userId = req.validateToken._id;
    var listId = req.params.listId;
    var boardId = req.params.boardId;

    models.List.findOne({_id: listId, _board: boardId}, function (err, list) {
        if (list) {
            list.populate('_board', '_user', function (err, list) {
                if (list._board._user == userId) {
                    list.remove();
                    res.sendStatus(204);
                } else {
                    res.sendStatus(401);
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
};

var patchList = function (req, res) {
    var userId = req.validateToken._id;
    var listId = req.params.listId;
    var boardId = req.params.boardId;

    models.List.findOne({_id: listId, _board: boardId}, function (err, list) {
        if (list) {
            list.populate('_board', '_user', function (err, list) {
                if (list._board._user == userId) {
                    patchData(req.body, list);
                    list.save(function (err, list) {
                        if (err) res.json(err);
                        res.json(list);
                    });
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
};

module.exports = {
    'addList': addList,
    'viewList': viewList,
    'deleteList': deleteList,
    'patchList': patchList
};