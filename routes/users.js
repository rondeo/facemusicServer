var express = require('express');
var router = express.Router();
var userController = require('./controllers/userController');

router.get('/allusers', (req, res) => {
  userController.allUsers(req.query)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
})

router.post('/reglogin', (req, res) => {
  userController.regLogin(req.body)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});



router.post('/friendrequests', (req, res) => {
  userController.friendRequests(req.body)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.get('/allfriendrequests/:id', (req, res) => {
  userController.allFriendRequests(req.params.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});



router.post('/pendingrequests', (req, res) => {
  userController.pendingRequests(req.body)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.get('/allpendingrequests/:id', (req, res) => {
  userController.allPendingRequests(req.params.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});



router.post('/friends', (req, res) => {

  userController.friends(req.body)
    .then(user => {
      
      userController.friendsSource(req.body)
      .then(user => {
        res.json(user)
      })
      .catch(err => {
        res.status(400).json(err)
      })

    })
    .catch(err => {
      res.status(400).json(err)
    })

});

router.get('/allFriends/:id', (req, res) => {
  userController.allFriends(req.params.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.delete('/deleterequest/:id', (req, res) => {
  userController.deleteRequest(req.params.id, req.query.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.delete('/cancelrequest/:id', (req, res) => {
  userController.cancelRequest(req.params.id, req.query.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});


router.put('/profilepic/:id', (req, res) => {
  userController.editProfilePic(req.params.id, req.body)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.get('/profilepicurl/:id', (req, res) => {
  userController.profilePicUrl(req.params.id, req.query.req)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.get('/otherprofilepicurl/:id', (req, res) => {
  userController.otherProfilePicUrl(req.params.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.get('/profile/:id', (req, res) => {
  userController.profilePage(req.params.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.get('/profilegenres/:id', (req, res) => {
  userController.profilePageGenres(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.status(400).json(err))
})



router.delete('/deleteaccount/:id', (req, res) => {
  userController.deleteAccount(req.params.id)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
})

module.exports = router;
