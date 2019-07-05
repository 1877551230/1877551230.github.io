---
layout:     post
title:      linux系统安装python
subtitle:   
date:       2018-07-03
categories: Linux
author:     miracle
catalog: true
tags:
    - Linux
---


ubuntu把python3.5升级为3.7 下载 wget https://www.python.org/ftp/python/3.7.1/Python-3.7.1rc2.tgz  

解压  
tar zxvf Python-3.7.1rc2.tgz  
cd Python-3.7.1rc2  
 
编译  
./configure  
make  
make install  
   
先找的python3.7解释器位置，一般是  
/usr/local/bin/python3.7  
 
删除原来的软连接  
rm -rf /usr/bin/python3  
rm -rf /usr/bin/pip3  
 
添加python3的软链接  
ln -s /usr/local/bin/python3.7 /usr/bin/python3  
添加 pip3 的软链接  
ln -s /usr/local/bin/pip3.7 /usr/bin/pip3  

sudo apt autoremove  
清理  