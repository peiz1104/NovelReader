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
!(function (window) {
  var NovelReader = function (options) {
    "use strict";
    var timer = null;
    var defaultsOption = {
      element: '',
      bgColor: '#e9dfc7',
      fontSize: 14,
      chapterTitle: '第一章 大圣归来',
      with: 0,
      height: 0,
      data: '',// 小说内容
      elevation: 80, //翻页阴影
      display: 'single', //页面模式
      turnCorners: 'bl,br', //翻页方向
      turning: function () { }, // 翻页中回调
      turned: function () { }, // 翻页结束
    }
    function addDom() {
      var ReaderContent = $(defaultsOption.element);
      if (!defaultsOption.element) new Error('root element required');
      if (ReaderContent) {

        var _content = $('<div/>', {
          'class': 'reader-h5-content',
          'id': 'magazine',
          css: {
            position: 'relative',
            with: defaultsOption.with || '100%',
            height: defaultsOption.height || '100%',
            'touch-action': 'none',
            overflow: 'hidden'
          }
        })
        _content.html('<div style="fontSize:' + defaultsOption.fontSize + 'px' + '; background: ' + defaultsOption.bgColor + '" class="pages_box" id="pages"></div><div class="content_box"}><div class="contentText_box" id="contentText"></div></div>')
      }
      var _alert = $('<div/>', {
        class: 'alert_box',
        id: 'alert'
      })
      ReaderContent.append(_content);
      ReaderContent.append(_alert);
    }

    function initPage(writeStr, pageNumber) {
      if (!writeStr) return;
      let $wrap = $("#magazine");
      let $page = $("#pages");
      let w = $page.width(); //窗口的宽度
      let h = ($page.height() || $(window).height()); //窗口的高度
      let $content = $("#contentText");
      $content.html('<h4>' + defaultsOption.chapterTitle + '</h4>' + writeStr);
      $content.css({ fontSize: defaultsOption.fontSize })
      let len = writeStr.length + (defaultsOption.chapterTitle ? defaultsOption.chapterTitle.length : 0); //总长度
      let cH = $content.height() || 0; //总高度
      console.log(cH, defaultsOption.fontSize);
      let pageStrNum; //每页大概有多少个字符
      let pages = 1;
      if (cH > h) {
        pageStrNum = ((h - 50) / cH) * len; //每页大概有多少个字符
        var obj = overflowhiddenTow($content, writeStr, h - 50, pageStrNum);
        $page.append('<div> <h4>' + defaultsOption.chapterTitle + '</h4>' + obj.curr + '</div>');
        while (obj.next && obj.next.length > 0) {
          pages++;
          obj = overflowhiddenTow($content, obj.next, h - 50, pageStrNum);
          $page.append('<div> <h6>' + defaultsOption.chapterTitle + '</h6>' + obj.curr + '</div>');
        }
        let page = pageNumber ? pageNumber : $page.turn("page") > pages ? pages : $page.turn("page");
        console.log(page, 'currentpage');
        $page.turn({
          width: w,
          height: h,
          elevation: 80,
          display: 'single',
          autoCenter: true,
          gradients: true,
          turnCorners: 'bl,br',
          pages,
          page,
          when: {
            start: function () { },
            turning: function (_e, _page, _view) { },
            turned: function (_e, _page, _view, _m) {
              console.log(_e, _page, _view, _m, 45)
            }
          }
        });

        let moveObj = null;
        let endObj = null;
        $wrap.on("touchstart mousedown", (e) => {
          let obj = getPoint(e);
          moveObj = {
            x: obj.clientX
          };
        });
        $wrap.on("touchmove mousemove", (e) => {
          let obj = getPoint(e);
          endObj = {
            x: obj.clientX
          };
        });


        $wrap.on("touchend mouseup", (_e) => {
          if (moveObj && endObj) {
            let mis = endObj.x - moveObj.x;
            // this.setBgstyle();
            if (Math.abs(mis) > 30) {
              let pageCount = $page.turn("pages"); //总页数
              let currentPage = $page.turn("page"); //当前页
              if (mis > 0) {
                if (currentPage > 1) {
                  $page.turn('page', currentPage - 1);
                } else {
                  console.log("已经是第一页")
                  showAlert('已经是第一页');
                }
              } else {
                if (currentPage < pageCount) {
                  $page.turn('page', currentPage + 1);
                } else {
                  console.log("最后一页");
                  showAlert('已经是最后一页');
                }
              }
            }
          }
          moveObj = null;
          endObj = null;
        });
        // this.setBgstyle();
      } else {
        return;
      }
    }

    function overflowhiddenTow($texts, str, at, pageStrNum) {
      let throat = pageStrNum;
      let tempstr = str.substring(0, throat);
      let len = str.length;
      $texts.html(tempstr);
      //取的字节较少,应该增加
      while ($texts.height() < at && throat < len) {
        throat = throat + 2;
        tempstr = str.substring(0, throat);
        $texts.html(tempstr);
      }
      //取的字节较多,应该减少
      while ($texts.height() > at && throat > 0) {
        throat = throat - 2;
        tempstr = str.substring(0, throat);
        $texts.html(tempstr);
      }
      return {
        curr: str.substring(0, throat),
        next: str.substring(throat)
      }
    }

    function getPoint(e) {
      let obj = e;
      if (e.targetTouches && e.targetTouches.length > 0) {
        obj = e.targetTouches[0];
      }
      return obj;
    }

    function showAlert(msg) {
      let $alert = $("#alert");
      clearTimeout(timer);
      $alert.text(msg);
      $alert.fadeIn();
      timer = setTimeout(function () {
        $alert.fadeOut();
        clearTimeout(timer);
      }, 1500)
    }

    function resetComputed(data, page) {
      let $page = $("#pages")
      let $content = $("#contentText")
      let $wrap = $("#magazine")
      if ($page.turn('pages') && page) { $page.turn('destroy') }
      $page.html('')
      $content.html('')
      $wrap.unbind()
      initPage(data, page)
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
      defaultsOption = prepareOptions(_options, defaultsOption);
      addDom();
      scrollIphone();
      resetComputed(defaultsOption.data, 1);
    }
    init(options);
  }
  window.NovelReader = NovelReader;
})(typeof window !== "undefined" ? window : this)

