module.exports = {
    ensureAutenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'You Are Not Authorized');

        res.redirect('/users/login');
    }
};