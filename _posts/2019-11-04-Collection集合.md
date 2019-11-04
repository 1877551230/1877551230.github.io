Collection

java的集合主要按两种接口分类:
* set
* map

Collection是一个接口,主要有两个分支,List和Set.  
List和Set都是接口,继承与Collection.List是有序的队列,List中可以有重复的元素,Set是数学概念中的集合,没有重复的元素.  

## Collection介绍
1. 集合的特点:
 * 集合中存储的元素是对象.
 * 集合的长度是可变的.
 * 集合不可以存储基本数据类型.
2. 集合是用于存储对象的容器,而每种容器内部都有其独特的数据结构,正因为不同的容器内部数据结构不同,使其有自己的使用场景,虽然每个容器都有其独特的结构,但是类似的容器还是存在共性的,所以这些共性方法被不断抽取,最终形成了集合框架体系.
3. 与数组的区别:
元素的类型可以不一致,长度可变.
4. 从继承关系和源码分析:
Collection继承了Iterator接口.在java1.8中包含了18个方法.  
* add(E e) 返回值是boolean
* addAll(Collection<? extends E> c) 返回值是boolean.
* clear() 返回值是void
* contains(object o) 如果包含返回为true
* contains(Collection<? extends E> c) 包含集合c返回true
* equals(object o) 
* hashCode 返回值是int,返回哈希码
* isEmpty() 如果为空返回true
* itreator() 返回迭代器
* remove(object o)返回类型是boolean
* removeIf(Predicate<? super E> filter) 删除满足条件的元素
* removeAll(Colletion<?> c) 删除包含集合c的所有元素
* size() 返回类型是int
* toArray().返回值是object[] ,将集合转换为数组
* stream() 返回类型是stream<E> 返回顺序流
* spliterator() 分割迭代器,1.8加入的可并行迭代

## Collection的遍历
1. for循环遍历
2. 迭代器遍历

```java
Iterator<String> it=Collection.iterator();
while(it.hasNext()){
System.out.println(it.next());
}
```

## List

List是有序的队列,每一个元素都有一个索引,第一个元素的索引值是0,一次增加,不可有重复的元素

## set

set没有重复的元素

## Vector

继承了AbstractList,实现了List,RandomAccess,Cloneable,Serialiazable  
1. 线程安全
2. 可以指定增长因子,如果增长因子制定了,扩容的时候每次新的数组大小会增加,否者就原数组大小*2;

```java
int newCapacity=oldCapacity+((capacityIncrement>0)? capacityIncrement:oldCapacity);
```

## ArrayList

继承了AbstractList,实现了List,RandomAccess,Cloneable,Serialiazable  
1. 线程不安全.
2. 如果不指定初始容量10
3. 本质上是一个可改变大小的数组,元素顺序存储,随机访问快,删除头尾元素慢,新增元素慢切浪费资源,如果不是需要可变数组,建议使用数组.
4. 扩容为原来的1.5倍

## LinkedList

是一个双链表,再添加和删除元素时具有比ArrayList更好的性能,但在get,set弱于ArrayList,适用于有大量的增加删除.随机访问慢,删除操作快,允许null元素,非线程安全。
1. 链表不能通过索引访问元素
2. 在插入和删除的时候效率高
3. 除了实现了LIst接口外,海在列表的开头和结尾get.remove,insert元素提供了统一的命名方法,这些操作可以将链表当做栈,队列和双端队列来使用.
4. 线程不安全


