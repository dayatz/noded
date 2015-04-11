var mongoose = require('mongoose');
var User = require('./models').User;


var addUser = function (req, res) {
    var user = new User(req.body);
    user.save();
    res.json(user);
};

var viewUser = function (req, res) {

};

module.exports.addUser = addUser;
module.exports.viewUser = viewUser;
