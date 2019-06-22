const express = require('express');
const router = express.Router();
const updateController = require('./controllers/updateController');
const cloudinary = require('cloudinary');

router.get('/newsfeed', (req, res) => {
    updateController.postsModel()
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
})

// FOR PROFILE PAGE
router.get('/allposts/:id', (req, res) => {
    updateController.getAllPosts(req.params.id)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.post('/createpost/:id', (req, res) => {
    updateController.createPost(req.body)
    .then(result => {
        res.json(result)       
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.delete('/deletepost/:id', (req, res) => {
    updateController.deletePost(req.params.id, req.query.id)
    .then(result => {
        res.json(result)       
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.put('/editabout/:id', (req, res) => {
    updateController.editAbout(req.params.id, req.body)
    .then(result => {
        res.json(result)       
    })
    .catch(err => {
        res.status(400).json(err)
    }) 
});

router.get('/about/:id', (req, res) => {
    updateController.aboutSection(req.params.id)
    .then(result => {
        res.json(result)       
    })
    .catch(err => {
        res.status(400).json(err)
    }) 
})



router.get('/allpics/:id', (req, res) => {
    updateController.getAllPics(req.params.id)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});


router.post('/addpic/:id', (req, res) => {
    updateController.addPic(req.body)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.delete('/deletepic/:id', (req, res) => {
    updateController.deletePic(req.params.id, req.query.picture)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});


router.post('/comments', (req, res) => {
    updateController.comments(req.body)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.get('/allcomments', (req, res) => {
    updateController.allComments()
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.delete('/deletecomment/:id', (req, res) => {
    updateController.deleteComment(req.params.id, req.query.postID, req.query.commID)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.put('/editcomment/:id', (req, res) => {
    updateController.editComment(req.params.id, req.body.currentState, req.body.id)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
});

router.put('/editpostcomment/:id', (req, res) => {
    updateController.editPost(req.params.id, req.body.id)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(400).json(err)
    })
})



module.exports = router;