---
layout:     post
title:     FileFilter和FilenameFilter
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


