package main

import (
	"github.com/astaxie/beego"
	"github.com/hzwy23/hauth/service"
)

func main() {
	service.StartHauth()
	beego.Run()
}
