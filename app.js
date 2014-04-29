var express = require('express');
var compress = require('compression');
var morgan  = require('morgan');

var app = express();
app.use(compress());
app.use(morgan('short'));

app.use('/feed', require('./routes/feed'));
app.use('/post', require('./routes/post'));

// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.status(200);
    res.jsonp({
        status: 1,
        statusInfo: err.message
    });
});

var server = app.listen(18080, function () {
    console.log('Listening on port %d', server.address().port);
});
