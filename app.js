const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));


//Load Ideas Model 
require('./models/Ideas');
const Idea = mongoose.model('ideas');

///Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

///Body-Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Method-override middleware
app.use(methodOverride('_method'));

//Session middleware
app.use(session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true,
}));

///Flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');

    res.locals.error_msg = req.flash('error_msg');

    res.locals.error = req.flash('error');

    next();
});

//Index Rout
app.get('/', (req, res) => {
    const title = 'Welcome';

    res.render('index', {
        title: title
    });
});

//About Rout
app.get('/about', (req, res) => {
    res.render('about');
});

//Ideas Rout
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => { res.render('ideas/index', { ideas: ideas }); });


});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea 
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', { idea: idea });
        });

});

//Precess Form
app.post('/ideas', (req, res) => {
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

app.put('/ideas/:id', (req, res) => {
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

app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Idea Deleted');

            res.redirect('/ideas');
        });
    // res.send('Winter');
});

app.listen(5000, () => {
    console.log(`server started on port ${5000}`);
});
