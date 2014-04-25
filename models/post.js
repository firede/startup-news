var cheerio = require('cheerio');
var EventEmitter = require('events').EventEmitter;
var extractCreateDate = require('../util').extractCreateDate;

/**
 * Post
 */
function Post() {
    EventEmitter.call(this);
}

require('util').inherits(Post, EventEmitter);

Post.prototype.init = function(id) {
    this.id = id;
    this.srcUrl = 'http://news.dbanotes.net/item?id=' + id;

    this.on('fetchcomplete', this.parse);
};

// 先 copy 过来，跑起来再说
Post.prototype.fetch = function() {
    var me = this;
    var http = require('http');

    http.get(this.srcUrl, function (res) {
        var body = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            me.srcBody = body;
            me.emit('fetchcomplete');
        });

    }).on('error', function (e) {
        me.emit('error', e.message);
    });
};

Post.prototype.parse = function() {
    var $ = cheerio.load(this.srcBody);

    var obj = {};

    // detail
    var detail = {};
    var detailItem = $($('table table:not([width])')[0]);

    if (detailItem.length === 0) {
        this.emit('error', 'Parse Error');
        return;
    }

    // title
    var titleEl = detailItem.find('.title a');
    detail.title = titleEl.text();

    // url
    var detailUrl = titleEl.attr('href');
    if (detailUrl.indexOf('item?') === 0) {
        detailUrl = 'http://news.dbanotes.net/' + detailUrl;
    }
    detail.url = detailUrl;

    // author
    detail.author = detailItem.find('a[href^=user]').text();

    // create date
    detail.createDate = extractCreateDate(detailItem.find('.subtext').text());

    // content
    var detailContent = detailItem.find('tr:nth-child(4) td:nth-child(2)').html();
    if (detailContent.indexOf('<textarea') !== -1) {
        detailContent = '';
    }
    detail.content = detailContent;

    obj.detail = detail;

    // comments
    var comments = [];
    var commentItems = $('table table table:not([width])');

    commentItems.each(function (i, item) {
        var item = $(item);
        var comment = {};

        // author
        var author = item.find('a[href^=user]').text();
        comment.author = author;

        // create date
        var createDateStr = item.find('.comhead').text();
        comment.createDate = extractCreateDate(createDateStr);

        // comment content
        var commentContent = item.find('.comment font').text();
        comment.content = commentContent;

        // points
        var pointsEl = item.find('[id^=score]');
        var pointsStr = pointsEl.text();
        comment.points = parseInt(pointsStr, 10);
        comment.id = pointsEl.attr('id').split('_')[1];

        comments.push(comment);
    });

    obj.comments = comments;

    this.emit('complete', obj);
};

module.exports = Post;
