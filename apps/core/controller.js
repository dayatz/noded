var app = require('express')();
var User = require('./models').User;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config');

var addUser = function (req, res) {
    var user = new User(req.body);
    user.save(function (err, user) {
        if (err) res.json({ 'error': err });
        res.json(user);
    });
};

var viewUser = function (req, res) {
    console.log(req.user);
    res.send(req.user);
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
        res.json({ 'error': err });
    }
};

var userAuth = function (req, res) {
    if (req.method == 'GET') {
        res.send('Noting to do here.');
        return;
    }
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username}, function (err, user) {
        console.log(user);
        if (err) res.sendStatus(401);
        if (!user) res.sendStatus(401);
        if (!user.validPassword(password)) res.sendStatus(401);

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


module.exports.addUser = addUser;
module.exports.viewUser = viewUser;
module.exports.userAuth = userAuth;
module.exports.isUserAuthenticated = isUserAuthenticated;