var models = require('./models');
var User = require('../core/models').User;

var addBoard = function (req, res) {
    if (!req.body) res.sendStatus(400);
    var board = new models.Board(req.body);
    board.user = req.validateToken._id;
    board.save(function (err, board) {
        if (err) res.json({ 'error': err });
        res.json(board);
    });
};

var myBoard = function (req, res) {
    var userId = req.validateToken._id;
    models.Board.find({user: userId}, function (err, boards) {
        if (err) res.json({'error': err});
        res.json(boards);
    });
};


var boardView = function (req, res) {
    var userId = req.validateToken._id;
    var boardId = req.params.boardId;

    models.Board.findOne({user: userId, _id: boardId}, function (err, board) {
        models.List.find({board: board._id}, function (err, lists) {
            board.lists = lists;
            res.json(board);
        });
    });
};

var addList = function (req, res) {
    if (!req.body) res.sendStatus(400);
    var list = new models.List(req.body);
    list.board = req.params.boardId;
    list.save(function (err, board) {
        if (err) res.json(err);
        res.json(list);
    });
};

module.exports = {
    // boards
    'addBoard': addBoard,
    'myBoard': myBoard,
    'boardView': boardView,

    // lists
    'addList': addList
};