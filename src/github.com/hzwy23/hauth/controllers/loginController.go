package controllers

import (
	"net/http"
	"html/template"

	"github.com/astaxie/beego/context"
	"github.com/hzwy23/hauth/models"
	"github.com/hzwy23/hauth/utils/logs"

	"github.com/hzwy23/hauth/utils"
	"github.com/hzwy23/hauth/utils/hret"
	"github.com/hzwy23/hauth/utils/token/hjwt"
)

var indexModels = new(models.LoginModels)

func HomePage(ctx *context.Context) {
	defer func(){
		if r:=recover();r!=nil{
			http.Redirect(ctx.ResponseWriter,ctx.Request,"/",http.StatusMovedPermanently)
		}
	}()

	cok, _ := ctx.Request.Cookie("Authorization")
	jclaim, err := hjwt.ParseJwt(cok.Value)
	if err != nil {
		logs.Error(err)
		http.Redirect(ctx.ResponseWriter, ctx.Request, "/", http.StatusMovedPermanently)
		return
	}

	url := indexModels.GetDefaultPage(jclaim.User_id)

	h, err := template.ParseFiles(url)
	if err != nil {
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 402, "获取首页信息失败",err)
		return
	}
	h.Execute(ctx.ResponseWriter,jclaim.User_id)
}

func LoginSystem(ctx *context.Context) {

	ctx.Request.ParseForm()

	userId := ctx.Request.FormValue("username")

	userPasswd := ctx.Request.FormValue("password")

	psd, err := utils.Encrypt(userPasswd)
	if err != nil {
		logs.Error("decrypt passwd failed.", psd)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 400, "encrypt user passwd failed.")
		return
	}

	domainId, err := indexModels.GetDefaultDomainId(userId)
	if err != nil {
		logs.Error(userId, " 用户没有指定的域", err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 401, "can't get org id of user")
		return
	}

	orgid, err := indexModels.GetDefaultDomainId(userId)
	if err != nil {
		logs.Error(userId, " 用户没有指定机构", err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 402, "can't get org id of user")
		return
	}

	if ok, code, cnt, rmsg := models.CheckPasswd(userId, psd); ok {
		token := hjwt.GenToken(userId, domainId, orgid)
		cookie := http.Cookie{Name: "Authorization", Value: token, Path: "/", MaxAge: 3600}
		http.SetCookie(ctx.ResponseWriter, &cookie)
		hret.WriteHttpOkMsgs(ctx.ResponseWriter, "login successfully.")
	} else {
		emsg := hret.NewHttpErrMsg(code, rmsg, cnt)
		hret.WriteHttpErrMsg(ctx.ResponseWriter, emsg)
	}
}

func LogoutSystem(ctx *context.Context) {
	cookie := http.Cookie{Name: "Authorization", Value: "", Path: "/", MaxAge: 3600}
	http.SetCookie(ctx.ResponseWriter, &cookie)
	hret.WriteHttpOkMsgs(ctx.ResponseWriter, "logout system safely.")
}
