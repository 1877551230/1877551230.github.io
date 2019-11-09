---
layout:     post
title:      synchronized关键字
subtitle:   
date:       2019-11-05
categories: 面试题
author:     miracle
catalog: true
tags:
    - 多线程
---

* content
{:toc}


## 简介

synchronized:能够保证同一时刻最多只有一个线程执行该段代码,以达到安全并发的效果.  
synchronized好比一把锁,把资源锁住之后,别人就不能使用,只有等这个线程用完后,别人才行用.  

```java
public class Test1 implements Runnable{
	static int a=0;
	public static void main(String[] args) throws InterruptedException {
		Test1 t1=new Test1();
		Thread thread1=new Thread(t1);
		Thread thread2=new Thread(t1);
		thread1.start();
		thread2.start();
		Thread.sleep(5000);
		System.out.println(a);
	}
	@Override
	public void run() {
		for(int i=0;i<1000;i++){
			a++;
		}
	}
}
```

最后发现有时候,结果会小于2000,是因为这个线程进行了三个操作  
1. 线程1读取a
2. 线程将a加1
3. 将a的值写入内存
在线程1还没把a的值写入内存,线程2就把内存的值读走了,这样就导致少加1.

如果在run方法中,加synchronized锁

```java
@Override
	public void run() {
		synchronized (o) {
			for (int i = 0; i < 100000; i++) {
				a++;
			}
		}
	}
```
结果就是正确的

## 对象锁
1. 同步代码块锁

```java
Object o1=new Object();
Object o2=new Object();
synchronized(o1){...}
synchronized(o2){...}
```

同步代码块锁是对象锁,被锁的两个代码块互不干扰,但是同一个代码块的逻辑,需要等待上一个线程执行完毕

2. 方法锁

方法锁就是给方法加上synchronized关键字.锁的是this对象.
如果有两个方法都被synchronized修饰,同一时刻,只有一个方法能被执行

## 类锁

1. static方法锁

在java中,类的对象可能有无数个,但类只有一个

```java
public class SynTest implements Runnable{
	public static void main(String[] args) {
		SynTest st1=new SynTest();
		SynTest st2=new SynTest();
		Thread t1=new Thread(st1);
		Thread t2=new Thread(st2);
		t1.start();
		t2.start();
		System.out.println("程序运行结束");
	}

	@Override
	public void run() {
		method();
	}
	public static synchronized void method(){
		try {
			System.out.println(Thread.currentThread().getName()+"进入了方法");
			Thread.sleep(2000);
			System.out.println(Thread.currentThread().getName()+"离开了静态方法");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

```

给method定为static静态方法,并用synchronized修饰.定义了两个不同的对象st1和st2,两个线程依次执行method方法,  
如果将static去掉,变为普通的方法,因为是两个不同的对象,两个线程会并行执行method方法.

2. Class锁

```java
public class SynTest2 implements Runnable {
	public static void main(String[] args) {
		SynTest st1 = new SynTest();
		SynTest st2 = new SynTest();
		Thread t1 = new Thread(st1);
		Thread t2 = new Thread(st2);
		t1.start();
		t2.start();
		System.out.println("程序运行结束");
	}
	@Override
	public void run() {
		method();
	}
	public void method() {
		synchronized (SynTest2.class) {
			try {
				System.out.println(Thread.currentThread().getName() + "进入了方法");
				Thread.sleep(2000);
				System.out.println(Thread.currentThread().getName() + "离开了静态方法");
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
```

使用了静态代码块,不过synchronized关键字包装的是类,我们定义了两个对象,但线程还是依次执行

## 6个常见的使用情况

1. 两个线程同时访问一个对象的同步方法
同一时刻只能有一个线程进入

2. 两个线程访问两个对象的同步方法

线程1和线程2互不影响的访问.锁不起作用

3. 两个线程访问的是synchronized的静态方法

同一时刻只能有一个线程进入方法.即使多个实例

4. 两个线程同时访问同步方法和非同步方法

如果只有一个对象,两个线程依次执行同步方法,非同步方法并行执行.

5. 一个线程访问同一个类的两个普通同步方法
锁生效

6. 同时访问静态同步方法和非静态同步方法

锁对象是类锁和对象锁,不生效,所以失效.

## 可重入性质

同一线程的外层函数获得锁之后,内层函数可以直接再次获取该锁.就是吃着碗里的,看着锅里的.
嘴里还没吃完就又去拿,不可重入就是吃完一碗才能吃下一碗.

可重入的程度分为三种情况

1. 同一个方法中是不是可以重入的,就好比递归调用同步方法

```java
public class Test1 {
	private int a=1;
	public static void main(String[] args) {
		Test1 t1=new Test1();
		t1.method();
	}
	public synchronized void method(){
		System.out.println("method1:a="+a);
		if(a==3){
			return;
		}else{
			a++;
			method();
		}
	}
}
```

可以递归使用同步方法,所以是可重入的

2. 不同的方法是不是可重入的.就好比一个同步方法调用另一个同步方法

```java
public class Test2 {
	public static void main(String[] args) throws Exception{
		Test2 t2=new Test2();
		t2.method1();
	}
	public synchronized void method1(){
		System.out.println("method1");
		method2();
	}
	public synchronized void method2(){
		System.out.println("method2");
		method1();
	}
}
```

在同步方法1中调用了同步方法2.说明了在不同的方法中也是可重入的

3. 不同的类方法是不是可重入的.

```java
public class Father {
	public synchronized static void father(){
		System.out.println("父亲");
	}
	public static void main(String[] args) {
		Son.son();
	}	
}
class Son{
	public synchronized static void son(){
		System.out.println("儿子");
		Father.father();
	}
}
```

能跨类调用,说明不同的类也是可重入的

4. 原理:
线程第一次给对象加锁的时候,计数为1,以后这个线程再次获取锁的时候,计数会依次增加,同理,任务离开的时候,相应的计数器也会减少.

## 不可中断性质

线程中设置了一个监控器monitor,线程进来就是monitorenter,线程离开是monitorexit.

## 内存模型

synchronized关键字,会对同步代码先写到工作内存,等synchronized修饰的代码块执行结束,就会写入到主内存.

## 缺点

1. 效率低
不可中断,一个线程如果不能取到锁就会一直等待,不能做其他事情.
2. 不灵活
每个锁只能有一个对象处理
3. 无法知道是否成功取到锁

## join方法

Thread.join方法是在等上一个线程执行完毕后,下一个线程才能开始.


