var express = require('express');
var router = express.Router();
var genreController = require('./controllers/genreController');

/* GET home page. */
router.get('/allgenres/:id', (req, res) => {
  genreController.getAllGenres(req.params.id)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
});

router.post('/creategenre/:id', (req, res) => {
  genreController.createGenre(req.body)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
});

router.delete('/deletegenre/:id', (req, res) => { 
  genreController.deleteGenre(req.params.id, req.query.genre)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
});

router.put('/updategenre/:id', (req, res) => {
  // get the user id, the body of the new genre, and then the id of the new body
  genreController.updateGenre(req.params.id, req.body, req.query.genreID)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
});

router.get('/getgenres/:email', (req, res) => {
  genreController.genresToSpotify(req.params.email)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
});

router.get('/genreschosen/:id', (req, res) => {
  genreController.genresPicked(req.params.id)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
});

router.get('/playlist/:id', (req, res) => {
  genreController.playlist(req.params.id, req.query.type)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
})

// router.get('/albuminfo/:category', (req, res) => {
//   genreController.albumInfo(req.params.category)
//   .then(result => {
//     res.json(result)
//   })
//   .catch(error => {
//     res.status(400).json(error)
//   })
// });

module.exports = router;
