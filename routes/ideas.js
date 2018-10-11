const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Load Ideas Model 
require('../models/Ideas');
const Idea = mongoose.model('ideas');

//Ideas Rout
router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => { res.render('ideas/index', { ideas: ideas }); });


});

// Add Idea Form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea 
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', { idea: idea });
        });

});

//Precess Form
router.post('/', (req, res) => {
    let error = [];
    if (!req.body.title) {
        error.push({ text: 'Plese enter some Title' });
    }
    if (!req.body.details) {
        error.push({ text: 'Plese enter some details' });
    }
    if (error.length > 0) {
        res.render('ideas/add', {
            error: error,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };

        new Idea(newUser).save().then(() => {
            req.flash('success_msg', 'Idea added');

            res.redirect('/ideas');
        });
    }
});

router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;

        idea.details = req.body.details;

        idea.save().then(() => {
            req.flash('success_msg', 'Idea Edited');

            res.redirect('/ideas');
        });
    });
});

router.delete('/:id', (req, res) => {
    Idea.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Idea Deleted');

            res.redirect('/ideas');
        });
    // res.send('Winter');
});

module.exports = router;