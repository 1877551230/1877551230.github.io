## 登陆

表单被提交时,触发事件,ajax向后端发送请求

```js
$(function(){
	//给form表单添加submit事件
	$("form").submit(function(){
		return login();
	});
});
function login(){
	//获取页面数据
	var adminName=$("form input[name=adminName]").val();
	var adminPassword=$("form input[name=adminPassword]").val();
	$.ajax({
		url:"http://www.ms.com/user/login",
		type:"get",
		data:{"adminName":adminName,"adminPassword":adminPassword},
		dataType:"json",
		success:function(result){
			//result是服务端返回的数据
			if(result.status==200){
				//window.location.href="index.html";
				window.location.href="index.html";
			}else{
				alert("登录失败");
			}
		},
		error:function(){
			alert("请求失败!");
		}
	});
	return false;
}
```
controller  
将ticket存到cookie中,key是EM_TICKET.ticket是service中拼接的newTicket

```java
@RequestMapping("login")
	public SysResult doLogin(Cinema manager,HttpServletRequest req,HttpServletResponse res){
		//通过业务层返回的数据ticket是否为空判断
		//登陆逻辑是否正常 ""正常值
		String ticket=userService.doLogin(manager);
		if("".equals(ticket)){
			//登录失败
			return SysResult.build(201, "", null);
		}else{
			//ticket不为空,说明登陆成功
			//返回成功信息之前,要在cookie中定义一个携带ticket的头的信息EM_TICKET,ticket是返回的newTicket
			CookieUtils.setCookie(req, res, "EM_TICKET", ticket);
			return SysResult.ok();
		}
	}
```


service

```java
public String doLogin(Cinema manager) {
		//判断登陆权限校验 select where username and password
		//加密
		//manager.setAdminPassword(MD5Util.md5(manager.getAdminPassword()));
		Cinema exits = userMapper.selectUserByUserNameAndPassword(manager);
		String loginKey="login_"+manager.getAdminName();//生成当前秒的一个登陆校验标识
		String newTicket="";//生成登陆校验key
		//判断loginKey是不是存在
		if(jedis.exists(loginKey)){
			//曾经有人登陆过
			//String oldTicket=jedis.get(loginKey);//获得已经登陆的此id的登陆校验标识的value
			jedis.del(jedis.get(loginKey));//删除此id的登陆校验标识的value:newTicket
			//jedis.del(oldTicket);
		}
		//正常设置newTicket-userJson
		try{
			newTicket="EM_TICKET"+System.currentTimeMillis()+exits.getAdminName()+"_"+exits.getCinemaName();//设置登陆校验key字符串,头+当前毫秒+管理员id+电影院名字
			String userJson=MapperUtil.MP.writeValueAsString(exits);//将电影院信息转换成json字符串
			jedis.setex(newTicket, 60*60*2, userJson);//将用户信息存入redis缓存
			//设置有效的ticket使用
			jedis.setex(loginKey,60*60*2,newTicket);//生成一个登录校验key存入缓存,多次客户端登录时会比对
		}catch(Exception e){
			e.printStackTrace();
			return "";
		}
		return newTicket;
		
	}
```
mapper

```java
public Cinema selectUserByUserNameAndPassword(Cinema manager);
```

```xml
<select id="selectUserByUserNameAndPassword" parameterType="Cinema"
		resultType="Cinema">
		select * from cinema where admin_name=#{adminName} and
		admin_password=#{adminPassword};
</select>
```

## 检查登录状态

携带cookie信息向后台发送请求,当登陆超时或者有多点登陆时,会将username+当时的毫秒数的loginkey的value值也就是newTicket删除,在比对redis缓存中发现没有此值,重新转向登陆界面.  

分两种情况
1. 本地cookie被删除(注销),转向登陆
2. redis缓存newTicket被删,转向登陆

```js
$(function(){
            var _ticket = $.cookie("EM_TICKET");//获取本地以EM_TICKET为头的cookie
            if(!_ticket){
                window.location.href="login.html";//如果没有此cookie,重定向到登陆界面
                return ;
            }
            //当dataType类型为jsonp时，jQuery就会自动在请求链接上增加一个callback的参数
            $.ajax({
                url : "http://www.ms.com/user/query/" + _ticket,//发送ajax请求,携带cookie信息
                dataType : "json",
                type : "GET",
                success : function(data){
	                 var _data = JSON.parse(data.data);//解析json字符串
	                 var cinemaName=_data.cinemaName;//取出json中的管理员名字
	                 var adminName=_data.adminName;
	                 //通过id名 adminName找到元素,加入变量adminName
	                  $("#cinemaname").html(cinemaName);
	                 $("#adminName").html(adminName);
	                 if($("#adminname")!=null){
	                  $("#adminname").val(cinemaName);
	                  }
					alert("欢迎你!"+cinemaName+"的管理员"+adminName);
					
                   /* if(data.status == 200){
                        var _data = JSON.parse(data.data);//jackson
                        if(_data==null){
                            window.location.href="./login.html";
                            return;}
                    }*/
                },
                error : function(){
                window.location.href="./login.html";
                    alert('index error.');
                }
            });
        });
```
controller  
携带cookie信息为参数,如果为null,就返回201.

```java
//获取redis中的userJson
	@RequestMapping("query/{ticket}")
	public SysResult queryTicket(@PathVariable String ticket){
		String userJson=userService.queryTicket(ticket);//cookie信息为参数,返回值是newTicket的value值
		if(userJson==null){
			//超过两小时
			return SysResult.build(201, "用户超时", null);
		}else{
			//登录状态可用
			return SysResult.build(200, "登陆状态可用", userJson);
		}
	}
```
service

```java
public String queryTicket(String ticket) {
		//判断剩余时间
		Long leftTime=jedis.pttl(ticket);
		if(leftTime<1000*60*30){
			//小于30分钟,续约一小时
			jedis.pexpire(ticket, leftTime+1000*60*60);
		}
		return jedis.get(ticket);
	}
```
