const User = require('./models/User');
const Genres = require('./models/Genres');
const uuid = require('uuidv4');

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: '5445014665f14870bc86cc9e7e7a21d6',
    clientSecret: '2d690fc37d6d4670a11f9d3cf19e2707',
    redirectUri: 'https://facemusic.herokuapp.com'
});


module.exports = {
    getAllGenres: (id) => {      
        return new Promise((resolve, reject) => {
            // Find the user id then find that user's genres
            // populate the inner genres database of the user
            // execute the error or success
            User.findOne({spotifyID: id}, 'genres')
            .populate('genres', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })
        })
    },

    createGenre: (params) => {

        return new Promise((resolve, reject) => {

            User.findOne({spotifyID: params.id})
            .then(user => {
                let newGenres = new Genres({
                    genre: params.genre,
                    genre_lowercase: params.genre_lowercase,
                    spotifyID: params.id,
                    user_id: user._id
                })
    
                newGenres.save()
                .then(savedGenre => {

                    user.genres.push(savedGenre)
                    
                    user.save()
                    .then(() => {
                        resolve(savedGenre)
                    })
                    .catch(error => {
                        reject(error)
                    })

                })
                .catch(err => {
                    reject(err)
                })
            })
            .catch(error => {
                reject(error)
            })
        })
    },

    deleteGenre: (userID, genreID) => {
    
        return new Promise((resolve, reject) => {
            // find the user id first that way the server can be able to detect the todoID

            // to get the genreID you have to display it in the then block to check it
            User.findOne({spotifyID: userID})
            .then(user => {
                // Always use a return, otherwise filtered will be blank
                let filtered = user.genres.filter(genre => {
                    return genre != genreID
                })

                user.genres = filtered;
            
                user.save()
                .then(() => {
                    // find the id in the genre model and delete
                    Genres.findByIdAndDelete({_id: genreID})
                    .then(() => {
                        // User.findById({_id: id from the user model}, 'user.genres')
                        // .populate('user.genres', '-__v -user_id from the User model)
                        User.findOne({spotifyID: userID}, 'genres')
                            .populate('genres', '-user_id -__v')
                            .exec((err, data) => {                            
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(data)
                                }
                            }) 

                    })
                    .catch(err => {
                        reject(err)
                    })
                })
                .catch(err => {
                    reject(err)
                })

            })
            .catch(error => {
                reject(error)
            })
        })
    },

    genresToSpotify: (email) => {

        return new Promise((resolve, reject) => {

            User.findOne({email: email})
            .then(() => {

                spotifyApi.clientCredentialsGrant()                  
                .then(data => {
                    console.log('The access token expires in ' + data.body['expires_in']);
                    console.log('The access token is ' + data.body['access_token']);

                    // Save the access token so that it's used in future calls
                    spotifyApi.setAccessToken(data.body['access_token']);

                    spotifyApi.getCategories({
                        country: 'US'
                    })  
                    .then(data => {
                        let { items } = data.body.categories
                        resolve(items)
                    })
                    .catch(err => {
                        reject(err)
                    })

                })
                .catch(err => {
                    console.log('Something went wrong when retrieving an access token', err.message);
                    reject(err)
                })
            })
            .catch(err => {
                reject(err)
            })

        })
    },

    genresChosen: (id) => {
        return new Promise((resolve, reject) => {
            User.findById({_id: id}, 'genres')
            .populate('genres', '-user_id -__v')
            .exec((err, user) => {
                if(err) {
                    reject(err)
                } else if(user) {

                    spotifyApi.clientCredentialsGrant()
                    .then(data => {
                        console.log('The access token expires in ' + data.body['expires_in']);
                        console.log('The access token is ' + data.body['access_token']);
    
                        // Save the access token so that it's used in future calls
                        spotifyApi.setAccessToken(data.body['access_token']);

                        // results = [ 'pop', 'hip hop' ]
                        let genres = results.map(genre => {  
                            
                            var accessToken = data.body['access_token']    

                            return new Promise((resolve, reject) => {
                                
                                spotifyApi.getCategory(genre, {
                                    country: 'US'
                                })
                                .then(data => {                                    
                                    data.body.itemID = uuid()
                                    data.body.accessToken = accessToken 
                                    resolve(data.body)
                                })
                                .catch(err => {
                                    let capitalize = genre[0].toUpperCase() + genre.slice(1)
                                    let error = `${capitalize} ${err.message}. Redirecting to previous page...`;
                                    reject(error)
                                })                             
                                    
                            })
                        })

                        Promise.all(genres)
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(err => {
                                    reject(err)
                                })
                    })
                    .catch(error => {
                        reject(error)
                    })

                }


            }) // User.findById


        }) // end Promise
        
    },

    genresPicked: (id) => {
        return new Promise((resolve, reject) => {

            User.findOne({spotifyID: id}, 'genres')
            .populate('genres', '-user_id -__v')
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

    playlist: (id) => {

        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'genres')
            .populate('genres', '-user_id -__v')
            .exec((err, user) => {

                if(err) {
                    reject(err)
                } else if(user) {                  
                    spotifyApi.clientCredentialsGrant()
                    .then(data => {
                        console.log('The access token expires in ' + data.body['expires_in']);
                        console.log('The access token is ' + data.body['access_token']);
    
                        // Save the access token so that it's used in future calls
                        spotifyApi.setAccessToken(data.body['access_token']); 

                        var accessToken = data.body['access_token']
                        
                        spotifyApi.getUserPlaylists('me')
                        .then(data => {                        
                            data.body.items.map(item => {
                                spotifyApi.getPlaylist(`${item.id}`)
                                .then(list => {                                                                
                                    list.access_token = accessToken
                                    resolve(list)
                                })
                                .catch(err => {
                                    reject(err)
                                }) 

                            }) // playlist

                        })
                        .catch(err => {
                            reject(err)
                        })                        
                    })
                    .catch(error => reject(error))

                }
            })
        })
    }
}