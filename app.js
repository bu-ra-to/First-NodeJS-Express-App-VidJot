const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

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
    secret: 'secret',
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

    res.locals.user = req.user || null;

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
