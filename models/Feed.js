var Grabber = require('./Grabber');
var cheerio = require('cheerio');
var extractCreateDate = require('../util').extractCreateDate;

/**
 * Feed
 */
function Feed() {
    Grabber.call(this);
}

require('util').inherits(Feed, Grabber);

/**
 * 初始化Feed
 *
 * @param {string} type 类型，newest 或 hotest
 * @param {string} page 分页token
 */
Feed.prototype.init = function(type, page) {
    this.type = type;
    this.page = page || '';

    var urlIndexPath = type === 'newest' ? '/newest' : '/';
    var urlPath = page === '' ? urlIndexPath : '/x?fnid=' + page;
    this.srcUrl = 'http://news.dbanotes.net' + urlPath;
};

/**
 * 解析为数据对象
 */
Feed.prototype.parse = function () {
    var $ = cheerio.load(this.srcBody);
    var items = $('table:not([width]) tr:not([style])');
    var itemLen = items.length;
    var hasMore = itemLen % 2 === 1;

    var obj = {};
    var data = [];

    items.each(function (i, item) {
        var item = $(item);
        // more
        if (hasMore && i === itemLen - 1) {
            obj.condition = {};
            obj.condition.more = item
                .find('a:contains(More)')
                .attr('href')
                .replace('/x?fnid=', '');

            return false;
        }

        // data index
        var index = Math.floor(i / 2);

        var itemLine = i % 2;

        switch (itemLine) {
            // title
            case 0:
                // init item object
                data[index] = {};

                // the No.
                var noStr = item.find('td:first-child').text();
                data[index].no = parseInt(noStr, 10);

                // title & url
                var titleEl = item.find('.title a');
                data[index].title = titleEl.text();

                var itemUrl = titleEl.attr('href');
                if (itemUrl.indexOf('item?') === 0) {
                    itemUrl = 'http://news.dbanotes.net/' + itemUrl;
                }
                data[index].url = itemUrl;

                // source
                var sourceStr = item.find('.comhead').text();
                data[index].source = sourceStr.replace(/\s\(|\)\s/g, '');

                break;

            // desc
            case 1:
                // points
                var pointsEl = item.find('.subtext span');
                var pointsStr = pointsEl.text();
                data[index].points = parseInt(pointsStr, 10) || 0;
                data[index].id = pointsEl.attr('id').split('_')[1];

                // create date
                var createDateStr = item.find('.subtext').text();
                data[index].createDate = extractCreateDate(createDateStr);

                // author
                var author = item.find('a[href^=user]').text();
                data[index].author = author;

                // comments
                var commentsStr = item.find('a[href^=item]').text();
                data[index].comments = parseInt(commentsStr, 10) || 0;

                break;
        }


    });

    obj.data = data;

    this.emit('complete', obj);
};

module.exports = Feed;
