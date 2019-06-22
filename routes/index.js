// const userController = require('./controllers/userController');
const express = require('express');
const router = express.Router();

// var spotify = function (req, res, next) {
//   console.log('LOGGED')
//   next()
// }

// router.use(spotify)

// var spotify = router.get('/callback', function (req, res, next) {
//   // res.redirect('/callback')
//   console.log('hello world!')
//   next()
// })

// router.use(spotify)

router.get('https://api.spotify.com/v1/me', (req, res) => {
  console.log('callback is working')
  res.redirect('/callback')
})

// router.use(function(req, res, next) {
//     console.log('logged')
//     next()
// })

// router.get('/callback', (req, res) => {
//     res.send('Hello spotify')
//     userController.spotifyLogin(req.body)
//     .then(result => {
//       res.send(result)
//     })
//     .catch(err => {
//       res.send(err)
//     })
// });

module.exports = router;