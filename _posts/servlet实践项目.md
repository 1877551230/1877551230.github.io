---
layout:     post
title:      web限制ip登录注册
subtitle:   
date:       2019-08-13
categories: Java
author:     miracle
catalog: true
tags:
    - JavaWeb
---

* content
{:toc}

## 工作原理图

[图](https://github.com/1877551230/1877551230.github.io/blob/master/img/%E7%94%A8%E6%88%B7%E6%A1%88%E4%BE%8B%E6%95%B0%E6%8D%AE%E6%B5%81%E8%BD%AC%E5%9B%BE.png?raw=true)

 * [jdbc基础参考](gitee.q1877551230.io/JDBC)
 * []()

 * 功能
  * 限制ip
  * 登录
  * 注册
  * 显示所有数据
  * 修改数据
  * 删除数据
  * 分页+模糊查询

## 限制ip

### Servlet层
```xml
 <servlet>
    <servlet-name>SysInitServletName</servlet-name>
    <servlet-class>cn.tedu.servlet.SysInitServlet</servlet-class>
    <init-param>
      <param-name>ipRange</param-name>
      <param-value>10.8.38.1-10.8.38.100</param-value>
    </init-param>
    <init-param>
      <param-name>encoding</param-name>
      <param-value>UTF-8</param-value>
    </init-param>
    <load-on-startup>0</load-on-startup>
  </servlet>
```

此xml有load-on-starup,此servlet在服务器加载的时候就加载  
<init-param>在<servlet>中,变量只在此servlet生效



```xml
 <context-param>
    <param-name>globalIpRange</param-name>
    <param-value>10.8.38.1-10.8.38.100</param-value>
  </context-param>
  <context-param>
    <param-name>globalEncoding</param-name>
    <param-value>UTF-8</param-value>
  </context-param>
```

此xml功能同上,但此<context-param>在<web-app>中,是全局变量,对整个项目生效



```xml
  <servlet>
    <servlet-name>IPLimitedServletName</servlet-name>
    <servlet-class>cn.tedu.servlet.IPLimitedServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>IPLimitedServletName</servlet-name>
    <url-pattern>/ip</url-pattern>
  </servlet-mapping>
  <servlet>
```

此servlet是对ip进行限制  

```xml
<welcome-file-list>
    <welcome-file>ip</welcome-file>
</welcome-file-list>
```

当有人访问时,IPLimitedServlet生命周期开始,SysInitServlet在加载时生命周期就开始


SysInitServlet.java

```java
public class SysInitServlet extends HttpServlet {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		super.destroy();
	}

	@Override
	public void init() throws ServletException {
		//读取全局数据
		String ipRange=this.getServletContext().getInitParameter("globalIpRange");
		String encoding=this.getServletContext().getInitParameter("globalEncoding");
		CommonValue.ipRange=ipRange;
		CommonValue.encoding=encoding;
		System.out.println(CommonValue.ipRange);
		System.out.println(CommonValue.encoding);
		//读取局部数据
		/*String ipRange=this.getInitParameter("ipRange");
		String encoding=this.get
		InitParameter("encoding");
		CommonValue.ipRange=ipRange;
		CommonValue.encoding=encoding;
		System.out.println(CommonValue.ipRange);
		System.out.println(CommonValue.encoding);*/
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		System.out.println("init(ServletConfig)");
				//读取全局数据
				String ipRange=config.getServletContext().getInitParameter("globalIpRange");
				String encoding=config.getServletContext().getInitParameter("globalEncoding");
				CommonValue.ipRange=ipRange;
				CommonValue.encoding=encoding;
				System.out.println(CommonValue.ipRange);
				System.out.println(CommonValue.encoding);
				//读取局部数据
				/*String ipRange=this.getInitParameter("ipRange");
				String encoding=this.getInitParameter("encoding");
				CommonValue.ipRange=ipRange;
				CommonValue.encoding=encoding;
				System.out.println(CommonValue.ipRange);
				System.out.println(CommonValue.encoding);*/
	}
}
```

```java
public class CommonValue {	
	public static String ipRange="";
	public static String encoding="";

}
```

上面有两种方式获得ipRange,一种是读取全局数据,另一种是读取局部数据,读取的方式不一样,两种方式对应上面两种xml的写法,当有init(ServletConfig config)时调用该方法,无参数方法不调用.把得到的IPRange和encoding存给CommonValue.java.

以上的代码都是在服务器加载时就工作

### 业务逻辑层

然后写限制ip的servlet具体业务逻辑

```java
@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String ipRange=CommonValue.ipRange;
		String[] ips=ipRange.split("-");
		int ip1=Integer.parseInt(ips[0].substring(ips[0].lastIndexOf(".")+1));
		int ip2=Integer.parseInt(ips[1].substring(ips[1].lastIndexOf(".")+1));;
		System.out.println(ip1+" "+ip2);
		//获取客户端访问的真实ip
		String realIp=req.getRemoteAddr();
		int clientIp=Integer.parseInt(realIp.substring(realIp.lastIndexOf(".")+1));
		System.out.println("realIp="+realIp);
		if(clientIp>ip1&&clientIp<ip2){
			resp.sendRedirect("login.html");//如果符合就重定向到登录界面
		}else{
			PrintWriter out=resp.getWriter();
			out.append("u r not qulify to read,ur ip="+realIp);
			out.close();
		}
	}

```


## 登录

### servlet层

先写xml,web.xml在服务器启动时就加载到内存,当请求login时,找到UserLoginServlet.class并实例化对象  


```xml
<servlet>
    <servlet-name>UserLoginServletName</servlet-name>
    <servlet-class>cn.tedu.servlet.UserLoginServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>UserLoginServletName</servlet-name>
    <url-pattern>/login</url-pattern>
  </servlet-mapping>
```

UserLoginServlet.java

```java
@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		//获取前端提交的数据
		String uname=req.getParameter("userName");
		String upwd=req.getParameter("userPassword");
		User user=new User();
		user.setName(uname);
		user.setPassword(upwd);
		//调用业务
		UserService userService=new UserServiceImpl();
		boolean flag=userService.login(user);
		//根据业务的返回结果做响应
		if(flag){
			resp.sendRedirect("success.jsp");
		}else{
			resp.sendRedirect("login.jsp");
		}
	}
```

### 业务逻辑层

接下来调用业务层
UserService.java(业务接口)

```java
public interface UserService {
	//登录的业务接口方法
	public boolean login(User user);

	public boolean register(User user);

}
```

具体业务逻辑

```java
public class UserServiceImpl implements UserService {
	private UserDao userDao=new UserDaoImpl();
	@Override
	public boolean login(User user) {
		boolean flag=false;
		int id=userDao.login(user);//调用数据库
		if(id>0){
			flag=true;
		}
		return flag;
	}
}
```

### 数据访问层
通过逻辑代码调用数据库的数据
数据库访问层接口
userDao.java

```java
public interface UserDao {
	//登陆的数据库方法
	public int login(User user);
}
```


登录操作实现
useDaoImpl.java

```java
public class UserDaoImpl implements UserDao {

	@Override
	public int login(User user) {
		int id=0;
		try {
			String sql = "select id from t_user where username=? and userpassword=?";
			Object[] params = new Object[] { user.getName(), user.getPassword() };
			List<User> users = CommonDao.executeQuery(User.class, sql, params);
			if (users != null && users.size() == 1) {
				id = users.get(0).getId();
			} 
		} catch (Exception e) {
			e.printStackTrace();
		}
		return id;
	}
```

### 响应
最后响应到浏览器上,如果登录成功则重定向到usershowall.jsp,否则重定向到当前页面

### 总结
数据的轮回如下

 浏览器-->Servlet-->业务逻辑层-->数据访问层(数据)-->业务逻辑层-->Servlet-->浏览器  
最终响应在浏览器上

## 注册

### servlet层

同登录,在创建Servlet类时可以直接创建Servlet对象,会自动在web.xml生成相应的配置

```xml
  <servlet>
    <servlet-name>UserRegisterServlet</servlet-name>
    <servlet-class>cn.tedu.servlet.UserRegisterServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>UserRegisterServlet</servlet-name>
    <url-pattern>/register</url-pattern>
  </servlet-mapping>
```

web.xml在服务器启动时就加载到内存,在请求register时,找到register同名的Servlet,找到类通过反射实例化对象  

UserRegisterServlet.java

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//1.获取注册的数据
		String uname=request.getParameter("userName");
		String upwd=request.getParameter("userPassword");
		String uage=request.getParameter("age");
		String uaddress=request.getParameter("address");
		User user=new User();
		user.setName(uname);
		user.setPassword(upwd);
		user.setAddress(uaddress);
		user.setAge(Integer.parseInt(uage));
		//2.注册的业务
		UserService userService=new UserServiceImpl();
		boolean flag=userService.register(user);
		//3.根据业务的返回结果做响应
		if(flag){
			
		}else{
			
		}
	}
```

### 业务逻辑层

上面的servlet得到表单的数据,然后调用业务逻辑

UserService.java(业务接口)同上

```java
public interface UserService {
	//登录的业务接口方法
	public boolean login(User user);

	public boolean register(User user);

}
```
具体的注册逻辑接口的实现
UserServiceImpl.java

```java
@Override
	public boolean register(User user) {
		boolean flag=false;
		int rowAffect=userDao.register(user);
		if(rowAffect==1){
			flag=true;
		}
		return false;
	}
```

###数据访问层

业务逻辑调用数据库数据
数据库访问层接口
userDao.java

```java
public interface UserDao {
	//注册的数据库方法
	public int register(User user);
}
```

具体的实现  
userDaoImple.java

```java
@Override
	public int register(User user) {
		int rowAffect=0;
		try {
			String sql = "insert into t_user (username,userpassword,age,address) values(?,?,?,?)";
			rowAffect = CommonDao.executeUpdate(sql,
					new Object[] { user.getName(), user.getPassword(), user.getAge(), user.getAddress() });
		} catch (Exception e) {
			// TODO: handle exception
		}
		return rowAffect;
	}
```

### 响应
最后响应到浏览器上,如果登录成功则重定向到login.jsp,否则重定向到当前页面

### 总结
数据的轮回如下

 浏览器-->Servlet-->业务逻辑层-->数据访问层(数据)-->-->业务逻辑层-->Servlet-->浏览器  
最终响应在浏览器上  

## 数据库操作(PropertyUtil)

数据库(CommonDao)的操作在jdbc讲过,为了更方便的修改不同的数据库,此项目用PropertyUtil方式
下面是通用的连接数据库操作
CommonDao.java

```java
public class CommonDao {
	private static PropertyUtil pu=new PropertyUtil("mysql.properties");
	private static String driverClass=pu.getProperty("jdbc_driverClass");
	private static String url=pu.getProperty("jdbc_url");
	private static String username=pu.getProperty("jdbc_username");
	private static String userpassword=pu.getProperty("jdbc_userpassword");
	/**
	 * 获取连接的公共方法
	 * @return
	 * @throws Exception
	 */
	public static Connection getConnection()throws Exception{
		Connection con=null;
		Class.forName(driverClass);
		con=DriverManager.getConnection(
				url,
				username,
				userpassword);
		return con;
	}
}
```

定义mysql属性文件  
mysql.properties

```text
jdbc_driverClass=com.mysql.jdbc.Driver
jdbc_url=jdbc:mysql://localhost:3306/testdb
jdbc_username=root
jdbc_userpassword=root
```

propertyUtil得到这个属性文件,然后通过文件中的属性名来得到具体的值,这样通过修改属性文件中的属性值就可以连接不同的数据库

## 显示所有数据

### servlet层

先创建UserShowAllServlet,当浏览器访问此servlet时,寻找此url-pattern,找到servlet-name,在servlet标签中找到对应的类,通过反射实例化对象(步骤同上)


```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//1.获取数据(无)
		//2.调用查询所有用户信息的业务方法
		List<User> users=new UserServiceImpl().findAllUsers();
		//3.根据业务的返回结果绑定给request对象,把带有数据的request对象转发给usershowall.jsp
		//绑定数据到request对象中
		request.setAttribute("allusers", users);
		//把带有新数据的request对象转发给下一个目的地usershowall.jsp
		RequestDispatcher rd=request.getRequestDispatcher("usershowall.jsp");
		rd.forward(request, response);
		
		
	}
```

浏览器访问UserShowAllServlet时,发送request请求,通过service调用doGet方法  
doGet方法里,把需要的所有user对象数据绑定到request对象中,然后转发到usershowall.jsp,key值为**allusers**,这个key下面会用到

### 业务逻辑层

具体的业务逻辑  

UserService.java(接口)
```java
public List<User> findAllUsers();
```

接下来实现这个接口中的方法

UserServiceImpl.java

```java
public List<User> findAllUsers() {
		return userDao.findAllUsers();
	}
```

### 数据访问层

业务逻辑中调用了userDao中的方法

userDao.java(接口)

```java
public List<User> findAllUsers();
```

接下来实现这个接口中的方法

```java
public List<User> findAllUsers() {
		List<User> users=null;
		try {
			String sql = "select id,username name,userpassword password,age,address from t_user";
			users = CommonDao.executeQuery(User.class, sql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return users;
	}
```

### 响应浏览器usershowall.jsp
 得到这些数据后要把这些所有数据显示在浏览器上面,用表格的形式显示在浏览器上,有多少数据就要创建多少行数据  
 我们用jstl在jsp页面里实现这些标签的生成  

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
```
在jsp文件开头加入此语句

```jsp
<c:forEach var="user" items="${requestScope.allusers}" varStatus="vs">
 		<tr>
 			<td>${vs.index}</td>
 			<td>${vs.count}</td>
 			<td>${user.id}</td>
 			<td>${user.name}</td>
 			<td>${user.password}</td>
 			<td>${user.age}</td>
 			<td>${user.address}</td>
 			<td><a href="UserDeleteServlet?uid=${user.id}">删除</a></td>
 			<td><a href="UserFindById?uid=${user.id}">修改</a></td>
 		</tr>
 	</c:forEach>	
```
上面语句相当于for循环,var="user"定义变量user,循环遍历的值是${allusers},这个值是通过上面request对象绑定得到的,然后把得到的属性值添加在表格中  
最后的删除操作是一个超链接,超链接访问的是一个servlet,通过?隔开后面带有一个数据,得知调用的是doGet()方法,后面写删除操作↓↓↓

### 总结
数据的轮回如下

 浏览器-->Servlet-->业务逻辑层-->数据访问层(数据)-->业务逻辑层-->Servlet-->浏览器  
最终响应在浏览器上  

## 删除数据

修改数据的方式是在显示所有数据的基础上,点击数据后面的修改来操作的,通过上面usershowall.jsp得知是通过超链接访问servlet方式来删除

### servlet层

上面超链接调用的是此servlet的doGet()方法

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//1.获取要删除的id
		String id=request.getParameter("uid");
		//2.调用删除用户业务
		boolean flag=new UserServiceImpl().deleteUser(Integer.parseInt(id));
		//3.根据业务的返回结果做跳转响应
		if(flag)
		response.sendRedirect("UserShowAllServlet");
	}
```

进入doGet()方法,先得到附带的uid的值,然后调用删除用户业务逻辑

### 业务逻辑层

UserService.java(接口)

```java
public boolean deleteUser(int id);
```

实现上面方法

UserServiceImpl.java

```java
public boolean deleteUser(int id) {
		boolean flag=false;
		int rowAffect=userDao.deleteUser(id);
		if(rowAffect==1){
			flag=true;
		}
		return flag;
	}
```

### 数据访问层

业务逻辑层调用了数据访问层方法

UserDao.java(接口)

```java
public int deleteUser(int id);
```

实现上面方法

```java
public int deleteUser(int id) {
		int rowAffect=0;
		try {
			String sql="delete from t_user where id=?";
			rowAffect=CommonDao.executeUpdate(sql, id);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rowAffect;
		
	}
```

### 响应浏览器UserShowAllServlet

跳转响应到UserShowAllServlet,上面已经做了分析,重新显示所有最新数据,相应的数据就被删除了


## 修改数据
修改数据分为两步
1. 通过id查找用户信息
2. 修改查找到的用户信息

### Servlet层

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding(CommonValue.encoding);
		//1.获取用户的id
		String id=request.getParameter("uid");
		//2.根据id查询用户信息
		User user=new UserServiceImpl().findUserById(Integer.parseInt(id));
		//3.把查询到的数据转发给update.jsp
		//绑定数据给request
		request.setAttribute("user", user);
		//转发request到新的目标url
		request.getRequestDispatcher("update.jsp").forward(request, response);
	}
```

进入UserFindById,带入一个uid值,调用的也是doGet()方法,然后调用具体查询用户业务逻辑

### 业务逻辑层

根据id查找用户信息  
UserService.java()接口

```java
public User findUserById(int id);
```
实现上面方法
UserServiceImpl.java

```java
public User findUserById(int id) {
		User user=userDao.findUserById(id);
		return user;
	}
```

### 数据访问层
进入数据访问层,根据用户id查询用户信息的数据库方法  

UserDao.java(接口)

```java
public User findUserById(int id);
```
实现上面方法  
UserDaoImpl.java

```java
public User findUserById(int id) {
		User user=null;
		try {
			String sql="select id,username name,userpassword password,age,address from t_user where id=?";
			List<User> users=CommonDao.executeQuery(User.class, sql,id);
			if(users!=null&&users.size()==1){
				user=users.get(0);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return user;
	}
```

### 响应浏览器

查到相应的数据后,重定向响应到浏览器update.jsp上,显示出一个修改界面让用户进行修改

update.jsp

```jsp
<form action="UserUpdateServlet" method="post">
<input type="hidden" name="userId" value="${requestScope.user.id}"/>
<table border="1px" align="center">
 		<tr>
 			<td>用户名</td>
 			<td><input type="text" name="userName" value="${requestScope.user.name}"/></td>
 		</tr>
 		<tr>
 			<td>密&nbsp;&nbsp;码</td>
 			<td><input type="password" name="userPassword" value="${requestScope.user.password}"/></td>
 		</tr>
 		<tr>
 			<td>年龄</td>
 			<td><input type="text" name="age" value="${requestScope.user.age}"/></td>
 		</tr>
 		<tr>
 			<td>地址</td>
 			<td><input type="text" name="address" value="${requestScope.user.address}"/></td>
 		</tr>
 		<tr>
```
重定向时为request对象绑定了key为user的user对象数据,并把user对象的属性值显示在jsp页面上,此时就可以重新为这些属性赋值,因为不能设置id的值,所以将id设置为隐藏按钮,提交后进入UserUpdateServlet

### servlet层

再次进入servlet层,进入UserUpdateServlet,调用的是post方法

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding(CommonValue.encoding);
		String uid=request.getParameter("userId");
		String uname=request.getParameter("userName");
		String upwd=request.getParameter("userPassword");
		String uage=request.getParameter("age");
		String uaddress=request.getParameter("address");
		User user=new User();
		user.setId(Integer.parseInt(uid));
		user.setAddress(uaddress);
		user.setName(uname);
		user.setPassword(upwd);
		user.setAge(Integer.parseInt(uage));
		boolean flag=new UserServiceImpl().updateUser(user);
		if(flag)
		response.sendRedirect("UserShowAllServlet");
	}
```
此方法得到新赋的值,然后调用业务逻辑更新方法

### 业务逻辑层
更新用户信息接口方法
UserService.java(接口)

```java
public boolean updateUser(User user);
```
实现上面方法

```java
public boolean updateUser(User user) {
		boolean flag=false;
		int rowAffect=userDao.updateUser(user);
		if(rowAffect==1){
			flag=true;
		}
		return flag;
	}
```

### 数据访问层
业务逻辑层调用了数据库方法  
更新用户信息的数据库方法  
UserDao.java

```java
public int updateUser(User user);
```
实现上面方法

```java
public int updateUser(User user) {
		int rowAffect=0;
		try {
			String sql="update t_user set username=?,userpassword=?,age=?,address=? where id=?";
			rowAffect=CommonDao.executeUpdate(sql, user.getName(),user.getPassword(),user.getAge(),user.getAddress(),user.getId());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rowAffect;
	}
```

### 响应浏览器
更新完成后,重定向到UserShowAllServlet里,又重新加载usershowall.jsp,显示当前最新的数据


## 分页+模糊查询

如果用户登录后,数据量非常庞大的情况下,不能在页面显示所有数据信息,于是有了分页  
### servlet层

```xml
 <servlet>
    <description></description>
    <display-name>FindUserByPageServlet</display-name>
    <servlet-name>FindUserByPageServlet</servlet-name>
    <servlet-class>cn.tedu.servlet.FindUserByPageServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>FindUserByPageServlet</servlet-name>
    <url-pattern>/FindUserByPageServlet</url-pattern>
  </servlet-mapping>
```
通过上面web.xml找到FindUserByPageServlet通过反射实例化对象

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//1.获取数据(当前页码,模糊条件用户名和地址)
		//获取currentPage
		int currentPage=1;
		String currentPage_String=request.getParameter("currentPage");
		if(currentPage_String!=null){
			currentPage=Integer.parseInt(currentPage_String);
		}
		//获取模糊关键字
		String keyword1=request.getParameter("keyword1");
		String keyword2=request.getParameter("keyword2");
		String kw1=(keyword1==null)? "":keyword1;
		String kw2=(keyword2==null)? "":keyword2;
		String[] keywords=new String[]{kw1,kw2};
		//获取每一页显示记录的条数PageSize(page.properties)
		int pageSize=Integer.parseInt(new PropertyUtil("page.properties").getProperty("pageSize"));
		
		
		//2.调用分页的业务
		UserService userService=new UserServiceImpl();
		Page page=userService.findUserByPage(currentPage,pageSize,keywords);
		
		//3.把查询到的分页信息绑定给request,转发给usershowbypage.jsp
		request.setAttribute("page", page);
		request.getRequestDispatcher("usershowbypage.jsp").forward(request, response);
		
	}
```

默认进入时显示第一页,通过request对象得到浏览器输入的keyword1和keyword2和当前页码数,通过page.properties得到每页数据条数,去调用业务逻辑

### 业务逻辑层
分页+模糊查询的接口方法  
UserService.java(接口)

```java
public Page findUserByPage(int currentPage, int pageSize, String[] keywords);
```
实现上面方法

UserServiceImpl.java

```java
public Page findUserByPage(int currentPage, int pageSize, String[] keywords) {
		Page page=new Page();
		page.setCurrentPage(currentPage);
		page.setPageSize(pageSize);
		page.setKeywords(keywords);
		//查询数据库获取带有模糊条件的总记录数
		int totalCount=userDao.getCount(keywords);
		page.setTotalCount(totalCount);
		//计算总页数
		int totalPage=(totalCount%pageSize==0)? (totalCount/pageSize):(totalCount/pageSize)+1;
		page.setTotalPage(totalPage);
		//计算前一页
		if(currentPage==1){
			page.setPreviousPage(1);
		}else{
			page.setPreviousPage(currentPage-1);
		}
		//计算下一页
		if(currentPage==totalPage){
			page.setNextPage(totalPage);
		}else{
			page.setNextPage(currentPage+1);
		}
		//从数据库获取当前页的数据
		List<User> users=userDao.getUsersByPage(currentPage,pageSize,keywords);
		page.setData(users);
		return page;
	}
```
该方法计算总页数,上一页,下一页,当前页user数据并存入Page对象

### 数据访问层
分页+模糊的数据库方法  
userDao.java(接口)

```java
//分页+模糊
	public int getCount(String[] keywords);
	public List<User> getUsersByPage(int currentPage, int pageSize, String[] keywords);
```

实现上面方法

userDaoImpl.java

```java
public int getCount(String[] keywords) {
		int count=0;
		try {
			String sql="select count(id) geshu from t_user "
					+ "where username like ? and address like ?";
			Object[] params=new Object[]{"%"+keywords[0]+"%","%"+keywords[1]+"%"};
			List<CountVO> counts=CommonDao.executeQuery(CountVO.class, sql, params);
			if(counts!=null&&counts.size()==1){
				count=counts.get(0).getGeshu();
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return count;
	}

	@Override
	public List<User> getUsersByPage(int currentPage, int pageSize, String[] keywords) {
		List<User> users=null;
		try {
			String sql="select id,username name,userpassword password,age,address from t_user where username like ? and address like ? limit ?,?";
			Object[] params=new Object[]{"%"+keywords[0]+"%","%"+keywords[1]+"%",(currentPage-1)*pageSize,pageSize};
			users=CommonDao.executeQuery(User.class, sql, params);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return users;
	}
```

查找总页数时,还记得jdbc基础那一张讲的反射方式吗,在求聚合函数时,我们User对象里没有相应的属性和方法,于是我们新创建一个ov类  
CountOV.java

```java
public class CountVO {
	private int geshu;
	public int getGeshu() {
		return geshu;
	}
	public void setGeshu(int geshu) {
		this.geshu = geshu;
	}
}

```

属性就叫个数,然后通过sql语句count(id) geshu 别名来把值存给CountOV,然后取出该值  
再通过查找当前页分页查询的方式得到数据,存进到page对象中,把page对象返回到浏览器

### 响应浏览器

在该servlet中,request对象绑定了page对象所有数据,于是我们就得到了currentPage当前页,previousPage上一页,nextPage下一页,pageData当前页数据这些属性,把这些属性返回到usershowbypage.jsp上  
usershowbypage.jsp

```jsp
<form action="FindUserByPageServlet" method="post">
 		用户名:<input type="text" name="keyword1" value="${page.keywords[0]}"/>
 		地址:<input type="text" name="keyword2" value="${page.keywords[1]}"/>
 		<input type="submit" value="模糊查询"/>
 	</form>
 	<div style="font-size:30px;font-wight:bold;">显示用户信息</div>
 	<table border="1" align="center">
 		<tr>
 			<th>序号1</th>
 			<th>序号2</th>
 			<th>id</th>
 			<th>用户名</th>
 			<th>密码</th>
 			<th>年龄</th>
 			<th>地址</th>
 			<th>删除</th>
 			<th>修改</th>
 		</tr>
 	<c:forEach var="user" items="${requestScope.page.data}" varStatus="vs">
 		<tr>
 			<td>${vs.index}</td>
 			<td>${vs.count}</td>
 			<td>${user.id}</td>
 			<td>${user.name}</td>
 			<td>${user.password}</td>
 			<td>${user.age}</td>
 			<td>${user.address}</td>
 			<td><a href="UserDeleteServlet?uid=${user.id}">删除</a></td>
 			<td><a href="UserFindById?uid=${user.id}">修改</a></td>
 		</tr>
 	</c:forEach>	
 	</table>
 	<!-- 分页条开始 -->
 	<c:if test="${requestScope.page.totalPage>1}">
 	[${page.currentPage}/${page.totalPage}]
 		<!-- 当前页为第一页的情况 -->
 		<c:if test="${requestScope.page.currentPage==1}">
 			<a href="FindUserByPageServlet?currentPage=2&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">下一页</a>
 			<a href="FindUserByPageServlet?currentPage=${page.totalPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">尾页</a>
 		</c:if>
 		<!-- 既不是第一页也不是最后一页 -->
 		<c:if test="${requestScope.page.currentPage>1 and requestScope.page.currentPage<requestScope.page.totalPage}">
 			<a href="FindUserByPageServlet?currentPage=1&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">首页</a>
 			<a href="FindUserByPageServlet?currentPage=${page.previousPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">上一页</a>
 			<a href="FindUserByPageServlet?currentPage=${page.nextPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">下一页</a>
 			<a href="FindUserByPageServlet?currentPage=${page.totalPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">尾页</a>
 		</c:if>
 		<!-- 当前页为最后一页 -->
 		<c:if test="${requestScope.page.currentPage==requestScope.page.totalPage}">
 			<a href="FindUserByPageServlet?currentPage=1&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">首页</a>
 			<a href="FindUserByPageServlet?currentPage=${page.previousPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">上一页</a>
 		</c:if>
 	</c:if>
 	<!-- 分页条结束 -->
```

该jsp增加了两个表单,1:关键字1,2:关键字2,增加了页码导航栏  
把当前页的数据同showalluser方式一样,显示在当前页面  
分页条:
* 如果总页数大于1,就显示分页条
* 显示[当前页数/总页数]
* 当前是第一页,就增加下一页和尾页
* 当前是中间页,就增加首页,上一页,下一页,尾页
* 当前是尾页,就增加首页和上一页
功能:
* 点击上一页,超链接指向到
FindUserByPageServlet?currentPage=${page.previousPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}  
通过doGet方式,把三个参数传入到FindUserByPageServlet中,然后重复上面的过程
* 点击下一页,超链接指向到
FindUserByPageServlet?currentPage=${page.nextPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}  
通过doGet方式,把三个参数传入到FindUserByPageServlet中,然后重复上面的过程
* 点击首页,超链接指向到
FindUserByPageServlet?currentPage=1&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}  
通过doGet方式,把三个参数传入到FindUserByPageServlet中,然后重复上面的过程
* 点击尾页,超链接指向到
FindUserByPageServlet?currentPage=${page.totalPage}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}  
通过doGet方式,把三个参数传入到FindUserByPageServlet中,然后重复上面的过程

## 跳转页面

```jsp
<!-- 跳转页 -->
 	<form action="FindUserByPageServlet" method="post">
 	<input type="text" value="${page.currentPage}" style="width:30px" name="currentPage"/>
 	<input type="submit" value="跳转"/>
 	</form>
```
创建一个表单,text文本框name值是currentPage,输入页数后,跳转到FindUserByPageServlet,重复上面过程

## 下拉框

```
<!-- 下拉列表跳转 -->
 	<form action="FindUserByPageServlet" method="post" id="form">
 	<select onchange="submitForm()" name="currentPage">
 		<c:forEach var="num" begin="1" end="${page.totalPage}" varStatus="vs">
 			<option value="${vs.count}">${vs.count}</option>
 		</c:forEach>
 		<option value="${page.currentPage}" selected="selected">当前页:${page.currentPage}</option>
 	</select>
 	</form>
 	<!-- js函数处理onchange事件 -->
 	<script type="text/javascript">
 	function submitForm(){
 		var form=document.getElementById("form");
 		form.submit();
 	}
 	</script>
```

用jstl循环总页数,从1开始遍历,用vs.count作为value值和显示的值,到totalPage结束  
select的name为currentPage,得到值后传给FindUserByPageServlet  
给select增加了onchange事件,当选择的页面发生变化时,自动重定向页面,onchange用javascript语句实现

## 分页条


```jsp
<!-- 分页条,一共显示7个码 -->
 	<c:if test="${page.totalPage>=7 and page.currentPage<=5}">
 		<c:forEach var="num" begin="1" end="7" varStatus="vs">
 			<a href="FindUserByPageServlet?currentPage=${vs.count}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">${vs.count}</a>
 		</c:forEach>
 	</c:if>	
 	<!-- 当当前页大于5且后面还能再加两个,向前显示4个,向后显示2个 -->
	<c:if test="${page.totalPage>=7 and page.currentPage>5 and page.currentPage+2<=page.totalPage}">
 		<c:forEach var="num" begin="${page.currentPage-4}" end="${page.currentPage+2}" varStatus="vs">
 			<a href="FindUserByPageServlet?currentPage=${num}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">${num}</a>
 		</c:forEach>
 	</c:if>	
 	<!-- 当当前页大于5且后面不能再加两个,向前显示少于7页的页数,向后显示到总页数 -->
 	<c:if test="${page.totalPage>=7 and page.currentPage>5 and page.currentPage+2>page.totalPage}">
 		<c:forEach var="num" begin="${page.currentPage-6+page.totalPage-page.currentPage}" end="${page.totalPage}" varStatus="vs">
 			<a href="FindUserByPageServlet?currentPage=${num}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">${num}</a>
 		</c:forEach>
 	</c:if>	
 	<c:if test="${page.totalPage<7}">
 		<c:forEach var="num" begin="1" end="${page.totalPage}" varStatus="vs">
 			<a href="FindUserByPageServlet?currentPage=${vs.count}&keyword1=${page.keywords[0]}&keyword2=${page.keywords[1]}">${vs.count}</a>
 		</c:forEach>
 	</c:if>
```

每页显示7个数字,以第5个数字作为当前页,同时作为参考位置,向后增加两个数字

* 总页数<7,从1增加到totalPage
* 总页数>7 and currentPage<=5,从1增加到7
* 总页数>7 and currentPage>5 and currentPage+2>totalPage,
此时说明后面不能增加两个,直能到最大页数,为了保证还是7个数字,向前补,currentPage-6到currentPage时,正好保证7个数字,然后减去currentPage后面的数,就是7个,即page.currentPage-6+page.totalPage-page.currentPage.
* 总页数>7 and currentPage>5 and currentPage+2<=totalPage
此时就从currentPage-4到currentPage+3