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
            if (board._user == userId || board.public == true || board._collaborators.indexOf(userId) > -1) {
                var populateQuery = [
                    {path: '_user', select: '_id username'},
                    {path: '_lists', select: '-_board -_todos'},
                    {path: '_collaborators', select: 'username'}
                ];
                board.populate(populateQuery, function (err, board) {
                    if (err) res.json(err);
                    res.json(board)
                });
            } else {
                res.sendStatus(401);
            }
        }
        res.sendStatus(404);
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
        }
        res.sendStatus(404);
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

module.exports = {
    // boards
    'addBoard': addBoard,
    'myBoard': myBoard,
    'boardView': boardView,
    'deleteBoard': deleteBoard,

    // lists
    'addList': addList
};
