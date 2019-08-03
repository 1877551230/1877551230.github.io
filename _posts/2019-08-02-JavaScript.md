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


---

创建js的自定义对象:
1.直接创建对象
  比如:
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

2.使用构造函数创建对象
  比如:
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
  
使用json创建对象
  json(javaScript Object Notation) 是一个轻量级的数据交换格式
  json的说明:
    用{}代表对象
	用[]代表数组
    使用名/值的方式定义,名和值之间用 : 间隔
	名称需要使用""引起来
	多对定义之间使用 , 间隔了多少个月
	字符串的属性值用 "" 引起来
  比如:
  
     var jsonObj={"name":"张三","age":30,"address":"北京"};
	 alert(jsonObj.name);
	 alert(jsonObj.age);
	 alert(jsonObj.address);
    
js中的事件处理:
事件:指页面元素状态改变,用户在操作鼠标或键盘时触发的动作
  
  触发的动作:
    鼠标事件: onclick  单击
	          ondblclick   双击
			  onmousedown   鼠标左键按下
			  onmouseup     鼠标左键抬起
			  onmouseover   鼠标划过(进入)
			  onmouseout    鼠标移出
			  onmousemove   鼠标在范围内移动
  
    键盘事件: onkeydown     键盘按下
	          onkeypress    键盘按下/按住
			  onkeyup       键盘抬起
  
    状态改变事件:
	          onblur        焦点失去
			  onfocus       焦点获取
			  onsubmit      表单提交      
              onchange      内容改变
              onselect      文本被选定
			  onload        窗体完成加载
			  onunload      用户退出页面
  
所有的事件原理都设计模式中的"监听者设计模式"; 
  
event对象:是js的内置对象  
  任何事件触发后将会产生一个event对象
  event对象记录事件发生时的鼠标位置,键盘按键状态
       和触发对象等信息
	   
  获取event对象和使用event对象获得相关信息,单击的位置
  触发的对象
  
			function ff(e){
				alert(e.clientX+":"+e.clientY);
				//e.srcElement,ie浏览器
				//e.target,firefox浏览器
				var obj=e.srcElement||e.target;
				alert(obj.nodeName);
			}
			<div onclick="ff(event)">event对象测试</div>

事件的冒泡机制:

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
json:
  http://www.json.org
  http://www.json.org.cn
  http://www.runoob.com/   菜鸟教程
  
1.了解熟悉json数据格式
   a.用键值对表达数据
   b.{键值对,键值对,键值对...}  json对象
   c.[{}...,[]...]  json数组
   d.json数据中可以包含 json数据,json数组,数字,字符串,布尔
   e.json对象和json数组可以做合理的嵌套

2.java对象和json数据的相互转换:
  借助第三方工具来实现相互转换
  阿里巴巴    fastjson
  国外        json-lib
  具体的参见testfastjson项目
            testjsonlib项目
  
3.javascript中的json对象和json字符串相互转换
   即,如何用js操作json数据
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
  

jquery:是一个优秀javascript框架,一个轻量级的js库
       兼容css3,及各种浏览器
	   使用户更方便的处理html,event,实现动画效果
	   并且方便网站提供ajax交互
	   使用户的html页面保持html和代码分离
	   注意:jquery2.x开始不再支持ie6,7,8
	   
    jquery的核心理念:write less,do more,写的少,做的多
	官方网站:http://jquery.com
	
jquery的编程步骤:

	1.引入jquery的js文件
	2.使用jquery的选择器,定位要操作的节点
	3.调用jquery的方法进行业务操作

什么是jquery对象:
  jquery为了解决浏览器的兼容问题而提供的一种统一
  封装后的对象描述
  query提供的方法都是针对jquery对象特有的,而大部分
  方法的返回类型也是jquery对象,所以方法可以连续调用(方法链)
  用法:
     jquery对象.方法().方法().方法()....
	 
html中  标签, 节点 ,对象  元素
css 中  样式:   属性和值 id选择器,class选择器,元素选择器,派生选择器,伪类选择器
js  中  javascript对象  内置对象,外置对象,自定义对象 有属性,有方法体的方法
json 中   java中json对象,java中的json字符串  相互转换
          javascript中json对象,javascript的json字符串  相互转换
jquery中 jquery的对象,有属性,有方法,操作元素节点     
         jquery对象有自己的属性和方法  
		 
		 
jquery对象与dom对象(原生js)之间的转换
   1.dom对象-->jquery对象
     实现: $(dom对象)
   2.jquery对象-->dom对象
     实现: $obj.get(0) 或者 $obj.get()[0];
  
jquery选择器:
  jquery选择器类似于css选择器(定位元素,添加样式)
  使用jquery选择器能够将内容与行为分开
  
  jquery选择器的分类
    -基本选择器
	-层次选择器
	-过滤选择器
	-表单选择器
   
   一定要学会查jquery的api文档

基本选择器
  #id    id选择器
     特点:最快,尽量使用id选择器,最好别重复
  .class  类选择器
     特点:根据class属性定位元素,非常常用,很多的样式框架都用此样式
  element  标记选择器,html选择器,元素选择器
     特点:改变标记的默认样式
  selector1,selector2,...selectorN 合并选择器
     特点: 所有选择器的合集
  *   所有页面元素,很少使用
     特点:页面中的所有元素都适用(慎用)


层次选择器
  select1空格select2
    根据select1找到节点后,再去select1的子节点中寻找
	符合select2的节点,在给定的祖先元素下匹配所有后代元素
	特点: 很好用,重点掌握
  
  select1>select2 只查找直接子节点,不查找间接子节点
  
  select1+select2 +符号表示下一个兄弟节点
  
  select1~select2 ~符号表示下面所有的兄弟

过滤选择器:过滤选择器以":"或"[]"开始
  1.基本能过滤选择器
    :first     第一个元素
	:last      最后一个元素
	:not(selector)  把selector排除在外
	:even      挑选偶数行
	:odd       挑选奇数行
	:eq(index) 下标等于index的元素
	:gt(index) 下标大于index的元素
	:lt(index) 小表小于index的元素
		
  2.内容过滤选择器
    :contains(text)  匹配包含给定文本的元素
	:empty           匹配所有不包含子元素或文本元素
	:has(selector)   匹配含有选择器所匹配的元素
	:parent          匹配含有子元素或文本的元素
	
  3.可见性过滤选择器
    :hidden     匹配所有不可见元素,或type为hidden的元素
	:visible    匹配所有可见元素
  4.属性过滤选择器
    [attribute] 匹配具有attribute属性的元素
	[attribute=value] 匹配属性等于value的元素
	[attribute!=value]匹配属性不等value的元素
	
  5.子元素过滤选择器
    :nth-child(index/even/odd) 将为每一个父元素匹配子元素,
	              index是从1开始的整数,表示对应的子元素
	:eq(index) 匹配一个给定索引的元素,index从0开始的整数
	
  6.表单对象属性过滤选择器
    :enabled
	:disabled
	:checked
	:selected
  

表单选择器 
   :input
   :text
   :password
   :radio
   :checkbox
   :submit
   :reset
   :button
   :file
   :hidden

jquery操作dom 增删改
  
  创建dom节点
  //js原生写法
	  var div_ele=document.createElement("div");
	  var txt_node=document.createTextNode("hello");
	  div_ele.appendChild(txt_node);
	  document.body.appendChild(div_ele);
  //jquery写法:
      语法:$(html)
	  如果创建一个div,并添加到body的最后一个节点
	  var $obj=$("<div>hello</div>");
	  $("body").append($obj);
	  等价于:
	  $("body").append("<div>hello</div>");

  插入节点的若干方法
    append()  作为最后一个子节点添加进来
	prepend() 作为第一个子节点添加进来
	after()   作为下一个兄弟节点添加进来
	before()  作为上一个兄弟节点添加进来
  删除节点
    remove()  移除
	remove(selector)  按照选择器定位后删除
	empty()   清空节点
	
  复制节点
    clone()   克隆
	clone(true) 复制节点也具有行为(将处理一并复制)
	
  样式操作:
    attr("属性名","属性值")  获取或设置属性  
	addClass("类样式名")     追加样式
	removeClass("类样式名")  移除样式
	toggleClass("类样式名")  切换样式
	hasClass("类样式名")     是否有某个样式
	css("样式名")            获取样式的值
    css("样式名","样式值")	 设置多个样式
 
  遍历节点:
    children()/children(selector)  只考虑直接子节点
	next()/next(selector)          下一个兄弟节点
	prev()/prev(selector)          上一个兄弟节点
	siblings()/siblings(selector)  其他兄弟
	find(selector)  查找满足选择器的所有后代
	parent()        父节点

jquery的事件处理 

  使用jquery实现事件绑定:
    语法:
	  $obj.bind("事件类型",事件处理函数);
	比如:
	  $obj.bind("click",function(e){});
	  简写方式:
	  $obj.click(function(e){});
	  
获取事件对象event
    $obj.click(function(e){});
    方法的参数中的e就是事件对象,但已经经过jquery对底层
	的事件进行了封装
	注意,封装后jquery事件对象e,就已经可以兼容各个浏览器
  
   e.target  事件触发的那个dom对象(在哪个对象上触发了事件)
   e.pageX e.pageY   获取鼠标触发事件时的坐标   
	  
事件冒泡:
  在子节点产生的事件会一次向上抛给父节点
  在原生js中终止事件冒泡,需要知道浏览器的差异
  在jquery中不需要了解浏览器差异,只需要e.stopPropagation()
  终止事件传播
  
合成事件:
  hover(mouseenter,mouseleave);模拟鼠标悬停事件
  toggle()  在多个事件响应中切换
  
模拟事件操作:
  语法:
    $obj.trigger(事件类型);
  比如:
    $obj.trigger("focus");
	简写形式:
	$obj.focus();
	
jquery动画:
  
   显示,隐藏的动画效果
   show()/hide()
   通过同时改变元素的宽度和高度来实现显示或隐藏
   语法:
      $obj.show(执行时间,回调函数);
	     执行时间:slow,normal,fast ,毫秒数
		 回调函数:动画执行完毕后要执行的函数
		 
   同理:$obj.hide();
   
   	
   上下滑动式的动画实现
     slideDown()/slideUp()
	 通过改变高度来实现显示和隐藏的效果
	 用法同show方法
	 
   淡入,淡出式动画:
     fadeIn()/fadeOut()
	 通过改变不透明度opacity样式实现显示和隐藏
	 用法同show方法
	 
   自定义动画:
     animate()
	 语法: 
	   animate(js对象,执行时间,回调函数);
	 说明:
	   js对象:用{}描述动画执行之后元素的样式
	   执行时间:毫秒数
	   回调函数:动画执行结束后要执行的函数
	 比如:
	$("div").click(function(){
		$(this).animate({left:"500px"},4000);
		$(this).animate({top:"300px"},2000).fadeOut("slow");
	});
	
jquery的类数组(重要)
  什么是类数组:jquery封装的多个对象
  类:指的是类似
  具备自己特有的操作方法
 
  类数组的操作:
    length属性
	each(fn)遍历数组,fn用来处理dom对象,
	    在fn中this表示正被遍历的那个dom对象,
		fn函数可以添加一个参数 i 用于表示正在遍历
		的dom对象的下标(从0开始)
	eq(index) 将下标等于index的dom对象取出来
	get() 返回一个dom对象组成的数组
	
	
ajax:
	什么是ajax:(Asynchronous javascript and xml)
	            异步         JavaScript 和  xml
    ajax是一种用来改善用户体验的技术,其实质上,使用
	XMLHttpRequest对象异步的向服务器发送请求,
	服务器返回部分数据,而不是返回完整页面,以页面
	无刷新的效果更新页面中局部内容
一.原生ajax的用法
   步骤如下:
   1.html页面或jsp页面中触发某个事件调用js方法
   2.编写js方法:
     a.创建XMLHttpRequest对象
	    1)ie浏览器
		2)非ie浏览器
	 b.调用open方法
	   参数1:提交的方式
	   参数2:提交到服务器的url
	   参数3:true异步,false同步
	 c.给XMLHttpRequest对象注册onreadystatechange事件
	   判断readyState的值是4,和status值是200,然后获取
	   服务端传递回来了xml或json或文本,然后dom编程更改
	   html页面或jsp页面的局部内容
	   
	 d.如果post提交,还要添加消息头
	 xmlHttpRequest.setRequestHeader("content-type","application/x-www-form-urlencoded");
	 
	 e.调用send方法发送请求
	 
 a.如何获取,创建ajax对象(XMLHttpRequest对象)
   var xmlHttpRequest;
   function createXMLHttpRequest(){
	if(window.XMLHttpRequest){
		//非ie浏览器
		xmlHttpRequest=new XMLHttpRequest();
	}else{
		//ie浏览器
		xmlHttpRequest=new ActiveXObject("Microsoft.XMLHTTP");
	}
   }
   等价于:
   function createXMLHttpRequest(){
	if("ActiveXObject" in window || window.ActiveXObject){
		//ie浏览器
		xmlHttpRequest=new ActiveXObject("Microsoft.XMLHTTP");
	}else{
		//非ie浏览器
		xmlHttpRequest=new XMLHttpRequest();
	}
   }
xmlHttpRequest对象的属性和方法:
  abort()   取消请求   xmlHttpRequest.abort();
  getAllResponseHeaders();获取响应的所有的http头
  getResponseHeader();获取指定的http头
  open(method,url,异步/同步)    创建请求
  send()    发送请求
  setRequestHeader()   设置请求http头
  onreadystatechange 发生任何状态变化时的事件控制对象
  readyState:  请求的状态
      0:   尚未初始化
	  1:   正在发送请求
	  2:   请求完成
	  3:   请求成功 ,正在接受数据
	  4:   接收数据成功
  status:服务器返回的http请求响应回来的状态码
      200:成功
	  202:请求被界都,但处理尚未完成
	  400:错误的请求
	  404:资源未找到
	  405:service方法调用错误
	  500:服务端java代码异常
	  
  responseText  服务器返回的文本
  responseXML   服务器返回的的xml,可以当做dom处理
  
  
b.调用open方法
   1.open请求,请求的方式是get
   xmlHttpRequest.open("get","xxxServlet",true);
     true:异步
	 false:同步
   2.open请求,请求的方式是post
   xmlHttpRequest.open("post","xxxServlet",true);
   xmlHttpRequest.setRequestHeader("content-type","application/x-www-form-urlencoded");
   注意:
    setRequestHeader的作用:因为http协议要求发送post请求时,
	必须有content-type消息头,但是默认情况ajax对象不会添加
	该消息头,所以需要调用此方法添加消息头
	
发送请求:
  get方式:	xmlHttpRequest.send(null);
  post方式: xmlHttpRequest.send(name=value&name1=value1...);

  注意:post方式传数据到服务器用send方式事项
       get方式传送数据到服务的用法:
    xmlHttpRequest.open("get","xxxServlet?name=value&name1=value1",true);

用ajax对象跟服务器传递数据时,如果参数中带有中文,可能产生乱码
  永远记住:
    只要是post提交,request.setCharacterEncoding("UTF-8");
    只要是get提交,
      方式一:
	     汉字=new String(乱码.getBytes("ISO8859-1"),"UTF-8");
		 适合tomcat7以及以前
      方式二: 不建议使用
         步骤一:在tomcat主目录中conf/server.xml文件中
           <connector URIEncoding="utf-8" >
           这个配置指定tomcat按照utf-8编码
         步骤二:使用encodeURI方法对请求中的汉字做utf-8编码
                此方法只针对ie浏览器使用,其他浏览器不用此
                方法,
             ie:
             var uri="xxxServlet?name=张三";
             xmlHttpRequest.open("get",encodeURI(uri),true);			 
         	  
	 
二,jquery的ajax用法
   
  load()方法:将服务器返回的数据字节添加到符合的节点之上.
    语法:
	$obj.load(请求的地址,请求的参数);
	
	  请求的参数:
	     方式一:
		    "username=tom&age=22"
	     方式二:
		    {"username":"tom","age":22}
	  有请求参数时,load方法发送post请求,否则发送get请求
	  
  get()方法:发送get请求
    语法:
	  $.get(请求的地址,请求的参数,回调函数,服务器反回的数据类型);
	说明:
	  回调函数添加的参数是服务器返回的数据
	  服务器返回的数据类型:
	    html:html文本
		text:文本
		JSON:josn数据格式对象
		xml:xml文档
		script:javascript脚本
		
  post()方法:发送post请求
    语法:
	$.post(请求的地址,请求的参数,回调函数,服务器反回的数据类型);
	说明:
	  回调函数添加的参数是服务器返回的数据
	  服务器返回的数据类型:
	    html:html文本
		text:文本
		JSON:josn数据格式对象
		xml:xml文档
		script:javascript脚本
  
  
  ajax方法:异步请求服务器
    语法:
	  $.ajax({});
	说明:{}内可以设置选项参数
	  - url:请求的地址
	  - type:请求的方式(get,pot,put,delete)
	  - data:请求的参数
	  - dataType:服务器返回的数据类型
	  - success:服务器处理正常对应的回调函数
	  - error:服务器出错对应的回调函数
	  - async: true(缺省),当值为false时发送同步请求	
	