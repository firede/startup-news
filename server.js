var express = require('express');
var app = express();
var port = 18080;

app.get('/', function (req, res) {
    res.format({
        html: function () {
            res.send('<h1>Hello, World!</h1>');
        },
        json: function () {
            res.send({ content: '<h1>Hello World!</h1>'});
        }
    });

});

app.listen(port);
