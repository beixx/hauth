## hauth简介
这是一款以beego为基础，开发出的一款快速开发平台。这个平台内部集成了菜单管理、用户管理、角色管理、授权管理、日志管理、机构管理、路由管理、域定义管理等等。在这个平台的基础上，可以快速的开发自己的应用,以响应瞬息万变的市场需求。

## 项目目标
打造一款安全，稳定，易拓展的快速开发平台.在这个平台的基础上，能够迅速的开发出市场上需要的应用产品，省去系统基础服务开发测试工作量。

## 特点介绍

1. 去session化，采用jwt标准管理用户连接信息，易于分布式环境部署.
2. 菜单页面采用metro风格,简洁明了.
3. 权限控制到按钮级别，有效的对系统API服务进行控制.
4. 快速添加应用程序，只需要在菜单资源管理页面中注册新应用的菜单、路由信息，便可便捷的扩展新应用.
5. 用户操作记录十分精细，有效的记录用户每一个API请求.

## 系统简介

系统管理是整个产品的核心功能部分，系统中菜单资源是整个系统的公有资源，其余的资源，都是建立在各自的域中。

每个域中特有的信息是：机构、用户、角色，所以，在这个开发平台中，可以轻松的构建出一个适用于不同群体的应用产品，不同的群体信息相互隔离，同一个群体内信息共享。在应用系统中，当新增一个用户群体时，只需要新建一个域，便可实现这个功能。

## 安装方法

**1. 导入数据库信息**

创建数据库用户，导入数据文件，目前支持mysql，mariadb。oracle版本属于商业版，暂时不开源，有需求可以联系。

导入数据文件方法，请修改下边“数据库名”为你的数据库中存在的数据库名
```shell
mysql -uroot -p 数据库名 < ./init_hauth.sql
```
提示：init_hauth.sql在src/github.com/hzwy23/hauth/script目录中

**2. 编译hauth代码，生成可执行文件**

2.1 Linux，Mac系统中，下边两种方式都可以，任选一种。

**A. 直接以安装包的方式编译**

执行下边命令，在执行命令前，请确保您已经安装了go sdk

```shell
## cd 到hauth的解压目录，然后执行下边命令
./build.sh
## 上边这种模式编译会生成一个可执行文件hauth，
```
这个命令将会在hauth的解压目录下生成hauth可执行文件。

**B. 采用build编译main.go文件方式**

main.go文件在hauth解压的根目录中，编译方法如下：
```
# cd 到hauth解压后的根目录
export GOPATH=${PWD}
go build -i main.go
```

使用liteide的童鞋，采用第二种方式比较好调试，只需要设置GOPATH环境变量后，就可以直接打开main.go，然后点击BuildAndRun按钮，既可以启动服务。


2.2 Windows用户

请先设置GOPATH和GOBIN两个环境变量，将这两个环境变量的值都设置到hauth的解压目录，切记，两个变量值设置到hauth的解压目录，不要将GOBIN设置到GOPATH/bin，请参考下边值设置，例如：

```shell
GOPATH=C:\User\hzwy23\Desktop\hauth
GOBIN=C:\User\hzwy23\Desktop\hauth
```

设置完环境变量后.便可以编译源代码。

**A. 直接以安装包的方式编译**

```shell
go install github.com/hzwy23/hauth
```

将会在GOBIN下生成hauth.exe可执行文件。

**B. 采用build编译main.go文件方式**
```shell
go build -i main.go
```

将会在GOPATH目录下生成hauth.exe文件。


**3 修改配置文件**

配置文件在conf目录中，app.conf是beego的配置文件，主要涉及到服务端口号等等，另外一个是system.properties配置文件，这个里边主要是是=数据库连接信息与日志管理信息配置。

beeog的配置方法，请在beego项目中查阅，请移步：beego.me。下边来讲讲system.proerties中数据库的配置方法。

```
DB.type=mysql
DB.tns = "tcp(localhost:3306)/test"
DB.user = root
DB.passwd="xzPEh+SfFL3aimN0zGNB9w=="
```

注意: 修改的文件必须保存为utf-8编码,否则可能会出现异常，DB.type=mysql，这个值请不要修改，因为当前项目中提供的数据库脚本是针对于mysql和mariadb的。

1. 修改DB.tns中对应的数据库地址，端口号，数据库名称。

2. 修改DB.user成相应的数据库用户名

3. 修改DB.passwd成上边用户所对应的密码，系统启动后会自动加密，在此输入密码明文即可。

## 启动方法
```shell
## linux上，请执行。此外需要注意的是：linux上开启1024以下端口号需要管理员权限。
nohup ./hauth &

## Mac上，
sudo ./hauth

## windows上，
## 请直接双击hauth.exe可执行文件
```

登录系统用户名是：demo，密码是：123456, 

管理员用户: admin, 密码: hzwy23


![安装流程演示](./install_handle.gif)

## 交流方式

E-mail： hzwy23@163.com

demo演示地址：https://www.asofdate.com 

## 改进计划

1. 引入api gateway模块。

2. 增加主题风格，以适应不同的人群审美。

