const mongoose = require('mongoose');
const Schima = mongoose.Schema;
const IdeaSchima = new Schima({
    title:
    {
        type: String,
        required: true
    },
    details:
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

mongoose.model('ideas', IdeaSchima);