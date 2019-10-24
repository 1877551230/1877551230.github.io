---
layout:     post
title:      集合排序(Comparator和Compareble)
subtitle:   
date:       2019-07-16
categories: Java
author:     miracle
catalog: true
tags:
    - JavaAPI
---

## Collection和Collections的区别

 **Collection接口**:是List和Set的父接口,接口中规范了List和Set集合的操作方式  
 **Collections类**:在类中有很多方法,这些方法都是用来操作集合的,可以看成是集合的工具类,且很多方法是静态方法

## 集合的排序:

### List集合排序

1. Collections.sort(List);  
 sort方法的参数是一个List集合,对List集合中的数据排序  
 如果List集合中的元素每个元素内部只有一个数据,就直接比较即可,前提要保证元素中的数据类型必须重写compareTo方法  
 如果List集合中的元素中的每个元素内部有很多其他数据,就需要把元素的类型实现Comparable接口,并重写compareTO方法,在此方法中指定排序的原则
2. Collections.sort(List,Comparator);
 sort方法的参数有两个,一个是要排序的list数据,另一个参数是比较器接口Comparator,在此比较器中指定要排序的原则,使用比较器的方式就不用对要比较的集合中的元素类型实现Comparable接口
 可以实现多个比较器,每个比较器对应一种排序原则

### 总结  
 如果有一种排序原则,用Comparable接口
 如果有多种比较原则,就用Comparator接口


| 参数 | Comparable | Comparator |
| :------ |:--- | :--- |
| 排序逻辑 | 排序逻辑必须在待排序对象的类中，故称之为自然排序 | 排序逻辑在另一个实现 |
| 实现 | 实现Comparable接口 | 实现Comparator接口 |
| 排序方法 | int compareTo(Object o1) | int compare(Object o1,Object o2) |
| 触发排序 | Collections.sort(List) | Collections.sort(List, Comparator) |
| 接口所在包 | java.lang.Comparable | java.util.Comparator |

## Comparable

Comparable接口只有一个方法--CompareTo()方法  

```java
package java.lang;
import java.util.*;
public interface Comparable<T> {
    public int compareTo(T o);
}
```

* 若x.compareTo(y) <0，则x<y;若x.compareTo(y) =0，则x=y;若x.compareTo(y) >0，则x=y;

```java
public void sortString(){
		ArrayList<String> strs = new ArrayList<String>();
		strs.add("hjk");
		strs.add("bcd");
		strs.add("wqr");
		strs.add("efg");
		strs.add("qaz");
		System.out.println("----------------原始循序----------------");
		for(String str:strs){
			System.out.println(str);
		}
		System.out.println("---------------开始循序----------------");
		Collections.sort(strs);
		System.out.println("---------------经过排序后输出----------------");
		for(String str:strs){
			System.out.println(str);
		}
	}
```
sort方法中使用了List中重写的compareTo方法,因为List已经实现了这个方法,所以就不用自己去实现了,当参数是List类型时,就会调用这个方法,实现排序  

**如果传入自己写的类类型怎么办?   是需要自己在类中重写compareTo方法的**

```java
public void sortStudent(){
		ArrayList<Student> students = new ArrayList<Student>();
		Student stu1 = new Student("zhangsan",20,"S001");
		Student stu2 = new Student("lisi",21,"S002");
		Student stu3 = new Student("wangwu",22,"S003");
		students.add(stu1);
		students.add(stu2);
		students.add(stu3);
		System.out.println("-----------------排序前------------------");
		for(Student stu : students){
			System.out.println("name="+stu.getName()
			+"age="+stu.getAge()
			+"stuNo="+stu.getStuNo());
		}
		System.out.println("-----------------开始排序------------------");
		Collections.sort(students);
		System.out.println("-----------------排序后------------------");
		for(Student stu : students){
			System.out.println("name="+stu.getName()
			+"age="+stu.getAge()
			+"stuNo="+stu.getStuNo());
		}
	}
```

Collections.sort(Student),Student重写compareTo方法

```java
@Override
	public int compareTo(Student o) {
		//给name排序
		int value = this.getName().compareTo(o.getName());//
		//给年龄排
		//int value = this.getAge()-o.getAge();
		//给stuNo排序
		//int value = this.getStuNo().compareTo(o.getStuNo());
		return value;
	}
```

## Comparator

* Comparator需要实现compare方法,用匿名内部类方式实现此方法,此方法是Comparator接口的方法  
* compare若compare(x,y) <0，则x<y;若compare(x,y) =0，则x=y;若compare(x,y)>0，则x=y;

```java
//此方法是为了获取一个List集合
	public List<Teacher> getTeachers(){
		ArrayList<Teacher> teachers = new ArrayList<Teacher>();
		Teacher tea1 = new Teacher("zhangsan",21,18000);
		Teacher tea2 = new Teacher("lisi",20,19000);
		Teacher tea3 = new Teacher("王五",22,20000);
		teachers.add(tea1);
		teachers.add(tea2);
		teachers.add(tea3);

		return teachers;
	}
	//排序,根据指定Comparator的排序原则,按名称排序的策略实现
	public void sortName(List<Teacher> teachers){
		Collections.sort(teachers,new Comparator<Teacher>(){

			@Override
			public int compare(Teacher o1, Teacher o2) {
				int value = o1.getName().compareTo(o2.getName());
				return value;
			}});
	}
	//排序,根据指定Comparator的排序原则,按年龄排序的策略实现
	public void sortAge(List<Teacher> teachers){
		Collections.sort(teachers,new Comparator<Teacher>(){

			@Override
			public int compare(Teacher o1, Teacher o2) {
				int value = o1.getAge()-o2.getAge();
				return value;
			}});
	}
	//排序,根据指定Comparator的排序原则,按工资排序的策略实现
		public void sortSalary(List<Teacher> teachers){
			Collections.sort(teachers,new Comparator<Teacher>(){

				@Override
				public int compare(Teacher o1, Teacher o2) {
					int value = o1.getSalary()-o2.getSalary();
					return value;
				}});
		}
```





