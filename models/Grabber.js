var EventEmitter = require('events').EventEmitter;
var cache = require('memory-cache');

/**
 * Feed
 */
function Grabber() {
    EventEmitter.call(this);
    this.on('fetchcomplete', this.parse);
}

require('util').inherits(Grabber, EventEmitter);

/**
 * 初始化
 */
Grabber.prototype.init = function() {};

/**
 * 抓取页面
 */
Grabber.prototype.fetch = function() {
    var me = this;
    var http = require('http');

    var cacheData = cache.get(this.srcUrl);

    if (cacheData) {
        this.srcBody = cacheData;
        this.emit('fetchcomplete');
        return;
    }

    http.get(this.srcUrl, function (res) {
        var body = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            me.srcBody = body;
            cache.put(me.srcUrl, body, 60000);
            me.emit('fetchcomplete');
        });

    }).on('error', function (e) {
        me.emit('error', e.message);
    });
};

/**
 * 解析数据
 */
Grabber.prototype.parse = function () {};

module.exports = Grabber;
