---
layout:     post
title:      wait和sleep的区别
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

## 区别

1. sleep是线程中的方法,wait是object中的方法.
2. sleep方法不会释放锁,但是wait会释放,而且会加入到等待队列中.
3. sleep方法不依赖于同步器synchronized,但是wait需要依赖synchronized关键字.
4. sleep不需要被唤醒(休眠之后退出阻塞),但是wait需要(不指定时间需要被别人中断).

## sleep方法不会释放锁,wait会释放

1. 测试sleep方法

```java
public class Test {
	private final static Object lock=new Object();
	public static void main(String[] args) {
		Stream.of("线程A","线程B").forEach(n->new Thread(n){
			public void run(){
				Test.testSleep();
			}
		}.start()
		);
	}
	protected static void testSleep() {
		synchronized(lock){
			System.out.println(Thread.currentThread().getName()+"运行");
			try {
				Thread.sleep(10000);
				System.out.println(Thread.currentThread().getName()+"结束");
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		
	}

}
```

线程A运行  
线程A结束  
线程B运行  
线程B结束  

线程A先获取了cpu资源,开始执行休眠,在休眠过程中,线程B是没办法执行的,必须等待线程A结束后才可以.

2. 测试wait方法

```java
public class TestWait {
	public final static Object lock = new Object();
	public static void main(String[] args) {
		Stream.of("线程A", "线程B").forEach(n -> new Thread(n) {
			public void run() {
				TestWait.testWait();
			}
		}.start());
	}
	protected static void testWait() {
		synchronized (lock) {
			try {
				System.out.println(Thread.currentThread().getName() + "运行");
				lock.wait(5000);
				System.out.println(Thread.currentThread().getName() + "结束");
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
```
线程A运行  
线程B运行  
线程B结束  
线程A结束  

线程A抢到cpu,然后等待五秒,在线程A等待的时候,线程B可以进入

## sleep不依赖同步方法,wait需要

1. sleep方法

```java
public class Test2 {

	public static void main(String[] args) {
		Stream.of("线程A", "线程B").forEach(n -> new Thread(n) {
			public void run() {
				Test2.testSleep();
			}
		}.start());
	}

	protected static void testSleep() {
		try {
			System.out.println(Thread.currentThread().getName() + "运行");
			Thread.sleep(5000);
			System.out.println(Thread.currentThread().getName() + "结束");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

```

两个线程会并行运行,无异常

2. wait方法

```java
public class TestWait2 {
	public final static Object lock = new Object();

	public static void main(String[] args) {
		Stream.of("线程A", "线程B").forEach(n -> new Thread(n) {
			public void run() {
				TestWait2.testWait();
			}
		}.start());
	}
	protected static void testWait() {
			try {
				System.out.println(Thread.currentThread().getName() + "运行");
				lock.wait(5000);
				System.out.println(Thread.currentThread().getName() + "结束");
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
	}
}
```

线程A运行  
线程B运行  
Exception in thread "线程A"  
Exception in thread "线程B"  
java.lang.IllegalMonitorStateException  

两个线程都产生了异常

## sleep不需要被唤醒,wait需要

```java
public class TestNotifyWait {
	public final static Object lock = new Object();
	private static void testWait(){
		synchronized(lock){
			try {
				System.out.println("我一直等");
				lock.wait();
				System.out.println("wait被唤醒了");
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	private static void notifyWait(){
		synchronized(lock){
			try {
				Thread.sleep(5000);
				lock.notify();
				System.out.println("休眠五秒钟唤醒");
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	public static void main(String[] args) {
		new Thread(){
			public void run(){
				TestNotifyWait.testWait();
			}
		}.start();
		new Thread(){
			public void run(){
				TestNotifyWait.notifyWait();
			}
		}.start();
	}
}
```

我一直等  
休眠五秒钟唤醒  
wait被唤醒了  

如果没有唤醒方法,第一个线程会一致处于等待的状态,第二个线程唤醒了之后就不用等待了

## 等待机制与synchronized

notify/notifyAll和wait方法，在使用这3个方法时，必须处于synchronized代码块或者synchronized方法中，否则就会抛出IllegalMonitorStateException异常，这是因为调用这几个方法前必须拿到当前对象的监视器monitor对象，也就是说notify/notifyAll和wait方法依赖于monitor对象，在前面的分析中，我们知道monitor 存在于对象头的Mark Word 中(存储monitor引用指针)，而synchronized关键字可以获取 monitor ，这也就是为什么notify/notifyAll和wait方法必须在synchronized代码块或者synchronized方法调用的原因。  
需要特别理解的一点是，与sleep方法不同的是wait方法调用完成后，线程将被暂停，但wait方法将会释放当前持有的监视器锁(monitor)，直到有线程调用notify/notifyAll方法后方能继续执行，而sleep方法只让线程休眠并不释放锁。同时notify/notifyAll方法调用后，并不会马上释放监视器锁，而是在相应的synchronized(){}/synchronized方法执行结束后才自动释放锁。  

[详情](https://blog.csdn.net/Imobama/article/details/81119812)