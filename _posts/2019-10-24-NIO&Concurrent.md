---
layout:     post
title:      NIO&Concurrent
subtitle:   
date:       2019-10-24
categories: 大数据
author:     miracle
catalog: true
tags:
    - 并发
---

* content
{:toc}


## 概览

1. NIO的作用:进行数据的传输
2. IO分类:
a. BIO-BlockingIO 同步阻塞式IO  
b. NIO-NewIO-NonBlockingIO 同步非阻塞IO jdk1.4  
c. AIO-AsynchronousIO-异步非阻塞式IO-jdk1.8 NIO2
3. NIO的组件:Buffer,Channel,Selector

## BIO缺点:

1. 阻塞:导致效率整体降低
2. 一对一的连接:客户端每过来一个请求,那么在服务器端就需要有一个线程去处理这个请求,如果客户端产生大量请求,会导致服务器端也产生大量的线程去处理请求,服务器端的线程数量一旦过多,会导致服务器的卡顿甚至崩溃.
3. 如果客户端连接之后不产生任何操作,依然会占用服务器端的线程,则会导致服务器资源的浪费

## NIO的组件:Buffer,Channel,Selector

### Buffer 缓冲区

1. 作用:存储数据
2. 容器:数组,针对基本类型提供了七种对应的Buffer
ByteBuffer,shortBuffer,IntBuffer,LongBuffer,FloatBuffer,DoubleBuffer,CharBuffer
3. 重要位置
a. capacity:容量位 用于标记缓冲区的大小  
b. limit:限制位 用于限制操作位能达到的最大位置,缓冲区刚创建时,limit和capacity重合  
c. position:操作位 类似于数组的下标,用于执行要读写的位置,默认为0  
d. mark:标记位 往往是确定数据没有问题的前提下进行标记,后续操作如果出错,从标记位重新开始即可,默认为-1  
4. 重要操作
filp:翻转缓冲区

```java
 public final Buffer flip() {
        limit = position;
        position = 0;
        mark = -1;
        return this;
    }

```

clear:清空缓冲区  
reset:重置缓冲区  
rewind:重绕缓冲区  

```java
//创建缓冲区并且添加初始元素
		//指定了缓冲区的初始元素以及长度
		ByteBuffer buffer=ByteBuffer.wrap("Hello".getBytes());
		//缓冲区的position现在是多少
		//无论用什么方式创建的缓冲区,默认初始位置都是0
		//System.out.println(buffer.position());
		//buffer.put("a".getBytes());//会覆盖h
		
		byte[] arr=buffer.array();//获取顶层的字节数组
		System.out.println(new String(arr,0,buffer.limit()));
```


### Channel 通道

1. 作用: 传输数据
2. 分类
a. 文件-FileChannel  
b. UDP-DatagramChannel  
c. TCP-SocketChannel,ServerSocketChannel
3. 通道默认是阻塞的
4. 通道可以进行双向传输

```java
//创建客户端的通道
		SocketChannel s=SocketChannel.open();
		//设置为非阻塞
		s.configureBlocking(false);
		//发链接
		//连接过程在BIO中会产生阻塞
		s.connect(new InetSocketAddress("localhost",8070));
		
		//判断连接是否建立
		while(!s.isConnected()){
			//如果没有连上,试图再次连接
			//如果连接多次依然失败,则意味着这个连接无效
			//finishConnect底层会自动计数,计数多次依然失败,则抛出异常
			s.finishConnect();
		}
		
		//发送数据
		s.write(ByteBuffer.wrap("hello server".getBytes()));
		Thread.sleep(10);
		//接收数据
		ByteBuffer dst=ByteBuffer.allocate(1024);
		s.read(dst);
		System.out.println(new String(dst.array(),0,dst.position()));
		//关流
		s.close();
```

```java
public class Server {
	public static void main(String[] args) throws IOException, InterruptedException {
		//开启服务器端的通道
		ServerSocketChannel ssc=ServerSocketChannel.open();
		//绑定接收端口
		ssc.bind(new InetSocketAddress(8070));
		//设置非阻塞
		ssc.configureBlocking(false);
		//接收连接
		SocketChannel sc=ssc.accept();
		//判断连接是否接收
		//服务器端是否要计数-不用
		while(sc==null)
			sc=ssc.accept();
		//接收数据
		ByteBuffer buffer = ByteBuffer.allocate(1024);
		sc.read(buffer);
		buffer.flip();
		System.out.println(new String(buffer.array(),0,buffer.limit()));
		//打回数据
		sc.write(ByteBuffer.wrap("数据已经收到".getBytes()));
		Thread.sleep(10);
		//关流
		ssc.close();
	}
}
```


### Select-多路复用选择器
1. 作用:选择事件
2. 选择器是面向通道进行操作,但是选择器要求必须是非阻塞的
3. 利用选择器,可以实现一对多的效果

```java
// 开启服务器端的通道
		ServerSocketChannel ssc = ServerSocketChannel.open();
		// 绑定端口
		ssc.bind(new InetSocketAddress(8070));
		// 将通道设置为非阻塞
		ssc.configureBlocking(false);
		// 开启选择器
		Selector selc = Selector.open();
		// 将服务器注册到选择器上
		ssc.register(selc, SelectionKey.OP_ACCEPT);
		while (true) {
			// 进行选择
			selc.select();
			// 获取选择出来的事件
			Set<SelectionKey> set = selc.selectedKeys();
			// 遍历集合,根据事件不同类型进行处理
			Iterator<SelectionKey> it = set.iterator();
			while (it.hasNext()) {
				SelectionKey key = it.next();
				//需要注意的是,key表示的是一个事件
				// 可接受
				if (key.isAcceptable()) {
					//真正要完成accept操作需要依靠通道来完成
					//从这个事件需要进行accept的通道
					ServerSocketChannel sscx=(ServerSocketChannel) key.channel();
					//接收连接
					SocketChannel sc=sscx.accept();
					//需要给这个通道注册可读或者可写事件
					//如果既需要注册可读,又需要注册可写
					//在注册的时候,后注册的事件会把之前的事件覆盖掉
					//将sc设置为非阻塞
					sc.configureBlocking(false);
					sc.register(selc, SelectionKey.OP_WRITE|SelectionKey.OP_READ);
				}
				// 可读
				if (key.isReadable()) {
					//先从事件中获取通道
					SocketChannel sc=(SocketChannel) key.channel();
					//读数据
					ByteBuffer dst=ByteBuffer.allocate(1024);
					sc.read(dst);
					System.out.println(new String(dst.array(),0,dst.position()));
					//注销read事件
					//sc.register(selc, key.interestOps()-SelectionKey.OP_READ);
					sc.register(selc, key.interestOps()^SelectionKey.OP_READ);
				}
				// 可写
				if (key.isWritable()) {
					//从事件中获取通道
					SocketChannel sc=(SocketChannel)key.channel();
					//写出数据
					sc.write(ByteBuffer.wrap("hello client".getBytes()));
					//注销write事件
					sc.register(selc, key.interestOps()^SelectionKey.OP_WRITE);
				}
				//移除
				it.remove();
```

## Concurrent
概述:  
Concurrent包是jdk1.5提供的一个应对高并发的包  
包含5块主要内容:  
BlockingQueue ConcurrentMap ExecutorService Lock Atomic操作 

## BlockingQueue 阻塞式队列

### 概述

1. 满足队列的特性:FIFO
2. 阻塞式队列是有界的,即大小固定不变
3. 阻塞:
a. 如果队列已满,则新添元素的线程会被阻塞  
b. 如果队列为空,则获取元素的线程会被阻塞
4. 
| 操作 | 抛异常 | 阻塞 | 返回特殊值 | 定时阻塞 |
| :------ |:--- | :--- |
| 添加 | add | put | offer(boolean) | offer(,,) |
| 获取 | remove | poll | take | poll(,) |

5. BlockingQueue中不允许存储null
6. 使用场景:生产消费
### 实现类
1. ArrayBlockingQueue-阻塞式顺序队列
a. 底层是基于数组来存储数据  
b. 使用的时候需要指定容量
2. LinkedBlockingQueue-阻塞式链式队列
a. 操作和ArrayBlockingQueue是一样的  
b. 底层是基于节点来存储数据  
c. 在使用的时候可以不指定容量,如果不指定则容量默认为Integer.MAX_VALUE,也因为这个容量比较大,导致在使用过程中很少会将这个队列放满,所以一般会认为这个队列是无界的
3. PriorityBlockingQueue 具有优先级的阻塞之队列
a. 可以不指定容量,如果不指定,默认容量是11  
b. 在遍历队列的时候,会对元素进行自然排序,要求元素对应的类要实现Comparable接口  
c. 如果使用迭代遍历,则不保证排序
4. SynchronousQueue-同步队列
a. 使用的时候不需要指定容量,默认容量为1并且只能为1  
b. 一般称这个队列是数据的汇合点

## BlockingDeque 阻塞式双端队列
允许双向进出

## ConcurrentMap 并发映射

1. 是JDK1.5提供的一套用于应对高并发的映射,并且在并发过程中能保证线程安全

### ConcurrentHashMap-并发哈希映射
1. 底层基于数组+链表结构
2. 初始容量为16,加载因子是0.75,默认扩容是增加一倍
3. ConcurrentHashMap采用的是分段/桶锁机制,用来保证读写效率
4. ConcurrentHashMap在后续版本中,在分段锁的基础上引入了读写锁机制:
a. 读锁:允许多个线程读,不允许写  
b. 写锁:只允许一个线程写,不允许线程读
5. 在jdk1.8中,为了避免锁所带来的开销,引入了CAS(Compare And Swap)无锁算法
CAS需要和计算机具体的内核架构相关
6. 在jdk1.8中,ConcurrentHashMap为了提高效率引入了红黑树机制
7. 红黑树:
a. 本质是一颗自平衡二叉查找树
b. 二叉查找树:  
 可以将二叉查找树理解为二分查找的空间结构  
 要求左＜根＜右
c. 特点
 所有节点非红即黑  
 根节点为黑  
 红节点的子节点一定为黑,黑节点的子节点可以为黑,可以为红  
 最下层的叶子节点一定是黑色的空节点  
 从根节点到任意一个叶子节点所经过的路径中的黑色节点个数要一致,即黑色节点高度是一致的
 新添的节点颜色为红
d. 修正: 红黑树一旦产生修正,一定是父子节点都为红  
 涂色:叔父节点为红,那么将父节点以及叔父节点涂黑,将祖父节点涂红
 左旋:叔父节点为黑,并且当前节点为右子叶,需要以当前节点为轴,进行左旋
 右旋:叔父节点为黑,并且当前节点为左子叶,以父节点为轴进行右旋

 
### ConcurrentNavigableMap-并发导航映射

1. 提供了截取子映射方法
2. 本身是一个接口,所以使用的是实现类ConcurrentSkipListMap-并发跳跃表映射
3. ConcurrentSkipListMap底层基于跳跃表来实现的
 map.headMap("r")  从头开始,截取到指定的键,不包含最后  
 map.tailMap("r")  从指定的键开始,截取到末尾  
 map.subMap("d", "r")  从指定键开始,截取到指定位置结束  
4. 跳跃表:
 a. 适合于查询多的场景
 b. 要求元素必须有序
 c. 跳跃表允许层层提取,但是最上层的跳跃表中的元素个数至少是2个
 d. 跳跃表是一个典型的以空间换时间的产物
 e. 在跳跃表中,新添的元素是否提取到上层的跳跃表中,遵循抛硬币原则
 f. 跳跃表的时间复杂度是O(logn)

## ExecutorService 执行器服务
概述: 
1. 线程池的意义:为了避免大量线程的创建和销毁,做到线程的复用
2. 线程池在定义好之后,里面没有任何线程
3. 每过来一个请求,会创建一个核心线程去处理这个请求
4. 核心线程在处理完请求之后并不会被销毁,而是等到下一个请求
5. 只要核心线程没有达到指定的数量,过来的每一个请求都回去创建一个新的核心线程
6. 当核心线程被全部占用,则后来的请求会被放入工作队列中
7. 如果工作队列满了,则后来的请求会交给临时线程处理
8. 临时线程在处理完请求之后,存活指定一段时间,这段时间内如果没有新的请求则该临时线程被销毁
9. 即使临时线程有空闲,也不会从工作队列中获取请求执行
10. 如果临时线程被全部占用,后来的请求会交给拒绝执行处理器进行拒绝处理

```java
        //corePoolSize 核心线程数量
		//maximumPoolSize 最大线程数 =核心线程数+临时线程数
		//keepAliveTime 存活时间
		//unit 单位
		//workQueue 工作队列
		//handler 拒绝执行处理器
			ExecutorService es=new ThreadPoolExecutor(5, 10, 5, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(5),new RejectedExecutionHandler() {
			
			@Override
			public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
				System.out.println("拒绝你"+r);
				
			}
		});
```

```java
//特点:
		//1.没有核心线程
		//2.临时线程的数量是Integer.Max_value,由于单台服务器所能承载线程数量远远达不到这个值,所以认为这个线程池无限大
		//3.工作队列是一个同步队列
		//大池子小队列
		//使用场景:高并发短任务
		//实际场景中,在测试阶段会填充一个无用的空请求
		ExecutorService es=Executors.newCachedThreadPool();
```
**callable**

```java
//特点:
		//1.没有临时线程,都是核心线程
		//2.工作队列是阻塞式链式队列,没有指定容量,则意味着可以存储无限多的请求
		//小池子大队列
		//使用场景:并发少,长任务  云盘 下载队列
		ExecutorService es=Executors.newFixedThreadPool(5);
		//Callable只能通过线程池启动
		//将返回结果封装成了Future
		Future<String> f=es.submit(new CDemo());
		//将结果从Future中解析出来
		System.out.println(f.get());
		es.shutdown();
		
	}
}
//表示返回值类型
class CDemo implements Callable<String>{

	@Override
	public String call() throws Exception {
		
		return "Success";
	}
	
}
```


## ScheduledExecutorService:定时执行器服务

```java
//这个方法不能起到定时效果
		//ses.submit(x);
		//推迟指定时间执行
		//ses.schedule(new ScheduledThread(), 5, TimeUnit.SECONDS);
		//每隔五秒执行一次
		//如果线程执行时间大于间隔时间,则以执行时间为准
		ses.scheduleAtFixedRate(new ScheduledThread(), 0, 5, TimeUnit.SECONDS);//从上一次执行开始计时
		//ses.scheduleWithFixedDelay(new ScheduledThread(), 0, 5, TimeUnit.SECONDS);//从上一次结束开始计时
```




## Callable
1. 不同于Runnable的地方在于,Callable有返回结果,Callable的泛型表示的返回值类型,会将结果封装成Future对象
2. Runnable和Callable的区别
  Runnable  
   没有返回值  
   通过Thread启动  
   通过线程池调用execute或submit  
   不允许抛出异常,也就不能使用全局容错机制  
  Callable  
   通过泛型规定返回值类型   
   只能通过submit  
   允许抛出异常,所以可以使用全局容错机制,例如spring中的异常通知

## 分叉合并池
1. 分叉:将一个大的任务分割成多个小的任务,这个小的任务都对应一个线程
2. 合并:将分出去的小任务的计算结果进行汇总
3. 分叉合并能够有效的提高cpu的利用率
4. 当数据量越大的时候,分叉效率越高
5. 分叉合并为了避免慢任务带来的效率降低问题,采用了work-stealing(工作窃取)策略来解决,即当一个核上的任务执行完成之后,并不会空闲下来,而是会随机的扫描一个核,然后从这个核的任务队列尾端偷取一个任务回来执行

```java
public class ForkJoinPoolDemo {
	public static void main(String[] args) throws InterruptedException, ExecutionException {
//		long sum=0;
//		
//		for(long i=1;i<10000000000000000L;i++){
//			sum+=i;
//			System.out.println(sum);
//		}
		ForkJoinPool pool=new ForkJoinPool();
		Future<Long> f =pool.submit(new Sum(1,100000000000L));
		System.out.println(f.get());
		pool.shutdown();
	}
}
class Sum extends RecursiveTask<Long>{
	private long start;
	private long end;
	public Sum(long start, long end) {
		super();
		this.start = start;
		this.end = end;
	}
	//进行分叉合并
	@Override
	protected Long compute() {
		if(end -start <=10000){
			long sum=0;
			for(long i=start; i<=end;i++){
				sum+=i;
			}
			return sum;
		}else{
			long mid=(start+end)/2;
			Sum left=new Sum(start,mid);
			Sum right=new Sum(mid+1,end);
			//分叉
			left.fork();
			right.fork();
			//合并
			 return left.join()+ right.join();
		}
		
	}
}
```


Lock锁
概述
1. synchronized虽然能通过锁对象来保证线程安全的问题,但是这个关键字在使用的时候并不灵活,因此在jdk1.5中,提供了一个单独的接口Lock
2. 公平和非公平策略:
 a. 公平策略下抢占的是入队顺序,非公平策略下抢占的是资源使用
 b. 非公平策略的效率会更高
 c.默认情况下,锁采用的是非公平策略
3. 读写锁:ReadWriteLock-ReentrantReadWriteLock

```java
public class LockDemo {
	static int i=0;
	public static void main(String[] args) throws InterruptedException {
		Lock l=new ReentrantLock();
		new Thread(new Add(l)).start();
		new Thread(new Add(l)).start();
		Thread.sleep(3000);
		System.out.println(i);
	}
}

class Add implements Runnable{
	private Lock l;
	
	public Add(Lock l) {
		super();
		this.l = l;
	}

	@Override
	public void run() {
		//加锁
			l.lock();
			for(int i=0;i<10000;i++){
				LockDemo.i++;
			}	
			//解锁
			l.unlock();
		
		
	}
	
}
```


其他
1. CountDownLatch:闭锁/线程递减锁.对线程计数,当被计数的线程结束之后,可以开启其他的任务

```java
public static void main(String[] args) throws InterruptedException {
	CountDownLatch cdl=new CountDownLatch(5);
	new Thread(new Teacher(cdl)).start();
	new Thread(new Student(cdl)).start();
	new Thread(new Student(cdl)).start();
	new Thread(new Student(cdl)).start();
	new Thread(new Student(cdl)).start();
	//在计数归零前,需要让当前线程陷入等待
	cdl.await();
	//放在主函数中
	//在java中主函数所在的类默认就是一个单独的线程
	System.out.println("开始考试");

}
}
class Teacher implements Runnable{
	private CountDownLatch cd1;
	

	public Teacher(CountDownLatch cd1) {
		super();
		this.cd1 = cd1;
	}


	@Override
	public void run() {
		try {
			Thread.sleep((long) (Math.random()*10000));
			System.out.println("老师到");
			//计数减少一个
			cd1.countDown();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
}
class Student implements Runnable{
	private CountDownLatch cd1;
	public Student(CountDownLatch cd1) {
		super();
		this.cd1 = cd1;
	}
	@Override
	public void run() {
		try {
			Thread.sleep((long) (Math.random()*10000));
			System.out.println("考生到");
			//计数减少一个
			cd1.countDown();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
}
```
2. CyclicBarrier:栅栏.所有的线程到达一个点后在分别继续执行

```java
public class CyclicBarrierDemo {
	public static void main(String[] args) {
		CyclicBarrier cb=new CyclicBarrier(6);
		new Thread(new Runner(cb),"1号").start();
		new Thread(new Runner(cb),"2号").start();
		new Thread(new Runner(cb),"3号").start();
		new Thread(new Runner(cb),"4号").start();
		new Thread(new Runner(cb),"5号").start();
		new Thread(new Runner(cb),"6号").start();
	}
}
class Runner implements Runnable{
	private CyclicBarrier cb;
	public Runner(CyclicBarrier cb) {
		super();
		this.cb = cb;
	}
	@Override
	public void run() {
		try {
			Thread.sleep((long) (Math.random()*10000));
			String name=Thread.currentThread().getName();
			System.out.println(name+"远动员到了起跑线");
			//让当前线程进入阻塞,并且减少一
			cb.await();
			System.out.println(name+"运动员跑了出去");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
```

3. exchanger:交换机 用于交换两个线程之间的信息

```java
public class ExchangerDemo {
	public static void main(String[] args) {
		Exchanger<String> ex=new Exchanger<>();
		new Thread(new Producer(ex)).start();
		new Thread(new Consumer(ex)).start();
	}
}
//生产者
class Producer implements Runnable{
	private Exchanger<String> ex;
	 
	public Producer(Exchanger<String> ex) {
		super();
		this.ex = ex;
	}

	@Override
	public void run() {
		String info="商品";
		//生产者需要将商品交换给消费者
		//同时,生产者应该收到消费者换过来的前钱
		//利用交换机来交换数据
		try {
			String msg=ex.exchange(info);
			System.out.println("生产者收到了消费者换过来的:"+msg);
			
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
//消费者
class Consumer implements Runnable{
	private Exchanger<String> ex;
	public Consumer(Exchanger<String> ex) {
		super();
		this.ex = ex;
	}

	@Override
	public void run() {
		String info="钱";
		//消费者需要将钱交还给生产者
		//同时,消费者应该收到生产者换过来的商品
		try {
			String msg=ex.exchange(info);
			System.out.println("消费者收到生产者交换来的"+msg);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
```

4. Semaphore:信号量 用于进行计数阻塞.当有限的资源被全部占用的时候,后续的线程就需要阻塞,知道有资源被释放,则后续的线程可以去抢占执行.信号量在实际开发中的作用适用于进行限流

```java
public class SemaphoreDemo {
	public static void main(String[] args) {
		//表示有五张桌子
		Semaphore s=new Semaphore(5);
		for(int i=0;i<8;i++){
			new Thread(new Eater(s)).start();
		}
	}
}
class Eater implements Runnable{
	Semaphore s;
	
	public Eater(Semaphore s) {
		super();
		this.s = s;
	}

	@Override
	public void run() {
		
		try {
			//表示获取一个信号
			//如果信号减为0,则后续的线程就会被阻塞
			s.acquire();
			//当桌子被占用的时候,意味着可以使用的资源减少,对外暴露的信号减少一个
			System.out.println("过来一个人就餐,占用一张桌子");
			Thread.sleep((long) (Math.random()*10000));
			//当有桌子被空出的时候,就意味着对外暴露的信号多了一个
			//释放被占用信号
			s.release();
			System.out.println("一个人吃完了,空出一个桌子");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
```


## Atomic操作

1. 是对对象进行封装,然后对外提供线程安全的操作而不用再显式的声明锁

```java
public class AtomicDemo {
	//static int i=0;
	//对外提供了很多线程安全的方法来操作该值
	//AtomicInteger在底层会对操作进行加锁
	//Jdk1.8开始,AtomicInteger采用Cas保证线程安全
	static AtomicInteger ai=new AtomicInteger(0);
	//原子性引用类型AtomicReference<V>
	public static void main(String[] args) throws InterruptedException {
		CountDownLatch cd1=new CountDownLatch(3);
		new Thread(new Add(cd1)).start();
		new Thread(new Add(cd1)).start();
		new Thread(new Add(cd1)).start();
		cd1.await();
		System.out.println(ai);
	}
}
class Add implements Runnable{
CountDownLatch cd1;

	public Add(CountDownLatch cd1) {
	super();
	this.cd1 = cd1;
}

	@Override
	public void run() {
		for(int i=0;i<10000;i++){
			//AtomicDemo.i++;
			AtomicDemo.ai.incrementAndGet();//++i
			
		}
		cd1.countDown();
	}
}
```