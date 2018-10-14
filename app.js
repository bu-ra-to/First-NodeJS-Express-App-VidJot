const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const ideas = require('./routes/ideas');
const users = require('./routes/users');


//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));


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



//Use Idea Routes
app.use('/ideas', ideas);

//Use Users Routes
app.use('/users', users);

app.listen(5000, () => {
    console.log(`server started on port ${5000}`);
});
