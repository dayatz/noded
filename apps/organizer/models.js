var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../core/models').User;

var boardSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    name: { type: String, required: true },
    description: String,
    public: { type: String, default: false },
    added: { type: Date, default: Date.now() },
    _collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    _lists: [{ type: Schema.Types.ObjectId, ref: 'List'}]
});

boardSchema.pre('remove', function (next) {
    mongoose.model('List').remove({_board: this._id}, function (err) {
        console.log(err);
    });
    next();
});

var listSchema = new Schema({
    _board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    name : { type: String, required: true },
    added: { type: Date, default: Date.now() },
    _todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
});

listSchema.pre('remove', function (next) {
    Todo.find({_list: this._id}).remove();
    next();
});

var todoSchema = new Schema({
    _list: { type: Schema.Types.ObjectId, ref: 'List', required: true },
    name : { type: String, required: true },
    added: { type: Date, default: Date.now() },
    done: { type: Boolean, default: false }
});

var Board = mongoose.model('Board', boardSchema);
var List = mongoose.model('List', listSchema);
var Todo = mongoose.model('Todo', todoSchema);

module.exports.Board = Board;
module.exports.List = List;
module.exports.Todo = Todo;