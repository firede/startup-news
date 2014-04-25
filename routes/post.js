var express = require('express');
var router = express.Router();
var Post = require('../models/post');

router.get('/:id', function (req, res) {
    var id = req.params.id;

    res.jsonp({
        status: 0,
        data: id
    });
});

module.exports = router;
