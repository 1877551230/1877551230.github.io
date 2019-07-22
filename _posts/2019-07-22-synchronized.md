---
layout:     post
title:      synchronized关键字
subtitle:   
date:       2019-07-22
categories: Java
author:     miracle
catalog: true
tags:
    - Java多线程
---

* content
{:toc}

 synchronize关键字 同步
 反义词:asynchronized 异步  
 同步资源,同步锁  
 
## 修饰在方法上
 当线程1调用method方法时,就会给method方法添加一个锁,如果方法不执行完毕,其他线程就不会只能此方法,线程排队等待


```java
/**
 * 作用在同一个实例对象上
 * synchronized同步方法测试
 * 两个线程,一个线程调用synchronized修饰的方法
 * 另一个线程调用非synchronized修饰的方法,互不影响
 * 并行执行
 */
public class SynchronizedTest1 {
    public synchronized void methodA(){
        try{
            for (int i = 0; i < 5; i++) {
                System.out.println("methodA-"+i);
                Thread.sleep(1000);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
    public void methodB(){
        try{
            for (int i = 0; i < 5; i++) {
                System.out.println("methodB-"+i);
                Thread.sleep(1000);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
```

```java
/**
 * 作用在同一个实例对象上
 * synchronized同步方法测试
 * 两个线程,一个线程调用synchronized修饰的方法
 * 另一个线程调用synchronized修饰的方法
 * 串行执行
 * 给同一个对象加锁,是用同一个对象分别调用methodA和methodB
 * 在test1.methodA(),把test1对象加锁了
 * 再次test1.methodB(),要等待test1对象锁释放,释放后才能调用methodB方法
 *
 * 如果test1.methodA()
 * test2.methodB()
 */
public class SynchronizedTest1_1 {
    public synchronized void methodA(){
        try{
            for (int i = 0; i < 5; i++) {
                System.out.println("methodA-"+i);
                Thread.sleep(1000);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
    public synchronized void methodB(){
        try{
            for (int i = 0; i < 5; i++) {
                System.out.println("methodB-"+i);
                Thread.sleep(1000);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
```

```java
/**
 * 作用在同一个实例对象上
 * synchronized同步方法测试
 * 两个线程,两个个线程调用synchronized修饰的方法methodA
 * 串行执行
 * 因为给同一个test1对象加锁
 */
public class SynchronizedTest1_2 {
    public synchronized void methodA(){
        try{
            for (int i = 0; i < 5; i++) {
                System.out.println("methodA-"+i);
                Thread.sleep(1000);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
```
 
## 修饰在对象上
 当线程1执行同步代码块时,就会给对象添加一个锁,如果代码块不执行完毕,其他线程就不会执行此代码块,线程排队等待

```java
/**
 * 作用在同一个实例对象上
 * synchronized同步代码块测试
 * 两个线程,一个线程执行synchronized代码块
 * 另一个线程调用非synchronized代码块
 *并行运行
 */
public class SynchronizedTest2 {
    public void methodA(){
        //同步代码块
        synchronized (this){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
    public void methodB(){
        try{
            for (int i = 0; i < 5; i++) {
                System.out.println("methodB-"+i);
                Thread.sleep(1000);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
```

```java
/**
 * 作用在同一个实例对象上
 * synchronized同步代码块测试
 * 两个线程,一个线程执行synchronized代码块
 * 另一个线程调用synchronized代码块
 *串行运行
 * 此时this就是test1
 */
public class SynchronizedTest2_1 {
    public void methodA(){
        //同步代码块
        synchronized (this){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
    public void methodB(){
        synchronized (this){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodB-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
```

### 结论

Java提供了同步机制互斥锁机制，这个机制保证了在同一时间内只有一个线程能访问共享资源（临界资源）。这个机制的保障来源于监视锁Monitor，在Java中，每个对象都自带监视锁，当我们要访问用synchronized修饰的方法或代码块的时候，都意味着进入这个方法或者代码块要加锁，离开要放锁。而且Synchronizd可以显示的说明对哪个对象加锁,如下例子：

```java
    public void methodA(){
        //同步代码块
        synchronized (this){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
```
等价于

```java
 public synchronized void methodA(){
        try{
            for (int i = 0; i < 5; i++) {
                System.out.println("methodA-"+i);
                Thread.sleep(1000);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }
```
 
## 修饰在类上

当线程1执行同步代码块时,就会给类添加一个锁,如果代码块不执行完毕,其他线程就不会执行此代码块,线程排队等待

```java
/**
 * 作用在同一个实例对象上
 * synchronized同步代码块测试和同步方法测试
 * 1.synchronized和Synchronized(this)二者没有区别,都是作用在this对象上,给this对象添加锁,所以会同步
 * 2.Synchronized(obj),这个是作用在obj对象上,给obj对象加锁
 *
 */
public class SynchronizedTest3 {
    //是给方法加锁
    public synchronized void methodA(){
        //同步代码块

            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }


    }

    /**
     * 给代码块加锁
     */
    public void methodB(){
        synchronized (this){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodB-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
```

```java
/**
 * 作用在同一个实例对象上
 * synchronized同步代码块测试和同步方法测试
 * 1.synchronized和Synchronized(this)二者没有区别,都是作用在this对象上,给this对象添加锁,所以会同步
 * 2.Synchronized(obj),这个是作用在obj对象上,给obj对象加锁
 *
 */
public class SynchronizedTest3_1 {
    //是给方法加锁
    public synchronized void methodA(){
        //同步代码块

            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }


    }

    /**
     * 给代码块加锁
     */
    public void methodB(){
        synchronized (this){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodB-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
    public void methodC(){
        //new对象
        Object obj = new Object();
        synchronized (obj){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodC-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }

```

```java
/**
 * 作用在同一个实例对象上
 * synchronized同步代码块测试和同步方法测试
 * 1.synchronized和Synchronized(this)二者没有区别,都是作用在this对象上,给this对象添加锁,所以会同步
 * 2.Synchronized(obj),这个是作用在obj对象上,给obj对象加锁
 * methodB和methodC是串行的
 * methodA和(methodB和methodC)是并行的
 *
 */
public class SynchronizedTest3_2 {
    private Object obj = new Object();
    //是给方法加锁
    public synchronized void methodA(){
        //同步代码块

            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }


    }

    /**
     * 给代码块加锁
     */
    public void methodB(){
        synchronized (obj){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodB-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
    public void methodC(){
        synchronized (obj){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodC-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
```

```java
/**
 * 作用在同一个类上,一个类上只有一把锁
 * synchronized类锁
 * static Synchronized 和 synchronized(类名.class)
 * 都是作用在用一个类锁上,所以会同步
 *
 */
public class SynchronizedTest4 {

    public synchronized static void methodA(){
        //同步代码块

            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }


    }

    /**
     * 给代码块加锁
     */
    public void methodB(){
        synchronized (SynchronizedTest4.class){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodB-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
```

```java
/**
 * synchronized的对象锁和static synchronized的类锁,
 * 是两个不用的锁,所以是异步,并行运行
 *
 */
public class SynchronizedTest5 {
    
    public synchronized  void methodA(){
        //同步代码块

            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodA-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }


    }

    /**
     * 给代码块加锁
     */
    public void methodB(){
        synchronized (SynchronizedTest5.class){
            try{
                for (int i = 0; i < 5; i++) {
                    System.out.println("methodB-"+i);
                    Thread.sleep(1000);
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }
```

## 博客参考
[一个不错的参考](https://blog.csdn.net/luoweifu/article/details/46613015)
