# NovelReader
h5 Novel Reader
# 项目中使用
- 安装：npm i novelreader 
- 引用：react、vue（import 'novelreader';）html中引用 'node_modules/novelreader/dist/novelReader.js'
# 配置项说明
- 必传选项require
{element:HTMLDOM,data:string,chapterTitle:string}
 element阅读器根元素；data对应章节的内容；chapterTitle章节的标题
- 可选参数 optional
 {chapterNavArray:Array,showNavBottom:boolean,}
 chapterNavArray章节数据如果有值显示对应的nav，没有传数据你可自定义
 chapterNavArray 的数据结构eg:[{id:1,title:'大圣归来'}]
 showNavBottom显示底部nav默认为true

 