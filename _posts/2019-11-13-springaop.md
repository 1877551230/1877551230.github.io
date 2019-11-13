---
layout:     post
title:      springAOP
subtitle:   
date:       2019-11-13
categories: 面试题
author:     miracle
catalog: true
tags:
    - spring框架
    - 设计模式
---

* content
{:toc}

## spring aop(xml方式)(jdk代理和cglib代理)
1. 创建工程
2. 导入jar包
3. 创建java类
原有的业务类  
新添加的功能业务类
4. 创建清单文件xml,annotation
告知spring哪些对象实例化  
告知spring对象的注入关系  
用spring aop独有的配置,把新功能横切到需要的业务方法上  
5. 启动spring容器读取清单文件,初始化spring容器
6. 从spring容器取出对象备用
注意:取出的对象是代理对象还是非代理对象(普通对象)


### 导入的jar包

```xml
    <!-- spring context依赖包 -->
  	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-context</artifactId>
		<version>4.3.7.RELEASE</version>
	</dependency>
	<!-- spring aop辅助依赖包 -->
	<dependency>
	  <groupId>org.springframework</groupId>
	  <artifactId>spring-aspects</artifactId>
	  <version>4.3.7.RELEASE</version>
	</dependency>	
	<dependency>
	  <groupId>org.aspectj</groupId>
	  <artifactId>aspectjweaver</artifactId>
	  <version>1.8.7</version>
	</dependency>
	<dependency>
	  <groupId>aopalliance</groupId>
	  <artifactId>aopalliance</artifactId>
	  <version>1.0</version>
	</dependency>	
```
清单文件  
通知的method的name对应类中的方法的名字

```xml
<!-- 实例化老的业务对象 -->
	<bean id="userDao" class="cn.tedu.dao.impl.UserDaoImpl"></bean>
	<bean id="userService" class="cn.tedu.service.impl.UserServiceImpl">
		<property name="userDao" ref="userDao"></property>
	</bean>
	<!-- 实例化新的业务对象 -->
	<bean id="transactionManager" class="cn.tedu.other.TransactionManager"></bean>
	<!-- spring aop 独有的配置 -->
	<!-- 强制使用cglib动态代理 -->
	<aop:config proxy-target-class="true">
		<!-- 切面 -->
	    <aop:aspect id="myAspect" ref="transactionManager">
	    	<!-- 切点 -->
	        <aop:pointcut expression="execution(* cn.tedu.service..*.*(..))" id="myPointcut"/>
	        <!-- 前置通知 -->
<!-- 	         <aop:before -->
<!--         pointcut-ref="myPointcut" -->
<!--         method="begin"/> -->
	        <!-- 后置通知 -->
<!-- 	         <aop:after-returning -->
<!--         pointcut-ref="myPointcut" -->
<!--         method="commit"/> -->
			<!-- 异常通知 -->
<!--          <aop:after-throwing -->
<!--         pointcut-ref="myPointcut" -->
<!--         method="rollback"/> -->
        
        	<!-- 最终通知 -->
<!--         	  <aop:after -->
<!--         pointcut-ref="myPointcut" -->
<!--         method="finallyMethod"/> -->

			<!-- 环绕通知 -->
	    	<aop:around
	        pointcut-ref="myPointcut"
	        method="around"/>
	    </aop:aspect>
 
	</aop:config>
```


### spring aop中的重要的若干概念:
1. proxy-target-class="true"强制使用cglib,不写默认false  使用jdk动态代理

```xml
 <aop:config proxy-target-class="true"></aop:config> 
```
2. 切面 aspect:就是一个java类,可以理解为一个新的功能业务类,这个新的功能业务类中有若干通知方法,每个通知方法代表一个要横切/织入的功能

```xml
    <!-- 新功能的业务模型 切面 -->
	<bean id="transactionManager"
	      class="com.tarena.other.TransactionManager"/>
	<!-- 告知spring要使用哪一个切面 -->
	<aop:aspect id="myAspect" ref="transactionManager"></aop:aspect>
```
3. 连接点(Joinpoint):用代理对象调用目标方法的那条语句的位置,就叫做连接点,前提一定用代理对象调用,才是连接点  
  userService.addUser(new User());//连接点, 用代理对象调用目标方法  
4. 通知(Advice):每个通知都是一个功能,用来横切到业务类的方法上切面类中的方法就是通知方法  
前置通知:前置通知一定会执行,前提是用代理对象调用目标方法

```xml
		<!-- 前置通知 -->
		<aop:before pointcut-ref="myPointcut1" method="begin"/>
		public void begin(JoinPoint jp){
			System.out.println("事务开启/前置通知");
			System.out.println("事务开启/前置通知"+jp.getArgs()[0]);
			System.out.println("事务开启/前置通知"+jp.getSignature().getName());
			System.out.println("事务开启/前置通知"+jp.getTarget());
		}
``` 		
后置通知:前置通知执行,然后执行完目标方法后执行后置通知

```xml
		<!-- 后置通知 -->
		<aop:after-returning
				pointcut-ref="myPointcut1"
				method="commit"
				returning="flag"/>
```

```java
        public void commit(JoinPoint jp,Object flag){
			System.out.println("事务提交/后置通知");
			System.out.println("事务提交/后置通知"+jp.getArgs()[0]);
			System.out.println("事务提交/后置通知"+jp.getSignature().getName());
			System.out.println("事务提交/后置通知"+jp.getTarget());
			System.out.println("事务提交/后置通知"+flag);			
		}
```			
异常通知:前置通知执行,执行了目标方法,在执行目标方法中发生异常,就执行异常通知,目标方法没有执行完毕

```xml
		<!-- 异常通知 -->
		<aop:after-throwing
				pointcut-ref="myPointcut1"
				method="rollback"
				throwing="ex"/>
```		

```java		
		public void rollback(JoinPoint jp,Throwable ex){
			System.out.println("事务回滚/异常通知");
			System.out.println("事务回滚/异常通知"+jp.getArgs()[0]);
			System.out.println("事务回滚/异常通知"+jp.getSignature().getName());
			System.out.println("事务回滚/异常通知"+jp.getTarget());
			System.out.println("事务回滚/异常通知"+ex.getMessage());
		}
```
最终通知:前置通知执行,然后执行目标方法,目标方法执行完就执行后置通知,然后最终通知执行目标方法报异常,执行异常通知,然后最终通知

```xml
		<aop:after
				pointcut-ref="myPointcut1"
				method="finallyMethod"/>
```

```java		
		public void finallyMethod(){
			System.out.println("finally资源回收");
		}
```

环绕通知:可以替换前面的4种通知,最大特点,可以控制目标方法的执行  
建议:环绕要么独立使用,要么独立使用上面4种通知,最好别混用

```xml
	    <!-- 环绕通知 -->
		<aop:around
				pointcut-ref="myPointcut1"
				method="around"/>
```

```java
		public Object around(ProceedingJoinPoint pjp) throws Throwable {
			System.out.println("环绕通知");
			Object retVal=null;
			try{
				System.out.println("around前置通知:"+pjp.getArgs()[0]);
				System.out.println("around前置通知:"+pjp.getSignature().getName());
				System.out.println("around前置通知:"+pjp.getTarget());
				retVal = pjp.proceed();//调用目标方法
				System.out.println("around后置通知:"+retVal);
			}catch(Exception e){
				System.out.println("around异常通知:"+e.getMessage());
				e.printStackTrace();
			}finally{
				System.out.println("around最终通知:");
			}    	
			return retVal;
		}
```
5. 切入点(Pointcut):根据指定的spring的独有的表达式,匹配哪些连接点,指定把什么新功能横切/织入到什么位置上  
注意,切到方法上而不是切入到类上


6. 目标对象(Target Object):就是原始业务对象
7. AOP代理(AOP Proxy):通过spring aop的生成的代理对象
8. 织入(Weaving):把原有业务模型和新功能业务模型织入在一起
在spring的清单文件  
 织入<aop:config></aop:config>就相当于织入新功能  
 取消<aop:config></aop:config>就相当于取消新功能  
spring想达到一个目的:就一个大的项目,可以由很多功能模块自由组合织入或取消织入,说明各功能模块是解耦  

```xml
	<!--全局-->
	<aop:config>
	<aop:pointcut expression="execution(* com.tarena.service..*.*(..))" 
			              id="myPointcut1"/>			  
	</aop:config>
	<!--局部-->
	<aop:config>
	  <aop:aspect>
		<aop:pointcut expression="execution(* com.tarena.service..*.*(..))" 
			              id="myPointcut1"/>			  
	  </aop:aspect>
	</aop:config>
```

## spring aop(annotation方式)
和xml方式基本相同,只不过用注解形式来创建对象


	
spring aop 实现步骤(annotation):
1. 创建java项目
2. 导入jar包 spring-context,spring-aspect,aspectjweaver,aopalliance
3. 创建java类 
原有业务模型(注解)  
新功能业务模型(注解)  
4. spring清单文件
  组件扫描包<context:component-scan>  
  解析@Controller,@Service,@Repository,@Component   
  解析@Resource,@Autowired @Qualifier,@Value   
  解析spring aop注解<aop:aspectj-autoproxy/>  
  @Aspect,@Pointcut,@Before  
  @AfterReturning,@AfterThrowing  
  @After,@Around  
5. 启动spring容器,读取清单文件
6. 从spring容器取出对象备用
   取出的对象是否是代理对象

   

```java
   /**
	 * 此类是一个新的功能类(切面类)
	 * 目的要把这个新的功能类添加到原有的业务上
	 * @author Administrator
	 *
	 */
	@Component("transactionManager")//spring实例化对象并交个spring管理
	@Aspect//本类是一个切面
	public class TransactionManager {
		//全局切点
		@Pointcut("execution(* com.tarena.service..*.*(..))")// the pointcut expression
		private void myPointCut1() {}// the pointcut signature
		
		//全局切点
		//@Pointcut("com.tarena.service.impl.UserServiceImpl.addUser() && args(user)")// the pointcut expression
		//private void myPointCut2(User user) {}// the pointcut signature
		
		//@Before(value="myPointCut2(user)")
		@Before(value="myPointCut1() && args(user)")
		public void begin(JoinPoint jp,User user){
			System.out.println("事务开启/前置通知");
			System.out.println("事务开启/前置通知"+jp.getArgs()[0]);
			System.out.println("事务开启/前置通知"+jp.getSignature().getName());
			System.out.println("事务开启/前置通知"+jp.getTarget());
			System.out.println("事务开启/前置通知"+user);
			
		}
		//@AfterReturning(pointcut="myPointCut1()",returning="flag")
		public void commit(JoinPoint jp,Object flag){
			System.out.println("事务提交/后置通知");
			System.out.println("事务提交/后置通知"+jp.getArgs()[0]);
			System.out.println("事务提交/后置通知"+jp.getSignature().getName());
			System.out.println("事务提交/后置通知"+jp.getTarget());
			System.out.println("事务提交/后置通知"+flag);
			
		}
		//@AfterThrowing(pointcut="myPointCut1()",throwing="ex")
		public void rollback(JoinPoint jp,Throwable ex){
			System.out.println("事务回滚/异常通知");
			System.out.println("事务回滚/异常通知"+jp.getArgs()[0]);
			System.out.println("事务回滚/异常通知"+jp.getSignature().getName());
			System.out.println("事务回滚/异常通知"+jp.getTarget());
			System.out.println("事务回滚/异常通知"+ex.getMessage());
		}
		//@After(value="myPointCut1()")
		public void finallyMethod(){
			System.out.println("finally资源回收");
		}
		//@Around("myPointCut1()")
		public Object around(ProceedingJoinPoint pjp) throws Throwable {
			System.out.println("环绕通知");
			Object retVal=null;
			try{
				System.out.println("around前置通知:"+pjp.getArgs()[0]);
				System.out.println("around前置通知:"+pjp.getSignature().getName());
				System.out.println("around前置通知:"+pjp.getTarget());
				retVal = pjp.proceed();//调用目标方法
				System.out.println("around后置通知:"+retVal);
			}catch(Exception e){
				System.out.println("around异常通知:"+e.getMessage());
				e.printStackTrace();
			}finally{
				System.out.println("around最终通知:");
			}    	
			return retVal;
		}
	}
```

```xml
	<?xml version="1.0" encoding="UTF-8"?>
	<beans xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
		xmlns:aop="http://www.springframework.org/schema/aop"
		xmlns:tx="http://www.springframework.org/schema/tx"
		xmlns:p="http://www.springframework.org/schema/p"
		xmlns:util="http://www.springframework.org/schema/util" 
		xmlns:context="http://www.springframework.org/schema/context"
		xmlns:mvc="http://www.springframework.org/schema/mvc"
		xsi:schemaLocation="
			http://www.springframework.org/schema/beans
			http://www.springframework.org/schema/beans/spring-beans.xsd
			http://www.springframework.org/schema/aop 
			http://www.springframework.org/schema/aop/spring-aop.xsd
			http://www.springframework.org/schema/tx 
			http://www.springframework.org/schema/tx/spring-tx.xsd
			http://www.springframework.org/schema/util 
			http://www.springframework.org/schema/util/spring-util.xsd
			http://www.springframework.org/schema/context
			http://www.springframework.org/schema/context/spring-context.xsd
			http://www.springframework.org/schema/mvc
			http://www.springframework.org/schema/mvc/spring-mvc.xsd">
		<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
		<context:component-scan base-package="com.tarena.dao"></context:component-scan>
		<context:component-scan base-package="com.tarena.service"></context:component-scan>
		<context:component-scan base-package="com.tarena.other"></context:component-scan>
	</beans>   
```	
	
**spring aop优点:**
* 遵守开闭原则和单一职责原则
* 提高开发效率
* 能横切和织入其他功能
**spring aop缺点:**
* 执行效率堪忧	

## 实例

### 处理异常(xml)
异常处理和业务处理完全松耦合  
需求:时刻捕获生成环境中的所有的异常错误,实时监控系统,收集异常信息  
需要记录,异常的信息,哪个类报的异常,出现的是什么异常  
使用异常通知实现  

清单文件

```xml
<!-- 实例化老的业务对象 -->
	<bean id="userDao" class="cn.tedu.dao.impl.UserDaoImpl"></bean>
	<bean id="userService" class="cn.tedu.service.impl.UserServiceImpl">
		<property name="userDao" ref="userDao"></property>
	</bean>
	<!-- 实例化新的业务对象 -->
	<bean id="em" class="cn.tedu.other.ExceptionManager"></bean>
	<!-- spring aop 独有的配置 -->
	<!-- 强制使用cglib动态代理 -->
	<aop:config proxy-target-class="true">
		<!-- 切面 -->
	    <aop:aspect id="myAspect" ref="em">
	    	<!-- 切点 -->
	        <aop:pointcut expression="execution(* cn.tedu.service..*.*(..))" id="myPointcut"/>
			<!-- 异常通知 -->
         <aop:after-throwing
        pointcut-ref="myPointcut"
        method="exceptionMessage"
        throwing="ex"/>
	    </aop:aspect>
	</aop:config>
```

```java
/**
 * 此类是一个新的功能类
 * 目的要把这个新的功能类添加到原有的业务上
 * @author PC
 *
 */

public class ExceptionManager {
	
	public void exceptionMessage(JoinPoint jp,Throwable ex){
		System.out.print("记录异常:发生了异常-->"+ex.getMessage());
		System.out.print(";异常类-->"+ex.getClass().getName());
		System.out.print(";在目标类-->"+jp.getTarget().getClass().getName());
		System.out.println(";方法是-->"+jp.getSignature().getName());
		
	}
}
```

### 事务管理(注解)
需求:自定义注解@Transaction,如果修饰了此注解的方法,那么调用的此方法就添加事务,如果没有修饰此注解就不添加事务  
使用环绕通知,因为有些方法是需要加事务,有些方法不需要加事务  
所以需要控制目标方法的执行  

事务管理需要我们自定义注解  
Transaction.java(注解类)

```java
//元注解
@Target(ElementType.METHOD)//可以修饰在方法
@Retention(RetentionPolicy.RUNTIME)//运行时调用
public @interface Transaction {
}
```

清单文件

```xml
<!-- 实例化老的业务对象 -->
	<context:component-scan base-package="cn.tedu.dao"></context:component-scan>
		<context:component-scan base-package="cn.tedu.service"></context:component-scan>	
	<!-- 实例化新的业务对象 -->
	<context:component-scan base-package="cn.tedu.other"></context:component-scan>
	<!-- 强制使用cglib -->
	<aop:aspectj-autoproxy proxy-target-class="true"></aop:aspectj-autoproxy>
</beans>
```
老的业务类serviceImpl.java

```
@Service("userService")
public class UserServiceImpl implements UserService{
	@Resource(name="userDao")
	private UserDao userDao;
	@Transaction
	@Override
	public boolean addUser(User user) {
		System.out.println("UserServiceImpl.addUser()");
		boolean flag=false;
		int rowAffect=userDao.addUser(user);
		if(rowAffect==1){
			flag=true;
		}
		//throw new RuntimeException("错了");
		return flag;
	}
```
新的功能类

```java
/**
 * 此类是一个新的功能类
 * 目的要把这个新的功能类添加到原有的业务上
 * @author PC
 *
 */
//实例化本类对象,并放在spring容器管理
@Component
//告知此类是一个切面类
@Aspect
public class TransactionManager {
	@Pointcut("execution(* cn.tedu.service..*.*(..))")// the pointcut expression
	private void myPointcut() {}// the pointcut signature
	
	//@Before("myPointcut()")
	public void begin(){
		System.out.println("事物开始");
	}
	//@AfterReturning("myPointcut()")
	public void commit(){
		System.out.println("事物提交");
	}

	  @Around("myPointcut()")
	    public Object around(ProceedingJoinPoint pjp) throws Throwable {
		  Object retVal=null;
			try{
				//得到目标方法,然后判断目标方法上是否有@Transaction
				Class clazz=pjp.getTarget().getClass();
				String methodName=pjp.getSignature().getName();
				Object[] args=pjp.getArgs();
				Method method=null;
				if(args!=null){
					Class[] claxxs=new Class[args.length];
					for(int i=0;i<args.length;i++){
						claxxs[i]=args[i].getClass();
					}
					method=clazz.getDeclaredMethod(methodName, claxxs);
				}else{
					method=clazz.getDeclaredMethod(methodName);
				}
				//能到此处得到的是目标方法Method对象
				boolean flag=method.isAnnotationPresent(Transaction.class);
				if(flag){
					try{
						System.out.println("开启事务");
						retVal=pjp.proceed();
						System.out.println("提交事务");
					}catch(Exception e){
						System.out.println("回滚事务");
						e.printStackTrace();
					}
					//说明用户正在调用的方法上面有此注解
					
				}else{
					//说明方法没有此注解,老业务直接执行
					retVal=pjp.proceed();//调用老的业务方法
				}
				
			}catch(Exception e){
				
			}finally{
				
			}
			return retVal;
		}
	
}
```

### 计算运行时间(注解)
性能监控:计算执行每一个业务方法所需要的时间	  
使用环绕通知实现  

清单文件

```xml
<!-- 实例化老的业务对象 -->
	<context:component-scan base-package="cn.tedu.dao"></context:component-scan>
		<context:component-scan base-package="cn.tedu.service"></context:component-scan>
		
	<!-- 实例化新的业务对象 -->
	<context:component-scan base-package="cn.tedu.other"></context:component-scan>
	<!-- 强制使用cglib -->
	<aop:aspectj-autoproxy proxy-target-class="true"></aop:aspectj-autoproxy>
```

新的功能类

只能用环绕方式

```java
/**
 * 此类是一个新的功能类
 * 目的要把这个新的功能类添加到原有的业务上
 * @author PC
 *
 */
//实例化本类对象,并放在spring容器管理
@Component
//告知此类是一个切面类
@Aspect

public class TimeManager {
	@Pointcut("execution(* cn.tedu.service..*.*(..))")// the pointcut expression
	private void myPointcut() {}// the pointcut signature
	
	//@Before("myPointcut()")
	public void begin(){
		System.out.println("事物开始");
	}
	//@AfterReturning("myPointcut()")
	public void commit(){
		System.out.println("事物提交");
	}

	  @Around("myPointcut()")
	    public Object doBasicProfiling(ProceedingJoinPoint pjp) throws Throwable {
		  Object retVal=null;
			try{
				long begin=System.currentTimeMillis();
				System.out.println("事务开启");
				retVal=pjp.proceed();
				long end=System.currentTimeMillis();
				System.out.print("调用"+pjp.getTarget().getClass().getName());
				System.out.print(";中的方法:"+pjp.getSignature().getName());
				System.out.print("执行的时间"+(end-begin));


				
			}catch(Exception e){
				
			}finally{
				
			}
			return retVal;
		}
	
}
```

### 权限管理(注解)
需求:自定义注解@Privilege(name="xxx"),如果修饰了@Privilege注解  
且name的值在允许的权限范围内,就执行方法,不在权限范围内就不执行目标方法  
使用环绕通知,根据注解的约定,来决定是否调用目标方法  


需要自己自定义注解实现权限管理  
privilege.java(注解类)

```java
@Target(ElementType.METHOD)//修饰在方法
@Retention(RetentionPolicy.RUNTIME)//运行时执行
public @interface Privilege {
	public String name();
}
```

工具类AllowPrivilege.java
用来定义拥有权限的注解

```java
public class AllowPrivilege {
	public static List<String> allow;
	static{
		allow=new ArrayList<String>();
		allow.add("add");
		allow.add("update");
	}
}
```
清单文件

```xml
<!-- 实例化老的业务对象 -->
	<context:component-scan base-package="cn.tedu.dao"></context:component-scan>
		<context:component-scan base-package="cn.tedu.service"></context:component-scan>
	
		
	<!-- 实例化新的业务对象 -->
	<context:component-scan base-package="cn.tedu.other"></context:component-scan>
	<!-- 强制使用cglib -->
	<aop:aspectj-autoproxy proxy-target-class="true"></aop:aspectj-autoproxy>
```

```java
/**
 * 此类是一个新的功能类
 * 目的要把这个新的功能类添加到原有的业务上
 * @author PC
 *
 */
//实例化本类对象,并放在spring容器管理
@Component
//告知此类是一个切面类
@Aspect
public class PrivilegeManager {
	@Pointcut("execution(* cn.tedu.service..*.*(..))")// the pointcut expression
	private void myPointcut() {}// the pointcut signature
	  @Around("myPointcut()")
	    public Object around(ProceedingJoinPoint pjp) throws Throwable {
		  Object retVal=null;
			try{
				//得到目标方法,然后判断目标方法上是否有@Privilege
				Class clazz=pjp.getTarget().getClass();
				String methodName=pjp.getSignature().getName();
				Object[] args=pjp.getArgs();
				Method method=null;
				if(args!=null){
					Class[] claxxs=new Class[args.length];
					for(int i=0;i<args.length;i++){
						claxxs[i]=args[i].getClass();
					}
					method=clazz.getDeclaredMethod(methodName, claxxs);
				}else{
					method=clazz.getDeclaredMethod(methodName);
				}
				//能到此处得到的是目标方法Method对象
				boolean flag=method.isAnnotationPresent(Privilege.class);
				if(flag){
					//说明用户正在调用的方法上面有此注解
					//获取注解对象
					Privilege privilege=(Privilege)method.getAnnotation(Privilege.class);
					String nameValue=privilege.name();
					if(AllowPrivilege.allow.contains(nameValue)){
						//用户正在调用的方法有权限
						System.out.println("有权限执行的方法");
						retVal=pjp.proceed();//调用老的目标方法
					}else{
						//没有权限
						System.out.println("没权限执行此方法");
					}
				}else{
					System.out.println("没有权限的注解");
				}
			}catch(Exception e){	
			}finally{	
			}
			return retVal;
		}
}
```
serviceImpl.java

```java
@Service("userService")
public class UserServiceImpl implements UserService{
	@Resource(name="userDao")
	private UserDao userDao;
	@Privilege(name="add")
	@Override
	public Boolean addUser(User user) {
		System.out.println("UserServiceImpl.addUser()");
		boolean flag=false;
		int rowAffect=userDao.addUser(user);
		if(rowAffect==1){
			flag=true;
		}
		//throw new RuntimeException("错了");
		return flag;
	}
	@Privilege(name="update")
	@Override
	public Boolean updateUser(User user) {
		System.out.println("UserServiceImpl.updateUser()");

		boolean flag=false;
		int rowAffect=userDao.addUser(user);
		if(rowAffect==1){
			flag=true;
		}
		return flag;
	}
}
```

## 在spring中常用的切点表达式分为两种:
方式一:execution表达式
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern)
throws-pattern?)
  * modifiers-pattern:匹配访问修饰符
  * ret-type-pattern:匹配方法的返回类型
  * declaring-type-pattern:匹配对应隶属的包和类名
  * name-pattern:匹配对应方法的名称
  * param-pattern:匹配对应方法的参数
  * throws-pattern:匹配方法抛出的异常
- a.the execution of any public method:
  任意公有的,任意返回值,任意方法名,任意方法参数
  execution(public * *(..))  
- b.the execution of any method with a name beginning with "set":
  任意修饰符,任意返回类型,任意类,任意set开头的方法,任意set方法参数
  execution(* set*(..)) 
- c.the execution of any method defined by the AccountService interface:
  任意修饰符,任意返回类型,com.xyz.service包下AccountService类中任意方法名,任意方法参数
  execution(* com.xyz.service.AccountService.*(..))
- d.the execution of any method defined in the service package:
  任意修饰符,任意返回类型,com.xyz.service包中任意类,任意方法,任意方法参数
  execution(* com.xyz.service.*.*(..))
- e.the execution of any method defined in the service package or a sub-package:
  任意修饰符,任意返回类型,com.xyz.service及其子包中任意类,任意方法,任意方法参数
  execution(* com.xyz.service..*.*(..))
方式二:within表达式:控制粒度粗,细粒度控制用execution
    within(com.xyz.service.*)//匹配com.xyz.service中任意类
	within(com.xyz.service..*)//匹配com.xyz.service包及其子包的任意类