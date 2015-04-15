var models = require('./models');
var User = require('../core/models').User;

// board processes
var addBoard = function (req, res) {
    if (!req.body) res.sendStatus(400);
    var board = new models.Board(req.body);
    board._user = req.validateToken._id;
    board.save(function (err, board) {
        if (err) res.json(err);
        res.json(board);
    });
};

var myBoard = function (req, res) {
    var userId = req.validateToken._id;
    models.Board.find({_user: userId}, function (err, boards) {
        if (err) res.json(err);
        models.Board.populate(boards, {path: '_collaborators', select: 'username'}, function (err, boards) {
            res.json(boards);
        });
    });
};

var boardView = function (req, res) {
    var userId = req.validateToken._id;
    var boardId = req.params.boardId;

    models.Board.findOne({_id: boardId}, function (err, board) {
        if (err) res.json(err);
        if (board) {
            if (board._user == userId || board.public == true || isInArray(userId, board._collaborators)) {
                var populateQuery = [
                    { path: '_user', select: '_id username' },
                    { path: '_lists', select: '-_board -_todos' },
                    { path: '_collaborators', select: 'username' }
                ];
                board.populate(populateQuery, function (err, board) {
                    if (err) res.json(err);
                    res.json(board);
                });
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(404);
        }
    });
};

var deleteBoard = function (req, res) {
    models.Board.findOne({_id: req.params.boardId}, function (err, board) {
        if (err) res.json(err);

        if (board) {
            if (board._user == req.validateToken._id) {
                board.remove();
                res.sendStatus(204);
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(404);
        }
    });
};

var patchBoard = function (req, res) {
    var userId = req.validateToken._id;
    var boardId = req.params.boardId;

    models.Board.findOne({_id: boardId}, function (err, board) {
        if (board) {
            if (board._user == userId || isInArray(userId, board._collaborators)) {
                //for (var field in req.body) {
                //    if (board[field] !== undefined) board[field] = req.body[field];
                //}
                patchData(req.body, board);
                board.save(function (err, board) {
                    if (err) res.json(err);
                    res.json(board);
                });
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(404);
        }
    });
};

var addRemoveCollaborator = function (req, res) {
    var userId = req.validateToken._id;
    var boardId = req.params.boardId;
    //var collaboratorId = req.params.collaboratorId;
    var collaboratorId = req.body.collaborator;

    models.Board.findOne({_id: boardId}, function (err, board) {
        if (board) {
            if (board._user == userId) {
                if (isInArray(collaboratorId, board._collaborators)) {
                    board._collaborators.pull(collaboratorId);
                } else {
                    board._collaborators.push(collaboratorId);
                }
                board.save(function (err) {
                    if (err) res.json(err);
                    res.json(board);
                });
            } else {
                res.sendStatus(401);
            }
        }
    });
};
// end board

var addList = function (req, res) {
    if (!req.body) res.sendStatus(400);
    var boardId = req.params.boardId;
    var list = new models.List(req.body);
    list._board = boardId;
    list.save(function (err, list) {
        if (err) res.json(err);

        if (list) {
            models.Board.findById(boardId, function (err, board) {
                board._lists.push(list);
                board.save();
            });
        }

        res.json(list);
    });
};

var viewList = function (req, res) {
    var userId = req.validateToken._id;
    var listId = req.params.listId;
    var boardId = req.params.boardId;

    models.List.findOne({_id: listId, _board: boardId}, function (err, list) {
        if (list) {
            list.populate('_board', '_user public _collaborators', function (err, board) {
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
            list.populate('_board', '_user', function (err, board) {
                if (board._user == userId) {
                    list.remove();
                    res.json({'success': 'removed'});
                } else {
                    res.sendStatus(401);
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
};

// common functions
var patchData = function (data, model) {
    for (var field in data) {
        if (model[field] !== undefined) {
            if (Object.prototype.toString.call(model[field]) == '[object Array]') {
                if (model[field].indexOf(data[field]) == -1) {
                    model[field].push(data[field]);
                }
            } else {
                model[field] = data[field];
            }
        }
    }
};

var boardPermission = function (board, userId) {
    //if (board._user == userId || board.public == true || board._collaborators.indexOf(userId) > -1) return true;
    //return false;
    return (board._user == userId || board.public == true || board._collaborators.indexOf(userId) > -1);

};

var isInArray = function (data, array) {
    return array.indexOf(data) > -1;
};

module.exports = {
    // boards
    'addBoard': addBoard,
    'myBoard': myBoard,
    'boardView': boardView,
    'deleteBoard': deleteBoard,
    'patchBoard': patchBoard,
    'addRemoveCollaborator': addRemoveCollaborator,

    // lists
    'addList': addList,
    'viewList': viewList,
    'deleteList': deleteList
};
