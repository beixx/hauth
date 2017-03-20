package service

import (
	"github.com/astaxie/beego/context"
	"github.com/hzwy23/hauth/utils/token/hjwt"
	"net/http"
	"github.com/hzwy23/hauth/utils/logs"
)

func CheckJWT(ctx *context.Context){
	cookie, err := ctx.Request.Cookie("Authorization")
	if err != nil || !hjwt.CheckToken(cookie.Value) {
		logs.Warn("have no authority. redirect to index")
		http.Redirect(ctx.ResponseWriter, ctx.Request, "/", http.StatusMovedPermanently)
	}
}