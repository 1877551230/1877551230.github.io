---
layout:     post
title:      ArrayList的removeIf用法
subtitle:   
date:       2019-07-12
categories: Java
author:     miracle
catalog: true
tags:
    - api
---


public boolean removeIf(Predicate<? super E> filter)
Description copied from interface: Collection
Removes all of the elements of this collection that satisfy the given predicate. Errors or runtime exceptions thrown during iteration or by the predicate are relayed to the caller.
Specified by:
removeIf in interface Collection<E>
Parameters:
filter - a predicate which returns true for elements to be removed
Returns:
true if any elements were removed


```java
//策略设计模式,匿名内部类
	/**
	 * 基于指定的条件删除集合中的数据
	 * 多态,Perdicate接口作为函数的参数
	 * 策略 每一个Predicate接口的子实现都是一种实现
	 * 回调函数  
	 * @param allPerson
	 */
	public void deletePersonByIf1(ArrayList allPerson){
		boolean flag = allPerson.removeIf(new Predicate(){
			//回调函数
			@Override
			public boolean test(Object t) {
				boolean flag = false;
				if(t instanceof CommonPerson){
					CommonPerson cp = (CommonPerson)t;
					if(cp.getName().startsWith("张")){
						flag = true;
					}
				}
				return flag;
			}
			
		});
	}
```
removeIf的参数是接口类型  
removeIf在调用时,用匿名内部类的方式,重写实现接口Predicate里的test方法  
test是boolean类型,判断条件满足时返回true  

进入removeIf源代码,会发现有这样一个判断

```java
if (filter.test(element)) {
     removeSet.set(i);
     removeCount++;
    }
```

Perdicate的子类对象打点调用test方法,test返回值是自己重写后的boolean类型的值,符合的就被删除了  
回调本质还是多态,长辈类作为参数,不同的子类重写方法来调用.  
如果对于匿名内部类不太熟悉,可以看这篇文章  
[匿名内部类思考](https://1877551230.github.io/2019/07/10/%E5%86%85%E9%83%A8%E7%B1%BB%E6%80%9D%E8%80%83/)

---

如果你看不懂什么是回调函数,我举个简单的例子

先定义个接口或父类抽象类,里面有一个抽象方法test,这个方法在其他类中会使用

```java
public interface Type {
	public String test();

}

```
做一个超人类,它的参数是上面定义的接口,因为接口是参数,符合多态的特点,用接口调用了test方法

```java
public class SuperMan{

	public static void fight(Type method){
		System.out.println("超人练出了新的技能,发动"+method.test());
	}

}
```
做一个战斗类,超人通过战斗方法来战斗,战斗方法的参数是Type接口,战斗方法调用了Type的test方法,所以此时重写test方法,就完成不同的战斗方式,下面用匿名内部类的方式重写test方法,代码复用性更高,逻辑越复杂时,好处越明显,我只是为了举例,代码很简单就不必要用这种方法

```java
public class Fight {
	public static void main(String[] args) {
		SuperMan.fight(new Type(){

			@Override
			public String test() {
				
				return "宇宙无敌激光波";
			}
			
		});
		SuperMan.fight(new Type(){

			@Override
			public String test() {
				
				return "三十六计,跑为上技";
			}
			
		});
	}

}
```
