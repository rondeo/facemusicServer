const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    display_name: { type: String, default: '' },
    post: { type: String, default: '' },
    news: { type: Object, default: {} },
    playlist: { type: Object, default: {} },
    spotifyID: { type: String, default: '' },
    picture: { type: String, default: '' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    timestamp: {
        type: String,
        default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
})

module.exports = mongoose.model('Posts', PostSchema);