---
layout:     post
title:      多线程api和synchronized关键字
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

## 线程的声明周期

新建(new),就绪(runnable),运行(running),阻塞(blocked),死亡(terminated)

### 休眠sleep
会使线程从running状态转变到runnable状态或是blocked状态  

Thread.sleep(100);//毫秒  
TimeUnit.SECOND.sleep(1);//单位秒,还有其他单位  
会抛出InterruptedException

### 中断interrupt

这种方式会使线程从blocked状态转换到其他状态,比如runnable,running,terminated状态

比如  
TimeUnit.SECONDS.sleep(2);
//休眠两秒就被中断  
Thread.interrupt();  
如果线程企图休眠1分钟,休眠两秒就被打断,就会报错

1. 中断线程相关的方法
在线程内部有一个中断flag,如果我们执行了interrupt方法,name这个标签会被设置为true.表示此线程被打上了中断标记,与线程中断的api还有两个  
 * boolean interrupted 测试当前线程是否已经中断,重置flag,清楚当前中断状态
 * boolean isInterrupted 测试当前线程是否已经中断
interrupt是唯一能将中断状态设置为true的方法,静态方法interrupted会将当前线程的中断状态清除.

2. 如何中断一个线程

```java
	public static void main(String[] args) {
		Thread thread=new Thread(()->{
			while(true){}
		});
		thread.start();
		//中断这个线程
		thread.interrupt();
	}
```

会发现中断不起作用,因为中断线程,但是线程里面没有对其进行回应.

```java
	public static void main(String[] args) {
		Thread thread=new Thread(()->{
			while(true){
				if(Thread.currentThread().isInterrupted()){
					return;
				}
			}
		});
		thread.start();
		//中断这个线程
		thread.interrupt();
	}
```

内部线程积极响应了外面的中断信号,就能够中断了.

### yied方法

这个方法会使线程从running状态转换到runnable状态  
意思是告诉调度器,愿意放弃当前的cpu资源

### 设置线程优先级

优先级高表示线程优先调用.不是绝对的.优先级从1-10,数字越大优先级越大

thread.setPriority(1);

### join方法

可以使其他线程从running状态转换到blocked状态.
t.join方法只会使主线程进入等待池并等待线程t线程执行完毕后才会被唤醒,并不影响同一时刻处在运行状态的其他线程.



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

## java对象头和Monitor

在jvm中,对象在内存中分为三块区域:对象头,实例数据和对齐填充

* 实例对象:存放类的属性数据信息，包括父类的属性信息，如果是数组的实例部分还包括数组的长度，这部分内存按4字节对齐。
* 填充数据:由于虚拟机要求对象起始地址必须是8字节的整数倍。填充数据不是必须存在的，仅仅是为了字节对齐，这点了解即可。
* java头对象:它是实现synchronized的锁对象的基础，一般而言，synchronized使用的锁对象是存储在Java对象头里的，jvm中采用2个字来存储对象头(如果对象是数组则会分配3个字，多出来的1个字记录的是数组长度)，其主要结构是由Mark Word 和 Class Metadata Address 组成
Mark Word:存储对象的hashcode,锁信息或分代年龄或GC标志灯信息  
Class Metadata Address:类型指针指向对象的类元数据,jvm通过这个指针确定该对象是哪个类的实例  
synchronized的对象锁，锁标识位为10，其中指针指向的是monitor对象（也称为管程或监视器锁）的起始地址。每个对象都存在着一个 monitor 与之关联，对象与其 monitor 之间的关系有存在多种实现方式，如monitor可以与对象一起创建销毁或当线程试图获取对象锁时自动生成，但当一个 monitor 被某个线程持有后，它便处于锁定状态。在Java虚拟机(HotSpot)中，monitor是由ObjectMonitor实现的  
ObjectMonitor中有两个队列，WaitSet 和 EntryList，用来保存ObjectWaiter对象列表( 每个等待锁的线程都会被封装成ObjectWaiter对象)，owner指向持有ObjectMonitor对象的线程，当多个线程同时访问一段同步代码时，首先会进入 EntryList 集合，当线程获取到对象的monitor 后进入 Owner 区域并把monitor中的owner变量设置为当前线程同时monitor中的计数器count加1，若线程调用 wait() 方法，将释放当前持有的monitor，owner变量恢复为null，count自减1，同时该线程进入 WaitSe t集合中等待被唤醒。若当前线程执行完毕也将释放monitor(锁)并复位变量的值，以便其他线程进入获取monitor(锁)。  
  

从字节码中可知同步语句块的实现使用的是monitorenter 和 monitorexit 指令，其中monitorenter指令指向同步代码块的开始位置，monitorexit指令则指明同步代码块的结束位置，当执行monitorenter指令时，当前线程将试图获取 objectref(即对象锁) 所对应的 monitor 的持有权，当 objectref 的 monitor 的进入计数器为 0，那线程可以成功取得 monitor，并将计数器值设置为 1，取锁成功。如果当前线程已经拥有 objectref 的 monitor 的持有权，那它可以重入这个 monitor (关于重入性稍后会分析)，重入时计数器的值也会加 1。倘若其他线程已经拥有 objectref 的 monitor 的所有权，那当前线程将被阻塞，直到正在执行线程执行完毕，即monitorexit指令被执行，执行线程将释放 monitor(锁)并设置计数器值为0 ，其他线程将有机会持有 monitor 。

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

## java怎么避免死锁

1. 加锁顺序
当多个线程需要相同的一些锁,但是按照不同的顺序加锁,死锁就很容易发生,如果能确保所有的线程都是按照相同的顺序获得锁,死锁就不会发生.
2. 加锁时限
在尝试获取锁的过程中,若超过了这个时限该线程放弃对该锁请求.若一个线程没有在给定的时限内成功获得所有需要的锁,则会进行回退并释放所有已经获得的锁,然后等待一段随机的时间再尝试.这段随机的等待时间让其他线程有机会尝试获取相同的这些锁,并且让该应用在没有获得锁的时候可以继续运行
3. 死锁检测
死锁检测是一个更好的死锁预防机制,它主要是针对那些不可能实现按序加锁并且锁超时也不可行的场景.每当一个线程获得了锁,会在线程和锁相关的数据结构中(map,graph等)将其记下.除此之外,每当有线程请求锁失败时,这个线程可以遍历锁的关系图看看是否有死锁的发生.那么当检测出死锁时,这些线程该做什么?  
一个可行的做法是释放所有的锁,回退,并且等待一段随机的时间后重试.更好的方案是给这些线程设置优先级,让一个或几个线程回退,剩下的线程就像没发生死锁一样继续保持他们需要的锁.如果赋予这些线程的优先级是固定不可变的,同一批线程总是会拥有更高的优先级.为避免这个问题,可以在死锁发生的时候设置随机的优先级.

