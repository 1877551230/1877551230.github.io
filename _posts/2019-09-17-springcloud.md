---
layout:     post
title:      springcloud
subtitle:   
date:       2019-09-17
categories: Java
author:     miracle
catalog: true
tags:
    - Java框架
---

* content
{:toc}


## springcloud

轻量级的微服务框架,可以基于springboot的自动配置(减少了自定义的大量代码编写)实现了多个微服务框架的组件功能

* eureka :服务治理 
* ribbon :客户端负载均衡调用 
* zuul:网关,微服务唯一对外提供的接口 
* feign:ribbon是同一种客户端,封装了ribbon 
* hystrix:熔断器 
* config:微服务中配置文件的管理者

## springcloud组件

## Eureka服务治理组件

springcloud中的核心组件,可以实现对整个微服务集群所有节点进行服 务的发现,服务的抓取和服务监听功能

* 服务注册中心:所有的服务的集中管理角色 
* 服务的提供者:服务提供者会将自己的信息打包(ip,port,服务名称 等等),注册在注册中被注册中心管理和维护(注册) 
* 服务的调用者: 可以通过对注册中心的访问,获取服务提供者的信 息,从而进行负载均衡的调用(抓取发现) 


### pom.xml
继承springboot-parent

```xml
<parent>  
<groupId>org.springframework.boot</groupId>  
<artifactId>spring-boot-starter-parent</artifactId>  <version>1.5.9.RELEASE</version> 
</parent>

```

导入springcloud的所有依赖

```xml
<dependencyManagement>
	<dependencies>
		<dependency>
			<groupId>org.springframework.cloud</groupId> 
			<artifactId>spring-cloud-dependencies</artifactId> 
			<version>${spring-cloud.version}</version> 
			<type>pom</type> 
			<scope>import</scope> 
		<dependency>
	<dependencies>
<dependencyManagement>	
```

引入eureka注册中心的依赖

```xml
<dependency>    
<groupId>org.springframework.cloud</groupId>    
<artifactId>spring-cloud-starter-eureka-server</artifactId>
</dependency>
```

### application.properties

```
server.port=8888 #eureka相关配置 
##关闭当前配置中心的服务抓取和注册
#如果自己到自己注册,需要提供服务名称 
spring.application.name=eurekaserver 
eureka.client.registerWithEureka=true 
eureka.client.fetchRegistry=false 
#注册中心的地址,但凡是服务提注册者都需要配置这个地址 
#注册者会访问这个地址的接口,携带自己节点的信息注册 
eureka.client.serviceUrl.defaultZone=http://localhost:8888/eureka
```

### 启动类

```java
@SpringBootApplication 
//eureka注册中心进程启动时需要springboot加载扫描的注解 
@EnableEurekaServer
public class StarterEurekaServer {
	public static void main(String[] args) { 
		SpringApplication.run(StarterEurekaServer.class, args); 
	}
}	
```

### web页面
localhost:8888  
就是当前注册中心维护的所有服务信息 展示的服务名称,服务实例名称,(服务的详细信息内存中维护的)

### 注册中心的作用

* 管理注册者的服务信息
内部接收注册者的请求,注册者携带本机/节点的详细参数(ip,port,服务名称)发送给注册中心,/eureka 接收请求,在 内存中存储一个双层map对象,保存所有的内容 

* 服务的监听超时
多个注册者同时注册一个服务,相当于一个具体的服务被一个集群管理接收请求,每60秒钟判断是否有服务提供者的续 约超时达到90秒,一旦满足条件,将会从内存中间超时的实例剔除

## 服务提供者

### pom.xml

继承springboot-parent  
导入springcloud dependencies  
引入starter-eureka-server依赖,此依赖包含了客户端需要的依赖

### application.properties

```
##端口 9001 
server.port=9001 
##服务名称 service-hi 
spring.application.name=service-hi 
##注册/发现 开启(默认开启) 
##注册地址 :8888/eureka 
eureka.client.serviceUrl.defaultZone=http://localhost:8888/eureka

```

### 启动类

```java
@SpringBootApplication 
//eureka客户端注解 
@EnableEurekaClient
public class StarterEurekaClient1 {
	public static void main(String[] args) { 
		SpringApplication.run(StarterEurekaClient1.class, args); 
	}
}	
```

### 业务Controller

```java
@RestController
public class HelloController {
	@RequestMapping("hello")
	public String sayHi(String name){
		return "hello "+name+",i am from 9001"; 
	}
}
```

### 注册者的逻辑

注册:启动后,当前eureka client一旦赋予注册能力  
registerWithEureka=true,将会访问注册中心接口8888/eureka 携带详细信息,注册在注册中心,注册中心以服务名称为key值记录一个当前服务的所有节点信息的map对象续约:eureka client一旦在注册中心提供注册的信息,将会每30 秒发起一次心跳(heartbeat)请求,告知注册中心,当前实例是存活的


## ribbon
配合服务治理组件eureka的客户端的发现功能,从注册中心抓取最新的 服务注册信息,从而可以在代码内部发起向该服务的访问,使用注册信 息中实例的详细信息访问不同的节点实现负载均衡-可以调用服务的,支持负载均衡访问的springcloud客户端组件  
**ribbon只能实现管理抓取的拦截逻辑,对restTemplate发送的请求做拦截处理**,所以通过访问ribbon再通过RestTemplate发送请求来调用服务

## ribbon负载的均衡调用9001/9002

### pom.xml
* eureka-client(抓取服务)
* ribbon的组件相关依赖

### application.properties

```
server.port=9004 
spring.application.name=service-ribbon 
eureka.client.serviceUrl.defaultZone=http://localhost:8888/eureka
```

### 启动类

```java
@SpringBootApplication
@EnableEurekaClient
public class StarterRibbon {
	public static void main(String[] args) {
		SpringApplication.run(StarterRibbon.class, args);
	}
	@Bean
	@LoadBalanced
	public RestTemplate initRestTemplate(){
		return new RestTemplate();
	}
	//修改自定义的随机负载均衡逻辑
	@Bean
	public IRule initRule(){
		return new RandomRule();
	} 
}
```

### 实现一个负载均衡的调用后端服务service-hi

编写一个ribbon的对外访问的url接口  
localhost:9004/hi?name=wang  
通过RestTemplate发送请求的方式进行拦截,实现负载均衡

controller

```java
@RestController
public class HelloController {
	@Autowired
	private HelloService helloService;
	//客户端调用hi接口
	@RequestMapping("hi")
	public String sayHi(String name){
		return "Ribbon:"+helloService.sayHi(name);
	}
}
```

service

```java
@Service
public class HelloService {
	@Autowired
	private RestTemplate client;//会因为使用的创建过程
	//@Bean @LoadBalanced注解,ribbon会对RestTemplate发送任何请求做拦截工作,将域名寻找抓取的服务名称做实例节点
	public String sayHi(String name) {
		String sayHi=client.getForObject("http://service-hi/hello?name="+name, String.class);
		return sayHi;
	}
}
```

### 动态添加扩充服务提供者

单独访问ribbon工程可以实现springcloud的ribbon组件做服务调用 服务的功能测试,对于被调用的服务service-hi,只要启动9003作为 扩容的节点,添加到eureka注册中心,注册中心维护的注册信息,将会发生变动

### 负载均衡的方式

* RoundRobinRule 
轮询,默认实现的负载均衡的逻辑 
* RandomRule 
随机,随机访问后端服务 
* WeightedResponse TimeRule 
权重访问,权重占比根据后端服务提供者响应 的速度,速度越快占比约高

## zuul网关

zuul是springcloud中提供的网关组件,可以实现整体微服务集群对外访问的入口,其他的任何服务的提供者,服务的调用者的外界访问,都必须通过zuul来实现 

## springcloud实例

对上个工程springboot项目 order-user进行了修改

### eureka-server

创建两个一样的eureka-server,在application.properties中,注册地址写对方的端口,互相抓取对方的服务,可以使两个服务一样,当有一个宕机时,另一个依然可以使用

#### pom.xml

* eureka依赖
* 继承springboot
* springcloud依赖

```xml
<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.9.RELEASE</version>
	</parent>	

<dependency>
  		<groupId>org.springframework.cloud</groupId>
  		<artifactId>spring-cloud-starter-eureka-server</artifactId>
  </dependency>

  <dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>Edgware.RELEASE</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
  
```

#### application.xml

```
server.port=9004

spring.application.name=service-ribbon
eureka.client.serviceUrl.defaultZone=http://localhost:8888/eureka
```

### order

#### application.properties

* spring.application.name=order-test  服务名称
* eureka.client.serviceUrl.defaultZone=xxx  服务注册的地址

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

#serverid
spring.application.name=order-test
eureka.client.serviceUrl.defaultZone=http://localhost:8888/eureka
```


#### pom.xml

增加eureka和ribbon依赖,因为order要调用user中的业务,所以要用ribbon对RestTemplate发出的请求进行拦截,将域名寻找抓取的服务名称做实例节点

```xml
<dependency>
  		<groupId>org.springframework.cloud</groupId>
  		<artifactId>spring-cloud-starter-eureka</artifactId>
  	</dependency>
  	<dependency>
  		<groupId>org.springframework.cloud</groupId>
  		<artifactId>spring-cloud-starter-ribbon</artifactId>
  	</dependency>
```

#### 启动类

新增加一个注解@EnableEurekaClient,因为order作为服务

```xml
@EnableEurekaClient
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

略,同springboot方式

### zuul

#### pom.xml
zuul的依赖封装了ribbon

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-zuul</artifactId>
</dependency>
```

#### application.properties

* zuul.routes.pay.path=/zuul-pay/**
* zuul.routes.pay.serviceId=order-test

定义一对路由,routes.xxx.path代表访问路径,xxx名字自定义,后面名字也自定义,**代表匹配多级目录  
routes.xxx.serviceId代表服务名字,访问path,然后寻找对应的serviceId

```
server.port=8103
#关闭敏感头
zuul.sensitive-headers=
#zuul微服务相关
spring.application.name=zuul-service
#路由规则 /order-test/**转发给order-test的服务
zuul.routes.pay.path=/zuul-pay/**
zuul.routes.pay.serviceId=order-test
zuul.routes.point.path=/zuul-point/**
zuul.routes.point.serviceId=user-test
#eureka server
eureka.client.serviceUrl.defaultZone=http://localhost:8888/eureka
```

#### 启动类
增加了一个注解@EnableZuulProxy

```java
@SpringBootApplication
@EnableEurekaClient
@EnableZuulProxy
public class StarterGateWay {
	public static void main(String[] args) {
		SpringApplication.run(StarterGateWay.class,args);
	}
}
```

#### nginx

nginx配置访问网关集群 

```
server {
 	   	listen 80;
		server_name www.ssm.com;
		location /user {
			proxy_pass http://zuulserver/zuul-point/user/;
			add_header 'Access-Control-Allow-Origin' '*'; 
            add_header 'Access-Control-Allow-Credentials' 'true'; 
		}
		location /order {
			proxy_pass http://zuulserver/zuul-pay/order/;
			add_header 'Access-Control-Allow-Origin' '*'; 
            add_header 'Access-Control-Allow-Credentials' 'true'; 
		}
		location /{
			root easymall;
			index index.html;
		}
    }   
    upstream zuulserver{
		server 127.0.0.1:8103;
    }
```

## 轮转总结

访问www.ssm.com/order/pay
-->监听到127.0.0.1:80/
-->转发到127.0.0.1:8103/zuul-pay/order
-->zuul接收 路由匹配zuul-pay/**
-->转发到服务order-test
-->127.0.0.1:8091/order
-->RestTemplate www.ssm.com/user/update/point
-->ribbon负载均衡 转发
-->监听到127.0.0.1:80/user
-->127.0.0.1:8103/zuul-point/user
-->zuul接受 路由匹配zuul-point/**
-->转发到服务user-test
-->127.0.0.1:8090/user
-->最终访问127.0.0.1:8090/user/update/point和127.0.0.1:8091/order/pay
 
