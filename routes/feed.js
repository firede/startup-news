var express = require('express');
var router = express.Router();
var Feed = require('../models/feed');

router.get('/newest', function (req, res) {
    feedHandler(req, res, 'newest');
});

router.get('/hotest', function (req, res) {
    feedHandler(req, res, 'hotest');
});

function feedHandler(req, res, type) {
    var feed = new Feed();
    var page = req.query.page || '';

    feed.init(type, page);

    feed.on('complete', function (json) {
        res.jsonp(json);
    });

    feed.on('error', function (err) {
        console.error(err);
        res.send(500);
    });

    feed.fetch();
}

module.exports = router;
