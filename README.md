## NovelReader
h5 Novel Reader
### 项目中使用
- 安装：npm i novelreader 
### 配置项说明
 ##### 属性
|属性|说明|类型|默认值|
|:-|:-:|:-:|-:|
|element|阅读器根元素(required)|string  (eg:'#readerContent')|-|
|data|阅读内容(required)|string |-|
|chapterTitle|章节标题|string|-|
|bgColor|阅读器背景色|string|#e9dfc7|
|checkedId|当前章节id|string number undefined|undefined|
|colorBgArray|可供选择的背景色|Array|[{color:'#567'}]|
|chapterNavArray|章节目录|Array (eg:[{id:xxx,title:xxx}])|[]|
|showNavBottom|是否显示底部导航|boolean|true|
|isFirstChapter|当前章节是否第一章|boolean|true|
|isLastChapter|当前章节是否为最后一章|boolean|true|
##### 方法
|方法|说明|类型|
|:-|:-:|-:|
|turning|翻页过程调用|(currentPage)=>viod|
|turned|翻页结束调用|(currentPage)=>viod|
|checked|点击选择某一章节 (返回当前章节id)|(id)=>viod|
|getNextChapter|下一章节(返回当前章节id)|(id)=>viod|
|getPrevChapter|上一章节(返回当前章节id)|(id)=>viod|
 