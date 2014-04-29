var express = require('express');
var router = express.Router();
var Feed = require('../models/Feed');

router.get('/newest', function (req, res) {
    feedHandler(req, res, 'newest');
});

router.get('/hotest', function (req, res) {
    feedHandler(req, res, 'hotest');
});

function feedHandler(req, res, type) {
    var feed = new Feed();
    var page = req.query.page || '';

    feed.on('complete', function (data) {
        res.jsonp({
            status: 0,
            data: data
        });
    });

    feed.on('error', function (err) {
        res.jsonp({
            status: 2,
            statusInfo: err
        });
    });

    feed.init(type, page);
    feed.fetch();
}

module.exports = router;
