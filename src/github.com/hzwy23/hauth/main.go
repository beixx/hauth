package main

import (
	"fmt"

	"net/http"

	"github.com/astaxie/beego"

	"github.com/astaxie/beego/context"

	"github.com/hzwy23/hauth/utils/token/hjwt"

	"github.com/hzwy23/hauth/utils/logs"
)

func redictToHtpps() {

	var redirectHandle = http.NewServeMux()

	redirectHandle.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		http.Redirect(w, r, "https://www.asofdate.com", http.StatusMovedPermanently)

	})

	err := http.ListenAndServe(":80", redirectHandle)

	if err != nil {

		fmt.Println("start http rediect to https failed.")

	} else {

		fmt.Println("port 80 redirect to 443")

	}
}

func RequireAuth(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/", http.StatusMovedPermanently)
}

func main() {

	go redictToHtpps()

	beego.InsertFilter("/v1/*", beego.BeforeRouter, func(ctx *context.Context) {
		cookie, err := ctx.Request.Cookie("Authorization")
		if err != nil || !hjwt.CheckToken(cookie.Value) {
			logs.Warn("have no authority. redirect to index")
			RequireAuth(ctx.ResponseWriter, ctx.Request)
		}
	})
	beego.Run()
}
