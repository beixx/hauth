// Copyright 2017 The hzwy23 . All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// this package provide method which handle domain share action
package controllers

import (
	"html/template"
	"strings"

	"github.com/hzwy23/hauth/utils/hret"
	"github.com/astaxie/beego/context"
	"github.com/hzwy23/hauth/models"
	"github.com/hzwy23/hauth/utils/token/hjwt"
	"github.com/hzwy23/hauth/utils/logs"

)

type DomainShareControll struct{
	models *models.DomainShareModel
}

var DomainShareCtl = DomainShareControll{
	models:new(models.DomainShareModel),
}


// domain share configuration page
// in this page, you can config share the domain to others.
func (DomainShareControll)Page(ctx *context.Context){
	defer hret.HttpPanic()
	ctx.Request.ParseForm()

	if !models.BasicAuth(ctx){
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,403,"权限不足")
		return
	}

	// check the domain details
	// config this domain to others
	var domain_id = ctx.Request.FormValue("domain_id")
	logs.Debug("domain_id is :",domain_id)

	cookie, _ := ctx.Request.Cookie("Authorization")
	jclaim, err := hjwt.ParseJwt(cookie.Value)
	if err != nil {
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 410, "No Auth")
		return
	}

	if jclaim.User_id != "admin" && domain_id != jclaim.Domain_id{
		level := models.CheckDomainRights(jclaim.User_id,domain_id)
		if level != 2 {
			logs.Error("您没有权限修改这个域的共享信息")
			hret.WriteHttpErrMsgs(ctx.ResponseWriter,420,"您没有权限修改这个域的共享信息")
			return
		}
	}


	// get the domain details info
	rst,err:=DomainCtl.models.GetRow(domain_id)
	if err != nil{
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,419,"获取域共享页面信息失败。")
		return
	}

	hz,_:=template.ParseFiles("./views/hauth/domain_share_info.tpl")
	hz.Execute(ctx.ResponseWriter,rst)
}


// 查询域共享信息
func (this DomainShareControll)Get(ctx *context.Context){
	defer hret.HttpPanic()

	if !models.BasicAuth(ctx){
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,403,"权限不足")
		return
	}

	domain_id :=ctx.Request.FormValue("domain_id")

	// if the request argument domain_id is empty,
	// so set domain_id yourself.
	if strings.TrimSpace(domain_id) == ""{
		cookie, _ := ctx.Request.Cookie("Authorization")
		jclaim, err := hjwt.ParseJwt(cookie.Value)
		if err != nil {
			logs.Error(err)
			hret.WriteHttpErrMsgs(ctx.ResponseWriter, 410, "No Auth")
			return
		}
		domain_id = jclaim.Domain_id
	}

	// get domain_id share info
	rst,err:=this.models.Get(domain_id)
	if err!=nil{
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,419,"操作数据库失败")
		return
	}
	hret.WriteJson(ctx.ResponseWriter,rst)
}

// check unshare domains to the domain
func (this DomainShareControll)UnAuth(ctx *context.Context){
	ctx.Request.ParseForm()
	domain_id :=ctx.Request.FormValue("domain_id")
	if strings.TrimSpace(domain_id)==""{
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,419,"请求域信息为空")
		return
	}
	rst,err:=this.models.UnAuth(domain_id)
	if err!=nil{
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,419,"查询未授权共享域信息失败")
		return
	}
	hret.WriteJson(ctx.ResponseWriter,rst)
}

// 新增域共享信息
func (this DomainShareControll)Post(ctx *context.Context){
	ctx.Request.ParseForm()

	if !models.BasicAuth(ctx){
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,403,"权限不足")
		return
	}

	domain_id := ctx.Request.FormValue("domain_id")
	target_domain_id :=ctx.Request.FormValue("target_domain_id")
	auth_level :=ctx.Request.FormValue("auth_level")

	cookie, _ := ctx.Request.Cookie("Authorization")
	jclaim, err := hjwt.ParseJwt(cookie.Value)
	if err != nil {
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 410, "No Auth")
		return
	}

	if jclaim.User_id != "admin" && domain_id != jclaim.Domain_id{
		level:=models.CheckDomainRights(jclaim.User_id,domain_id)
		if level != 2 {
			logs.Error("您没有权限修改这个域的共享信息")
			hret.WriteHttpErrMsgs(ctx.ResponseWriter,420,"您没有权限修改这个域的共享信息")
			return
		}
	}

	err = this.models.Post(domain_id,target_domain_id,auth_level,jclaim.User_id)
	if err!=nil{
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,419,"授权失败，操作数据库时出现异常")
		return
	}else{
		hret.WriteHttpOkMsgs(ctx.ResponseWriter,"域信息共享成功")
	}
}

// 删除域共享信息
func (this DomainShareControll)Delete(ctx *context.Context){
	ctx.Request.ParseForm()

	if !models.BasicAuth(ctx){
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,403,"权限不足")
		return
	}

	js :=ctx.Request.FormValue("JSON")
	domain_id :=ctx.Request.FormValue("domain_id")

	if strings.TrimSpace(domain_id) == "" {
		return
	}

	cookie, _ := ctx.Request.Cookie("Authorization")
	jclaim, err := hjwt.ParseJwt(cookie.Value)
	if err != nil {
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 410, "No Auth")
		return
	}

	if jclaim.User_id != "admin" && domain_id != jclaim.Domain_id{
		level:=models.CheckDomainRights(jclaim.User_id,domain_id)
		if level != 2 {
			logs.Error("您没有权限修改这个域的共享信息")
			hret.WriteHttpErrMsgs(ctx.ResponseWriter,420,"您没有权限修改这个域的共享信息")
			return
		}
	}

	// delete share domain info
	err=this.models.Delete(js)
	if err!=nil{
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,419,"删除授权域失败",err)
		return
	}

	hret.WriteHttpOkMsgs(ctx.ResponseWriter,"删除授权信息成功")

}


// 更新域共享信息
func (this DomainShareControll)Put(ctx *context.Context){
	ctx.Request.ParseForm()

	if !models.BasicAuth(ctx){
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,403,"权限不足")
		return
	}

	uuid:=ctx.Request.FormValue("uuid")
	level:=ctx.Request.FormValue("auth_level")
	domain_id := ctx.Request.FormValue("domain_id")

	if strings.TrimSpace(domain_id)==""{
		return
	}

	// get user session from cookies
	cookie, _ := ctx.Request.Cookie("Authorization")
	jclaim, err := hjwt.ParseJwt(cookie.Value)
	if err != nil {
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 410, "No Auth")
		return
	}

	if jclaim.User_id != "admin" && domain_id != jclaim.Domain_id{
		level:=models.CheckDomainRights(jclaim.User_id,domain_id)
		if level != 2 {
			logs.Error("您没有权限修改这个域的共享信息")
			hret.WriteHttpErrMsgs(ctx.ResponseWriter,420,"您没有权限修改这个域的共享信息")
			return
		}
	}


	err = this.models.Update(uuid,jclaim.User_id,level)
	if err!=nil{
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter,419,"更新域共享信息傻逼爱。")
		return
	}else{
		hret.WriteHttpOkMsgs(ctx.ResponseWriter,"更新域共享模式成功")
	}
}