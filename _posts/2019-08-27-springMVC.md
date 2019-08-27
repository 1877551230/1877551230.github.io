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
* spring_mvc.xml有load-on-startup,所以在服务器加载时也加载了并把其中的类实例化对象放在springmvc容器中管理,反射带有Controller的类,解析该类中的@RequestMapping注解,然后做路径拼装,把路径和路径所对应的方法信息存储到springmvc容器中(map集合)
* tomcat服务器启动完毕
*  发送请求给服务器
* org.springframework.web.servlet.DispatcherServlet拦截*.do请求
* 进入DispatcherServlet的service方法
 - 根据请求url去HandlerMapping中寻找是否有指定Controller,HandlerMapping维护的map集合是从springmvc容器取出的
 - 通过HandlerAdapter(处理器适配去)调用和执行Controller中方法,Controller对象是从springmvc容器中取出
 - 调用Controller方法,返回ModelAndView
 - 从ModelAndView取出消息对象,目标页面的字符串,拼装出url,并渲染目标页面,利用request.getRequestDispatcher("目标url").forward(request,response);
* 把渲染完的页面响应给浏览器,然后浏览器格式化显示输出

## 表单方式得到数据
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
如下是一个controller,上面介绍了,给controller写了RequestMapping注解,从中得到很多方法,@RequestMapping("user/")添加在类前面,给整个类增加一个路径/user,给方法增加注解@RequestMapping(value="login1.do",method=RequestMethod.POST),value是方法名,method是区分post方法还是get方法  
当login.jsp提交表单时,表单action为/user/*.do方法,就调用controller中对应的方法  

下面controller写了4种从表单中获取数据的方式,也写了4种响应到服务器上的方式,可以两两随意组合  

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

