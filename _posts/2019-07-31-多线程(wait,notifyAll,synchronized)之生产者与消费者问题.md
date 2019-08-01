---
layout:     post
title:      多线程(wait,notifyAll,synchronized)之生产者与消费者问题
subtitle:   
date:       2019-07-31
categories: Java
author:     miracle
catalog: true
tags:
    - Java多线程
---

* content
{:toc}

1. wait()
该方法用来将当前线程置入休眠状态，直到在其他线程调用此对象的notify()方法或notifyAll()方法将其唤醒。  

在调用wait()之前，线程必须要获得该对象的对象级别锁，因此只能在同步方法或同步块中调用wait()方法。进入wait()方法后，当前线程释放锁。在从wait()返回前，线程与其他线程竞争重新获得锁。如果调用wait()时，没有持有适当的锁，则抛出IllegalMonitorStateException，它是RuntimeException的一个子类，因此，不需要try-catch结构。

2. notify()
该方法唤醒在此对象监视器上等待的单个线程。如果有多个线程都在此对象上等待，则会随机选择唤醒其中一个线程，对其发出通知notify()，并使它等待获取该对象的对象锁。注意“等待获取该对象的对象锁”，这意味着，即使收到了通知，wait的线程也不会马上获取对象锁，必须等待notify()方法的线程释放锁才可以。和wait()一样，notify()也要在同步方法/同步代码块中调用。  

总结两个方法：wait()使线程停止运行，notify()使停止运行的线程继续运行。



## 题目

生产和消费产品,仓库的总量为1000,不能超过仓库总量,当库存为0时,不能消费.每次可以消费和生产随机数的产品

###思路

一个线程作为生产者  
一个线程作为消费者  
仓库最大容量为1000  
库存==1000时,生产线程进入等待,消费者消费任意数额,唤醒生产者
库存==0时,消费线程进入等待,生产者生产任意数额,唤醒消费者

##解答

### 定义产品类
产品可以添加属性,我没有添加

Product.java

```java
public class Product {

    public Product(){

    }
}
```

### 定义仓库类
仓库有消费(出库)和生产(入库方法),有一个集合用来存放产品,集合的大小即产品库存数量

Repertory.java

```java
public class Repertory {
    public int i;//产生随机数(随机消费或生产的个数)

    /**
     * 定义Product对象的集合
     */
    public LinkedList<Product> store = new LinkedList<Product>();
    public LinkedList<Product> getStore(){
        return store;
    }
    public void setStore(LinkedList<Product> store){
        this.store = store;
    }
    /**
     * 生产者方法
     * push用于生产
     * 加线程锁是当有多个生产线程时,为了防止数据覆盖所以加锁
     */
    public synchronized void push(Product p,String ThreadName){
    /*
    *当库存等于1000时,进入等待
    */
        while (store.size()==1000){
            System.out.println("仓库已满,先卖点去");
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        /*
        *如果此时库存为0,则消费者已经进入等待状态
        *库存不等于1000个时,唤醒消费线程进行消费
        *消费者进行生产,如果此时生产个数为0,消费者得到cpu会再次进入等待状态
        *生产者会继续生产,直到生产大于0个,双方并发执行
        */
        this.notifyAll();
        /**
         * 把生产的产品添加进入仓库
         */
        i=new Random().nextInt(1000);
        int count=0;
        for (int j = 0; j < i; j++) {
            if (store.size()<1000){
            store.addLast(p);
            count++;
            }else{
                break;
            }

        }

        System.out.println(ThreadName+"生产了"+count+"个产品");
        System.out.println("当前剩余:"+store.size());
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     *消费者方法
     * pop用于消费
     * 加线程锁是当有多个消费线程时,为了防止数据覆盖所以加锁
     */
    public synchronized void pop(String threadName){
    /*
    *当库存等于0个时,进入等待状态
    */
        while(store.size()==0){
            System.out.println("卖完了,生产去吧");
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        //当库存不等于0个时,唤醒生产线程进行生产
            this.notifyAll();
            /**
             * 把消费的产品移出仓库
             */
            i=new Random().nextInt(1000);
            int count=0;
            for (int j = 0; j < i; j++) {
                if (store.size()>0){
                    store.removeLast();
                    count++;
                }else{
                    break;
                }

            }
            System.out.println(threadName+"消费了"+count+"件商品");
            System.out.println("当前剩余:"+store.size());
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

    }
}
```

## 生产者类
生产者需要获取仓库产品的数量,给生产者传仓库类的参数并调用仓库类的生产方法

Producer.java

```java
public class Producer implements Runnable {
    Repertory repertory = null;
    public Producer(Repertory repertory){
        this.repertory = repertory;
    }

    @Override
    public void run() {
        while(true){
                Product product = new Product();
                repertory.push(product,Thread.currentThread().getName());
        }
    }
}

```

## 消费者类

消费者需要获取仓库产品的数量,给消费者传仓库类的参数并调用仓库类的消费方法

Consumer.java

```java
public class Consumer implements Runnable {
    Repertory repertory = null;
    public  Consumer(Repertory repertory){
        this.repertory = repertory;
    }
    @Override
    public void run() {
        while(true){
            repertory.pop(Thread.currentThread().getName());
        }

    }
}
```

## 测试类

Test.java

```java
public class Test {
    public static void main(String[] args) {
        Repertory repertory = new Repertory();
        Producer producer = new Producer(repertory);
        Consumer consumer = new Consumer(repertory);
        Thread t1 = new Thread(producer);
        Thread t2 = new Thread(consumer);
        Thread t3 = new Thread(producer);
        Thread t4 = new Thread(consumer);
        t2.start(); 
        t1.start();
        t3.start();
        t4.start();
        

    }

}
```
