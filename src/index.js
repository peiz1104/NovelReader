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
      checked: function () { },
      openChapterNav: function () { },//章节选择
      chapterNavArray: [],// 章节目录
      showFont: false,
      showNavBottom: true,
      showChapterNav: false,
      checkedId: undefined
    }
    const colorBgArray = [{ color: '#fff' }, { color: '#567' }, { color: '#edd566' }, { color: '#f98' }, { color: '#000' }, { color: 'rgb(233, 223, 199)' }];
    function addDom() {
      var ReaderContent = $(defaultsOption.element);
      if (!defaultsOption.element) new Error('root element required');
      if (ReaderContent) {
        var _content = $('<div/>', {
          'class': 'reader-h5-content',
          'id': 'magazine',
          css: {
            position: 'relative',
            width: defaultsOption.width || '100%',
            height: defaultsOption.height || '100%',
            'touch-action': 'none',
            overflow: 'hidden'
          }
        })
        _content.html('<div style="font-size:' + defaultsOption.fontSize + 'px;' + ' background: ' + defaultsOption.bgColor + '" class="pages_box" id="pages"></div><div class="content_box"><div class="contentText_box" id="contentText"></div></div>')
      }
      var _navPannel = $('<div/>', {
        class: defaultsOption.showFont ? 'nav_pannel' : 'nav_pannel hidden_navpannel',
      })
      _navPannel.html('<div class="child_mod"><span>字号</span><button id="bgFontbtn" class="fontsize_button">大</button><button id="smFontbtn" class="fontsize_button">小</button></div><div class="child_mod"> <span class="bgtext">背景</span><div class="bk_container bg1"><div class="bk_container_current"></div></div><div class="bk_container bg2"><div class="bk_container_current"></div></div><div class="bk_container bg3"><div class="bk_container_current"></div></div><div class="bk_container bg4"><div class="bk_container_current"></div></div><div class="bk_container bg5"><div class="bk_container_current"></div></div><div class="bk_container bg6"><div class="bk_container_current"></div></div></div>')
      var _alert = $('<div/>', {
        class: 'alert_box',
        id: 'alert'
      })
      var _bottomNav = $('<div/>', {
        class: defaultsOption.showNavBottom ? 'bk_bottom_nav show_nav' : 'bk_bottom_nav'
      })
      _bottomNav.html('<div id="showChapter" class="item"><div class="item_wrap"><div class="common_nt item_hidden"></div><div class="icon_text">目录</div></div></div><div class="item" id="setFontbtn"><div class="item_wrap"><div class="common_nt icon_ft"></div><div class="icon_text">字体</div> </div></div><div id="nightBtn" class="item showngiht"><div class="item_wrap"><div class="common_nt icon_nt"></div><div class="icon_text">夜间</div> </div></div><div id="dayBtn" class="item hidenday"><div class="item_wrap"><div class="common_nt icon_daytime"></div><div class="icon_text">白天</div> </div></div>')
      ReaderContent.append(_content);
      ReaderContent.append(_navPannel);
      ReaderContent.append(_bottomNav);
      ReaderContent.append(_alert);
      if (defaultsOption.chapterNavArray.length) {
        var _ChapterNav = $('<div/>', {
          class: defaultsOption.showChapterNav ? 'chapternav_box' : 'chapternav_box hidden_chapternav',
          css: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: defaultsOption.width * 0.7 + 'px',
            background: '#fff',
            'touch-action': 'none',
            'z-index': 1000,
            height: '100%',
            'box-shaow': '0px 6px 10px 2px rgba(106,115,133,0.36)',
            transition: 'all ease 0.5s'
          }
        })
        _ChapterNav.append('<div class="nav_bar"><div class="item_title">目录</div></div>')
        var _navItemContent = $('<div/>', {
          class: 'nav_title_item'
        })
        var itemList = '';
        defaultsOption.chapterNavArray.forEach((item) => {
          itemList += '<div class="item_list_box"  data-key=' + item.id + '>' + item.title + '</div>'
        })
        _navItemContent.append(itemList)
        _ChapterNav.append(_navItemContent)
        ReaderContent.append(_ChapterNav)
      }
    }

    function addEvent() {
      var $fontBtn = $('#setFontbtn');
      var $nightBtn = $('#nightBtn');
      var $dayBtn = $('#dayBtn');
      var $bgFontbtn = $('#bgFontbtn');
      var $smFontbtn = $('#smFontbtn');
      var $page = $("#pages");
      var $showChapter = $("#showChapter")

      $fontBtn.on('click', (e) => {
        e.stopPropagation();
        $('.nav_pannel').toggleClass('hidden_navpannel')
        $('.icon_ft').toggleClass('current')
      })
      $nightBtn.on('click', (e) => {
        e.stopPropagation();
        $nightBtn.removeClass('showngiht')
        $nightBtn.addClass('hidennight')
        $dayBtn.removeClass('hidenday')
        $dayBtn.addClass('showday')
        defaultsOption.bgColor = '#000'
        setBgstyle()
      })
      $dayBtn.on('click', (e) => {
        e.stopPropagation();
        $nightBtn.removeClass('hidennight')
        $nightBtn.addClass('showngiht')
        $dayBtn.removeClass('showday')
        $dayBtn.addClass('hidenday')
        defaultsOption.bgColor = '#e9dfc7'
        setBgstyle()
      })
      $('.bk_container').each(function (index) {
        $(this).on('click', (e) => {
          e.stopPropagation()
          defaultsOption.bgColor = colorBgArray[index].color
          setBgstyle();
        })
      })
      $bgFontbtn.on('click', (e) => {
        e.stopPropagation();
        if (defaultsOption.fontSize > 20) return
        defaultsOption.fontSize += 1
        setFontSize()
      })
      $smFontbtn.on('click', (e) => {
        e.stopPropagation();
        if (defaultsOption.fontSize < 12) return
        defaultsOption.fontSize -= 1
        setFontSize()
      })
      $page.on('click', (e) => {
        e.stopPropagation();
        defaultsOption.showNavBottom = !defaultsOption.showNavBottom;
        defaultsOption.showChapterNav = false;
        $('.bk_bottom_nav').toggleClass('show_nav')
        $('.nav_pannel').addClass('hidden_navpannel')
        $('.icon_ft').removeClass('current')
        $('.chapternav_box') && $('.chapternav_box').addClass('hidden_chapternav')
      })
      if ($('.item_list_box')) {
        $('.item_list_box').each(function (index) {
          $(this).on('click', (e) => {
            e.stopPropagation()
            defaultsOption.checkedId = $(this).attr('data-key');
            chapterNavItemAddCurrent()
          })
        })
      }
      $showChapter.on('click', (e) => {
        e.stopPropagation()
        if (defaultsOption.chapterNavArray.length == 0) {
          if (typeof defaultsOption.openChapterNav === 'function') {
            defaultsOption.openChapterNav('openNav')
          }
        }
        $('.chapternav_box').removeClass('hidden_chapternav')
        $('.bk_bottom_nav').removeClass('show_nav')
        $('.nav_pannel').addClass('hidden_navpannel')
      })
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
            turning: function (_e, _page, _view) {
              if (typeof defaultsOption.turning === 'function') {
                defaultsOption.turning(_page, _view);
              }
            },
            turned: function (_e, _page, _view, _m) {
              if (typeof defaultsOption.turned === 'function') {
                defaultsOption.turned(_page, _view);
              }
            }
          }
        });

        let moveObj = null;
        let endObj = null;
        $wrap.on("touchstart mousedown", (e) => {
          e.stopPropagation()
          let obj = getPoint(e);
          moveObj = {
            x: obj.clientX
          };
        });
        $wrap.on("touchmove mousemove", (e) => {
          e.stopPropagation()
          let obj = getPoint(e);
          endObj = {
            x: obj.clientX
          };
        });


        $wrap.on("touchend mouseup", (e) => {
          e.stopPropagation()
          if (moveObj && endObj) {
            let mis = endObj.x - moveObj.x;
            setBgstyle();
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
        setBgstyle();
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

    function setBgstyle() {
      $('.turn-page').css({ background: defaultsOption.bgColor })
    }
    function setFontSize() {
      let $page = $("#pages")
      let $content = $("#contentText")
      let $wrap = $("#magazine")
      $wrap.unbind()
      $page.html('')
      $content.html('')
      $('#pages').css({ fontSize: defaultsOption.fontSize })
      initPage(defaultsOption.data)
    }
    function chapterNavItemAddCurrent() {
      $('.item_list_box').each(function () {
        if ($(this).attr('data-key') == defaultsOption.checkedId) {
          $(this).addClass('current_list')
        } else {
          $(this).removeClass('current_list')
        }
      })
      if (typeof defaultsOption.checked === 'function') {
        defaultsOption.checked(defaultsOption.checkedId);
        $('.chapternav_box').addClass('hidden_chapternav')
      }
    }
    function resetComputed(data, page) {
      let $page = $("#pages")
      if ($page.turn('pages') && page) { $page.turn('destroy') }
      commonMethod()
      initPage(data, page)
    }

    function reloadChapter(item) {
      let $page = $("#pages")
      let $content = $("#contentText")
      let $wrap = $("#magazine")
      if ($page.turn('pages') && item.pageNumber) { $page.turn('destroy') }
      $page.html('')
      $content.html('')
      $wrap.unbind()
      defaultsOption.data = item.data
      item.title && (defaultsOption.chapterTitle = item.title)
      initPage(item.data, item.pageNumber || 1)
    }

    function destroyReader() {
      commonMethod()
    }

    function commonMethod() {
      let $page = $("#pages")
      let $content = $("#contentText")
      let $wrap = $("#magazine")
      var $fontBtn = $('#setFontbtn')
      var $nightBtn = $('#nightBtn');
      var $dayBtn = $('#dayBtn');
      var $bgFontbtn = $('#bgFontbtn');
      var $smFontbtn = $('#smFontbtn');
      var $showChapter = $("#showChapter")
      var $bkcontainer = $('.bk_container')
      var $ItemListBox = $('.item_list_box')
      $page.html('')
      $content.html('')
      $page.unbind()
      $wrap.unbind()
      $fontBtn.unbind()
      $nightBtn.unbind()
      $dayBtn.unbind()
      $bgFontbtn.unbind()
      $smFontbtn.unbind()
      $showChapter.unbind()
      $bkcontainer && $bkcontainer.each(function () { $(this).unbind() })
      $ItemListBox && $ItemListBox.each(function () { $(this).unbind() })
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
    function triggerEvent() {
      var eventop = $.Event("openChapterNav");
      var ReaderContent = $(defaultsOption.element);
      ReaderContent.trigger(eventop)
    }

    function init(_options) {
      defaultsOption = prepareOptions(_options, defaultsOption);
      addDom();
      scrollIphone();
      triggerEvent();
      resetComputed(defaultsOption.data, 1);
      addEvent();
    }
    init(options);
    return {
      reloadChapter: function (item) {
        reloadChapter(item)
      },
      destroyReader,
    }
  }
  window.NovelReader = NovelReader;
})(typeof window !== "undefined" ? window : this)

