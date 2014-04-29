var EventEmitter = require('events').EventEmitter;

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

/**
 * 解析数据
 */
Grabber.prototype.parse = function () {};

module.exports = Grabber;
