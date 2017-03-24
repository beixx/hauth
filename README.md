## hauth简介

非常抱歉,项目结构与名称调整, 获取最新的源代码信息

请移步 https://github.com/hzwy23/asofdate


## 安装介绍

1. 首先导入数据库文件,数据库文件在script目录中,导入数据库文件方法

```shell
cd script
mysql -uroot -p dbname < ./init_hauth.sql
```

2. 修改数据库配置信息

配置文件在conf目录中，app.conf是beego的配置文件，主要涉及到服务端口号等等，另外一个是system.properties配置文件，这个里边主要是是=数据库连接信息与日志管理信息配置。

beeog的配置方法，请在beego项目中查阅，请移步：beego.me。下边来讲讲system.proerties中数据库的配置方法。

```
DB.type=mysql
DB.tns = "tcp(localhost:3306)/dbname"
DB.user = root
DB.passwd="xzPEh+SfFL3aimN0zGNB9w=="
```

注意: 修改的文件必须保存为utf-8编码,否则可能会出现异常，DB.type=mysql，这个值请不要修改，因为当前项目中提供的数据库脚本是针对于mysql和mariadb的。

1. 修改DB.tns中对应的数据库地址，端口号，数据库名称。

2. 修改DB.user成相应的数据库用户名

3. 修改DB.passwd成上边用户所对应的密码，系统启动后会自动加密，在此输入密码明文即可。
