const User = require('./models/User');
const Messages = require('./models/Messages');

module.exports = {
    allMessages: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({spotifyID: id})
            .populate('messages', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })
        })
    },

    createMessage: (params) => {
        return new Promise((resolve, reject) => {

            User.findOne({spotifyID: params.id})
            .then(user => {

                let newMsg = new Messages({
                    message: params.data.message,
                    spotifyID: params.id,
                    user_id: user._id
                })

                newMsg.save()
                .then(saved => {
                    user.messages.push(saved)

                    user.save()
                    .then(() => resolve(saved))
                    .catch(err => reject(err))
                    
                })
                .catch(error => reject(error))

            })
            .catch(error => reject(error))
        })
    }
}