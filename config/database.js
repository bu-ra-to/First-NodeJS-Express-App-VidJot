if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://IvanFirstApp:KraKpRo23@ds143603.mlab.com:43603/ivanzagrebelnyy1' };
}
else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' };
}