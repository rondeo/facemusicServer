const mongoose = require('mongoose')
const moment = require('moment')

const About = new mongoose.Schema({
    aboutYou: { type: String, default: '' },
    user_id: { type: String, ref: 'Users' },
    timestamp: {
        type: String,
        default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
})

module.exports = mongoose.model('About', About);