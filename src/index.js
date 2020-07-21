/*!
 * NoVELreader JavaScript Library v1.0.0
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 *
 * Date: 2020-07-21T22:49Z
*/
import $ from 'jquery';
import './js/turn.js';
import './css/novel.css';
(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    // For CommonJS and CommonJS-like environments where a proper `window`
    // For environments that do not have a `window` with a `document`
    // (such as Node.js), expose a factory as module.exports.
    // This accentuates the need for the creation of a real `window`.
    module.exports = global.document ?
      factory(options, global, true) :
      function (w) {
        if (!w.document) {
          throw new Error("NovelReader requires a window with a document");
        }
        return factory(options, w);
      };
  } else {
    factory(options, global);
  }
  // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (options, window, noGlobal) {
  "use strict";

  var that = this;
  this.defaultsOption = {
    element: '',
    bgColor: '#e9dfc7',
    fontSize: 14,
    chapterTitle: undefined,
    with: $(window).with(),
    height: $(window).height(),
    data: '',// 小说内容
    elevation: 80, //翻页阴影
    display: 'single', //页面模式
    turnCorners: 'bl,br', //翻页方向
    turning: function () { }, // 翻页中回调
    turned: function () { }, // 翻页结束
  }
  function addDom() {
    var ReaderContent = $(that.defaultsOption.element);
    if (!that.defaultsOption.element) new Error('root element required');
    if (ReaderContent) {

      var _content = $('<div/>', {
        'class': 'reader-h5-content',
        'id': 'magazine',
        css: {
          position: 'relative',
          with: that.defaultsOption.with || '100%',
          height: that.defaultsOption.height || '100%',
          'touch-action': 'none',
          overflow: 'hidden'
        }
      })
      _content.html('<div style="fontSize:' + that.defaultsOption.fontSize + '; background: ' + that.defaultsOption.bgColor + '" class="pages_box" id="pages"></div><div class="content_box"}><div class="contentText_box" id="contentText"></div></div>')
    }
    ReaderContent.append(_content);

  }

  // 滑动iphone出现滚动
  function scrollIphone() {
    let A = navigator.userAgent;
    if (A.indexOf("Android") > -1 || A.indexOf("Linux") > -1) { } else {
      if (A.indexOf("iPhone") > -1) {
        $(window).on("scroll.elasticity", function (B) {
          B.preventDefault()
        }).on("touchmove.elasticity", function (B) {
          B.preventDefault()
        })
      } else {
        if (A.indexOf("Windows Phone") > -1) { }
      }
    }
  }

  function prepareOptions(options, options_to_extend) {
    var _options = {};
    if ((typeof options === 'string') || (options instanceof Array)) {
      _options.text = options;
    } else {
      _options = options;
    }
    return $.extend({}, options_to_extend, _options);
  }

  function init(_options) {
    that.defaultsOption = prepareOptions(_options, that.defaultsOption);
    addDom();
    scrollIphone();
  }
  init(options);
})
