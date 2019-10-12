---
layout:     post
title:      elasticsearch
subtitle:   
date:       2019-10-11
categories: Java
author:     miracle
catalog: true
tags:
    - 互联网框架
---

* content
{:toc}

## 安装

### 调整linux环境配置
设置root以外最大使用线程数量  
* vim /etc/security/limits.d/90-nproc.conf
添加一个虚拟内存使用上限655360  
*  vim /etc/sysctl.conf
es启动不允许使用最大权限的root,创建es用户
* groupadd es 
*  useradd es -g es -p 123 
使用root用户给es赋权
*  chown -R es:es /home/software/elasticsearch-5.5.2

### 配置elasticsearch.yml

集群名
* cluster.name: elasticsearch
节点名
* node.name: es01
关闭bootstrap的加载
* bootstrap.memory_lock: false
* bootstrap.system_call_filter: false
开启绑定外界访问服务器的ip地址
* network.host: 10.9.101.10
打开默认端口9200
* http.port: 9200
为head插件访问开启http权限(配置文件末尾)
* http.cors.enabled: true
* http.cors.allow-origin: "*"

### head插件
Gruntfile.js修改hostname的ip地址
* grunt server

## 索引管理
创建索引
* #curl -XPUT http://10.9.104.184:9200/index01 
详情查看one note笔记文件

## 脑裂

在es的集群中,多个master选举出一个现役(active)master后,由于现役master网络波动但没有宕机,导致其他主节点连接不到判断宕机,其他主节点执行选举逻辑,生成新的master,当网络波动消失,集群将会被多个master同时管理(meta data),最终集群中的数据会错乱--脑裂

### 解决脑裂

原则:集群中至多只有一个有效的现役master,配置文件中准备一个过半的有效最小master数量

## 集群选举

启动es的集群时,可以成为master的节点可能有多 个(master.node: true),最终成为现役master的节 点是谁需要通过选举完成(bully算法,谁的id大/小)

### 步骤
1. 节点启动链接协调器,获取集群所有节点信息在内存中准备一个activeMaster的对象存储现役master 
2. 判断activeMaster中是否已经有现役master的 值,如果有了,启动结束,加入集群(一般都可以在 第二步结束),如果没有现役master进入第三步
3. 如果activeMaster没有值,将可以获取的所有可 以成为master的节点,加入到一个后备 list(candidate),判断后备的candidate中是否有配 置文件指定最小master数量,如果没有,返回第一 步重新连接,重新执行,满足进入第四步 
4. 执行bully选举,从中选取id最大/最小,放到 activeMaster(暂定的master).重新执行第一步
## 宕机时选举逻辑

### 现役master宕机
对于其他master来讲,activeMaster空了,执行 第三步判断candidate中是否存在有效master 数量,进行bully选举 
### 宕机其他mster
也会根据master数量(activeMaster)判断剩余master是否满足最小master数量决定是否可用 

## 索引操作

### 初始化连接对象

```java
private TransportClient client;
public void initClient() throws Exception{
		//提供一些连接es的信息 ip:port
		//准备一个配置对象,可以设置当前客户端连接的'
		//集群名称elasticsearch
		Settings set=Settings.builder().put("cluster.name","elasticsearch").build();
		client=new PreBuiltTransportClient(set);
		//为client赋值,底层使用的prepare预包装 提供ip端口
		InetSocketTransportAddress ista1=new InetSocketTransportAddress(InetAddress.getByName("10.42.141.101"), 9300);//代码插件,客户端连接es使用的9300
		InetSocketTransportAddress ista2=new InetSocketTransportAddress(InetAddress.getByName("10.42.145.240"), 9300);
		InetSocketTransportAddress ista3=new InetSocketTransportAddress(InetAddress.getByName("10.42.66.53"), 9300);
		
		//交给client三个地址对象,只要能联通一个节点就可以操作es
		client.addTransportAddress(ista1);
	}
```
### 创建索引

```java
public void indexManage(){
		//transportClient视同pre**实现方式,将所有访问的功能,都封装成了单独的request和response对象
		//首先需要在代码中封装对应功能的request对象,利用client接受响应
		//创建索引,需要先获取索引的管理对象
		AdminClient admin=client.admin();
		IndicesAdminClient indices=admin.indices();
		//新建索引,看不到代码的请求方式,看不到url
		//prepare前缀的方法都是获取一个request对象
		CreateIndexRequestBuilder request=indices.prepareCreate("index03");
		CreateIndexResponse response=request.get();
		response.isAcknowledged();
		response.isShardsAcked();
		response.remoteAddress();//看到当前的请求是哪个远程es节点返回的消息
		//对索引其他的操作
		indices.prepareDelete("");
		indices.prepareExists("");
	}
```
### 新增文档

```java
public void documentManage() throws JsonProcessingException{
		/*//获取文档,索引名称,类型名,索引id
		GetRequestBuilder request=client.prepareGet("index01","article","2");
		//获取响应结果
		GetResponse response=request.get();
		//将获取的document所有的数据封装了json字符串
		response.getSource();
		Map<String,Object> map=response.getSourceAsMap();
		String json=response.getSourceAsString();
		System.out.println(json);
		//删除document
		//client.prepareDelete(index,type,id)
		//新增document
		//测试 如何从数据库获取product 利用客户端将数据写进索引*/
		Product p=new Product();
		p.setProductCategory("1");
		p.setProductDescription("1");
		p.setProductId("1");
		p.setProductImgurl("1");
		p.setProductName("手机");
		p.setProductPrice(100.0);
		p.setProductNum(1);
		IndexRequestBuilder irRequest=client.prepareIndex("index02","product",p.getProductId());
		ObjectMapper mapper=new ObjectMapper();
		String pJson=mapper.writeValueAsString(p);
		irRequest.setSource(pJson);
		IndexResponse iResponse=irRequest.get();
		iResponse.getResult();
	}
```

### 搜索索引

```java
	public void queryManage(){
		//client调用创建的搜索条件query,设置分页进行搜索
		//QueryBuilders.fuzzyQuery(name, value) 模糊查询
		MatchQueryBuilder query=QueryBuilders.matchQuery("productName", "手机");
		//client调用搜索实现数据获取
		SearchRequestBuilder request=client.prepareSearch("index02");
		//将参数配置交给请求对象
		//from相当于sql分页查询的start起始位置
		//size相当于rows
		SearchResponse response=request.setQuery(query).setFrom(0).setSize(5).get();
		SearchHits hits=response.getHits();
		System.out.println(hits.totalHits);
		System.out.println(hits.maxScore());
		SearchHit[] hits2=hits.getHits();
		for(SearchHit hit:hits2){
			String json=hit.getSourceAsString();
			System.out.println(json);
		}
	}
```

### CAP理论
* C:consistence 系统数据一致性 
* A:avalibility 系统可用性 
* P:Partition Tolerance 分区容忍度
CAP只允许其中3个存在不能同时存在:  
CP:分区出现时,要求容忍度高,数据一致性高,牺牲可用性  
AP:分区出现时,容忍度低,可用性高,牺牲了一致性  
AC:没分区的时候  