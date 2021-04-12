const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const UserModel = mongoose.model('User', userScheme);

module.exports = UserModel;