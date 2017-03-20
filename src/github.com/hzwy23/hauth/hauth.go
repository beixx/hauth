package main

import (
	"github.com/hzwy23/hauth/service"
	"github.com/astaxie/beego"
)

func main() {
	service.StartHauth()
	beego.Run()
}
