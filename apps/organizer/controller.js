var models = require('./models');
var User = require('../core/models').User;

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
        res.json(boards);
    });
};


var boardView = function (req, res) {
    var userId = req.validateToken._id;
    var boardId = req.params.boardId;

    //models.Board.findOne({user: userId, _id: boardId}, function (err, board) {
    //    models.List.find({board: board._id}, function (err, lists) {
    //        //board._lists = lists;
    //        res.json(board);
    //    });
    //});
    models.Board.findOne({_user: userId, _id: boardId})
        .populate('_lists', '-_board -_todos').exec(function (err, board) {
            if (err) res.json(err);
            res.json(board);
        });
    models.Board.findOne({_id: boardId}, function (err, board) {
        if (board._user == userId || board.public || board._collaborators.indexOf(userId) > -1){
            board.populate('_lists', '-_board -_todos').exec(function (err, board) {
                if (err) res.json(err);
                res.json(board)
            });
        } else {
            res.sendStatus(401);
        }
    });
};

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

    // lists
    'addList': addList
};
