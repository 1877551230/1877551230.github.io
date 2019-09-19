---
layout:     post
title:      springboot
subtitle:   
date:       2019-09-14
categories: Java
author:     miracle
catalog: true
tags:
    - Java框架
---

* content
{:toc}


## springboot搭建
1. 创建maven工程quickstart
2. pom文件--集成springboot-parent

```xml
<parent> 
  <!-- groupId artifactId version -->  
  <groupId>org.springframework.boot</groupId>  
  <artifactId>spring-boot-starter-parent</artifactId> 
  <version>1.5.9.RELEASE</version>
</parent>
```
starter-web开发一个web应用（没有持久层）

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
3. 启动类
核心注解@SpringBootApplication

```java
@SpringBootApplication
@MapperScan("cn.tedu.mapper")
public class StarterOrder {
	/*
	 * 启动方法main
	 */
	public static void main(String[] args){
		/*
		 *source:Class表示当前启动类的反射对象
		 */
		SpringApplication.run(StarterOrder.class, args);
	}
}
```
4. controller和server 注入

## springboot的自动配置原理

1. 早期的xml
大量的bean标签 
2. jdk5出现了注解
整合了大量的关键字的配置内容,扫描@Controller @Service @Component等等,DOM/SAX-->JavaConfig-->配合注解实现大量的bean标签,转化配置-->springboot实现了更多的注解使用代替了xml 
3. 包扫描bean的创建
 * xml文件利用注解@Configuratoin使用代码配置 （@Configuration所在的类表示一个xml配置文件） 
 * @Bean创建对象（相当于bean标签） 

```java
@Configuration
//@Bean注解生成一个初始化方法,返回一个bean对 象 
@Bean
return new HelloComponent(); public HelloComponent initH(){
public class HelloConfig {
	}
}
```

4. springboot的核心注解
@SpringBootApplication是一个组合注解组合了三个重要的内容   
 @SpringBootConfiguration  
 @ComponentScan  
 @EnableAutoConfiguration  
 * SpringBootConfiguration注解==Configuration:启动类本身 就是一个配置累，表示一个启动加载spring的基本xml 文件（componentScan）
 * ComponentScan相当于是将之前xml中 context:component-scan转化成注解,默认会对当前类的包进行加载相当于包扫描的 basePackage context:component-scan basePackge="cn.tedu"
5. 根据依赖的内容实现自动加载bean对象
 
@Conditional衍生注解（根据依赖做条件的核心内容）, 可以使用条件注解判断当前配置类是否生效加载

 * @ConditionalOnClass：环境中存在指定类满足条件
 * @ConditionalOnMissingClass：环境中不存在指定类满足条件
 * @ConditionalOnBean：环境中存在指定bean对象，满足条件
 * @ConditionalOnMissingBean:不存在指定bean对象满足条件 
 * @ConditionalOnProperties：环境中对应属性配置满足条件 
 * @ConditionalOnWebApplication：当前系统是web应用满足条件
6. springboot的整合自动配置
 @EnableAutoConfiguration 根据依赖的jar包spring-boot-autoconfigure.jar，**autoconfigure.jar提供的配置文件spring.factories 记录了当前扩展jar包中提供的所有实现过得不同技术 的配置类的加载配置类全路径名称

##RestTemplate
springmvc的对象,支持REST风格,支持http协议的代发访问(http协议封 装成了对象调用的方法 )  
getForObject(url,Class) get请求  
postForObject post请求  
putForObject   
deleteForObject  

## order-user 支付积分系统分布

### user积分系统

#### application.properties
命名必须是application.properties


```
server.port=8090
server.contextPath=/
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql:///testdb?useUnicode=true&characterEncoding=utf8&autoReconnect=true&allowMultiQueries=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
mybatis.typeAliasesPackage=cn.tedu.domain
mybatis.mapperLocations=classpath:mapper/*.xml
mybatis.configuration.mapUnderscoreToCamelCase=true
mybatis.configuration.cacheEnabled=false
```


#### pom.xml配置

```xml
<parent>
		<!-- groupId artifactId version -->
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.9.RELEASE</version>
</parent>
```
springboot中整合了tomcat,所以不用再配置tomcat

```xml
<dependencies>
  <!-- web应用的简化依赖starter-web 
  	jackson spring mvc context tomcat log等
  -->
  	<dependency>
  		<groupId>org.springframework.boot</groupId>
  		<artifactId>spring-boot-starter-web</artifactId>
  	</dependency>
  	<dependency>
  		<groupId>org.springframework.boot</groupId>
  		<artifactId>spring-boot-starter-jdbc</artifactId>
  	</dependency>
  	<!-- mysql -->
  	<dependency>
  		<groupId>mysql</groupId>
  		<artifactId>mysql-connector-java</artifactId>
  		<version>5.0.8</version>		
  	</dependency>
  	<!-- springboot mybatis -->
  	<dependency>
  		<groupId>org.mybatis.spring.boot</groupId>
  		<artifactId>mybatis-spring-boot-starter</artifactId>
  		<version>1.3.0</version>
  	</dependency>
  	<!-- druid -->
  	<dependency>
  		<groupId>com.alibaba</groupId>
  		<artifactId>druid</artifactId>
  		<version>1.0.14</version>
  	</dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
  	<plugins>
  		<plugin>
  			<groupId>org.springframework.boot</groupId>
  			<artifactId>spring-boot-maven-plugin</artifactId>
  		</plugin>
  	</plugins>
  </build>
```

#### spring运行容器

```java
@SpringBootApplication
@MapperScan("cn.tedu.mapper")
public class StarterUser {
	/*
	 * 启动方法main
	 */
	public static void main(String[] args){
		/*
		 *source:Class表示当前启动类的反射对象
		 */
		SpringApplication.run(StarterUser.class, args);
	}
}
```

#### controller

更新积分的业务通过支付来调用,支付系统是另一个项目

```java
@RestController
public class UserController {
	@Autowired
	private UserService userService;
	//请求积分查询
	@RequestMapping("user/query/point")
	public User queryUser(Integer userId){
		return userService.queryUser(userId);
	}
	//更新积分
	@RequestMapping("user/update/point")
	public Integer updateUserPoint(Integer orderMoney,Integer userId){
		try{
			userService.updateUserPoint(orderMoney,userId);
			return 1;
		}
		catch(Exception e){
			e.printStackTrace();
			return 0;
		}
	}
}
```

#### service

```java
@Service
public class UserService {
	@Autowired
	private UserMapper userMapper;
	
	public void updateUserPoint(Integer orderMoney, Integer userId) {
		/*
		 * 根据业务逻辑,实现积分的功能
		 * 根据user的lev的值
		 * lev=0 普通用户 2倍
		 * lev=1 高级用户 5倍
		 * */
		
		//查询级别
		User user=userMapper.selectUserById(userId);
		//做更新的参数user
		User param=new User();
		param.setUserId(userId);
		
		if(user.getLev()==0){
			//积分两倍
			param.setPoints(user.getPoints()+orderMoney*2);
		}else{
			//积分五倍
			param.setPoints(user.getPoints()+orderMoney*5);
		}
		userMapper.updateUserPointById(param);
	}
	public User queryUser(Integer userId) {
		return userMapper.selectUserById(userId);
	}
}
```

#### mapper

```java
public interface UserMapper {

	public User selectUserById(Integer userId);
	public void updateUserPointById(User paramUser);
}
```

```xml
	<select id="selectUserById" parameterType="Integer" resultType="User">
		select * from t_user where user_id=#{userId}
	</select>
	<update id="updateUserPointById" parameterType="User">
		update t_user set points=#{points} where user_id=#{userId}
	</update>
```

### order支付系统

#### application.properties

```
server.port=8091
server.contextPath=/
#dataSource
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql:///testdb?useUnicode=true&characterEncoding=utf8&autoReconnect=true&allowMultiQueries=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
mybatis.typeAliasesPackage=cn.tedu.domain
mybatis.mapperLocations=classpath:mapper/*.xml
mybatis.configuration.mapUnderscoreToCamelCase=true
mybatis.configuration.cacheEnabled=false
```

#### pom.xml

同上

#### controller

```java
@RestController
public class OderController {
	@Autowired
	private OrderService orderService;
	//订单支付
	@RequestMapping("order/pay")
	public Integer orderPay(String orderId){
		try{
			orderService.orderPay(orderId);
			return 1;
		}catch(Exception e){
			e.printStackTrace();
			return 0;
		}
	}
}
```

#### service
是怎么解决两个不同项目的调用的呢?  
通过RestTemplate,请求了一个url,然后此url就是user积分系统中的RequestMapping管理的一个业务


```java
@Service
public class OrderService {
	@Autowired
	private OrderMapper orderMapper;
	public void orderPay(String orderId) {
		
		//查询order对象,获取userId和orderMoney的数据
		Order order=orderMapper.selectOrderById(orderId);
		//支付逻辑中可以实现打折活动,确定支付的真正金额
		System.out.println(order.getOrderId()+"支付金额"+order.getOrderMoney());
		//想办法将参数userId orderMoney封装到一个http请求中,发起请求访问www.ssm.com/user/update/point
		//
		RestTemplate client=new RestTemplate();
		String url="http://www.ssm.com/user/update/point?userId="+order.getUserId()+"&orderMoney="+order.getOrderMoney();
		Integer success=client.getForObject(url, Integer.class);
		if(success==1){
			System.out.println("积分成功");
		}
		if(success==0){
			System.out.println("积分失败");
			
		}	
		
	}

}
```

#### mapper

```xml
<select id="selectOrderById" parameterType="String" resultType="Order">
	select * from t_order where order_id=#{orderId}
</select>
```


```java
public interface OrderMapper {
	public Order selectOrderById(String orderId);
}
```