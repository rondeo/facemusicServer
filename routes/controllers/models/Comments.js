const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    post: { type: String, default: '' },
    theUser: { type: String, default: '' },
    name: { type: String, default: '' },
    picture: { type: String, default: '' },
    user_id: { type: String, ref: 'Posts' },
    timestamp: {
        type: String, 
        default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
});

module.exports = mongoose.model('Comments', CommentSchema);