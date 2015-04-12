var models = require('./models');
var User = require('../core/models').User;

var addBoard = function (req, res) {
    if (!req.body) res.sendStatus(401);
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

module.exports.addBoard = addBoard;
module.exports.myBoard = myBoard;