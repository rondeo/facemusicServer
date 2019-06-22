const User = require('./models/User');
const FriendRequest = require('./models/FriendRequests');
const PendingRequest = require('./models/PendingRequests');
const Friends = require('./models/Friends');
const MainPic = require('./models/MainPic');
const uuid = require('uuidv4');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport-spotify');

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: '5445014665f14870bc86cc9e7e7a21d6',
    clientSecret: '2d690fc37d6d4670a11f9d3cf19e2707',
    redirectUri: 'https://facemusic.herokuapp.com'
});

module.exports = {

    allUsers: () => {
        return new Promise((resolve, reject) => {
            User.find()
            .then(users => {
                resolve(users)
            })
            .catch(err => reject(err))
        })
    },

    regLogin: (params) => {

        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: params.id})
            .then(user => {

                if(!user) {                   

                    const newUser = new User({
                        name: params.display_name,
                        email: params.email,
                        password: params.password,
                        spotifyID: params.id
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) {
                                throw err
                            } else {
                                newUser.password = hash;
                                newUser.save()
                                .then(saved => resolve(saved))
                                .catch(err => reject(err));
                            }
                        })
                    })
                    
                    theUser.save()
                    .then(savedUser => {
                        resolve(savedUser)
                    })
                    .catch(err => {
                        reject(err)
                    })
                    
                }

                resolve(user)
                
            })
            .catch(err => reject(err))
        })
    },
    

    editProfilePic: (id, picUrl) => {
        return new Promise((resolve, reject) => {   
            User.findOneAndUpdate({spotifyID: picUrl.id}, {$set: {profilePic: picUrl.newPic}}, {new: true})
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
        })
    },

    profilePicUrl: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'profilePic')
            .then(result => {
                resolve(result)
            })
            .catch(err => reject(err))
        })
    },

    otherProfilePicUrl: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'profilePic')
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
        })
    },

    friendRequests: (params) => {
        return new Promise((resolve, reject) => {

            console.log('from friendRequests')
            console.log(params)

            User.findOne({spotifyID: params.receiverID})
            .then(found => {

                let newFriend = new FriendRequest({
                    name: params.name,
                    source_id: params.sourceID,
                    spotify_id: params.sourceID
                })

                newFriend.save()
                .then(saved => {
                    found.friendRequests.unshift(saved)                   

                    found.save()
                    .then(result => resolve(result))
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
    },

    allFriendRequests: (id) => {
        return new Promise((resolve, reject) => {
            // Find the user id then find that user's friend requests
            // populate the inner genres database of the user
            // execute the error or success

            User.findOne({spotifyID: id}, 'friendRequests')
            .populate('friendRequests', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })

        })
    },


    deleteRequest: (userID, reqID) => {
        return new Promise((resolve, reject) => {

            User.findOne({spotifyID: userID})
            .then(user => {
                let filtered = user.friendRequests.filter(item => {
                    return item != reqID
                })

                user.friendRequests = filtered

                user.save()
                .then(() => {
                    FriendRequest.findByIdAndDelete({_id: reqID})
                    .then(() => {
                        // save the new info in the browser after reloading
                        User.findOne({spotifyID: userID}, 'friendRequests')
                            .populate('friendRequests', '-user_id -__v')
                            .exec((err, data) => {
                                err ? reject(err) : resolve(data)
                            })
                    })
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
            
        })
    },

    cancelRequest: (userID, pendingID) => {
        return new Promise((resolve, reject) => {

            User.findOne({spotifyID: userID})
            .then(user => {
                let filtered = user.pendingRequests.filter(item => {
                    return item != pendingID
                })

                user.pendingRequests = filtered

                user.save()
                .then(() => {
                    PendingRequest.findByIdAndDelete({_id: pendingID})
                    .then(() => {
                        User.findOne({spotifyID: userID}, 'pendingRequests')
                            .populate('pendingRequests', '-user_id -__v')
                            .exec((err, data) => {
                                err ? reject(err) : resolve(data)
                            })
                    })
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))

        })
    },


    pendingRequests: (params) => {
        return new Promise((resolve, reject) => {

            console.log('from pendingRequests')
            console.log(params)

            User.findOne({spotifyID: params.sourceID})
            .then(found => {
                let pending = new PendingRequest({
                    name: params.name,
                    source_id: params.sourceID,
                    spotify_id: params.id
                })

                pending.save()
                .then(saved => {
                    
                    found.pendingRequests.unshift(saved)

                    found.save()
                    .then(result => resolve(result))
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
    },

    allPendingRequests: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'pendingRequests')
            .populate('pendingRequests', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })           
        })
    },

    // adds new friend from accepted friend request
    friends: (params) => {  
        return new Promise((resolve, reject) => {
            console.log('params from friends')
            console.log(params)

            User.findOne({spotifyID: params.loggedInUser})
            .then(user => {
                console.log('user')
                console.log(user)

                let newFriend = new Friends({
                    name: params.name,
                    profilePic: params.profilePic,
                    spotify_id: params.userID,                  
                    user_id: params.id
                })

                newFriend.save()
                .then(saved => {
                    // add the new friend(source) in the receiver's friends list
                    user.friends.unshift(saved)   

                    user.save()
                    .then(() => {
                        // remove the accepted friend request from the list
                        let filtered = user.friendRequests.filter(item => {
                            return item != params.id
                        })

                        user.friendRequests = filtered

                        user.save()
                            .then(result => resolve(result))
                            .catch(err => reject(err))
                        
                    })
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))

        })
    },

    friendsSource: (params) => {
        return new Promise((resolve, reject) => {
            console.log('params from friendsSource')
            console.log(params)

            // the other person's pending request should be filtered
            User.findOne({spotifyID: params.userID})
            .then(user => {
                console.log('user')
                console.log(user)

                // adding mark to nicole
                let newFriend = new Friends({
                    name: params.loggedInName,
                    profilePic: params.profilePic2,
                    spotify_id: params.loggedInUser, 
                    user_id: params.userID
                })

                newFriend.save()
                .then(saved => {
                    // add the new friend(source) in the receiver's friends list
                    user.friends.unshift(saved)   

                    user.save()
                        .then(result => resolve(result))
                        .catch(err => reject(err))
                })
                .catch(err => reject(err))
                
            })
            .catch(err => reject(err))
        })
    },

    allFriends: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'friends')
            .populate('friends', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            }) 
        })      
    },

    profilePage: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id})
            .populate('posts')
            .populate('friends')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })
        })
    },

    profilePageGenres: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id})
            .populate('genres')
            .exec((err, user) => {

                if(err) {
                    reject(err)
                } else if(user) {
                    spotifyApi.clientCredentialsGrant()
                    .then(data => {
                        console.log('The access token expires in ' + data.body['expires_in']);
                        console.log('The access token is ' + data.body['access_token']);

                        spotifyApi.setAccessToken(data.body['access_token'])

                        let genres = []
                        user.genres.forEach(item => {
                            genres.push(item.genre_lowercase)
                        })
                        
                        let genreList = genres.map(item => {
                            var accessToken = data.body['access_token'] 

                            return new Promise((resolve, reject) => {
                                spotifyApi.getCategory(item, {
                                    country: 'US'
                                })
                                .then(data => {                                    
                                    data.body.itemID = uuid()
                                    data.body.accessToken = accessToken  
                                    data.body.userID = id
                                    resolve(data.body)
                                })
                                .catch(err => {
                                    let capitalize = item[0].toUpperCase() + item.slice(1)
                                    let error = `${capitalize} ${err.message}. Redirecting to previous page...`;
                                    reject(error)
                                })
                            })
                            
                        })

                        Promise.all(genreList)
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(err => {
                                    reject(err)
                                })

                    })
                }
            })
        })
    },


    deleteAccount: (id) => {
        return new Promise((resolve, reject) => {

            User.findOneAndDelete({spotifyID: id})
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
        })
    }
    
}
