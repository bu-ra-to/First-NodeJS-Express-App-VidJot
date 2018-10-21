const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

//User Model
require('../models/Users');
const User = mongoose.model('users');

//Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//Login Form Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Register Form Post
router.post('/register', (req, res) => {

    let error = [];
    if (req.body.password != req.body.password2) {
        error.push({ text: 'Passwords do not match' });
    }
    if (req.body.password.length < 4) {
        error.push({ text: 'Passwords must be more than 4 characters' });
    }
    if (error.length > 0) {
        res.render('users/register', {
            errors: error,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error', 'email already taken');

                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            if (err) throw err;

                            newUser.password = hash;

                            newUser.save()
                                .then(() => {
                                    req.flash('success_msg', 'New User Saved to DB');

                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });

    }
});

module.exports = router;
