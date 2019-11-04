---
layout:     post
title:     FileFilter和comparable
subtitle:   
date:       2019-07-18
categories: 面试题
author:     miracle
catalog: true
tags:
    - JavaAPI
    - Java多态
---

* content
{:toc}

## listFiles(FileFilter)

```java
public void testMethod14() {
		File file = new File("D:/aa");
		if (file.exists()) {
			File[] fs = file.listFiles(new FileFilter(){
				//回调函数
				@Override
				public boolean accept(File pathname) {
					
					return pathname.getName().endsWith(".txt");//过滤的条件
				}
			});
			for (File f : fs) {
				System.out.println(f);
			}
		} else {
			System.out.println("目录不存在");
		}
	}
```
过滤后的文件以数组存进fs里,该方法参数是FileFilter接口的子类,子类重写了接口accept方法,listFiles方法中调用了FileFilter的accept方法,参数用匿名内部类的方式重写accept方法,参数表示该目录下的文件对象
```java
 public File[] listFiles(FileFilter filter) {
        String ss[] = list();
        if (ss == null) return null;
        ArrayList<File> files = new ArrayList<>();
        for (String s : ss) {
            File f = new File(s, this);
            if ((filter == null) || filter.accept(f))
                files.add(f);
        }
        return files.toArray(new File[files.size()]);
    }
```
这是回调函数,多态的典型

## listFiles(FilenameFilter)

```java
	public void testMethod15() {
		File file = new File("D:/aa");
		if (file.exists()) {
			File[] fs = file.listFiles(new FilenameFilter(){

				@Override
				public boolean accept(File dir, String name) {
					
					return name.endsWith("txt");
				}});
			for (File f : fs) {
				System.out.println(f);
			}
		} else {
			System.out.println("目录不存在");
		}
	}

}
```

过滤后的文件以数组存进fs里,该方法参数是FilenameFilter接口的子类,子类重写了接口accept方法,listFiles方法中调用了FileFilter的accept方法,参数用匿名内部类的方式重写accept方法,accept有两个参数,第一个参数表示路径,第二个参数表示文件名
看源码

```java
 public File[] listFiles(FilenameFilter filter) {
        String ss[] = list();
        if (ss == null) return null;
        ArrayList<File> files = new ArrayList<>();
        for (String s : ss)
            if ((filter == null) || filter.accept(this, s))
                files.add(new File(s, this));
        return files.toArray(new File[files.size()]);
    }
```

这是多态,回调函数的典型








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
		int value = this.getName().compareTo(o.getName());
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

## 总结  
 如果有一种排序原则,用Comparable接口
 如果有多种比较原则,就用Comparator接口


| 参数 | Comparable | Comparator |
| :------ |:--- | :--- |
| 排序逻辑 | 排序逻辑必须在待排序对象的类中，故称之为自然排序 | 排序逻辑在另一个实现 |
| 实现 | 实现Comparable接口 | 实现Comparator接口 |
| 排序方法 | int compareTo(Object o1) | int compare(Object o1,Object o2) |
| 触发排序 | Collections.sort(List) | Collections.sort(List, Comparator) |
| 接口所在包 | java.lang.Comparable | java.util.Comparator |


