const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const userSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    spotifyID: { type: String, default: '' },
    about: { type: String, default: 'Tell us something exciting about yourself!' },
    profilePic: { type: String, default: '' },
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genres' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Messages' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
    pictures: [{ type: Schema.Types.ObjectId, ref: 'Pictures' }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'FriendRequests' }],
    pendingRequests: [{ type: Schema.Types.ObjectId, ref: 'PendingRequests' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friends' }],
    // comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    timestamp: {
        type: String,
        default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
});

module.exports = mongoose.model('Users', userSchema);