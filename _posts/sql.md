

## 常用的sql语句

```sql
/*创建数据库*/
create database `yy` default character set utf8;
/*显示数据库*/
show databases;
/*显示创建数据库的sql语句*/
show create database `yy`;
/*删除数据库*/
drop database if exists `yy`;
/*打开数据库*/
use `yy`;
/*------------------------------------------------------------------*/
/*显示当前数据库中的所有的数据表*/
show tables;
/*创建数据表*/
create table if not exists t_user
(
  `id` int not null AUTO_INCREMENT comment '用户id,主键,不空',
  `username` varchar(20) not null comment '用户名称,不空',
  `userpassword` varchar(20) not null default '123' comment '用户密码,不空,默认123',
  `age` int DEFAULT 1 COMMENT '用户年龄,默认1',
  `address` varchar(20) DEFAULT '' COMMENT '用户地址',
  CONSTRAINT pk_id PRIMARY KEY (`id`),
  CONSTRAINT uq_username UNIQUE (`username`)
);
/*查看表的结构*/
desc `t_user`;
/*查看创建表的sql语句*/
show create table `t_user`;

/*变更表 alter table*/

/*增加列*/
alter table `t_user` add COLUMN (`gender` char(2));
/*修改列*/
alter table `t_user` change column `gender` sex char(2);
/*给指定的列添加约束*/
alter table `t_user` alter column `sex` set default '男';
/*删除列*/
alter table `t_user` drop column `sex`;
/*修改表名*/
alter table `t_user` rename to `t_usr`;
/*变更字符集*/
alter table `t_user` character set utf8;

/*删除表 cascade级联删除*/
create table t_temp(id int);
drop table t_temp,t_user;
/*-----------------------------------------------------------------*/
/*插入数据*/
/*没有指定列的名字,但给值的时候必须全给*/
insert into t_user values(10,'aa','aa',20,'beijing','男');
/*只指定部分列名字,其余没有指定的列必须由默认值或可以为null*/
insert into t_user(username) values('bb');
/*建议指定所有列的名字(自增列特例可以不写)标准写法*/
insert into t_user(id,username,userpassword,age,address,sex)
values(12,'cc','cc',20,'亦庄','男');
/*连续插入多条数据,sql优化要求*/
insert into t_user(id,username,userpassword,age,address,sex)
values(13,'dd','dd',20,'朝阳','男'),
      (14,'ee','ee',21,'东城','女'),
      (15,'ff','ff',23,'西城','男');
/*-----------------------------------------------------------------*/
/*更新数据,可以所有列更新,也可以部分列更新*/
update t_user set username='ggg',userpassword='ggg' where id=10;
/*-----------------------------------------------------------------*/
/*删除数据,根据条件删除*/
delete from t_user where id=10;
/*删除数据,删除所有数据*/
delete from t_user;
/*删除所有数据*/
truncate t_user;
/*-----------------------------------------------------------------*/
/*查询数据 返回特定列*/
select id,username from t_user;
/*查询数据,返回所有列(不推荐,sql优化不允许)
因为mysql server要根据*去数据库中查询*所对应的列信息会把语句转换成
select id,username,userpassword,age,address,sex from t_user;*/
select * from t_user;
/*返回所有列必须把所有的列写上*/
select id,username,userpassword,age,address,sex from t_user;
/*返回的列可以把列名设置别名*/
select id,
username '用户名',
userpassword as '密码',
age '年龄',
address '地址',
sex as '性别'
from t_user;
/*返回所有行的数据*/
select * from t_user;
/*返回部分行的数据,必须添加where子句*/
select * from t_user where address like '%亦庄%';
select * from t_user where age>10 and age<22;
select * from t_user where age between 10 and 22;
/*排序查询*/
select * from t_user where address like '%城%' order by id desc;
/*聚合函数*/
/*count(列名) 统计记录数(有多少行) 不推荐*/
select count(*) from t_user where address like '%城%';
/*count(主键列名) 统计记录数(有多少行) */
select count(id) from t_user where address like '%城%';
/*sum(数字类型的列名)筛后在聚合求和*/
select sum(age) from t_user where address like '%城%';
/*avg(数字类型的列名)筛后在聚合求平均*/
select avg(age) from t_user where address like '%城%';
/*max(数字类型的列名)筛后在聚合求最大值*/
select max(age) from t_user where address like '%城%';
/*min(数字类型的列名)筛后在聚合求最小值*/
select min(age) from t_user where address like '%城%';
/*---------------------------------------------------------------*/
/*分组查询*/
select count(id) '个数' from t_user group by address;
select avg(age) '平均年龄' from t_user group by address;
select count(id) '个数' from t_user group by address having '个数'<3;
/*---------------------------------------------------------------*/
/*演示多表联合*/
/*创建部门表*/
create table dept(
 id int PRIMARY key AUTO_INCREMENT,
 name varchar(20)
);
insert into dept values(null, '财务部'),
		       (null, '人事部'),
		       (null, '科技部'),
		       (null, '销售部');
/*创建雇员表*/
create table emp(
			id int primary key auto_increment,
			name varchar(20),
			dept_id int,
			foreign key(dept_id) references dept(id)
		);
insert into emp values(null, '张三', 1),
		      (null, '李四', 2),
		      (null, '老王', 3),
		      (null, '赵四', 4),
		      (null, '刘能', 4);
/*查询*/

/*笛卡尔积*/
select d.id,d.name,e.id,e.name,e.dept_id from dept d,emp e;
/*内连接的sql92写法*/
select d.id,d.name,e.id,e.name,e.dept_id from dept d,emp e where d.id=e.dept_id;
/*内连接的sql99写法*/
select d.id,d.name,e.id,e.name,e.dept_id from dept d inner join emp e on d.id=e.dept_id;
/*左外连接 拿左表中的全部数据,右表只拿相等的数据*/
select d.id,d.name,e.id,e.name,e.dept_id from dept d left outer join emp e on d.id=e.dept_id;
/*右外连接 拿右表中的全部数据,左表只拿相等的数据*/
select d.id,d.name,e.id,e.name,e.dept_id from dept d right outer join emp e on d.id=e.dept_id;
/*子查询 获取销售部里的所有员工*/
select e.id,e.name,e.dept_id from emp e where e.dept_id=(select id from dept d where d.name='销售部');
/*子查询 删除销售部和人事部所有人*/
delete from emp where id in(select d.id from dept d where d.name in('销售部','人事部'));
/*获取销售部里的所有员工,内连接写法*/
select d.id,d.name,e.id,e.name,e.dept_id from dept d inner join emp e on d.id=e.dept_id where d.name='销售部';
```