var models = require('./models');
var User = require('../core/models').User;

var addBoard = function (req, res) {
    var board = new models.Board(req.body);
    board.save(function (err, board) {
        if (err) res.json({ 'error': err });
        res.json(board);
    })
};

var myBoard = function (req, res) {
    models.Board.find(function (err, boards) {
        if (err) res.json({'error': err});
        res.json(boards);
    })
};

module.exports.addBoard = addBoard;
module.exports.myBoard = myBoard;