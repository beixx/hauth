# hauth
hauth是一款集成开发平台，产品内部集成了用户权限控制，在此平台的基础上，方便快速的开发业务模块，而不用去从头开始搭建系统基础组件。
	
## 依赖库
* [beego](https://github.com/astaxie/beego)
* [jwt-go](https://github.com/dgrijalva/jwt-go)
* [dbobj](https://github.com/hzwy23/dbobj)
* [xlsx](https://github.com/tealeg/xlsx)

## 注意事项
在使用这款系统时，首先导入必要的数据结构，默认支持mysql，mariadb数据库，oracle数据库属于商业版本，有意向可以联系，也可以自己修改。

## 安装说明

### 编译hauth，

linux:执行build.sh生成可执行文件,文件中已经有一个已经在linxu上编译好的可执行文件hauth.

windows: 设置环境变量与编译方法

```shell
    GOPATH=...hauth
    GOBIN=...hauth
    在windows上设置上边两个环境变量倒hauth的下载目录.然后执行下边的命令,会生成一个hauth.exe可执行文件.
    go install github.com/hzwy23/hauth
```

### 导入产品依赖的数据结构，

数据库脚本在src/github.com/hzwy23/hauth/script/init_hauth.sql中，

导入方式：

> mysql -uroot -p 数据库名  < ./script/init_hauth.sql


### 修改数据密码信息,数据库连接信息存储在conf/system.properties文件

```
DB.type=mysql
DB.tns = "tcp(localhost:3306)/test"
DB.user = root
DB.passwd="xzPEh+SfFL3aimN0zGNB9w=="
```

1. 修改DB.tns中对应的数据库地址，端口号，数据库名称。

2. 修改DB.user成相应的数据库用户名

3. 修改DB.passwd成上边用户所对应的密码，系统启动后会自动加密，在此输入密码明文即可。

4. 登录系统用户名是：demo，密码是：123456, 管理员用户: admin, 密码: hzwy23

## 交流方式

1. Email: hzwy23@163.com

2. demo演示地址:[https://www.asofdate.com](https://www.asofdate.com)  用户名：demo  密码：123456
