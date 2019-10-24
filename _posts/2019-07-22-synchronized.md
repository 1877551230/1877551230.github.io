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
### 例一
当线程1调用method方法时,就会给该类所有synchronized修饰的方法添加一个锁,如果方法不执行完毕,其他线程就
不会只能此方法,线程排队等待,此类有一个方法加锁,另一个不加锁,所以可以并行执行

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
    public static void main(String[] args) {
        SynchronizedTest1 test1 = new SynchronizedTest1();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA(); }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();
    }
}
```

### 例二
 下面的两个方法同步执行,因为synchronized影响范围不单单是方法本身,而是这个类中所有带synchronized修饰的方法

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
    public static void main(String[] args) {
        SynchronizedTest1_1 test1 = new SynchronizedTest1_1();
        //SynchronizedTest1_1SynchronizedTest1_1 test2 = new SynchronizedTest1_1();

        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();
    }
}
```

### 例三
 下面两个线程访问同一个对象,该对象的方法加锁,即锁住的是方法所属对象本身,所以同步执行

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
    public static void main(String[] args) {
        SynchronizedTest1_2 test1 = new SynchronizedTest1_2();


        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t2.start();
    }
}
```
 
## 修饰在对象上
 当线程1执行同步代码块时,就会给对象添加一个锁,如果代码块不执行完毕,其他线程就不会执行此代码块,线程排队等待  

 
### 例一

synchronized修饰代码块,两个线程,一个访问带synchronized修饰的代码块,另一个访问不带synchronized修饰的代码块,所以并行


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
    public static void main(String[] args) {
        SynchronizedTest2 test1 = new SynchronizedTest2();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();
    }
}
```

### 例二

两个代码块都带synchronized修饰,两个线程访问时,串行运行

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
     public static void main(String[] args) {
        SynchronizedTest2_1 test1 = new SynchronizedTest2_1();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();
    }
}
```

### 例三

下面类中两个方法等价,都是给对象添加锁,所以同步运行

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
     public static void main(String[] args) {
        SynchronizedTest3 test1 = new SynchronizedTest3();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();
    }
}
```

### 例四
下面三个方法,前两个方法等同,相当于给对象加锁,第三个方法C未加锁  
AB两个方法同步,与C方法异步

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
    public static void main(String[] args) {
        SynchronizedTest3_1 test1 = new SynchronizedTest3_1();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();

        Thread t3 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodC();
            }
        });
        t3.start();
    }
}

```

### 例五
本类中,方法A锁的是本类的对象,this指代本类,给this对象加锁,BC两个方法给都是obj对象加锁,所以BC两个同步,A与BC异步


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
    public static void main(String[] args) {
        SynchronizedTest3_2 test1 = new SynchronizedTest3_2();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();

        Thread t3 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodC();
            }
        });
        t3.start();
    }
}
```


 
## 修饰在类上

当线程1执行同步代码块时,就会给类添加一个锁,如果代码块不执行完毕,其他线程就不会执行此代码块,线程排队等待


### 例一
static静态方法属于类,第二个方法的代码块synchronized修饰的也是此类,所以同步


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
    public static void main(String[] args) {
        SynchronizedTest4 test1 = new SynchronizedTest4();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();
    }
}
```

### 例二
方法A是修饰对象的锁,方法B是修饰此类的锁,互不影响,所以并行


```java
/**
 * synchronized的对象锁和static synchronized的类锁,
 * 是两个不同的锁,所以是异步,并行运行
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
    public static void main(String[] args) {
        SynchronizedTest5 test1 = new SynchronizedTest5();
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodA();
            }
        });
        t1.start();
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                test1.methodB();
            }
        });
        t2.start();
    }
}
```

## 博客参考
[一个不错的参考](https://blog.csdn.net/luoweifu/article/details/46613015)

## 总结

1. synchronized方法执行的时候,synchronized方法影响的不是方法本身,而是这个类中所有带synchronized的方法,synchronized线程都会等待其执行完成.  如果一个synchronized方法调用另一个synchronized方法,则会造成死锁.
2. 如果两个方法请求的资源互不相干,尽量使用synchronized修饰代码段的方式,如下方式

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