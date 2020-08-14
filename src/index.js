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
export class BKNovelReader {
  constructor(options) {
    this.defaultsOption = options
    this.init()
    this.scrollIphone()
    this.timer = null
  }

  get _options() {
    return {
      bgColor: '#e9dfc7',
      fontSize: 14,
      chapterTitle: '',
      width: 0,
      height: 0,
      data: '',// 小说内容
      elevation: 80, //翻页阴影
      display: 'single', //页面模式
      turnCorners: 'bl,br', //翻页方向
      turning: function () { }, // 翻页中回调
      turned: function () { }, // 翻页结束
      checked: function () { },
      openChapterNav: function () { },//章节选择
      getNextChapter: function () { },// 下一章节
      getPrevChapter: function () { },// 上一章节
      chapterNavArray: [],// 章节目录
      colorBgArray: [{ color: '#fff' }, { color: '#567' }, { color: '#edd566' }, { color: '#f98' }, { color: '#000' }, { color: 'rgb(233, 223, 199)' }],
      showFont: false,
      showNavBottom: true,
      showChapterNav: false,
      checkedId: undefined,
      isFirstChapter: true,
      isLastChapter: false
    }
  }

  init() {
    if (!this.defaultsOption.checkedId) new Error('参数缺失【当前章节id】')
    if (!this.defaultsOption.checkedId && this.defaultsOption.chapterNavArray && this.defaultsOption.chapterNavArray.length) this.defaultsOption.checkedId = this.defaultsOption.chapterNavArray[0]['id']
    if (this.defaultsOption.colorBgArray && this.defaultsOption.colorBgArray.length === 0) this.defaultsOption.colorBgArray = this._options.colorBgArray
    this.prepareOptions(this.defaultsOption, this._options);
    this.addDom();
    this.triggerEvent();
    this.resetComputed(this.defaultsOption.data, 1);
    this.addEvent();
  }

  prepareOptions(options, options_to_extend) {
    var _options = {};
    if ((typeof options === 'string') || (options instanceof Array)) {
      this.showAlert('初始化optins必须为对象');
      new Error('options must be object')
    } else {
      _options = options;
    }
    this.defaultsOption = $.extend({}, options_to_extend, _options);
  }

  addDom() {
    let defaultsOption = this.defaultsOption
    var ReaderContent = $(defaultsOption.element);
    if (!defaultsOption.element) new Error('root element required');
    if (!ReaderContent) new Error('Hi Please check the life cycle of your components, can’t get Dom 😁')
    if (ReaderContent) {
      ReaderContent.css({ fontSize: '16px' })
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
    _navPannel.html('<div class="child_mod"><span>字号</span><button id="bgFontbtn" class="fontsize_button">大</button><button id="smFontbtn" class="fontsize_button">小</button></div>')
    if (this.defaultsOption.colorBgArray && this.defaultsOption.colorBgArray.length) {
      var _bgPannel = '';
      this.defaultsOption.colorBgArray.forEach((item, index) => {
        _bgPannel += '<div class="bk_container" style="background:' + item.color + '"><div class="bk_container_current"></div></div>'
      })
      let _bgSet = '<div class="child_mod"> <span class="bgtext">背景</span>' + _bgPannel + '</div>'
      _navPannel.append(_bgSet)
    }
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
        itemList += '<div class="item_list_box ' + (item.id == defaultsOption.checkedId ? 'current_list' : '') + '"  data-key=' + item.id + '>' + item.title + '</div>'
      })
      _navItemContent.append(itemList)
      _ChapterNav.append(_navItemContent)
      ReaderContent.append(_ChapterNav)
    }
  }

  addEvent() {
    var that = this;
    var $fontBtn = $('#setFontbtn');
    var $nightBtn = $('#nightBtn');
    var $dayBtn = $('#dayBtn');
    var $bgFontbtn = $('#bgFontbtn');
    var $smFontbtn = $('#smFontbtn');
    var $page = $("#pages");
    var $showChapter = $("#showChapter")
    $('.nav_pannel').on('click mousemove touchmove', (e) => { e.stopPropagation() })
    $('.bk_bottom_nav').on('click mousemove touchmove', (e) => { e.stopPropagation() })
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
      this.defaultsOption.bgColor = '#000'
      this.setBgstyle()
    })
    $dayBtn.on('click', (e) => {
      e.stopPropagation();
      $nightBtn.removeClass('hidennight')
      $nightBtn.addClass('showngiht')
      $dayBtn.removeClass('showday')
      $dayBtn.addClass('hidenday')
      this.defaultsOption.bgColor = '#e9dfc7'
      this.setBgstyle()
    })
    $('.bk_container').each(function (index) {
      $(this).on('click', (e) => {
        e.stopPropagation()
        that.defaultsOption.bgColor = that.defaultsOption.colorBgArray[index].color
        that.setBgstyle();
      })
    })
    $bgFontbtn.on('click', (e) => {
      e.stopPropagation();
      if (this.defaultsOption.fontSize > 20) return
      this.defaultsOption.fontSize += 1
      this.setFontSize()
    })
    $smFontbtn.on('click', (e) => {
      e.stopPropagation();
      if (this.defaultsOption.fontSize < 12) return
      this.defaultsOption.fontSize -= 1
      this.setFontSize()
    })
    $page.on('click', (e) => {
      this.defaultsOption.showNavBottom = !this.defaultsOption.showNavBottom;
      this.defaultsOption.showChapterNav = false;
      $('.bk_bottom_nav').toggleClass('show_nav')
      $('.nav_pannel').addClass('hidden_navpannel')
      $('.icon_ft').removeClass('current')
      $('.chapternav_box') && $('.chapternav_box').addClass('hidden_chapternav')
    })
    if ($('.item_list_box')) {
      $('.nav_title_item').on('click', '.item_list_box', function (e) {
        e.stopPropagation()
        that.defaultsOption.checkedId = $(this).attr('data-key');
        that.chapterNavItemAddCurrent(true)
      })
    }
    $showChapter.on('click', (e) => {
      e.stopPropagation()
      if (this.defaultsOption.chapterNavArray.length == 0) {
        if (typeof this.defaultsOption.openChapterNav === 'function') {
          this.defaultsOption.openChapterNav('openNav')
        }
      }
      $('.chapternav_box').removeClass('hidden_chapternav')
      $('.bk_bottom_nav').removeClass('show_nav')
      $('.nav_pannel').addClass('hidden_navpannel')
    })
  }

  initPage(writeStr, pageNumber) {
    if (!writeStr) return;
    let defaultsOption = this.defaultsOption;
    let title = defaultsOption.chapterTitle || defaultsOption.title
    let $wrap = $("#magazine");
    let $page = $("#pages");
    let w = $page.width(); //窗口的宽度
    let h = ($page.height() || $(window).height()); //窗口的高度
    let $content = $("#contentText");
    $content.html('<h4>' + title + '</h4>' + writeStr);
    $content.css({ fontSize: defaultsOption.fontSize })
    let len = writeStr.length + (title ? title.length : 0); //总长度
    let cH = $content.height() || 0; //总高度
    let pageStrNum; //每页大概有多少个字符
    let pages = 1;
    if (cH > h) {
      pageStrNum = ((h - 70) / cH) * len; //每页大概有多少个字符
      var obj = this.overflowhiddenTow($content, writeStr, h - 70, pageStrNum);
      $page.append('<div><h4>' + title + '</h4>' + obj.curr + '</div>');
      while (obj.next && obj.next.length > 0) {
        pages++;
        obj = this.overflowhiddenTow($content, obj.next, h - 70, pageStrNum);
        $page.append('<div><h6>' + title + '</h6>' + obj.curr + '</div>');
      }
      let page = pageNumber ? pageNumber : $page.turn("page") > pages ? pages : $page.turn("page");
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
        let obj = this.getPoint(e);
        moveObj = {
          x: obj.clientX
        };
      });
      $wrap.on("touchmove mousemove", (e) => {
        e.stopPropagation()
        let obj = this.getPoint(e);
        if (!moveObj) { moveObj = { x: obj.clientX } }
        endObj = {
          x: obj.clientX
        };
      });
      $wrap.on("touchend mouseup", (e) => {
        e.stopPropagation()
        if (moveObj && endObj) {
          let mis = endObj.x - moveObj.x;
          this.setBgstyle();
          if (Math.abs(mis) > 30) {
            let pageCount = $page.turn("pages"); //总页数
            let currentPage = $page.turn("page"); //当前页
            if (mis > 0) {
              if (currentPage > 1) {
                $page.turn('page', currentPage - 1);
              } else {
                // 本章节第一页；如果是第一章节toast提示
                if (defaultsOption.isFirstChapter) {
                  this.showAlert('已经是第一页')
                  return
                }
                if (defaultsOption.chapterNavArray && defaultsOption.chapterNavArray.length) {
                  this.computedChapterId('F') ? this.showAlert('已经是第一页') : defaultsOption.getPrevChapter(defaultsOption.checkedId)
                } else { defaultsOption.getPrevChapter(defaultsOption.checkedId) }
              }
            } else {
              if (currentPage < pageCount) {
                $page.turn('page', currentPage + 1);
              } else {
                if (defaultsOption.isLastChapter) {
                  // 本章节最后一页；没有其他章节toast提示
                  this.showAlert('已经是最后一页');
                  return
                }
                if (defaultsOption.chapterNavArray && defaultsOption.chapterNavArray.length) {
                  this.computedChapterId('L') ? this.showAlert('已经是最后一页') : defaultsOption.getNextChapter(defaultsOption.checkedId)
                } else { defaultsOption.getNextChapter(defaultsOption.checkedId) }
              }
            }
          }
        }
        moveObj = null;
        endObj = null;
      });
      this.setBgstyle();
    } else {
      return;
    }
  }

  overflowhiddenTow($texts, str, at, pageStrNum) {
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

  getPoint(e) {
    let obj = e;
    if (e.targetTouches && e.targetTouches.length > 0 || (e.originalEvent && e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 0) || (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length > 0)) {
      obj = e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches[0] : e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 0 ? e.originalEvent.targetTouches[0] : e.originalEvent.changedTouches[0];
    }
    return obj;
  }

  computedChapterId(type) {
    let defaultsOption = this.defaultsOption
    defaultsOption.isFirstChapter = false
    defaultsOption.isLastChapter = false
    if (type == 'F') return defaultsOption.checkedId == defaultsOption.chapterNavArray[0]['id']
    var length = defaultsOption.chapterNavArray.length - 1
    if (type == 'L') return defaultsOption.checkedId == defaultsOption.chapterNavArray[length]['id']
  }

  showAlert(msg) {
    let $alert = $("#alert");
    this.timer && clearTimeout(this.timer);
    $alert.text(msg);
    $alert.fadeIn();
    this.timer = setTimeout(function () {
      $alert.fadeOut();
      clearTimeout(this.timer);
    }, 1500)
  }
  setBgstyle() {
    $('.turn-page').css({ background: this.defaultsOption.bgColor })
    $('#magazine').css({ background: this.defaultsOption.bgColor })
  }

  setFontSize() {
    let $page = $("#pages")
    let $content = $("#contentText")
    let $wrap = $("#magazine")
    $wrap.unbind()
    $page.unbind('turned').unbind('turning').unbind('start')
    $page.html('')
    $content.html('')
    $page.css({ fontSize: this.defaultsOption.fontSize + 'px' })
    this.initPage(this.defaultsOption.data)
  }
  chapterNavItemAddCurrent(reloadChapterStatus) {
    let defaultsOption = this.defaultsOption
    $('.item_list_box').each(function () {
      if ($(this).attr('data-key') == defaultsOption.checkedId) {
        $(this).addClass('current_list')
      } else {
        $(this).removeClass('current_list')
      }
    })
    if (typeof defaultsOption.checked === 'function' && reloadChapterStatus) {
      defaultsOption.checked(defaultsOption.checkedId);
      $('.chapternav_box').addClass('hidden_chapternav')
    }
  }
  resetComputed(data, page) {
    let $page = $("#pages")
    if ($page.turn('pages') && page) { $page.turn('destroy') }
    this.commonMethod()
    this.initPage(data, page)
  }
  reloadChapter(item) {
    let $page = $("#pages")
    let $content = $("#contentText")
    let $wrap = $("#magazine")
    if ($page.turn('pages') && item.pageNumber) { $page.turn('destroy') }
    $page.html('')
    $content.html('')
    $wrap.unbind()
    this.defaultsOption = { ...this.defaultsOption, ...item }
    item.title && (this.defaultsOption.chapterTitle = item.chapterTitle || item.title)
    this.initPage(item.data, item.pageNumber || 1)
    if (this.defaultsOption.chapterNavArray && this.defaultsOption.chapterNavArray.length) this.chapterNavItemAddCurrent(false)

  }
  destroyReader() {
    this.commonMethod()
  }
  commonMethod() {
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
    var $ItemListBox = $('.nav_title_item')
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
    $ItemListBox && $ItemListBox.unbind()
  }
  triggerEvent() {
    var eventop = $.Event("openChapterNav");
    var ReaderContent = $(this.defaultsOption.element);
    ReaderContent.trigger(eventop)
  }
  scrollIphone() {
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
}

!(function (window) {
  window.BKNovelReader = BKNovelReader
})(typeof window !== "undefined" ? window : this)
