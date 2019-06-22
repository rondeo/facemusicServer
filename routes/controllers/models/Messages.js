const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const messageSchema = new mongoose.Schema({
    message: { type: String, default: '' },
    spotifyID: { type: String, default: '' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    timestamp: {
        type: String,
        default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
})

module.exports = mongoose.model('Messages', messageSchema);