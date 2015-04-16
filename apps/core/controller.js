var app = require('express')();
var User = require('./models').User;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config');

var addUser = function (req, res) {
    var user = new User(req.body);
    user.save(function (err, user) {
        if (err) res.json(err);

        var token = generateToken(user);
        res.json({
            'token': token,
            'user': user
        });
    });
};

var viewUser = function (req, res) {
    var userId = req.validateToken._id;
    User.findById(userId).select('-password').exec(function (err, user) {
        if (err) res.json(err);
        res.json(user);
    });
};

var isUserAuthenticated = function (req, res, next) {
    var token = req.get('x-access-token');
    if (!token) {
        res.sendStatus(401);
    }
    try {
        var tokenVerify = jwt.verify(token, config.token.jwtTokenSecret);
        if (tokenVerify) {
            req.validateToken = tokenVerify;
            next();
        } else {
            res.json({ 'error': 'Unauthenticated' });
        }
    } catch(err) {
        res.json(err);
        return false;
    }
};

var userAuth = function (req, res) {
    if (req.method == 'GET') {
        res.send('Noting to do here.');
        return;
    }

    if (!req.body) res.sendStatus(400);
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username}, function (err, user) {
        if (err) res.json(err);
        if (!user) res.sendStatus(401);

        if (user && !user.validPassword(password)) res.sendStatus(401);

        if (user && user.validPassword(password)) {
            var token = generateToken(user);
            res.json({
                'token': token,
                'user': user
            });
        }
    });
};

var generateToken = function (user) {
    var payload = {
        _id: user._id,
        iss: user.name
    };
    return jwt.sign(payload, config.token.jwtTokenSecret, {
        expiresInMinutes: config.token.EXPIRES
    });
};

var comparePassword = function (password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
};

var isInArray = function (data, array) {
    return array.indexOf(data) > -1;
};

var boardPermission = function (board, userId) {
    return (board._user == userId || board.public == true || board._collaborators.indexOf(userId) > -1);
};

var isOwner = function (obj, userId) {
    return obj._user == userId;
};

var patchData = function (data, model) {
    for (var field in data) {
        if (model[field] !== undefined && Object.prototype.toString.call(model[field]) !== '[object Array]')
            model[field] = data[field];
    }
};

module.exports = {
    'addUser': addUser,
    'viewUser': viewUser,
    'userAuth': userAuth,
    'isUserAuthenticated': isUserAuthenticated,
    'isInArray': isInArray,
    'boardPermission': boardPermission,
    'patchData': patchData
};