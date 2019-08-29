---
layout:     post
title:      spring mvc
subtitle:   
date:       2019-08-27
categories: Java
author:     miracle
catalog: true
tags:
    - Java框架
---

* content
{:toc}

## spring mvc框架
M: Model 模型:Model的职责是负责业务逻辑,包含:  
* 数据访问层 dao
* 业务逻辑层 service
* 辅助工具层 util
* 实体和值对象  entity,vo,domain,pojo
V: view 视图:他的职责负责显示交互的界面(收集页面数据)  
C: Controller 控制器:职责是M和V之间的桥梁,用于控制流程  
V的页面数据提交给C-->C调用M处理数据-->把M处理完的数据通过C返回给V-->V显示处理完的数据

## springmvc执行原理步骤:


web.xml

```xml
<!-- 全局初始化数据,spring的监听器读取此配置文件 
	多个配置文件用分号分隔 -->
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>
		          classpath:conf/spring.xml;
		</param-value>
	</context-param>
	<!-- spring容器初始化的监听器,会读取全局初始化的数据(xml文件) -->
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	<!-- spring处理post中文乱码问题 -->
	<filter>
		<filter-name>encodingFilter</filter-name>
		<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
		<init-param>
			<param-name>encoding</param-name>
			<param-value>UTF-8</param-value>
		</init-param>
		<init-param>
			<param-name>forceEncoding</param-name>
			<param-value>true</param-value>
		</init-param>
	</filter>
	<filter-mapping>
		<filter-name>encodingFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	
	<!-- spring mvc的入口 加载spring mvc 前端控制器 -->
	<servlet>
		<servlet-name>dispatcher_restful</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:conf/spring_mvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>dispatcher_restful</servlet-name>
		<url-pattern>*.do</url-pattern>
	</servlet-mapping>
``` 

* 先启动tomcat-->tomcat自检-->读取tomcat中的web.xml
* tomcat加载项目中的web.xml
* 按照监听器,过滤器,Servlet的顺序加载
* spring.xml是全局变量,在服务器启动的时候就加载
* spring_mvc.xml有load-on-startup,所以在服务器加载时也加载了并把其中的类实例化对象放在springmvc容器中管理,反射带有Controller的类,解析该类中的@RequestMapping注解,把路径和路径所对应的方法信息存储到springmvc容器中(map集合)
* tomcat服务器启动完毕
*  发送请求给服务器
* org.springframework.web.servlet.DispatcherServlet拦截*.do请求和其他程序员写的请求
* 进入DispatcherServlet的service方法
 - 根据请求url去HandlerMapping中寻找是否有指定Controller,HandlerMapping维护的map集合是从springmvc容器取出的
 - 通过HandlerAdapter(处理器适配去)调用和执行Controller中方法,Controller对象是从springmvc容器中取出
 - 调用Controller方法,返回ModelAndView
 - 从ModelAndView取出消息对象,目标页面的字符串,拼装出url,并渲染目标页面,利用request.getRequestDispatcher("目标url").forward(request,response);
* 把渲染完的页面响应给浏览器,然后浏览器格式化显示输出

## 表单方式得到数据

return相当于转发,可以通过requestScope.key获得value  
有如下一个表单,表单的action是user/login1.do,方法是post

login.jsp

```html
<div style="text-align:center;">
 	<div style="font-size:30px;font-weight:bold;">用户登录1</div>
 	<form action="user/login1.do" method="post">
 	<table border="1px" align="center">
 		<tr>
 			<td>用户名</td>
 			<td><input required="required" type="text" name="userName"/></td>
 		</tr>
 		<tr>
 			<td>密&nbsp;&nbsp;码</td>
 			<td><input required="required" type="password" name="userPassword"/></td>
 		
 		</tr>
 			
 		<tr>
 			<td colspan="2" align="center">
 			<input type="submit" value="登录"/>
 			<input type="reset" value="重置"/>
 			</td>
 		</tr>
 	</table>
 	</form>
 </div>
```
如下是一个controller,上面介绍了,给controller写了RequestMapping注解,从中得到方法  
@RequestMapping("user/")注解添加在类前面,给整个类拼接一个路径头/user
给方法增加注解@RequestMapping(value="login1.do",method=RequestMethod.POST),value是方法名,method是区分post方法还是get方法  
当login.jsp提交表单时,表单action为/user/*.do方法,就调用controller中对应的方法  

下面controller写了4种从表单中获取数据的方式,也写了4种响应到服务器上的方式,可以两两随意组合  
在springmvc.xml中有jspViewResolver jsp视图解析器的类(导入的),可以自动拼装路径,成功后会跳转到相应的界面,spring_mvc.xml中有注解  

UserController.java

```java
@Controller
@RequestMapping("user/")//为整个类增加一个路径/user
public class UserController_Form {
	@RequestMapping("test.do")
	@ResponseBody
	public String method(){
		return "hello spring mvc";
	}
	/**
	 * 
	 * @param userName 对应页面的表单中的名字<input name="userName"
	 * @param userPassword 对应页面的表单中的名字<input name="userPassword"
	 * @return ModelAndView对象,给InternalResourceViewResover解析
	 */
	@RequestMapping(value="login1.do",method=RequestMethod.POST)
	public ModelAndView login1(String userName,String userPassword){
		ModelAndView mav=new ModelAndView();
		//1.获取数据
		System.out.println(userName+" "+userPassword);
		//2.专注做业务调用,此处是模拟业务返回为true 成功
		boolean flag=true;
		//根据业务的结果做跳转
		if(flag){
			//等同于转发
			//request.setAttribute("msg","登陆成功"
			//request.getRequestDispatcher("success.jsp").forward(request,response);
			mav.setViewName("success");
			mav.addObject("msg","登陆成功");
		}
		return mav;
	}
	/**
	 * 
	 * @param name @RequestParam("userName") <input name="userName"
	 * @param password @RequestParam("userName") <input name="userPassword"
	 * @return  ModelAndView对象,给InternalResourceViewResover解析
	 */
	@RequestMapping(value="login2.do",method=RequestMethod.POST)
	public ModelAndView login2(@RequestParam("userName") String name,@RequestParam("userPassword") String password){
		ModelAndView mav=new ModelAndView();
		//1.获取数据
		System.out.println(name+" "+password);
		//2.专注做业务调用,此处是模拟业务返回为true 成功
		boolean flag=true;
		//根据业务的结果做跳转
		if(flag){
			//等同于转发
			//request.setAttribute("msg","登陆成功"
			//request.getRequestDispatcher("success.jsp").forward(request,response);
			mav.setViewName("success");
			mav.addObject("msg","登陆成功");
		}
		return mav;
	}
	/**
	 * 
	 * @param user <input name="userName" userName的第一个字母大写 前面加上set ->setUserName()
	 * 			去user对象中寻找是否有此方法,如果有就注入,没有就不注入
	 * 				<input name="userPassord" userPassword的第一个字母大写 前面加上set ->setUserPassword()
	 * 			去user对象中寻找是否有此方法,如果有就注入,没有就不注入
	 * @param model 就是ModelAndView中的Model,此对象维护的就是request对象
	 * 				等价于request.setAttribute("key","value")
	 * @return  字符串,就是ModelAndView中的view,交给InternalResourceResolver解析
	 */
	@RequestMapping(value="login3.do",method=RequestMethod.POST)
	public String login3(User user,Model model){
		String result="error";
		//1.获取数据
		System.out.println(user.getUserName()+" "+user.getUserPassword());
		//2.专注做业务调用,此处是模拟业务返回为true 成功
		boolean flag=true;
		//根据业务的结果做跳转
		if(flag){
			//等同于转发
			//request.setAttribute("msg","登陆成功"
			//request.getRequestDispatcher("success.jsp").forward(request,response);
			
			model.addAttribute("msg","登陆成功");
			result="success";
		}
		return result;
	}
	/**
	 * 注意:用HttpServlet和HttpSession,此种做法耦合Http的API
	 * @param request
	 * @param response
	 * @param session
	 * @param modelMap
	 * @return
	 */
	@RequestMapping(value="login4.do",method=RequestMethod.POST)
	public String login4(HttpServletRequest request,HttpServletResponse response,HttpSession session,ModelMap modelMap){
		String result="error";
		//1.获取数据
		String uname=request.getParameter("userName");
		String upwd=request.getParameter("userPassword");
		System.out.println(uname+" "+upwd);
		//2.专注做业务调用,此处是模拟业务返回为true 成功
		boolean flag=true;
		//根据业务的结果做跳转
		if(flag){
			//等同于转发
			//request.setAttribute("msg","登陆成功"
			//request.getRequestDispatcher("success.jsp").forward(request,response);
			
			modelMap.addAttribute("msg","登陆成功");
			result="success";
		}
		return result;
	}
	
	@RequestMapping(value="login5.do",method=RequestMethod.POST)
	public String login5(HttpServletRequest request,HttpServletResponse response,HttpSession session,Map map){
		String result="error";
		//1.获取数据
		String uname=request.getParameter("userName");
		String upwd=request.getParameter("userPassword");
		System.out.println(uname+" "+upwd);
		//2.专注做业务调用,此处是模拟业务返回为true 成功
		boolean flag=true;
		//根据业务的结果做跳转
		if(flag){
			//等同于转发
			//request.setAttribute("msg","登陆成功"
			//request.getRequestDispatcher("success.jsp").forward(request,response);
			
			map.put("msg","登陆成功");
			result="success";
		}
		return result;
	}
	@RequestMapping(value="login6.do",method=RequestMethod.GET)
	public String login6(){
		String result="error";
		//1.获取数据
		
		//2.专注做业务调用,此处是模拟业务返回为true 成功
		boolean flag=true;
		//根据业务的结果做跳转
		if(flag){
			//重定向
			result="redirect:/test.jsp";
		}
		return result;
	}
}
```

## 利用ajax方式得到数据

### jackson方式
login.jsp

```xml
<script src="js/common/jquery-3.2.1.min.js"></script>
<script src="js/login_async.js"></script>
<form id="form_login1">
```

在jsp文件中,引入了jquery和js文件

```js
$(function(){
	$("#form_login1").submit(function(){
		return login1();
	});
});
function login1(){
	//1.获取表单的数据
	var uname=$("#form_login1 input[name=userName]").val();
	var upwd=$("#form_login1 input[name=userPassword]").val();
	alert(uname+" "+upwd);
	//2.发送异步请求ajax
	$.ajax({
		url:"user_async/login1.do",
		type:"get",
		data:{
			"userName":uname,
			"userPassword":upwd
			},
		dataType:"json",
		success:function(result){
			alert("success-->"+result.status+" "+result.message);
			alert("data-->"+result.data.userName+" "+result.data.userPassword);
		},
		error:function(){
			alert("请求失败");
		}
		
	})
	return result;
}
```
在提交表单后,执行js中的login1方法,通过ajax向url发送请求,url请求的资源在spring容器中,执行controller中的login1方法,该方法用的jackson包,@ResponseBody注解:把result对象转换成json字符串

```xml
</dependency>
<!-- spring mvc 辅助依赖包,只针对把对象转换成json这种情况 -->
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-core</artifactId>
	<version>2.8.1</version>
</dependency>
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-databind</artifactId>
	<version>2.8.1</version>
</dependency>
```
controller

```java
@Controller
@RequestMapping("user_async/")
public class UserController_Async {
	@RequestMapping(value="login1.do",method=RequestMethod.GET)
	@ResponseBody//把result对象转换成json字符串,利用jackson
	public Result login1(User user){
		Result result=new Result();
		System.out.println(user.getUserName()+" "+user.getUserPassword());
		//模拟业务调用
		boolean flag=true;
		if(flag){
			result.setStatus(1);
			result.setMessage("登陆成功");
			result.setData(user);
		}else{
			result.setStatus(0);
			result.setMessage("登录失败");
		}
		return result;
	}
```

### fastjson方式

jsp页面和js逻辑和jackson一样,controller中转换为字符串方式不同,用的是JSON.toJSONString(xx);方法,然后通过printWriter流的方式写出

```java
@RequestMapping(value="login2.do",method=RequestMethod.GET)
	public void login2(User user,HttpServletRequest request,HttpServletResponse response){
		Result result=new Result();
		System.out.println(user.getUserName()+" "+user.getUserPassword());
		//模拟业务调用
		boolean flag=true;
		if(flag){
			result.setStatus(1);
			result.setMessage("登陆成功");
			result.setData(user);
		}else{
			result.setStatus(0);
			result.setMessage("登录失败");
		}
		try {
			//转化result对象为json字符串
			String json=JSON.toJSONString(result);
			PrintWriter out=response.getWriter();
			out.println(json);
			out.flush();
			out.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
```

## restful架构:资源状态转换
资源:软件资源,图片资源,网页资源,视频资源,文字资源,文件资源等等  
在资源相互转换的时候需要做资源定位(url);  

### 在资源的转换过程中细分为若干种动作:
* get:获取资源
* post:创建资源,部分更新
* put:修改资源
* delete:删除资源

### 方式一:
在jsp文件中引用一个js文件和jquery库

```xml
<script src="js/common/jquery-3.2.1.min.js"></script>
<script src="js/login_restful.js"></script>
```
当提交时,调用js方法

```js
$(function(){
	$("#form_login1").submit(function(){
		return login1();
	});
});
function login1(){
	//1.获取表单的数据
	var uname=$("#form_login1 input[name=userName]").val();
	var upwd=$("#form_login1 input[name=userPassword]").val();
	alert(uname+" "+upwd);
	//2.发送异步请求ajax
	$.ajax({
		url:"user_restful/login/uname/"+uname+"/pwd/"+upwd+"/toController",
		type:"get",
		dataType:"json",
		success:function(result){
			alert("success-->"+result.status+" "+result.message);
			alert("data-->"+result.data.userName+" "+result.data.userPassword);
		},
		error:function(){
			alert("请求失败");
		}
	})
	return result;
}
```
ajax中没有data,直接通过url将数值传给controller,怎么通过url给controller的呢,看下面controller,他给自己的注解命名就是url的地址,然后利用PathVariable注解得到userName和userPassword的值,然后通过ResponseBody注解(jackson),转换为json字符串

```java
@Controller
@RequestMapping("user_restful/")
public class UserController_restful {
	@RequestMapping(value="login/uname/{userName}/pwd/{userPassword}/toController",method=RequestMethod.GET)
	@ResponseBody//把result对象转换成json字符串,利用jackson
	public Result login1(@PathVariable("userName") String name,@PathVariable("userPassword") String pwd,HttpSession session){
		Result result=new Result();
		System.out.println(name+" "+pwd);
		User user=new User();
		user.setUserName(name);
		user.setUserPassword(pwd);
		//模拟业务调用
		boolean flag=true;
		if(flag){
			session.setAttribute("userName", name);
			result.setStatus(1);
			result.setMessage("登陆成功");
			result.setData(user);
		}else{
			result.setStatus(0);
			result.setMessage("登录失败");
		}
		return result;
	}
```

### 方式二

web.xml要增加下面

```xml
<servlet>
		<servlet-name>dispatcher_restful</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:conf/spring_mvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>dispatcher_restful</servlet-name>
		<url-pattern>/</url-pattern>
```

jsp请求方式和方式一一样通过js和ajax请求,ajax中请求的url地址不同,不再是.do

```js
url:"user_restful/login2"
```
方法的注解,通过这个注解和类上的注解组成url的地址,然后通过fastjson的方式返回数据

```java
@RequestMapping(value="login2",method=RequestMethod.GET)
public void login2(User user,HttpServletRequest request,HttpServletResponse response){
		Result result=new Result();
		System.out.println(user.getUserName()+" "+user.getUserPassword());
		//模拟业务调用
		boolean flag=true;
		if(flag){
			result.setStatus(1);
			result.setMessage("登陆成功");
			result.setData(user);
		}else{
			result.setStatus(0);
			result.setMessage("登录失败");
		}
		try {
			//转化result对象为json字符串
			String json=JSON.toJSONString(result);
			PrintWriter out=response.getWriter();
			out.println(json);
			out.flush();
			out.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
```
## 用到的spring mvc.xml

```xml
<!-- 有关springmvc的配置放在此文件中 -->
		
		<!-- 在restful模式下,要添加静态资源,这些静态资源能够直接使用,不经过拦截处理 -->
		<mvc:resources location="/js/" mapping="/js/**"></mvc:resources>
		<!--  <mvc:resources location="/" mapping="/**"></mvc:resources>-->
		<!-- 另一种跳过拦截的方式(不推荐),不能细粒度控制具体的文件夹 -->
		<!-- <mvc:default-servlet-handler/> -->
		
		
		<!-- 用于解析@RequestMapping注解 @ResponseBody注解 -->
	<mvc:annotation-driven></mvc:annotation-driven>
	<!-- 扫描Controller包 -->
		<context:component-scan base-package="cn.tedu.controller"></context:component-scan>
	<!-- 内部资源视图解析器,用于springmvc专门用来拼装目标url地址的
		prefix:前缀/WEB-INF/pages/
		suffix:后缀.jsp
		拼装成目标url地址,拼装的原则:前缀+viewName+后缀->/WEB-INF/pages/success.jsp
	 -->
	<bean id="jspViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/pages/"/>
    <property name="suffix" value=".jsp"/> 	
    </bean>
    
    <!-- 处理spring mvc上传文件的 -->
    <bean id="multipartResolver"
        class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <!-- 其中一个可以配置的属性; 上传文件的最大字节 -->
    <property name="maxUploadSize" value="4194304"/>
	</bean>
	
<!-- spring mvc拦截器的配置 -->
	<mvc:interceptors>
		<mvc:interceptor>
			<!-- 需要拦截的地址,一般是所有的请求都需要拦截,把不需要拦截的除去 -->
			<mvc:mapping path="/**"/>
			<!-- 不需要拦截的地址 -->
			<mvc:exclude-mapping path="/login_restful.jsp"/>
			<mvc:exclude-mapping path="/js/**"/>
			<mvc:exclude-mapping path="/user_restful/**"/>
			<mvc:exclude-mapping path="/user/**"/>
			<bean class="cn.tedu.interceptor.SecurityInterceptor"/>
		</mvc:interceptor>
	</mvc:interceptors>
```

## spring mvc文件上传


### 方式一:表单上传的方式

```xml
  <form action="upload_form/uploadfile" method="post" enctype="multipart/form-data">
	<input type="file" name="file" id="fileid"/>
	<input type="text" name="desc" />
  </form>
```
请求upload_form/uploadfile,在spring容器中找到这个controller方法

```java
@Controller
@RequestMapping("upload_form/")
public class UploadController_Form {
	@RequestMapping(value="uploadfile",method=RequestMethod.POST)
	public String upload(String desc,MultipartFile addFile,HttpServletRequest request,HttpServletResponse response,Model model){
		String result="error";
		System.out.println(desc+" "+addFile);
		//获取服务器的上传文件件的路径
		String realPath=request.getServletContext().getRealPath("/uploadfile");
		File realFile=new File(realPath);
		if(realFile.exists()){
			realFile.mkdir();
		}
		if(addFile==null||addFile.isEmpty()){
			//说明没添加文件
			model.addAttribute("msg","请选择一个文件");
			result="uploadinfo";
		}else{
			//说明添加了文件,开始接收文件
			//获取上传的文件名
			String originalFileName=addFile.getOriginalFilename();
			//获取表单文件域的名字
			String fieldName=addFile.getName();
			//获取文件的类型
			String contentType=addFile.getContentType();
			//获取文件的大小
			long fileSize=addFile.getSize();
			System.out.println(originalFileName+" "+fieldName+" "+contentType+" "+fileSize);
			//可以if限定文件类型和大小
			//用spring mvc的api来上传文件
			try {
				File serverFile=new File(realFile,originalFileName);
				addFile.transferTo(serverFile);
				model.addAttribute("msg","上传文件成功");
				result="uploadinfo";
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
		}
		return result;
	}
}
```
在springmvc.xml中添加如下配置

```xml
<!-- 处理spring mvc上传文件的 -->
    <bean id="multipartResolver"
        class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <!-- 其中一个可以配置的属性; 上传文件的最大字节 -->
    <property name="maxUploadSize" value="4194304"/>
	</bean>
```

在pom.xml中添加如下

```xml
<!-- common fileupload -->
		<dependency>
	  		<groupId>commons-fileupload</groupId>
	  		<artifactId>commons-fileupload</artifactId>
	  		<version>1.4</version>
		</dependency>
```

springmvc的底层上传框架还是commons-fileupload组件,但是上传的api方法就不是commons-fileupload组件的api,此commons-fileupload组件api又经过springmvc框架的封装,上传的api就变成org.springframework.web.multipart.commons.CommonsMultipartResolver的api方法  
**注意:**
springmvc不是只对Commons-fileupload做封装  
springmvc还可以对Cos的上传文件的组件进行封装所有,需要添加第三的jar包(commons-fileupload,cos)  

## springmvc拦截器
spring的HandlerMapping处理器支持拦截器的应用,当需要为某些请求提供特殊的功能的时候,添加拦截器  
拦截常见应用就是身份验证,就是在所有的请求的前面都要判断是否是已经登录,已经登录就直接访问资源,没有登录就跳转到登录页面.  
拦截器的概念,就横切了一个身份验证的切面  
拦截器必须实现HandlerInterceptior接口,这个接口有下面的三个方法  
* preHandle();
处理器被执行前调用,方法返回true表示会继续调用其他的拦截器,如果没有其他的拦截器,就调用对应的处理器,处理Contoller  
返回值是false表示终端流程,不会执行后续的拦截器和处理器  
* postHandler();
处理器执行后,视图处理前调用,此时可以通过ModelAndView对象模型  
对model数据和view数据更该,以达到传送不同的数据和跳转不同目标  
* afterCompletion();
整个请求处理完毕后调用此方法,如果性能监控我们在此记录结束的时间  
只有preHandler返回true,才会调用此方法  
### 实现springmvc拦截器的步骤:
1. 建立一个类实现自HanderInterceptor接口
 * a.此类可以实现HandlerInterceptor接口,也可以继承自HanderInterceptorAdaptor类
 * b.实现接口或继承类,然后重写对应的三个方法,只需要重写需要的方法即可
2. 在spring_mvc.xml的配置文件整配置拦截器
 * a.把拦截器纳入spring容器管理
 * b.指定拦截谁,不拦截谁
 
```java
public class SecurityInterceptor implements HandlerInterceptor{
@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object obj) throws Exception {
		System.out.println("preHandle");
		HttpSession session=request.getSession();
		Object o=session.getAttribute("userName");
		if(o!=null){
			//说明登录时给session存过数据userName
			
			return true;
		}
		response.sendRedirect("login_restful.jsp");
			return false;
	}
}
```

```xml
<!-- spring mvc拦截器的配置 -->
		<mvc:interceptors>
			<mvc:interceptor>
				<!-- 需要拦截的地址,一般是所有的请求都需要拦截,把不需要拦截的除去 -->
				<mvc:mapping path="/**"/>
				<!-- 不需要拦截的地址 -->
				<mvc:exclude-mapping path="/login_restful.jsp"/>
				<mvc:exclude-mapping path="/js/**"/>
				<mvc:exclude-mapping path="/user_restful/**"/>
				<mvc:exclude-mapping path="/user/**"/>
				<bean class="cn.tedu.interceptor.SecurityInterceptor"/>
			</mvc:interceptor>
		</mvc:interceptors>
```
