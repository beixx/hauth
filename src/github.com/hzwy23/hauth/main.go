package main

import (
	"github.com/astaxie/beego"

	"github.com/astaxie/beego/context"

	"github.com/hzwy23/hauth/service"
)

func main() {

	// 开启消息，
	// 将80端口的请求，重定向到443上
	go service.RedictToHtpps()

	beego.InsertFilter("/*", beego.FinishRouter, func(ctx *context.Context) {
		go service.WriteHandleLogs(ctx)
	}, false)

	beego.InsertFilter("/v1/*", beego.BeforeRouter, func(ctx *context.Context) {
		service.CheckJWT(ctx)
	}, false)

	beego.Run()
}
