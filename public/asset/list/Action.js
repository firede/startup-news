/*! 2014 Baidu Inc. All Rights Reserved */
define("list/Action",function(require){function t(t){t=t||{},e(o,t.events||{}),t.events=o,r.call(this,t)}var e=require("saber-lang/extend"),n=require("saber-lang/bind"),i=require("saber-lang/inherits"),r=require("saber-firework/Action"),o={"view:more":function(){var t=this.view;this.model.more().then(n(t.add,t))}};return i(t,r),t});