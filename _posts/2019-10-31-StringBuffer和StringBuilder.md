---
layout:     post
title:      StringBuffer和StringBuilder
subtitle:   
date:       2019-10-31
categories: 面试题
author:     miracle
catalog: true
tags:
    - 面试题
---

* content
{:toc}

## StringBuilder和StringBuffer
与String不同,StringBuffer和StringBuilder是可变的,增删改都是在原字符串基础上操作的,操作再多内存也不会被白白浪费
* StringBuffer是线程安全的,支持并发操作,适合多线程
* StringBuilder是线程不安全的,不支持并发操作,适合单线程

## 构造方法

```java
//直接new一个空对象
StringBuffer s=new StringBuffer();
//new对象,分配1024个字节缓冲区
StringBuffer s=new StringBuffer(1024);
//new带内容的对象
StringBuffer sb2=new StringBuffer("张三");
```

## 增删改操作

```java
//增加内容
s.append("呵呵");
//在指定位置插入
s.insert(2,"呵呵");
//删除指定字符
s.deleteCharAt(1);
//删除指定范围字符
s.delete(2,6);
//内容翻转
s.reverse();
//对指定位置字符更改
s.setCharAt(2,'李');
```


## 性能比较

```java
	@Test
	public void testStringP(){
		String s="";
		long begin=System.currentTimeMillis();
		for(int i=0;i<10000;i++){
			s+="java";
		}
		long end=System.currentTimeMillis();
		System.out.println(end-begin);
	}
	@Test
	public void testStringBufferP(){
		StringBuffer s=new StringBuffer();
		long begin=System.currentTimeMillis();
		for(int i=0;i<10000;i++){
			s.append("java");
		}
		long end=System.currentTimeMillis();
		System.out.println(end-begin);
	}
	@Test
	public void testStringBuilderP(){
		StringBuilder s=new StringBuilder();
		long begin=System.currentTimeMillis();
		for(int i=0;i<10000;i++){
			s.append("java");
		}
		long end=System.currentTimeMillis();
		System.out.println(end-begin);
	}
```

* String 为271ms
* StringBuffer和StringBuilder都是1ms

## 在内存中

```java
String s1="张三";
String s2="张三";
String s3=new String("张三");
String s4=new String("张三");

```

* s1==s2 true
* s1==s3 false
* s3==s4 fasle

s1="张三"和s2="张三",都会生成字面常量和符号引用,存储在方法区常量池中,但jvm会在常量池查找,一看一样,就把张三的地址给s2,所以他们的地址是一样的  
但只要有new,就会在堆中创建一个新的对象