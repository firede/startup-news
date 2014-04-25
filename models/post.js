var cheerio = require('cheerio');
var EventEmitter = require('events').EventEmitter;

/**
 * Post
 */
function Post() {
    EventEmitter.call(this);
}

require('util').inherits(Post, EventEmitter);

Post.prototype.init = function(id) {
    this.id = id;
};

module.exports = Post;
