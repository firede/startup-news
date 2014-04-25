var express = require('express');
var router = express.Router();
var Post = require('../models/post');

router.get('/:id', function (req, res) {
    var post = new Post();
    var id = req.params.id;

    post.init(id);

    post.on('complete', function (data) {
        res.jsonp({
            status: 0,
            data: data
        });
    });

    post.on('error', function (err) {
        res.jsonp({
            status: 2,
            statusInfo: err
        });
    });

    post.fetch();
});

module.exports = router;
