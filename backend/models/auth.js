
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    name: {
        type: String,
    },
    description : {
        type: String,
    },
    photo: {
        type: String
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = { User }