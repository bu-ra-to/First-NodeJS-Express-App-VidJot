const mongoose = require('mongoose');
const Schima = mongoose.Schema;
const UsersSchima = new Schima({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    date:
    {
        type: Date,
        default: Date.now
    }

});

mongoose.model('users', UsersSchima);