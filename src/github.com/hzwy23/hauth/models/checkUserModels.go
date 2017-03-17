package models

import (
	"database/sql"

	"github.com/hzwy23/dbobj"
	"github.com/hzwy23/hauth/utils/logs"
	"github.com/astaxie/beego/context"
	"github.com/hzwy23/hauth/utils/token/hjwt"
	"github.com/hzwy23/hauth/utils/hret"
)

const (
	error_querydb  string = "can not found user info in system."
	error_maxerror string = "user was forbided, you have continued type password error 6 times."
	error_password string = "user's password error.please check your password"
)

type mSysUserSec struct {
	User_id                 string        `json:"user_id"`
	User_passwd             string        `json:"user_passwd"`
	User_status             sql.NullInt64 `json:"user_status"`
	User_continue_error_cnt sql.NullInt64
}

func updateContinueErrorCnt(cnt int64, user_id string) {
	dbobj.Exec("update sys_sec_user set continue_error_cnt = ? where user_id = ?", cnt, user_id)
}

func forbidUsers(user_id string) {
	dbobj.Exec("update sys_sec_user set status_id = 1 where user_id = ?", user_id)
}


// check user's passwd is right.
func CheckPasswd(user_id, user_passwd string) (bool, int, int64, string) {
	var sec mSysUserSec
	err := dbobj.QueryRow(sys_rdbms_010, user_id).Scan(&sec.User_id, &sec.User_passwd, &sec.User_status, &sec.User_continue_error_cnt)
	if err != nil {
		return false, 402, 0, error_querydb
	}

	if sec.User_status.Int64 != 0 {
		return false, 406, sec.User_status.Int64, error_maxerror
	}

	if sec.User_continue_error_cnt.Int64 > 6 {
		forbidUsers(user_id)
		return false, 403, sec.User_continue_error_cnt.Int64, error_maxerror
	}

	if sec.User_id == user_id && sec.User_passwd == user_passwd {
		updateContinueErrorCnt(0, user_id)
		return true, 200, 0, ""
	} else {
		updateContinueErrorCnt(sec.User_continue_error_cnt.Int64+1, user_id)
		return false, 405, sec.User_continue_error_cnt.Int64 + 1, error_password
	}
}


// check the user wheather handle the domain
// return value :
// -1   : have no right to handle the domain
// 1    : can read the domain info
// 2    : can read and wirte the domain info
func CheckDomainRights(user_id string,domain_id string)int{
	var cnt = -1
	err := dbobj.QueryRow(sys_rdbms_001,domain_id,user_id).Scan(&cnt)
	if err!=nil{
		logs.Error(err)
		return -1
	}
	return cnt
}

func CheckDomainByOrgId(org_unit_id string)(string,error){
	domain_id := ""
	err:=dbobj.QueryRow(sys_rdbms_002,org_unit_id).Scan(&domain_id)
	return domain_id,err
}

func CheckDomainByUserId(user_id string)(string,error){
	domain_id := ""
	err:=dbobj.QueryRow(sys_rdbms_003,user_id).Scan(&domain_id)
	return domain_id,err
}

func CheckDomainByRoleId(role_id string)(string,error){
	domain_id := ""
	err := dbobj.QueryRow(sys_rdbms_004,role_id).Scan(&domain_id)
	return domain_id,err
}

func BasicAuth(ctx *context.Context) bool {

	cookie, _ := ctx.Request.Cookie("Authorization")
	jclaim, err := hjwt.ParseJwt(cookie.Value)
	if err != nil {
		logs.Error(err)
		hret.WriteHttpErrMsgs(ctx.ResponseWriter, 310, "No Auth")
		return false
	}
	if jclaim.User_id == "admin" {
		return true
	}
	cnt := 0
	err = dbobj.QueryRow(sys_rdbms_022,jclaim.User_id,ctx.Request.URL.Path).Scan(&cnt)
	if err!=nil{
		return false
	}
	if cnt == 0 {
		return false
	}
	return true
}

// 返回值是-1 表示没有读写权限
// 返回值是0 表示有读取权限，没有写入权限
// 返回值是1 表示有读写权限
func DomainAuth(ctx *context.Context,domain_id string) int {
	level := -1
	cookie, _ := ctx.Request.Cookie("Authorization")
	jclaim, err := hjwt.ParseJwt(cookie.Value)
	if err != nil {
		logs.Error(err)
		return level
	}

	// if the user is not admin, and user_id is not owner this domain_id
	// check share info. or not
	if jclaim.User_id != "admin" && jclaim.Domain_id != domain_id {
		level = CheckDomainRights(jclaim.User_id,domain_id)
		return level
	} else {
		return 1
	}
}