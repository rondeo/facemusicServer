const passport = require('passport');

const SpotifyStrategy = require('passport-spotify').Strategy;

const User = require('../controllers/models/User');

const userController = require('../controllers/userController');
const { jsonSecret } = require('../config/keys');

// The strategy takes in the fields it will look for to authenticate a user, 
//then the method it will authenticate a user with.

passport.use(
    new SpotifyStrategy({
        clientID: 'b40a880e696b433981d9888e1f9c9ab3',
        client_secret: 'a549535cd6a042e8ae4ccf1e753405a6',
        callback_url: 'http://localhost:3001/auth/spotify/callback'
    }, (accessToken, refreshToken, expires_in, profile, done) => {
        return new Promise((resolve, reject) => {
            User.findOrCreate({ spotifyID: profile.id }, (err, user) => {
                if(err) {
                    console.log(err)
                    reject(err)
                } else {
                    spotifyApi.clientCredentialsGrant() 
                    .then(data => {
                        console.log(data)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
            })
        })
    })
)


module.exports = passport;
