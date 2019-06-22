const Posts = require('./models/Posts');
const User = require('./models/User');
const Pictures = require('./models/Pictures');
const Comments = require('./models/Comments');

module.exports = {
    postsModel: () => {
        return new Promise((resolve, reject) => {
            Posts.find()
            .then(result => resolve(result))
            .catch(err => reject(err))
        })
    },

    getAllPosts: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'posts')
            .populate('posts', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })
        })       
    },

    createPost: params => {    
        return new Promise((resolve, reject) => {

            User.findOne({spotifyID: params.id})
            .then(user => {

                let newPost = new Posts({
                    post: params.newStatus,
                    news: params.newStatusNews,
                    playlist: params.newStatusPlaylist,
                    spotifyID: params.id,
                    picture: params.profilePic,
                    display_name: params.name,
                    user_id: user._id
                })

                // save the new post, if saved, push it into the 
                // posts array in users, then save 'user'

                newPost.save()
                .then(savedPost => {

                    user.posts.unshift(savedPost)

                    // return what is being pushed in user
                    user.save()
                    .then(() => {
                        resolve(savedPost)
                    })
                    .catch(error => {
                        reject(error)
                    })

                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))

        })
    },

    deletePost: (userID, postID) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: userID})
            .then(user => {

                let filtered = user.posts.filter(item => {
                    return item != postID
                })

                user.posts = filtered

                user.save()
                .then(() => {
                    Posts.findByIdAndDelete({_id: postID})
                    .then(() => {
                        User.findOne({spotifyID: userID}, 'posts')
                            .populate('posts', '-user_id -__v')
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


    getAllPics: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'pictures')
            .populate('pictures', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })
        })
    },

    addPic: params => {
        return new Promise((resolve, reject) => {
            console.log(params)

            User.findOne({spotifyID: params.id})
            .then(user => {
                console.log(user)

                let newPicUrl = new Pictures({
                    url: params.url,
                    spotifyID: params.id,
                    user_id: user._id
                })

                newPicUrl.save()
                .then(saved => {
                    user.pictures.unshift(saved)

                    user.save()
                    .then(() => resolve(saved))
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => {
                reject(err)
            })
        })      
    },


    deletePic: (id, picID) => {
        return new Promise((resolve, reject) => {
            console.log(id, picID)
            User.findOne({spotifyID: id})
            .then(user => {
                // traverse through users to find the pictures array
                // filter the pictures array
                let filtered = user.pictures.filter(pic => {
                    return pic != picID
                })

                user.pictures = filtered

                user.save()
                .then(() => {
                    Pictures.findByIdAndDelete({_id: picID})
                    .then(() => {
                        User.findOne({spotifyID: id}, 'pictures')
                            .populate('pictures', '-user_id -__v')
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

    editAbout: (id, desc) => {
        return new Promise((resolve, reject) => {
        
            User.findOneAndUpdate({spotifyID: id}, {$set: {about: desc.desc}}, {new: true})
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })

        })
    },

    aboutSection: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id}, 'about')
            .then(result => resolve(result))
            .catch(err => reject(err))
        })
    },

    comments: (params) => {
        return new Promise((resolve, reject) => {

            Posts.findOne({_id: params.postid})
            .then(post => {
                let newComment = new Comments({
                    post: params.comment,
                    theUser: params.id,
                    name: params.name,
                    picture: params.picture,
                    user_id: params.postid
                })

                newComment.save()
                .then(saved => {                      
                    post.comments.push(saved)

                    post.save()
                    .then(() => {
                        resolve(saved)
                    })
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => {
                reject(err)
            })
         
        })
    }, 

    allComments: () => {
        return new Promise((resolve, reject) => {
            Comments.find()
                .then(result => resolve(result))
                .catch(err => reject(err))
        })
    },

    deleteComment: (userID, postID, commID) => {
        return new Promise((resolve, reject) => {

            Posts.findById({_id: postID})
            .then(post => {

                let filtered = post.comments.filter(deleted => {
                    return deleted != commID
                })

                post.comments = filtered

                post.save()
                .then(() => {
                    Comments.findByIdAndDelete({_id: commID})
                    .then(() => {
                        Posts.findById({_id: postID}, 'comments')
                        .populate('comments', '-user_id -__v')
                        .exec((err, user) => {
                            err ? reject(err) : resolve(user)
                        })
                    })
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))

        })
    },

    editComment: (id, newState, newStateID) => {
        return new Promise((resolve, reject) => {
            Comments.findOneAndUpdate({_id: newStateID}, {$set: {post: newState}}, {new: true})
            .then(comm => resolve(comm))
            .catch(err => reject(err))        
        })
    },

    editPost: (userid, postid) => {
        return new Promise((resolve, reject) => {
            console.log(userid, postid);
            
            // User.findOne({spotifyID: userid})
            // .then(user => {
            //     Posts.findByIdAndUpdate({_id: postid}, )
            // })
        })
    }
}