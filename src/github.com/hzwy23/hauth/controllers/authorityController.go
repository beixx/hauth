// Copyright 2017 The hzwy23 . All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// authorization management
// Now this package did not use for the time being
// all authorization handle is relation to resources. so you can find authorization in roleUserController
package controllers

import (
	"text/template"

	"github.com/astaxie/beego/context"
	"github.com/hzwy23/hauth/models"
)

// Controller
// for authorization
// this class provide 4 Method
type AuthorityController struct {
	models *models.AuthorityModel
}

var AuthroityCtl = &AuthorityController{
	models: new(models.AuthorityModel),
}

// Get authorization page
func (AuthorityController) GetBatchPage(ctx *context.Context) {
	hz, _ := template.ParseFiles("./views/hauth/sys_batch_page.tpl")
	hz.Execute(ctx.ResponseWriter, nil)
}

// grant role to user
// Arguments:
// Users     string
// Roles     string
//func (this AuthorityController) BatchGrants(ctx *context.Context) {
//	ctx.Request.ParseForm()
//	users := ctx.Request.FormValue("Users")
//	roles := ctx.Request.FormValue("Roles")
//	cookie, _ := ctx.Request.Cookie("Authorization")
//	jclaim, err := hjwt.ParseJwt(cookie.Value)
//	if err != nil {
//		logs.Error(err)
//		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 401, "No Auth")
//		return
//	}
//
//	ret, err := this.models.Grants(users, roles, jclaim.User_id)
//	if err != nil {
//		logs.Error(err)
//		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 415, err.Error())
//		return
//	}
//	if len(ret) > 0 {
//		hret.WriteHttpOkMsg(ctx.ResponseWriter, hret.HttpOkMsg{Version: "v1.0", Reply_code: 210, Reply_msg: "batch grant complete. but there are some role can't grant to users", Data: ret})
//	} else {
//		hret.WriteHttpOkMsgs(ctx.ResponseWriter, "batch grant successfully.")
//	}
//}
//
//func (this AuthorityController) GetGettedRoles(ctx *context.Context) {
//	ctx.Request.ParseForm()
//
//	cookie, _ := ctx.Request.Cookie("Authorization")
//	jclaim, err := hjwt.ParseJwt(cookie.Value)
//	if err != nil {
//		logs.Error(err)
//		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 310, "No Auth")
//		return
//	}
//	rst, err := this.models.GetOwnerRoles(jclaim.User_id)
//	if err != nil {
//		logs.Error(err)
//		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 416, "操作数据库失败")
//		return
//	}
//	hret.WriteJson(ctx.ResponseWriter, rst)
//}

//func (this AuthorityController) CanGrantRoles(ctx *context.Context) {
//	ctx.Request.ParseForm()
//	userid := ctx.Request.FormValue("user_id")
//	cookie, _ := ctx.Request.Cookie("Authorization")
//	jclaim, err := hjwt.ParseJwt(cookie.Value)
//	if err != nil {
//		logs.Error(err)
//		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 310, "No Auth")
//		return
//	}
//	rst, err := this.models.GetGrantRoles(jclaim.User_id, userid)
//	if err != nil {
//		logs.Error(err)
//		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 417, "操作数据库失败")
//		return
//	}
//	hret.WriteJson(ctx.ResponseWriter, rst)
//}
//
