---
layout:     post
title:      cookie和session区别
subtitle:   
date:       2019-11-05
categories: 面试题
author:     miracle
catalog: true
tags:
    - web
---

* content
{:toc}

## cookies 

是服务器发送到浏览器并保存在本地的一个数据块，他会在浏览器下一次向同一台服务器请求时被携带并发送到服务器上。通常是告知服务器两个请求是否来自于同一个浏览器，如保持用户的登陆状态。使得无状态的http协议记录状态变得可能

cookies主要用于以下三方面

1. 会话状态管理(用户登录状态,购物车,游戏分数等)
2. 个性化设置(用户自定义设置,主题等)
3. 浏览器行为跟踪(分析用户行为)

### Cookie

- cooke数据存储到浏览器客户端
- 安全性低,可以通过工具查询
- 数量:
一个浏览器可以存储300个cookie  
一个网站应用最多存储20个cookie  
一个cookie存储的数据上限为4kb  

 浏览器向web服务器发送请求时,服务器将少量的数据以set-cookie消息头方式发送给浏览器,浏览器将这个数据保存起来  
当浏览器再次访问服务器时,会将这数据以cookie消息头的方式发送给服务器  

### 创建cookie
sevlet api 提供javax.servlet.http.Cookie来创建cookie对象  
Cookie c=new Cookie("key",value);  
response.addCookie(c);  

### 得到cookie

Cookie[] cookies=request.getCookies();  
注意:一定要判断cookies是否为null,因为无法保证上文存储过cookie  
不是null,就说明上文存储过cookie,或浏览器中有其他的cookie  

### cookie的生存时间

默认情况下,浏览器会将cookie保存到客户端的内存中,只要浏览器不关闭,cookie就会一直存储浏览器客户端的内存中  
如果希望关闭浏览器后cookie仍存在,可以通过设置过期时间  
void setMaxAge(int seconds);  
用cookie对象调用上面api即可  
**说明**:
* seconds>0:浏览器要保存cookie的最长时间,如果超过指定的时间,浏览器就删除这个cookie,在时间范围内保存在硬盘上可以通过某些工具可以查询cookie信息,很不安全
* seconds=0:删除cookie,设置为零,随着response发回客户端替换原有的cookie,因为生命周期到了,即将该cookie删除
* seconds<0:缺省值/默认值:浏览器会将cookie保存在内存中,浏览器关闭,cookie也就消失了

### cookie编码

1. java  
 如果cookie中保存中文汉字,需要做中文处理  

```java
  Cookie c=new Cookie("name",URLEncoder.encode("张三","utf-8"));
```
解码

```java
  Cookie[] cookies=request.getCookies();
  if(cookies!=null){
	for(Cookie c: cookies){
		String name=c.getName();//name;
		String value=URLDecoder.decode(c.getValue,"utf-8");//张三
	}
  }
```

2. JavaScript

cookie编码(js):  
  escape("aa w3c!");     //aa20%w3c21%  

cookie解码(js):  
  unescape("aa20%w3c21%");  //aa w3c!  

### 获取cookie

* 方式一:
cookie在服务端创建的,然后响应给客户端  
客户端读取cookie放在页面上  
jsp: ${cookie.rename.value}  
html: 用js获取cookie数据  
服务端也可以读取cookie  
Cookie[] cookies=request.getCookies()  
* 方式二:
cookie在客户端创建  
客户端读取cookie放在页面上  
jsp: ${cookie.rename.value}  
html: 用js获取cookie数据 var cookies=document.cookie  
服务端也可以读取cookie  
Cookie[] cookies=request.getCookies()  

## session

Session 代表着服务器和客户端一次会话的过程。Session 对象存储特定用户会话所需的属性及配置信息。这样，当用户在应用程序的 Web 页之间跳转时，存储在 Session 对象中的变量将不会丢失，而是在整个用户会话中一直存在下去。当客户端关闭会话，或者 Session 超时失效时会话结束。


### session会话做了两件事  
1. 标识session事哪个客户端
2. 基于同一个客户端,可以共享数据
3. session对象存在于服务器端
4. 是服务端的资源(servlet,jsp)访问,服务端的session对象  

### session对象是何时创建的 

一定要注意:不是浏览器客户端访问应用服务器就有session对象  

### session对象是否被创建 

1. 请求头中如果没有JSESSIONID,那么就说明在服务端没有session对象,是可以创建session对象了  
2. 请求头中有一个JSESSIONID  
   a.如果服务端有一个session的id值与JSESSIONID的值相同,就不创建,直接使用服务端的session对象  
   b.如果服务端没有与JSESSIONID的值相同的session id就新创建一个session对象  
	 
### session对象如何创建 

在servlet中第一次使用下面语句创建session  
HttpSession session=request.getSession();等同于request.getSession(true);创建session对象  
如果第一访问一个jsp文件,服务端会自动创建一个session对象  
因为在jsp文件中有page指令 <% page  session="true"%> 默认创建一个session对象  

注意第二次访问servlet 和jsp不会创建session对象了,直接使用之前的session对象  
	 
### 项目如何使用session对象
在ServletA中  

```java  
HttpSesson session=request.getSession();  
session.setAttribute("page",page);//绑定数据session对象  
```
在servletB中  

```java
HttpSesson session=request.getSession();  
Object page=session.getAttribute("page");  
```

### session对象的销毁  
1. 给session对象设置存活时间,如果不设置默认30分钟,1800秒  
  session.setMaxInactiveInterval(1000);   //1000秒  
2. session.invalidate();  

### session是如何记录是哪一个浏览器客户端
如果服务器端创建了一个session对象,服务端会把生成的sessionID用Cookie响应给浏览器,基于当前浏览器,发送任何请求,浏览器都在请求头中,设置key和value  
JSESSIONID=服务端创建的sessionID

### 用java代码清除session
  1. 清除session对象
session.invalidate();  
相当于清除session中的所有数据  
  2. session对象没有销毁,但清除sessoin中的数据  
session.removeAttribte(key);  
等同于  
session.setAttribute(key,null);  

### session的常用的api
 * session.getSession();//获取或创建session
 * session.setInactiveInterval(1000);//设置session最大的非活动时间
 * session.setAttribute(key ,value);//绑定数据给session对象
 * session.getAttribute(key);//从session中取出指定的数据
 * session.removeAttibute(key);//从session中清除指定的key的数据
  
### 设置sesion的存活时间
1. 代码方式
session.setMaxInactiveInterval(1000);//秒为单位  
2. 用web.xml配置,以分钟为单位,

```xml
	  <session-config>
       <session-timeout>10</session-timeout>
      </session-config>
```
### session的优缺点
* 优点:
安全性较高(存储到服务器上)  
session能保存的数据更丰富,cookie只能保存字符串  
session能够保存更多的数据,cookie只能保存4kb数据
* 缺点:
session将状态保存到服务器上,占用服务器内存,如果并发量高,会严重拖慢服务器的速度 
  
## cookie和session不同

* 作用范围不同，Cookie 保存在客户端（浏览器），Session 保存在服务器端。
* 存取方式的不同，Cookie 只能保存 ASCII，Session 可以存任意数据类型，一般情况下我们可以在 Session 中保持一些常用变量信息，比如说 UserId 等。
* 有效期不同，Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭或者 Session 超时都会失效。
* 隐私策略不同，Cookie 存储在客户端，比较容易遭到不法获取，早期有人将用户的登录名和密码存储在 Cookie 中导致信息被窃取；Session 存储在服务端，安全性相对 Cookie 要好一些。
* 存储大小不同， 单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie。

## cookie和session的作用

我们都知道浏览器是没有状态的(HTTP 协议无状态)，这意味着浏览器并不知道是张三还是李四在和服务端打交道。这个时候就需要有一个机制来告诉服务端，本次操作用户是否登录，是哪个用户在执行的操作，那这套机制的实现就需要 Cookie 和 Session 的配合。  
用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建创建对应的 Session ，请求返回时将此 Session 的唯一标识信息 SessionID 返回给浏览器，浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中，同时 Cookie 记录此 SessionID 属于哪个域名。

当用户第二次访问服务器的时候，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务端，服务端会从 Cookie 中获取 SessionID，再根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失效，如果找到 Session 证明用户已经登录可执行后面操作。

根据以上流程可知，SessionID 是连接 Cookie 和 Session 的一道桥梁，大部分系统也是根据此原理来验证用户登录状态。

## 服务端是根据 Cookie 中的信息判断用户是否登录，那么如果浏览器中禁止了 Cookie，如何保障整个机制的正常运转

第一种方案，每次请求中都携带一个 SessionID 的参数，也可以 Post 的方式提交，也可以在请求的地址后面拼接 xxx?SessionID=123456…。

第二种方案，Token 机制。Token 机制多用于 App 客户端和服务器交互的模式，也可以用于 Web 端做用户状态管理。

Token 的意思是“令牌”，是服务端生成的一串字符串，作为客户端进行请求的一个标识。Token 机制和 Cookie 和 Session 的使用机制比较类似。

当用户第一次登录后，服务器根据提交的用户信息生成一个 Token，响应时将 Token 返回给客户端，以后客户端只需带上这个 Token 前来请求数据即可，无需再次登录验证。

## 分布式session问题

在互联网公司为了可以支撑更大的流量，后端往往需要多台服务器共同来支撑前端用户请求，那如果用户在 A 服务器登录了，第二次请求跑到服务 B 就会出现登录失效问题。

分布式 Session 一般会有以下几种解决方案：

Nginx ip_hash 策略，服务端使用 Nginx 代理，每个请求按访问 IP 的 hash 分配，这样来自同一 IP 固定访问一个后台服务器，避免了在服务器 A 创建 Session，第二次分发到服务器 B 的现象。
Session 复制，任何一个服务器上的 Session 发生改变（增删改），该节点会把这个 Session 的所有内容序列化，然后广播给所有其它节点。
共享 Session，服务端无状态话，将用户的 Session 等信息使用缓存中间件来统一管理，保障分发到每一个服务器的响应结果都一致。


