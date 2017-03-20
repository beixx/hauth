package service

import (
	"net/http"
	"fmt"
	"github.com/hzwy23/hauth/utils/hret"
	"github.com/hzwy23/hauth/utils/config"
	"github.com/astaxie/beego/logs"
)

func RedictToHtpps() {

	defer hret.HttpPanic()

	red,err := config.GetConfig("./conf/system.properties")
	if err !=nil {
		logs.Error(err)
		return
	}

	portMap,err := red.Get("PortMap")
	if err!=nil{
		logs.Error(err)
		return
	}

	if portMap == "true" {
		var redirectHandle = http.NewServeMux()

		redirectHandle.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

			http.Redirect(w, r, "https://www.asofdate.com", http.StatusMovedPermanently)

		})

		fmt.Println("即将开启服务，将http默认的80端口请求消息转发到https默认端口443上...")

		err := http.ListenAndServe(":80", redirectHandle)

		if err != nil {

			fmt.Println("您的用户没有权限开启80端口，或80端口已经被占用，无法将http默认80端口消息转发到https默认端口443上，请使用https协议访问系统",err)

		}
	}
}


