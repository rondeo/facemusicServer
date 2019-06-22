const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const PicSchema = new mongoose.Schema({
    url: { type: String, default: '' },
    spotifyID: { type: String, default: '' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    timestamp: {
        type: String,
        default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
});

module.exports = mongoose.model('Pictures', PicSchema);