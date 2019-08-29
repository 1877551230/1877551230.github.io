---
layout:     post
title:      spring 事务管理
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

## spring jdbc:
spring对jdbc有效的封装,用spring来创建和管理jdbc相关的对象
### 连接池:
可以通过一些连接池产品,预先创建出一批连接
用户从连接池获取数据库的连接,然后基于数据库连接做相应数据库操作(增删改查)
用户关闭连接,相当于把连接还给连接池中,以备其他用户再次从连接池中获取连接
### 常见的连接池产品

* apache commons-dbcp.jar(commons-jdbc.jar commons-pool.jar ) 教学环境,很少用在生产环境
* 阿里巴巴 druid  可以直接使用生产环境
* c3p0  早期在生产环境使用
* proxool  早期在生产环境使用
* HikariCP 最近出现的一个产品(号称最快)
性能方面: hikariCP>druid>tomcat-jdbc>dbcp>c3p0 。hikariCP的高性能得益于最大限度的避免锁竞争。
druid功能最为全面，sql拦截等功能，统计数据较为全面，具有良好的扩展性。  
综合性能，扩展性等方面，可考虑使用druid或者hikariCP连接池。  
可开启prepareStatement缓存，对性能会有大概20%的提升。  

## spring 声明式事务管理
### 方式一:xml
* jdbcTemplate是一个jdbc模板,是由spring提供的,这个模板使用了阿里巴巴的连接池druid  
在UserDaoImpl中我们使用这个模板来调用方法  比如update方法(增删改)和query方法(查)
* bean id=dataSource 代表连接  
* bean id=txManager 代表新功能(org.springframespring...中写好的)
* tx:advice id="txAdvice transaction-manager="txManager 指明哪些方法需要加事务管理,txManager是新功能
* tx:method name="add* 对所有add开头的方法生效
*  <aop:config><aop:advisor advice-ref="txAdvice" pointcut-ref="ServiceOperation></aop:config> 声明参数是txAdvice,先扫描该切点所有方法,然后对比切点类中方法名称,上面txAdvice是参数,例是以add开头的,就生效


```xml
   	<!-- 加载属性文件进入spring容器 -->
	<context:property-placeholder location="classpath:mysql.properties"/>
	<!-- 实例化老的业务对象 -->
	<bean id="userDao" class="cn.tedu.dao.impl.UserDaoImpl">
		<property name="jdbcTemplate" ref="jdbcTemplate"></property>
	</bean>
	<bean id="userService" class="cn.tedu.service.impl.UserServiceImpl">
	
		<property name="userDao" ref="userDao"></property>
	</bean>
	
	<!-- 用spring实例化和管理spring jdbc相关的对象,jdbcTemplate  jdbc模板 -->
	
	<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
		<property name="dataSource" ref="alibabaDataSource"></property>
	</bean>
	
	<!-- 用spring实例化和管理alibaba druid连接池对象 -->
	<!-- 数据库连接池 commons-dbcp ,c3p0,proxool,阿里巴巴druid -->
	<bean id="alibabaDataSource"
	      class="com.alibaba.druid.pool.DruidDataSource"
	      init-method="init"
	      destroy-method="close">
	    <!-- 数据库连接的4项 -->
		<property name="driverClassName">
			<value>${jdbc_driverClass}</value>
		</property>
		<property name="url">
			<value>${jdbc_url}</value>
		</property>
		<property name="username">
			<value>${jdbc_userName}</value>
		</property>
		<property name="password">
			<value>${jdbc_userPassword}</value>
		</property>
		<!-- 连接池中的最大连接数 -->
		<property name="maxActive">
			<value>5</value>
		</property>
		<!-- 初始化的连接数 -->
		<property name="initialSize">
			<value>2</value>
		</property>
		<!-- 获取连接的最大等待时间 -->
		<property name="maxWait">
			<value>6000</value>
		</property>
		<!-- 连接池的最大空闲 -->
		<property name="maxIdle">
			<value>2</value>
		</property>
		<!-- 连接池的最小空闲 -->
		<property name="minIdle">
			<value>2</value>
		</property>
		<!-- 自动清除无用的连接 -->
		<property name="removeAbandoned">
			<value>true</value>
		</property>
		<!-- 自动清除无用的连接的等待时间 -->
		<property name="removeAbandonedTimeout">
			<value>180</value>
		</property>
		<!-- 连接属性 -->
		<property name="connectionProperties">
			<value>clientEncoding=UTF-8</value>
		</property>      
	</bean>
	<!-- spring声明式事物开始 -->
	<!-- 事物的通知 -->
	 <tx:advice id="txAdvice" transaction-manager="txManager">
        <!-- 事务语义... -->
        <tx:attributes>
        	<!-- 需要横切事务的方法定义 -->
        	<tx:method name="add*" propagation="REQUIRED" rollback-for="java.lang.Exception"/>
        	<tx:method name="update*" propagation="REQUIRED" rollback-for="java.lang.Exception"/>
        	<tx:method name="delete*" propagation="REQUIRED" rollback-for="java.lang.Exception"/>
        	<tx:method name="create*" propagation="REQUIRED" rollback-for="java.lang.Exception"/>
            <!-- 所有用'get find'开头的方法都是只读的 不需要添事务-->
            <tx:method name="get*" read-only="true"/>
            <!-- 其他的方法使用默认的事务配置(看下面) -->
            <tx:method name="*"/>
        </tx:attributes>
    </tx:advice>

    <!-- 使得上面的事务配置对Service接口的所有操作有效 -->
    <aop:config>
        <aop:pointcut id="ServiceOperation" expression="execution(* cn.tedu.service..*.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="ServiceOperation"/>
    </aop:config>

    <!-- 同样的, 也不要忘了PlatformTransactionManager 就是切面,新功能业务-->
    <!-- 有事物的开启,事物的提交,事物的回滚 -->
    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="alibabaDataSource"/>
    </bean>
	<!-- spring声明式事务结束 -->
```
UserDaoImpl.java数据库方法和UserServiceImpl.java业务方法和下面注解版一样,只不过注解版多加了注解


### 方式二:annotation版 
* 添加了@Transactional注解的,被添加了事务,在业务类上面添加事务  
* 只有增删改修改了数据库的需要添加事务,查找不修改数据库的数据,所以不用添加事务  
* 相对于xml版,少了tx:method,aop:config等配置

```xml
  <!-- 加载属性文件进入spring容器 -->
	<context:property-placeholder location="classpath:mysql.properties"/>
	
	<context:component-scan base-package="cn.tedu.dao"></context:component-scan>
	<context:component-scan base-package="cn.tedu.service"></context:component-scan>
	
	<!-- 用spring实例化和管理spring jdbc相关的对象,jdbcTemplate  jdbc模板 -->
	
	<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
		<property name="dataSource" ref="alibabaDataSource"></property>
	</bean>
	
	<!-- 用spring实例化和管理alibaba druid连接池对象 -->
	<!-- 数据库连接池 commons-dbcp ,c3p0,proxool,阿里巴巴druid -->
	<bean id="alibabaDataSource"
	      class="com.alibaba.druid.pool.DruidDataSource"
	      init-method="init"
	      destroy-method="close">
	    <!-- 数据库连接的4项 -->
		<property name="driverClassName">
			<value>${jdbc_driverClass}</value>
		</property>
		<property name="url">
			<value>${jdbc_url}</value>
		</property>
		<property name="username">
			<value>${jdbc_userName}</value>
		</property>
		<property name="password">
			<value>${jdbc_userPassword}</value>
		</property>
		<!-- 连接池中的最大连接数 -->
		<property name="maxActive">
			<value>5</value>
		</property>
		<!-- 初始化的连接数 -->
		<property name="initialSize">
			<value>2</value>
		</property>
		<!-- 获取连接的最大等待时间 -->
		<property name="maxWait">
			<value>6000</value>
		</property>
		<!-- 连接池的最大空闲 -->
		<property name="maxIdle">
			<value>2</value>
		</property>
		<!-- 连接池的最小空闲 -->
		<property name="minIdle">
			<value>2</value>
		</property>
		<!-- 自动清除无用的连接 -->
		<property name="removeAbandoned">
			<value>true</value>
		</property>
		<!-- 自动清除无用的连接的等待时间 -->
		<property name="removeAbandonedTimeout">
			<value>180</value>
		</property>
		<!-- 连接属性 -->
		<property name="connectionProperties">
			<value>clientEncoding=UTF-8</value>
		</property>      
	</bean>
	<!-- spring声明式事物开始 -->
	

   <tx:annotation-driven transaction-manager="txManager"/><!-- 仍然需要一个TransactionManager -->


    <!-- 同样的, 也不要忘了TransactionManager 就是切面,新功能业务-->
    <!-- 有事物的开启,事物的提交,事物的回滚 -->
    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="alibabaDataSource"/>
    </bean>
	<!-- spring声明式事务结束 -->
```

UserDaoImpl.java

```java
@Repository("userDao")
public class UserDaoImpl implements UserDao {
	@Autowired   //自动装载,因为容器只有一个此类型,所以可以自动装载
	private JdbcTemplate jdbcTemplate;
	
	@Override
	public int addUser(User user) {
		System.out.println("UserDaoImpl.addUser()");
		int rowAffect=0;
		String sql="insert into t_user(username,userpassword,age,address) values(?,?,?,?)";
		Object[] args=new Object[]{user.getUserName(),user.getUserPassword(),user.getAge(),user.getAddress()};
		rowAffect=this.jdbcTemplate.update(sql, args);
		return rowAffect;
	}

	@Override
	public int updateUser(User user) {
		System.out.println("UserDaoImpl.updateUser()");
		int rowAffect=0;
		String sql="update t_user set username=?,userpassword=?,age=?,address=? where id=?";
		Object[] args=new Object[]{user.getUserName(),user.getUserPassword(),user.getAge(),user.getAddress(),user.getId()};
		rowAffect=this.jdbcTemplate.update(sql, args);
		return rowAffect;
	}

	/**
	 * 写法等价于CommonDao中的策略版的查询
	 */
	@Override
	public User findUserById(Integer id) {
		User user=null;
		String sql="select id,username,userpassword,age,address from t_user where id=?";
		RowMapper<User> rm=new RowMapper<User>(){

			@Override
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				User user=new User();
				user.setId(rs.getInt("id"));
				user.setUserName(rs.getString("userName"));
				user.setUserPassword(rs.getString("userPassword"));
				user.setAge(rs.getInt("age"));
				user.setAddress(rs.getString("address"));
				return user;
			}

		};
		List<User> users=this.jdbcTemplate.query(sql, new Object[]{id},rm);
		if(users!=null&&users.size()==1){
			user=users.get(0);
		}
		return user;
	}
	//写法等同于CommonDao中的反射版本
	@Override
	public List<User> findAllUsers() {
		List<User> users=null;
		String sql="select id,username,userpassword,age,address from t_user";
		RowMapper rm=new BeanPropertyRowMapper<User>(User.class);
		users=this.jdbcTemplate.query(sql, rm);
		return users;
	}
}
```

UserServiceImpl.java

```java
@Service("userService")
public class UserServiceImpl implements UserService{
	@Autowired
	@Qualifier("userDao")
	private UserDao userDao;
	
@Transactional(propagation=Propagation.REQUIRED,rollbackFor=Exception.class)
	@Override
	public Boolean addUser(User user) {
		System.out.println("UserServiceImpl.addUser()");
		boolean flag=false;
		int rowAffect=userDao.addUser(user);
		if(rowAffect==1){
			flag=true;
		}
		//throw new RuntimeException("错了");
		//int i=10/0;
		return flag;
	}
@Transactional(propagation=Propagation.REQUIRED,rollbackFor=Exception.class)
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
	@Override
	public User findUserById(Integer id) {
		// TODO Auto-generated method stub
		return userDao.findUserById(id);
	}

	@Override
	public List<User> findAllUsers() {
		// TODO Auto-generated method stub
		return userDao.findAllUsers();
	}

}
```

## 编程式事务:
### 方案一:TransactionTemplate

```java
	public class SimpleService implements Service {
		// single TransactionTemplate shared amongst all methods in this instance
		private final TransactionTemplate transactionTemplate;
		// use constructor-injection to supply the PlatformTransactionManager
		public SimpleService(PlatformTransactionManager transactionManager) {
			Assert.notNull(transactionManager, "The 'transactionManager' argument must not be null.");
			this.transactionTemplate = new TransactionTemplate(transactionManager);
		}
		public Object someServiceMethod() {
			return transactionTemplate.execute(new TransactionCallback() {
			// the code in this method executes in a transactional context
			public Object doInTransaction(TransactionStatus status) {
			updateOperation1();
			return resultOfUpdateOperation2();
			}
			});
	    }
	} 
```
### 方案二:PlatformTransactionManager

```java
	DefaultTransactionDefinition def = new DefaultTransactionDefinition();
	// explicitly setting the transaction name is something that can only be done programmatically
	def.setName("SomeTxName");
	def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
	TransactionStatus status = txManager.getTransaction(def);
	try {
		// execute your business logic here
	}
	catch (MyException ex) {
		txManager.rollback(status);
		throw ex;
	}
	txManager.commit(status);
```

