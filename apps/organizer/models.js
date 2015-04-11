var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../core/models').User;

var boardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    name: { type: String, required: true },
    description: String,
    public: { type: String, default: false },
    added: { type: Date, default: Date.now() },
    collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

var listSchema = new Schema({
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    name : { type: String, required: true },
    added: { type: Date, default: Date.now() }
});

var todoSchema = new Schema({
    list: { type: Schema.Types.ObjectId, ref: 'List', required: true },
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