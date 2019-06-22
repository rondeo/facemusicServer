var express = require('express');
var router = express.Router();
var messageController = require('./controllers/messageController')

router.get('/allmessages/:id', (req, res) => {
    messageController.allMessages(req.params.id)
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.status(400).json(error)
    })
})

router.post('/createmessage/:id', (req, res) => { 
    messageController.createMessage(req.body)
    .then(result => {
        res.json(result)
        // res.render('index', { title: 'Messages' })
    })
    .catch(error => {
        res.status(400).json(error)
    })
})

module.exports = router;