---
layout:     post
title:      zookeeper
subtitle:   
date:       2019-10-25
categories: 大数据
author:     miracle
catalog: true
tags:
    - zookeeper
---

* content
{:toc}


## 一 概述
1. zookeeper是Apache提供的一套用于进行分布式管理和协调的框架
## 二 分布式的问题
1. 分布式容易存在死锁以及活锁问题
2. 分布式中,需要引入管理节点
3. 如果只有一个管理节点,容易存在单点故障,所以需要引入管理集群
4. 管理集群中需要选举出一个主节点
5. 管理节点之间需要进行信息的共享


## 三 安装
1. 单机模式:只用一个节点安装,往往只能提供框架的部分功能
2. 伪分布式:只用一个节点来安装,但是模拟集群环境,能够提供框架的所有功能
3. 完全分布式:在集群中安装,提供这个框架的所有功能

## 四 细节
1. zookeeper本身是一个树状结构
2. 根节点是/
3. 将zookeeper中每个节点称之为znode节点,
4. 每一个节点都要求携带数据
5. zookeeper不支持相对路径
6. 将数据存储在磁盘以及内存中
7. 数据在磁盘上的存储位置由dataDir来决定
8. 理论上zookeeper可以作为缓存机制使用,但是如果使用zookeeper作为缓存机制,则会导致内存被大量占用,则致使zookeeper的协调能力弱
9. 会对每一次的写操作(create/set/delete/rmr)分配一个全局递增的编号,这个编号称为Zxid 


### 命令: 
* ls / 查看根节点的所有子节点  
* create /news 'news server' 创建节点  
* delete /news 删除节点(要求节点没有子节点)  
* rmr /news 递归删除  
* set /log '' 更新数据  
* get/log 查看数据  

### java操作

#### 连接zookeeper

```java
public void connect()  throws Exception{
		//zookeeper的连接和监控过程使用的是Netty,Netty是非阻塞框架
		final CountDownLatch cd1=new CountDownLatch(1);	
		 zk=new ZooKeeper(
				"192.165.245.130:2181",//连接地址,端口号
				5000,//回话超时时间,现阶段这个值需要在4000-40000之间,单位默认是毫秒
				//watcher-监控者 用于监控zookeeper是否连接成功
				new Watcher(){

					public void process(WatchedEvent event) {
						//event 被监控事件
						if(event.getState()==KeeperState.SyncConnected){
							System.out.println("连接成功");
							cd1.countDown();
						}
						
					}
					
				});
		cd1.await();
	}
```

#### 创建节点

```java
//创建节点
	public void createNode() throws Exception{
		//path路径
		//data 数据
		//acl 权限策略 
		//createMode 节点类型
		//返回值表示创建的节点名字
		String name=zk.create("/log", "log server".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
		System.out.println(name);
	}
```

#### 修改数据

```java
//修改数据
	public void setData() throws Exception{
		//path data
		//version 数据版本 dataversion
		//修改的时候,要求指定的version必须和节点的dataversion一致
		//如果version为-1,则忽略版本校验,强制修改
		Stat s=zk.setData("/log", "hello log".getBytes(), 0);
		System.out.println(s);
	}
```

#### 获取数据

```java
public void  getData() throws Exception{
		
		//如果需要节点信息,则创建一个传入
		//Stat s=new Stat();
		byte[] data=zk.getData("/log", null, null);
		System.out.println(new String(data));
	}
```

#### 删除节点

```java
public void deleteNode() throws InterruptedException, KeeperException{
		//要求没有子节点
		zk.delete("/log", -1);
	}
```

#### 判断节点是否存在


```java
public void exists()throws Exception{
		//如果节点存在,则返回节点信息
		//如果节点不存在则返回null
		zk.exists("/log", null);
	}
```

#### 获取子节点

```java
public void getChildren() throws Exception{
		//返回值是list
		//list包含的子节点的名字
		List<String> names=zk.getChildren("/", null);
		for(String name:names){
			System.out.println(name);
		}
	}
```

#### 监控节点数据是否改变

```java
//监控节点数据是否被改变
	public void dataChange() throws Exception{
		final CountDownLatch cd1=new CountDownLatch(1);
		zk.getData("/log", new Watcher(){

			public void process(WatchedEvent event) {
				if(event.getType()==EventType.NodeDataChanged);
				System.out.println("改变了");
				cd1.countDown();
				
			}
			
		}, null);
		cd1.await();
	}
```

#### 监控子节点个数是否变化

```java
public void childrenChange() throws Exception{
		final CountDownLatch cd1=new CountDownLatch(1);
		zk.getChildren("/log", new Watcher(){

			public void process(WatchedEvent event) {
				if(event.getType()==EventType.NodeChildrenChanged);
				System.out.println("子节点个数改变了");
				cd1.countDown();
				
			}
			
		});
		cd1.await();
	}
```

#### 监控节点创建删除状态

```java
//监控节点删除状态
	public void nodeChange() throws Exception{
		final CountDownLatch cd1=new CountDownLatch(1);
		zk.exists("/log", new Watcher(){

			public void process(WatchedEvent event) {
				if(event.getType()==EventType.NodeCreated){
				System.out.println("子节点个数改变了");
				}
				else if(event.getType()==EventType.NodeDeleted){
					System.out.println("节点被删除");
				}
				cd1.countDown();
				
			}
			
		});
		cd1.await();
	}
```

### 节点信息

* czxid 创建事务id -create  
* ctime 创建时间  
* mZxid 修改事务id -set  
* mtime 修改时间  
* pZxid 子节点变化事务id  
* cversion 子节点个数变化次数  
* dataVersion 数据变化次数  
* aclVersion 权限变化次数  
* ephemeralOwner 用于标记当前节点是否是临时节点 如果是持久节点此项为0,如果是临时节点,此项的值是sessionId  
* dataLength 数据字节个数  
* numChildren 子节点个数  

### 节点类型:

|  | 持久节点  | 临时节点 |
| :------ |:--- | :--- |
| 顺序节点 | permanent-Sequencial | Ephemeral-Sequencial |
| 非顺序节点 | permanent | Ephemeral |


## 选举机制

1. 当Zookeeper在启动的时候,会先去恢复当前服务器上的最大事务id
2. 在选举开始的时候,每个节点都会选择自己当leader节点
3. 每一个zookeeper服务器会将自己的选举信息发送给其他节点然后进行选举

### 细节
1. 选举信息
 a. 最大事务id
 b. 选举编号-myid
 c. 逻辑时钟值-控制所有节点处在同一轮选举上 
2. 比较原则:
 a. 先比较两个节点之间的最大事务id,谁打谁赢
 b. 如果最大事务id一致,则比较myid,谁大谁赢
3. 如果一个节点比一半及以上的节点都大,这个节点会成为leader-过半性
4. 在Zookeeper中,只要一个集群中选举出来的leader,后续加入的节点只能是follower
5. 如果leader丢失,会自动重新选举出一个新的leader
6. 因为集群分裂导致子集群中产生了leader,致使整个集群汇总产生了多个leader,这个现象称为脑裂
7. 如果存货的节点数不足一半的时候,这个zookeeper集群就不再选举,也不再对外提供服务
8. zookeeper集群的节点个数一般是奇数个数
9. Zookeeper中会对每一次选举的leader分配一个全局递增的编号,编号称之为epochid ,每一个节点在被选为leader之后,会将当前的epochid分发给每一个follower
10. 如果因为分裂而产生脑裂,恢复之后,zookeeper会自动kill掉epochid小的节点
11. 节点状态变化:
 a. voting/looking 选举状态  
 b. follower-追随者  
 c. leader-领导者  
 d. observer-观察者


## ZAB协议

### 一. 概述

1. ZAB(Zookeeper Atomic Broadcast) Zookeeper原子广播协议,是针对Zookeeper专门设计的一套进行原子广播和崩溃恢复的协议
2. ZAB是基于2PC算法进行设计,利用PAXOS进行改进

### 二. 原子广播

1. 保证数据一致性

2. 2pc 2 phase commint 二阶段提交

 a.将提交过程分为两个阶段  
  i准备阶段:当协调者收到请求之后,将请求分发给每一个参与者,并且等待参与者的返回信息  
  ii提交阶段:如果协调者收到了参与者的返回信息,并且所有的参与者都返回了yes,那么协调者发布指定要求执行这个操作  
  iii终止阶段:如果协调者没有收到所有参与者的yes,那么协调者会认为这个操作不能执行,要求所有的参与者删除这个操作  
 b. 核心思想是"一票否决"  
 
### 三. 崩溃恢复

1. 当集群中,leader从集群中脱离之后,集群会自动选举出一个新的leader
2. 用于避免单点故障
3. 在zookeeper中,每产生一个新的leader,会自动分配一个全局递增的epochid.这个epochid同样会体现在事务id(Zxid)上.在集群中,事务id实际上是由64位二进制组成,其中高32位是epochid,低32位是真正的事务id
4. epochid能够有效的保证操作的提交顺序

## 观察者 observer
### 概述:
1. 特点:不投票不选举,但是会监听投票结果,然后根据投票结果执行操作
2. 观察者适合于节点数量较多或者网络情况不好的场景,在实际开发中,因为参与选举的节点的数量越多,选举的效率会越低,所以实际过程中,会将90%的节点设置为observer
3. 因为observer不参与投票,所以observer不影响过半,即observer的存活与否都不会影响集群的服务

### 四.特性
1. 过半性
2. 数据一致性- 原子广播
3. 可靠性-崩溃恢复
4. 顺序性-队列.epochid
5. 实时性-可以对zookeeper进行实时监控

## AVRO
### 一.概述:
1. AVRO是apache提供的一套用于进行序列化和RPC的机制

### 二.序列化
1. 将数据转化为指定的格式
2. 作用:数据的存储和传输
3. 序列化的衡量标准:
 a.对cpu和内存的占用比较少  
 b.序列化之后产生的数据的大小
 c.序列化之后的数据,能否跨平台,跨语言
4. avro将数据转化为字符串的序列化机制

### RPC
1. remote Procedure call 远程过程调用 ,允许在一个节点上远程调用另一个节点上的方法,而不用显式实现这个方法
