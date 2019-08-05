---
layout:     post
title:      JavaScript
subtitle:   
date:       2019-08-02
categories: JavaScript
author:     miracle
catalog: true
tags:
    - JavaScript
---

* content
{:toc}


简称js
* javascript是嵌入html中在浏览器中运行的脚本语言
* 是一种网页的编程技术,用来向html页面添加交互行为
* 直接嵌入html页面
* 由浏览器解释执行代码,不进行预编译
 
## javascript特点:
- 可以用任何编辑文本的工具编写js代码
- 由浏览器内置的javascript引擎执行代码
- 解释执行:事先不编译,逐行执行
- 基于对象:内置大量的现成的对象   
- 适宜:
   * 客户端的数据计算
   * 客户端的表单验证
   * 浏览器的事件触发
   * 网页特效制作
   * 服务器的异步提交 ajax 
   
## 如何引入js:
三种方式:
1. 把js代码写在html的某个标签中

```js
 <input type="button" value="点一下" onclick="alert('哈哈')" />
``` 

2. 把js代码写在html文件中<head>元素中的<script>标记中  
 这样的<script>标记,在head中可以出现多次  
 <script>可以写在任意位置,但推荐放在<head>中  
 
```js
 <head>
	<script type="text/javascript" language="javascript">
	  function aa(){
		alert("哈哈")
	  }
	</script>
 </head>
```
 在body体中
 
```js
 <input type="button" value="再点一下" onclick="aa();" />
```

3. 把js代码写在专门的js文件中
  test.js
  
```js
  function bb(){
	alert("哈哈 bb方法");
  }
```
在html文件中的head元素中引入js文件
在html的head元素中中可以引入多个js文件
但每个script标记只能引入一个js文件

```js
  <head>
  <script src="test.js" ></script>
  </head>
```
  在body体中
  
```js
 <input type="button" value="再点一下" onclick="bb();" />
```
## js的语法

### js的注释:
* 单行  //  
* 多行 /**/  
* js代码区分大小写,大小写敏感  
* 所有js语句用分号结束  
* 标识符和关键字:  
* 标识符的定义:可以包含字母,数字,下划线,$符号,就是不能用数字开头
* 命名的规范用骆驼(驼峰)命名法

### 变量:
  js变量声明用var定义
  比如:
  
```js
     var i=3;i="abc";
```
	 
### js的数据类型:
- 特殊类型  null 空  ,  undefined  未定义
- 内置对象(类型)
- Number  数字
- String  字符串
- Boolean  布尔
- Function 函数
- Array   数组
- 外置对象:
   window对象:浏览器对象  
   document对象:文档对象
- 自定义对象: Object对象

### String类型:
  用双引和单引都可以标记js的字符串
  **转义字符:\n  \\  \"   \'**
### Number类型:
  不区分整型数据和浮点型数据  
  var k=3;  
  k=3.3;  
  所有的数字都采用64位浮点格式存储,类似于double格式  
**Boolean类型**:  
  只有两个值 true和false  
  可以自动转换作为数值参与运算,运算时true=1,false=0  
  
js属于松散类型的程序语言(弱类型)  
变量在声明时不需要制定数据类型  
变量所引用的数据就是这个变量的类型  
  数字+字符串     字符串  
  数字+布尔       数字,true=1,false=0  
  字符串+布尔     字符串,把true和false转成字符串  
  布尔+布尔        数字  

### 数据类型的转换函数
toString() 将所有数据类型转换为String类型  
parseInt() 强制转换成整数,如果不转换,则返回NaN(not a number)  
parseInt("5.5"); //结果5  
parseFloat() 强制转换成浮点数,不能转换返回NaN  
parseFloat("5.5");//结果5.5  
typeof() 查询当前的数据类型  
typeof("test"+10);//返回String  
isNaN()  是否不是一个数字  

### 特殊的数据类型
  null 在程序中代表的是"无值"或"无对象"  
  可以给一个变量赋值为null,相当于清除变量的内容  
  undefined   声明了变量但从未赋值  
  对象属性不存在  

## js流程控制:
- 顺序结构
- 选择分支结构  if else    switch case
- 循环结构 for while do while

- js中有关表达式真假值问题:
  0           false  
  null        false  
  ""          false  
  undefined   false  
  NaN         false  
  一切表示空的值都是false  
  非空值      true  

  
## js中的一些对象(api)
 - 内置对象
 - 外部对象
    window对象
    document对象
 - 自定义对象

## 常用的内置对象
 * String对象  
 * Number对象  
 * Boolean对象  
 * Array对象  
 * Math对象  
 * Date对象  
 * RegExp对象  
 * Function对象  
  
### String对象

```js
  var str="abc";
  var str1=new String("abc");
```

**length属性**:取字符串的长度
  
```js
   console.log(str.length);
```

**方法:**
 * str.toLowerCase();//转小写
 * str.toUpperCase();//转大写
 * str.charAt(2);//返回指定位置的字符
 * str.charCodeAt(2);//返回指定位置的字符的unicode编码
 * str.indexOf(findstr,[index]);从index位置开始拿findstr去str寻找,找到了返回位置,没找到-1
 * str.lastIndexOf(findstr,[index]);
 * str.substring(start,[end]);返回子字符串;
 * str.substr(start,length);返回子字符串;
 * str.replace(findstr,tostr);在str中寻找findstr,找到后用tostr替换返回值换后的字符串
 * str.split(bystr[,howmany]);
 * bystr:分隔的字符串
 * howmany 指定返回的数组的最大长度,可以省略,返回值是分割后的字符串数组
  
  
### Number对象:是数值对象
 创建Number对象
 var mynum=12.567;
 
 toFixed(num)转换为字符串,并保留小数点后一位数,如果必要,该数字会被舍入,也可以用0补充

```js
    var num=23.56789;
    console.log(num.toFixed(2));//23.57
    
    var num1=23.5;
	console.log(num.toFixed(2));//23.50
``` 

### Array对象
1. 创建数组对象
- var arr1=new Array();
- var arr2=new Array(10);
- var arr3=new Array(100,"abc",true);
- var arr4=[100,"200",true];

 数组对象的属性  
 arr.length;返回数组的长度  
  
  创建二维数组:
  
```js
  var arr5=[
              [1,"2",3],
			  [true,"abc"],
			  [12.567]
           ];
  var arr6=new Array();
  arr6[0]=new Array();
```  
2. 数组的方法:
 - arr.reverse() 翻转,改变了源数组 
 - 数组的排序:
 
```js
  arr.sort([sortFunc]);//数组排序  
  var arr=[32,12,111,444];
  arr.sort();
  console.log(arr.toString());//111,12,32,444;
  
  arr.sort(sortFunction);
  console.log(arr.toString());//12,32,111,444;
  function sortFunction(a,b){
     return a-b;
  }
```
### for in 循环 

```js
var x;
var mycars = new Array()
mycars[0] = "Saab"
mycars[1] = "Volvo"
mycars[2] = "BMW"

for (x in mycars)
{
	document.write(mycars[x] + "<br />")
}
```
### Math对象:
 * Math.PI   Math.E  Math.round(3.567);
 * Math.sin(x)....
 * Math.sqrt(x)...
 * Math.abs(x)...
 * Math.random()

### Date对象:用于处理日期和时间,封装系统时间毫秒数
 - 创建对象:
```js
    var now=new Date();
	var now1=new Date("2017/9/14 11:27");
```
 - 读写时间毫秒数
   getTime(),setTime();
 - 读写时间分量
   getDate()  getDay()  getFullYear()  
   setDate()  setDay()  setFullYear()  
 - 转换日期为字符串  
   toString()  
   toLocaleTimeString();  
   toLocaleDateString();

### RegExp对象
 - 创建对象:
   var regexp=/pattern/flags;  
   var regexp1=new RegExp("pattern"[,flags]);  
   
  flags:  
g:设定当前匹配为全局模式  
i:忽略匹配中的大小写检测  
	
  比如:  

```js 
var reg1=/^\d{3,6}$/;
var reg12=new RedExp("^\d{3,6}$");
```	 
 - 匹配正则表达式的方法
  reg1.test(string)  
  如果字符串string中含有与reg1对象匹配的文本,返回true,否则返回false;

```js
  var name="aaaa";
  var reg=new RegExp("^[a-zA-Z0-9]{3,6}$")
  var flag=reg.test(name);
  
  reg1.replace(regexp,tostr);//按照正则规则寻找,找到后替换toStr
  reg1.match(regext);//返回匹配字符串数组
  reg1.search(regext);//返回匹配字符串的首字符的位置索引
```

### 函数对象:
js中的函数就是Function对象  
函数的名称就指向Function对象的引用  
- 定义一个函数
  
```js
  function 函数名称(函数的的参数){
	函数体
	return 返回值;
  }
```

- 函数的返回值,如果没有return 就是默认返回undefined
  如果有return,就return后边的数据,且一个数据
  
- 函数参数的说明:
 * js中没有函数重载
 * 调用时只要函数名一样,无论传入多少个参数,
 * 调用都是一个额函数
 * 没有接收到实参的参数值是undefined
 * 所有的参数传递给arguments数组对象
 * 函数的参数不能加var

## 匿名函数:

```js
  var func=function(arg1,arg2...){
	  函数体
	  return 返回值
  }
```  
  比如:
  
```js
  var add=function(a,b){
	return a+b;
  };
  
  console.log(add(1,2));//3
  console.log(add);//输出的函数的文本
```

有关函数的一个特殊用法  
使用Function对象直接创建函数  

```js
 var func=new Function(arg1,arg2...,functionbody);
```
 比如:

```js
    var add=new Function("x","y","return (x+y);");
	var result=add(1,2);
	console.log(result);//3
	console.log(add);//方法的文本
```	  

## 全局函数:
 parseInt()   parseFloat()  isNaN()  
 eval();  
 
 eval函数用于计算表达式字符串,或者用于执行字符串中js代码  
 
 只能接受原始字符串做为参数  
 如果参数中没有合法的表达和语句,则抛出异常  

```js
 var s="2+3";
 eval(s);//5
```
## 外部对象:

### BOM对象
  browser object model浏览器对象模型,用来访问跟浏览器窗口有关的对象  
 在BOM对象对象有很多的对象,每个对象还有很多属性和方法  
 通过这些方法和属性,移动窗口,更改状态栏文本,和其他跟窗口操作相关的.
 
### DOM对象
  Document Object model文档对象模型,用来操作文档  
 定义了访问和操作html文档的标准方法  
 应用程序通过对dom树的操作,来实现和html的交互  

### window对象
  window表示浏览器窗口  
  是所有javascript全局对象,如果不写window,默认从window访问起  
  
#### window常用的属性:
 - document:在窗口中显示文档树.
 - history:浏览器的窗口的后退和前进
 - location:窗口文件地址对象. window.location.href="login.html";
 - screen:当前屏幕对象
 - navigator:浏览器的相关信息
	
#### window对象常用的方法:
 - alert();弹出式窗口,模态框(当前窗口不关闭,无法操作后面的窗口)
 - confirm();模态框,确认窗口
 - setTimeOut()  setInterval() 周期性函数
 - clearTimeOut()  clearInterval(); 
## 定时器:用于网页动态时钟,制作倒计时等周期性操作

 周期性时钟:以一定的时间间隔执行代码,循环往复  
 一次性时钟:在一个设定的时间间隔之后来执行代码,而不是调用时立即执行  

 
- setInterval(exp,time);周期性触发代码exp  
 exp:执行的语句  
 time:时间周期,单位毫秒 返回值是已经启动的定时器对象  
- clearInterval(setInterval的返回值);停止启动的定时器  
 
- setTimeout(exp,time);一次性触发代码exp  
   exp:执行js代码  
   time:间隔时间,单位毫秒,返回值是已经启动的定时器对象  
- clearTimeOut(setTimeout的返回值);//停止启动的定时器  

## screen对象包含有关客户端显示屏幕的信息  
  常用于获取屏幕的分辨率和色彩  
  常用的属性:  
   width/height  
   avaiWidth/avaiHeight  

## history对象:包含用户在浏览器窗口中,访问过的url
length属性
  方法:
  - back()
  - forward()
  - go(num)
  
## location对象:包含有关url的信息
  href属性:给地址栏赋值新地址  
  window.location.href="xxx.html";  

## navigator对象:包含的是浏览器的信息
  常用语获取客户端浏览器和操作系统信息  
  

## dom编程:
 查询:
  - 通过id查询
  - 通过name查询
  - 通过标签名查询
  - 通过表单名查询

1. 根据id查询
   document.getElementById("");
   通过id查询返回元素节点,在整个html文档中搜索id,只找到第一个id,返回元素,如果id错误,返回null

2. 根据层次查询节点:
  - parentNode  
   遵循文档的上下文层次结构,查找单个父节点  
   比如:
   
```html
       <table id="tblid">
	     <tr>
			<td id="tdid"></td>
			<td></td>
		 </tr>
	   </table>
    var td_ele=document.getElementById("tdid");
	var tr_ele=td_ele.parentNode;
	var table_ele=td_ele.parentNode.parentNode;
```

  - childNodes
   遵循文档的上下文层次结构,查找多个子节点  
   比如:上面的例子

```js
var td_ele=document.getElementById("tdid");
//获取当前td对象的所有兄弟
var tds_ele=td_ele.parentNode.childNodes;	  
//获取当前td的父亲,和所有叔叔节点
var trs_ele=td_ele.parentNode.parentNode.childNodes;
```
3. 根据标签名查询节点:
 getElementsByTagName("标签名");
从当前对象往下寻找符合标签名的所有元素对象,返回结果是一个数组,标签名错误,返回长度为0,
比如:

```html
       <table id="tblid">
	     <tr>
			<td id="tdid"></td>
			<td></td>
		 </tr>
	   </table>
	   
	var table_ele=document.getElementById("tblid");
	var trs_ele=table_ele.getElementsByTagName("tr");
```
4. 根据name属性查询节点
  document.getElementsByName("元素的name属性值");  
  注意:不是所有的元素节点都有name属性  

根据document.表单名字.表单控间名  
docuemnt.forms[数字].表单控件名 
	

* 创建元素节点:  
  document.createElement(元素节点名);  
  返回结果是创建的节点对象  
 
* 创建文本节点:  
  document.createTextNode("文本信息");  
  返回结果是一个文本节点对象  
  
* 添加新节点:  
  parentNode.appendChild(newNode);  
  追加newNode节点到父节点的所有子节点的最后.  

  parentNode.insertBefore(newNode,refNode);  
  把newNode插入到refNode的前面  
  newNode和refNode是兄弟关系  
  
* 删除节点:  
node.removeChild(childNode)  
  删除node节点下的childNode的节点对象  
  
  
* 定位节点:
  parentNode.firstChild;第一个子节点  
  parentNode.lastChild;最后一个子节点  

js的神奇之处:
  自定义对象:是一种特殊的数据类型,由属性和方法封装而成
     属性:与对象有关的的值   对象名.属性名  div_ele.id="divid";
	 方法:指对象可以执行的行为或可以完成的功能
	       对象名.方法名();




## 创建js的自定义对象:
1. 直接创建对象
  比如:
```js
   function testObject(){
	var personObj=new Object();
	
	//添加属性
	personObj.name="zhangsan";
	personObj.age=30;
	
	//添加方法
    personObj.say=function(){
		alert("hello");
	}
	
	//使用新添加的方法和属性
	personObj.say();
	alert(personObj.name+"   "+personObj.age);

   }
```
2. 使用构造函数创建对象
  比如:
  
```js
    function Person(n,a,ad){
		//定义name和age属性
		this.name=n;
		this.age=a;
		this.address=ad;
		
		//定义方法showInfo
		this.showInfo=function(){
			alert(this.name+"   "+this.age);
		};
		//定义方法showAddreds
		this.showAddress=introAddress;
	}
	function introAddress(){
		alert(this.address);
	}
	
    //是由构造函数创建的对象
	function testOject1(){
		var p=new  Person("zhangsan",30,"beijing");
		alert(p.age);
		p.showInfo();
		p.showAddress();
		
		var p=new  Person("lisi",20,"shanghai");
		alert(p.age);
		p.showInfo();
		p.showAddress();
	}
```  


## 使用json创建对象
  json(javaScript Object Notation) 是一个轻量级的数据交换格式  
  json的说明:
- 用{}代表对象
- 用[]代表数组
- 使用名/值的方式定义,名和值之间用 : 间隔
- 名称需要使用""引起来
- 多对定义之间使用 , 间隔了多少个月
- 字符串的属性值用 "" 引起来  
  比如:
  
```js
     var jsonObj={"name":"张三","age":30,"address":"北京"};
	 alert(jsonObj.name);
	 alert(jsonObj.age);
	 alert(jsonObj.address);
```    
## js中的事件处理:
事件:指页面元素状态改变,用户在操作鼠标或键盘时触发的动作  
  
触发的动作:
  
鼠标事件:
* onclick  单击
* ondblclick   双击
* onmousedown   鼠标左键按下
* onmouseup     鼠标左键抬起
* onmouseover   鼠标划过(进入)
* onmouseout    鼠标移出
* onmousemove   鼠标在范围内移动  
  
键盘事件: 
* onkeydown     键盘按下
* onkeypress    键盘按下/按住
* onkeyup       键盘抬起  
  
状态改变事件:
* onblur        焦点失去
* onfocus       焦点获取
* onsubmit      表单提交      
* onchange      内容改变
* onselect      文本被选定
* onload        窗体完成加载
* onunload      用户退出页面
  
所有的事件原理都设计模式中的"监听者设计模式";  
  
event对象:是js的内置对象  
  任何事件触发后将会产生一个event对象  
  event对象记录事件发生时的鼠标位置,键盘按键状态和触发对象等信息  
	   
  获取event对象和使用event对象获得相关信息,单击的位置  
  触发的对象  

```js
			function ff(e){
				alert(e.clientX+":"+e.clientY);
				//e.srcElement,ie浏览器
				//e.target,firefox浏览器
				var obj=e.srcElement||e.target;
				alert(obj.nodeName);
			}
			<div onclick="ff(event)">event对象测试</div>
```
事件的冒泡机制:

```js
function cancelBubble(e){
	alert("input button");
	//取消冒泡:
	if(e.stopPropagation){
		//火狐和谷歌浏览器的取消冒泡
		e.stopPropagation();
	}else{
		//ie浏览器的取消冒泡
		e.cancelBubble=true;
	}
}
```
## json
```js
{"name":"张三","age":30,"address":"北京","students":[{"name":"name1","age":20},{"name":"name2","age":20},{"name":"name3","age":20}]}

{
    "name": "张三",
    "age": 30,
    "address": "北京",
    "students": [
        {
            "name": "name1",
            "age": 20
        },
        {
            "name": "name2",
            "age": 20
        },
        {
            "name": "name\"",
            "age": 20
        }
    ]
}

[
    {
        "id": 1,    getId() setId()
        "userAddress": "chaoyang", getUserAddress() setUserAddress
        "userName": "zhangsan",
        "userPassword": "zs"
    },
    {
        "id": 2,
        "userAddress": "chaoyang",
        "userName": "lisi",
        "userPassword": "ls"
    },
    {
        "id": 3,
        "userAddress": "chaoyang",
        "userName": "wangwu",
        "userPassword": "ww"
    },
    {
        "id": 4,
        "userAddress": "chaoyang",
        "userName": "zhaoliu",
        "userPassword": "zl"
    },
    {
        "id": 5,
        "userAddress": "chaoyang",
        "userName": "tianqi",
        "userPassword": "tq"
    }
]

```
json:
  http://www.json.org  
  http://www.json.org.cn  
  http://www.runoob.com/   菜鸟教程  
  
1. 了解熟悉json数据格式
   a.用键值对表达数据  
   b.{键值对,键值对,键值对...}  json对象  
   c.[{}...,[]...]  json数组  
   d.json数据中可以包含 json数据,json数组,数字,字符串,布尔  
   e.json对象和json数组可以做合理的嵌套  

2. java对象和json数据的相互转换:
  借助第三方工具来实现相互转换  
  阿里巴巴    fastjson  
  国外        json-lib  
  具体的参见testfastjson项目  testjsonlib项目  
  
3. javascript中的json对象和json字符串相互转换
   即,如何用js操作json数据  
```html
<html>
	<head>
		<title>用js操作json数据</title>
		<meta charset="UTF-8"/>
		<script src="json.js" ></script>
		<script>
			//访问json简单对象
			function f1(){
				var obj={"name":"zhangsan","age":20};
				alert(obj.name+"   "+obj.age);
			}
			//访问json复杂对象
			function f2(){
				var obj={
					"name":"zhangsan",
					"age":20,
					"address":{
						"city":"beijing",
						"street":"杨庄大街",
						"building":"首钢实训楼"
					}
				};
				alert(obj.name+"  "+obj.age+"   "+obj.address.building);
			}
			//访问简单josn数组
			function f3(){
				var arr=[
					{
						"name":"zhangsan",
						"age":20
					},
					{
						"name":"lisi",
						"age":21
					}
				];
				alert(arr[1].name);
			}
			//访问复杂的json数组
			function f4(){
				var arr={
					"name":"zhangsan",
					"age":20,
					"friends":[
						{
						"name":"wangwu",
						"age":20
						},
						{
							"name":"zhaoliu",
							"age":21
						}
					]
				};
				alert(arr.name+"   "+arr.friends[1].name);
			}
			//把json字符串转换成javascript的json对象
			//eval函数方式转换(不推荐)
			function f5(){
				//这个str不是json数据,是一个json的字符串
				var str='{"name":"zhagnsan","age":20}';
				var obj=eval("("+str+")");
				alert(obj.name);			
			}
			//javascript原生写法(浏览器版本不能太低)json串-->json对象
			function f6(){
				var str='{"name":"zhagnsan","age":20}';
				var obj=JSON.parse(str);
				alert(obj.name);
			}
			//第三方工具(josn.js)json字符串-->json对象
			function f7(){
				var str='{"name":"zhagnsan","age":20}';
				var obj=str.parseJSON();
				alert(obj.name);
			}
			function f8(){
				var str='[{"name":"zhangsan","age":20},{"name":"wangwu","age":30}]';
				var obj=str.parseJSON();
				alert(obj[1].name);
			}
			//json对象-->json字符串
			function f9(){
				var obj={"name":"zhangsan","age":20};
				var str=JSON.stringify(obj);
				alert(str);
			}
		</script>
	</head>
	<body>
		<a href="javascript:f1();">访问简单json数据</a><br />
		<a href="javascript:f2();">访问复杂json数据</a><br />
		<a href="javascript:f3();">访问简单json数据(数组)</a><br />
		<a href="javascript:f4();">访问复杂json数据(数组)</a><br />
		<a href="javascript:f5();">eval函数方式转换(不推荐)</a><br />
		<a href="javascript:f6();">js原生写法(浏览器版本不能太低)json字符串-->json对象</a><br />
		<a href="javascript:f7();">第三方工具(josn.js)json字符串-->json对象</a><br />
		<a href="javascript:f8();">第三方工具(josn.js)json字符串-->json对象</a><br />
		<a href="javascript:f9();">json对象-->json字符串</a><br />

	</body>
</html> 
```

---

