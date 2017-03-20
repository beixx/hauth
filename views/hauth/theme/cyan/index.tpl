<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="description" content="Metro, a sleek, intuitive, and powerful framework for faster and easier web development for Windows Metro Style.">
	<meta name="keywords" content="HTML, CSS, JS, JavaScript, framework, metro, front-end, frontend, web development">
	<meta name="author" content="Sergey Pimenov and Metro UI CSS contributors">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=8">
	<meta http-equiv="Expires" content="0">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="Cache-control" content="no-cache">
	<meta http-equiv="Cache" content="no-cache">


	<title>大数据应用分析平台</title>
	<link rel="stylesheet" href="/static/css/metro.css">
	<link rel="stylesheet" href="/static/bootstrap-3.3.7-dist/css/bootstrap.min.css"/>
	<link rel="stylesheet" href="/static/Font-Awesome-3.2.1/css/font-awesome.min.css"/>

	<link rel="stylesheet" href="/static/theme/default/index.css" type="text/css" />
	<link rel="stylesheet" href="/static/css/animate.css"/>
	<link rel="stylesheet" href="/static/nprogress/nprogress.css"/>

	<script type="text/javascript" src="/static/js/jquery-3.1.1.min.js"></script>
	<script src="/static/nprogress/nprogress.js"></script>

	<script type="text/javascript" src="/static/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="/static/js/utils.js"></script>


	<!--bootstrap-table表格-->
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="/static/bootstrap-table/dist/bootstrap-table.min.css">
	<!-- Latest compiled and minified JavaScript -->
	<script src="/static/bootstrap-table/dist/bootstrap-table.min.js"></script>
	<!-- Latest compiled and minified Locales -->
	<script src="/static/bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js"></script>

</head>

<body style="overflow: hidden" class="theme-bg-cyan">
<div id="bigdata-platform-subsystem"
	 style="margin-right:0px; background-size: cover; overflow: hidden;">
	<div style="position: relative; height: 60px; text-align: left;">
		<div class="col-sm-6 col-md-6 col-lg-6" style="padding-left: 30px;">
			<h3 id="huuid" style="color: #ffffff; font-size: 23px; font-weight: 700; height: 60px; line-height: 60px;">大数据应用分析平台</h3>
		</div>
		<div class="col-sm-6 col-md-6 col-lg-6" style="padding-left: 30px; text-align: right">
			<span class="label label-primary" style="color: #ffffff; font-size: 14px; font-weight: 700; height: 60px; line-height: 60px;"><i class="icon-user"></i>&nbsp;{{.}}</span>
		</div>
	</div>
	<div id="wrap" class="col-sm-12 col-md-12 col-lg-12" style="overflow: auto;">
		<div id="h-system-service" class="col-sm-12 col-md-6 col-lg-4"></div>
		<div id="h-mas-service" class="col-sm-12 col-md-6 col-lg-4"></div>
		<div id="h-other-service"  class="col-sm-12 col-md-6 col-lg-4"></div>
	</div>
</div>
<!--导航栏,标签切换栏, 修改为隐藏-->
<div class="H-content-tab theme-bg-cyan">
	<div class="H-tab-bar pull-left" id="H-tab-left">
		<button class="H-left-tab theme-bg-cyan" onclick="Hutils.H_HomePage()"><i style="color: white" class="icon-th-large"></i></button>
		<nav class="H-tabs-index"></nav>
	</div>
	<div class="H-tab-bar pull-right" id="H-tab-right">
		<button data-toggle="tooltip" title="显示菜单栏" class="H-right-tab theme-bg-cyan" onclick="Hutils.HchangeWrapper()"><i style="color: white" class="icon-columns"></i></button>
		<button data-toggle="tooltip" title="安全退出" class="H-right-tab theme-bg-cyan" onclick="Hutils.HLogOut()"><i style="color: white" class="icon-off"></i></button>
		<button data-toggle="tooltip" title="用户信息" class="H-right-tab theme-bg-cyan" onclick="Hutils.UserMgrInfo()"><i style="color: white" class="icon-user"></i></button>
	</div>
</div>

<script type="text/javascript">
    NProgress.start();
    var indexObj = {
		/*
		 * 调整元素位置
		 * 使其铺满全屏
		 * */
        adjustLocation:function(){
            var hh = document.documentElement.clientHeight;
            $("#wrap").height(hh-96);
        },
		/*
		 * 绑定一系列事件
		 * */
        bindEvents:function(){
			/*绑定鼠标指向事件
			 * 鼠标指过去时,背景变成白色,前景色成黑色
			 * */
            $(".H-right-tab").on("mouseover",function(){
                $(this).find("i").css("color","black");
            }).on("mouseout",function(){
                $(this).find("i").css("color","white");
            })
            $(".H-left-tab").on("mouseover",function(){
                $(this).find("i").css("color","black");
            }).on("mouseout",function(){
                $(this).find("i").css("color","white");
            })
			/*
			 * 开启bootstrap的title提示特效
			 * */
            $("[data-toggle='tooltip']").tooltip();
        }
    };

	/*
	 * 禁用浏览器后退按钮
	 * */
    window.onload = function () {
        if (typeof history.pushState === "function") {
            history.pushState("jibberish", null, null);
            window.onpopstate = function () {
                history.pushState('newjibberish', null, null);
                Hutils.H_HomePage()
            };
        }
        else {
            var ignoreHashChange = true;
            window.onhashchange = function () {
                if (!ignoreHashChange) {
                    ignoreHashChange = true;
                    window.location.hash = Math.random();
                }
                else {
                    ignoreHashChange = false;
                }
            };
        }
    };

    var changeTheme = function (id) {
		$.HAjaxRequest({
		    url:"/v1/auth/theme/update",
			type:'post',
			dataType:'json',
			data:{theme_id:id},
			success:function () {
				window.location.href="/HomePage"
            },
		})
    };

    var changemodifypassword = function(){
        $.Hmodal({
            header:"密码修改",
            body:$("#h-user-modify-password").html(),
            height:"420px",
            width:"720px",
            preprocess:function () {
                var user_id = $("#h-user-details-user-id").html()
                $("#h-modify-user-id").val(user_id)
            },
            callback:function(hmode){
                var newpd = $("#plat-change-passwd").find('input[name="newpasswd"]').val()
                var orapd = $("#plat-change-passwd").find('input[name="orapasswd"]').val()
                var surpd = $("#plat-change-passwd").find('input[name="surepasswd"]').val()
                if ($.trim(newpd) =="" || $.trim(orapd) == "" || $.trim(surpd)  == "" ){
                    $.Notify({
                        title:"温馨提示",
                        message:"不能将密码设置成空格",
                        type:"danger",
                    })
                    return
                }else if(newpd != surpd){
                    $.Notify({
                        title:"温馨提示",
                        message:"两次输入的新密码不一致，请确认是否存在多余的空格",
                        type:"danger",
                    })
                    return
                }
                $.HAjaxRequest({
                    type:"post",
                    url:"/v1/auth/passwd/update",
                    data:$("#plat-change-passwd").serialize(),
                    dataType:"json",
                    success:function(){
                        $(hmode).remove();
                        $.Notify({
                            title:"执行成功",
                            message:"修改密码成功",
                        })
                    },
                });
            }
        })
    };

    // tab 管理模块
    var Hutils = {
        // 隐藏子菜单系统，切换具体页面内容
        hideWrapper:function(){
            var htop = $("#wrapper").height();
            $("#wrapper").animate({
                bottom:-htop,
                opacity:0,
            },360);
        },
        // 隐藏内容显示部分，切换到子菜单系统
        showWrapper:function() {
            $("#wrapper").animate({
                bottom:0,
                opacity:1,
            },360);
        },
        // 判断子菜单系统显示状态，如果是隐藏，则切换到显示，如果是显示，则隐藏。
        HchangeWrapper:function(){
            if (window.event != undefined){
                window.event.cancelBubble = true;
            } else {
                // firefox
                var event = Hutils.getEvent()
                event.stopPropagation()
            }
            if ($(".H-tabs-index").html()==""){
                $.Notify({
                    title:"温馨提示：",
                    message:"目前没有已经打开的页面",
                    type:"info",
                });
                return
            };

            // 判断子系统菜单也距离底部的位置，如果距离底部的位置是0，则隐藏子菜单系统，否则显示子菜单系统
            if ("0px" == $("#wrapper").css("bottom")){
                Hutils.hideWrapper()
            }else{
                Hutils.showWrapper()
            }
        },
        ShowCannotEditTips:function(obj){
            $(obj).tooltip({
                title:"亲,此处无法编辑哟"
            }).tooltip("show")
        },
        // 跳转到首页系统菜单。
        H_HomePage:function(){
            if (window.event != undefined){
                window.event.cancelBubble = true;
            } else {
                // firefox
                var event = Hutils.getEvent()
                event.stopPropagation()
            }
            window.location.href="/HomePage"
        },
        // 退出登录
        HLogOut:function(){
            if (window.event != undefined){
                window.event.cancelBubble = true;
            } else {
                // firefox
                var event = Hutils.getEvent()
                event.stopPropagation()
            }
            $.Hconfirm({
                callback:function(){
                    $.ajax({type:"Get",url:"/logout",cache:!1,async:!1,dataType:"text",
                        error:function(){window.location.href="/"},
                        success:function(a){
                            window.location.href="/"}
                    })
                },
                header:"用户注销确认框",
                body:"<span style='font-size: 15px; font-weight: 500; height: 90px; line-height: 90px;padding-left: 90px;'>是否确认退出登录？</span>"
            })
        },
        // 用户信息管理
        UserMgrInfo:function(){
            if (window.event != undefined){
                window.event.cancelBubble = true;
            } else {
                // firefox
                var event = Hutils.getEvent()
                event.stopPropagation()
            }

            $.Hmodal({
                body:$("#mas-passwd-prop").html(),
                footerBtnStatus:false,
                height:"420px",
                width:"720px",
                header:"用户信息",
                preprocess:function () {
                    $.getJSON("/v1/auth/user/query",function (data) {
                        $(data).each(function (index, element) {
                            $("#h-user-details-user-id").html(element.user_id)
                            $("#h-user-details-user-name").html(element.user_name)
                            $("#h-user-details-user-email").html(element.user_email)
                            $("#h-user-details-user-phone").html(element.user_phone)

                            $("#h-user-details-user-org-name").html(element.org_unit_desc)
                            $("#h-user-details-user-domain").html(element.domain_id)
                            $("#h-user-details-user-domain-name").html(element.domain_name)
                            $("#h-user-details-user-create").html(element.create_user)
                            $("#h-user-details-user-create-date").html(element.create_date)
                            $("#h-user-details-user-modify").html(element.modify_user)
                            $("#h-user-details-user-modify-date").html(element.modify_date)
                            // 机构编码处理
                            var upcombine = element.org_unit_id.split("_join_")
                            if (upcombine.length==2){
                                $("#h-user-details-user-org").html(upcombine[1])
                            }else{
                                $("#h-user-details-user-org").html(upcombine)
                            }
                        })
                    });
                }
            });
        },
        // 子系统中，打开具体页面按钮
        goEntrySubSystem:function(e){
            // 隐藏子菜单系统，显示具体的内容
            Hutils.hideWrapper();

            var flag = false;

            // 资源的url地址
            var url = $(e).attr("data-url");

            // 资源的id
            var data_id = $(e).attr("data-id");

            // 资源的名称
            var name = $(e).find("div:last").html();

            // 获取新tab模板内容
            var optHtml = Hutils.__genTabUI(data_id,name)


            // 遍历整个tab栏目，查找指定id的资源是否打开，
            // 如果该资源已经打开，则直接切换到该资源，无需从后台获取内容
            // 如果该资源没有打开，则将flag为false，从后台获取资源内容
            $(".H-tabs-index").find("span").each(function(index,element){
                // 如果资源存在，直接切换到这个资源的tab中。
                if (data_id == $(element).attr("data-id")){
                    Hutils.__changetab(element)
                    flag = true;
                    return false;
                }
            });


            // 资源未打开，从后台请求资源信息
            if (flag == false){
                $.HAjaxRequest({
                    type:"get",
                    url:url,
                    cache:false,
                    async:true,
                    dataType:"text",
                    success: function(data){
                        // 清楚所有的tab选中状态
                        $(".active-tab").removeClass("active-tab");

                        // 在tab栏目列表中添加新的tab
                        $(".H-tabs-index").append(optHtml);

                        // 隐藏内容显示区域
                        $("#h-main-content").find("div.active").removeClass("active").addClass("none");
                        var newContent = document.createElement("div")
                        $(newContent).attr({
                            "data-type":"frame",
                            "data-id":data_id,
                        }).css({
                            "padding":"0px",
                            "margin":"0px",
                        }).addClass("active").html(data)
                        $("#h-main-content").append(newContent);
                    }
                });
            }
        },
        // 打开指定资源按钮
        openTab:function(param){
            // 隐藏子菜单页面
            Hutils.hideWrapper();

            // 判断子元素会否已经被打开，默认设置为未打开
            var flag = false;

            // 资源url地址
            var url = param.url;

            // 资源id
            var data_id = param.id;

            // 资源名称
            var name = param.title;

            // 获取tab模板
            var optHtml = Hutils.__genTabUI(data_id,name);

            $(".H-tabs-index").find("span").each(function(index,element){
                if (data_id == $(element).attr("data-id")){
                    flag = true;
                    $.HAjaxRequest({
                        type:"get",
                        url:url,
                        cache:false,
                        async:true,
                        dataType:"text",
                        success: function(data){
                            Hutils.__changetab(element);
                            $(element).find("hzw").html(name);

                            $("#h-main-content").find("div.active").each(function(index,element){
                                if (data_id == $(element).attr("data-id")){
                                    $(element).html(data);
                                    return false;
                                }
                            })
                        }
                    });
                    return false;
                }
            });
            if (flag == false){
                $.HAjaxRequest({
                    type:"get",
                    url:url,
                    cache:false,
                    async:true,
                    dataType:"text",
                    success: function(data){
                        // 清楚所有的tab选中状态
                        $(".active-tab").removeClass("active-tab");

                        // 在tab栏目列表中添加新的tab
                        $(".H-tabs-index").append(optHtml);

                        // 隐藏内容显示区域
                        $("#h-main-content").find("div.active").removeClass("active").addClass("none");

                        var newContent = document.createElement("div")
                        $(newContent).attr({
                            "data-type":"frame",
                            "data-id":data_id,
                        }).css({
                            "padding":"0px",
                            "margin":"0px",
                        }).addClass("active").html(data)
                        $("#h-main-content").append(newContent);
                    },
                });
            }
        },

        // 切换tab页面
        __changetab : function(e){
            if (window.event != undefined){
                window.event.cancelBubble = true;
            } else {
                // firefox
                var event = Hutils.getEvent()
                event.stopPropagation()
            }

            // 隐藏子菜单页面
            Hutils.hideWrapper()

            // 清除所有tab的激活标签
            $(".active-tab").removeClass("active-tab");

            // 给新的tab加上激活标签
            $(e).addClass("active-tab")

            // 获取新tab的id
            var id = $(e).attr("data-id");

            // 在已经打开的页面中，根据id，寻找到指定的页面，将这个页面显示出来
            $("#h-main-content").find("div.active").removeClass("active").addClass("none");
            $("#h-main-content").find("div[data-id='"+id+"']").removeClass("none").addClass("active");
        },
        __genTabUI:function (data_id,name) {
            var mspan = document.createElement("span")
            $(mspan).css({
                "min-width":"120px",
                "border-left":"#6f5499 solid 1px"
            }).attr({
                "data-id":data_id,
                "onclick":"Hutils.__changetab(this)",
            }).addClass("H-left-tab active-tab");

            var hzw = document.createElement("hzw");
            $(hzw).html(name);
            $(hzw).css({
                "font-weight":"600",
                "color":"white",
            });

            var mi = document.createElement("i")
            $(mi).css("font-size","14px")
                .addClass("icon-remove-sign H-gray-close pull-right")
                .attr("onclick","Hutils.__closetab(this)")

            $(mspan).append(hzw);
            $(mspan).append(mi);
            return mspan
        },
        getEvent:function(){
            if(window.event)    {
                return window.event;
            }
            var func = Hutils.getEvent.caller;
            while( func != null ){
                var arg0 = func.arguments[0];
                if(arg0){
                    if((arg0.constructor==Event || arg0.constructor ==MouseEvent
                        || arg0.constructor==KeyboardEvent)
                        ||(typeof(arg0)=="object" && arg0.preventDefault
                        && arg0.stopPropagation)){
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        // 关闭tab标签，以及tab标签关联的内容,在__genTabUI中引用了__closetab
        __closetab:function(e){
            // 取消后续事件
            if (window.event != undefined){
                window.event.cancelBubble = true;
            } else {
                var event = Hutils.getEvent()
                event.stopPropagation()
            }

            // 获取被关闭tab的id
            var id = $(e).parent().attr("data-id");

            // 首先判断，这个tab是否被激活，如果是激活状态，则在关闭tab后，
            // 还需要切换到新的tab页面中，切换顺序是，先寻找左侧隐藏的tab，如果没有再寻找右侧
            // 如果两侧都没有，则直接返回子菜单系统。
            if ($(e).parent().hasClass("active-tab")){
                // 获取左侧tab
                var pobj = $(e).parent().prev("span");
                var pid = $(pobj).attr("data-id");

                // 获取右侧tab
                var nobj = $(e).parent().next("span");
                var nid = $(nobj).attr("data-id");

                // 关闭选中的tab,以及这个tab所关联的内容
                $(e).parent().remove();
                $("#h-main-content").find("div[data-id='"+id+"']").remove();

                // 如果pid与nid都为undefined，则直接切换到子菜单系统
                // 如果左侧tab存在，则切换到左侧tab，否则切换到右侧tab
                if (pid == undefined){
                    if (nid == undefined){
                        Hutils.showWrapper()
                        return
                    } else {
                        id = nid
                    }
                } else {
                    id = pid
                }

                // 清除左侧tab的隐藏状态，使其显示。
                $("#h-main-content").find("div[data-id='"+id+"']").removeClass("none").addClass("active");

                // 遍历整个tab栏，找到匹敌的tab id，
                $(".H-left-tab").each(function(index,element){
                    if (id == $(element).attr("data-id")){
                        $(element).addClass("active-tab")
                    }
                });
            } else {
                // 当被删除的这个tab没有被激活时，直接将这个tab也从tab栏目中删除，并连同删除这个tab关联的内容即可。
                $(e).parent().remove();
                $("#h-main-content").find("div[data-id='"+id+"']").remove();
            }
        },
        go_entry :function (e){
            var id = $(e).attr("data-id");
            $.HAjaxRequest({
                url:'/v1/auth/index/entry',
                data:{Id:id},
                dataType:'text',
                success:function(d){
                    $("#bigdata-platform-subsystem").html(d)
                },
                error:function () {
                    $.Notify({
                        title:"温馨提示：",
                        message:"登录连接已经断开，请重新登录系统",
                        type:"info",
                    });
                    window.location.href="/"
                },
            });
        },
        initMenu:function(TypeId,Id,Group1,Group2,Group3){

            var __genUI = function (name) {
                var mdiv = document.createElement("div")
                $(mdiv).addClass("tile-group")
                var mspan = document.createElement("span")
                $(mspan).addClass("tile-group-title").css("font-size","12px").html(name)
                $(mdiv).append(mspan)

                return mdiv
            };

            var __genDiv = function (res_id,res_class,res_bg_color,res_img,res_name,res_url) {
                var mdiv = document.createElement("div")
                $(mdiv).attr({
                    "data-id":res_id,
                    "data-role":"tile",
                    "data-url":res_url,
                }).addClass(res_class).addClass("fg-white hzwy23div")
                    .css("background-color",res_bg_color);

                var cdiv = document.createElement("div")
                $(cdiv).addClass("tile-content iconic")

                var mspan = document.createElement("span")
                $(mspan).addClass("icon")

                var mimg = document.createElement("img")
                $(mimg).attr("src",res_img)

                var ccdiv = document.createElement("div");
                $(ccdiv).addClass("tile-label").html(res_name);

                $(mspan).append(mimg)
                $(cdiv).append(mspan)
                $(mdiv).append(cdiv)
                $(mdiv).append(ccdiv)
                return mdiv
            };

            $.HAjaxRequest({
                url:'/v1/auth/main/menu',
                data:{TypeId:TypeId,Id:Id},
                success: function(data){

                    var cdiv1 = document.createElement("div");
                    $(cdiv1).addClass("tile-container");

                    var cdiv2 = document.createElement("div");
                    $(cdiv2).addClass("tile-container");

                    var cdiv3 = document.createElement("div");
                    $(cdiv3).addClass("tile-container");

                    var divlist = new Array();

                    divlist.push(cdiv1);
                    divlist.push(cdiv2);
                    divlist.push(cdiv3);

                    $(data).each(function(index,element){
                        var gid = parseInt(element.Group_id)-1;
                        var mdiv = divlist[gid];
                        $(mdiv).append(__genDiv(element.Res_id,element.Res_class,element.Res_bg_color,element.Res_img,element.Res_name,element.Res_url));
                    });

                    if ($(cdiv1).html() != "") {
                        var mdiv1 = __genUI(Group1)
                        $(mdiv1).append(cdiv1)
                        $("#h-system-service").html(mdiv1)
                    }else{
                        $("#h-system-service").remove()
                    }

                    if ($(cdiv2).html() !=""){
                        var mdiv2 = __genUI(Group2)
                        $(mdiv2).append(cdiv2)
                        $("#h-mas-service").html(mdiv2)
                    }else{
                        $("#h-mas-service").remove()
                    }

                    if ($(cdiv3).html() !=""){
                        var mdiv3 = __genUI(Group3)
                        $(mdiv3).append(cdiv3);
                        $("#h-other-service").html(mdiv3)
                    }else{
                        $("#h-other-service").remove();
                    }

                    if (TypeId == 1){
                        $(".hzwy23div").click(function () {
                            Hutils.goEntrySubSystem(this)
                        })
                    } else if (TypeId == 0) {
                        $(".hzwy23div").click(function(){
                            Hutils.go_entry(this)
                        })
                    }

                    $(function() {
                        //取消水平滑动的插件
                        //$.StartScreen();
                        var tiles = $(".tile, .tile-small, .tile-sqaure, .tile-wide, .tile-large, .tile-big, .tile-super");
                        $.each(tiles, function() {
                            var tile = $(this);
                            setTimeout(function() {
                                tile.css({
                                    opacity: 1,
                                    "-webkit-transform": "scale(1)",
                                    "transform": "scale(1)",
                                    "-webkit-transition": ".3s",
                                    "transition": ".3s"
                                });
                            }, Math.floor(Math.random() * 500));
                        });
                        $(".tile-group").animate({
                            left: 0
                        });
                    });
                },
            });
        },
    };


    //调整主菜单的长度和宽度
    $(document).ready(function(){
        Hutils.initMenu(0,-1,"系统服务","管理会计","公共信息")
        indexObj.adjustLocation()
        indexObj.bindEvents()
        NProgress.done();
    });

    window.onresize = function(){
        var hh = document.documentElement.clientHeight;
        $("#wrap").height(hh-96);
    }
</script>

<script id="mas-passwd-prop" type="text/html">
	<div class="panel panel-default">
		<!-- Default panel contents -->
		<div class="panel-heading">
			<span style="font-size: 12px;font-weight: 600;">主题切换：</span>
			<button onclick="changeTheme(1001)" class="btn btn-success btn-sm">
			</button>
			<button onclick="changeTheme(1004)" class="btn btn-sm theme-bg-cyan" style="color: white;">
			</button>
			<div class="pull-right">
				<button onclick="changemodifypassword()" class="btn btn-success btn-xs">
					<i class="icon-wrench"> 修改密码</i>
				</button>
			</div>
		</div>
		<table class="table table-bordered table-responsive">
			<tr style="height: 36px;line-height: 36px;">
				<td style="text-align: right;">用户id:&nbsp;</td>
				<td id="h-user-details-user-id" style="font-weight: 600">user_id</td>
				<td style="text-align: right;">用户名称:&nbsp;</td>
				<td id="h-user-details-user-name" style="font-weight: 600">user_name</td>
			</tr>
			<tr style="height: 36px;line-height: 36px;">
				<td style="text-align: right;">邮箱:&nbsp;</td>
				<td id="h-user-details-user-email" style="font-weight: 600">user_email</td>
				<td style="text-align: right;">手机号:&nbsp;</td>
				<td id="h-user-details-user-phone" style="font-weight: 600">user_phone</td>
			</tr>
			<tr style="height: 36px;line-height: 36px;">
				<td style="text-align: right;">所属域编码:&nbsp;</td>
				<td id="h-user-details-user-domain" style="font-weight: 600">user_dept</td>
				<td style="text-align: right;">所属域名称:&nbsp;</td>
				<td id="h-user-details-user-domain-name" style="font-weight: 600">user_domain</td>
			</tr>
			<tr style="height: 36px;line-height: 36px;">
				<td style="text-align: right;">组织部门编码:&nbsp;</td>
				<td id="h-user-details-user-org" style="font-weight: 600">user_dept</td>
				<td style="text-align: right;">组织部门描述:&nbsp;</td>
				<td id="h-user-details-user-org-name" style="font-weight: 600">user_domain</td>
			</tr>
			<tr style="height: 36px;line-height: 36px;">
				<td style="text-align: right;">创建人:&nbsp;</td>
				<td id="h-user-details-user-create" style="font-weight: 600">user_create</td>
				<td style="text-align: right;">创建时间:&nbsp;</td>
				<td id="h-user-details-user-create-date" style="font-weight: 600">user_create_date</td>
			</tr>
			<tr style="height: 36px;line-height: 36px;">
				<td style="text-align: right;">修改人:&nbsp;</td>
				<td id="h-user-details-user-modify" style="font-weight: 600">user_create</td>
				<td style="text-align: right;">修改时间:&nbsp;</td>
				<td id="h-user-details-user-modify-date" style="font-weight: 600">user_create_date</td>
			</tr>
		</table>
	</div>

</script>
<script id="h-user-modify-password" type="text/html">
	<form id="plat-change-passwd" class="col-sm-12 col-md-12 col-lg-12">
		<div class="form-group col-sm-12 col-md-12 col-lg-12">
			<label class="h-label" style="width: 100%;">账　号：</label>
			<input id="h-modify-user-id" readonly="readonly" class="form-control" style="width: 100%;height: 30px; line-height: 30px;" type="text" name="userid"/>
		</div>
		<div class="form-group col-sm-12 col-md-12 col-lg-12">
			<label class="h-label" style="width: 100%;">原密码：</label>
			<input placeholder="密码长度必须大于6位，小于30位" class="form-control" style="width:100%;height: 30px; line-height: 30px;" type="password" name="orapasswd"/>
		</div>
		<div class="form-group col-sm-12 col-md-12 col-lg-12">
			<label class="h-label" style="width: 100%;">新密码：</label>
			<input placeholder="密码长度必须大于6位，小于30位" class="form-control" style="width:100%;height: 30px; line-height: 30px;" type="password" name="newpasswd"/>
		</div>
		<div class="form-group col-sm-12 col-md-12 col-lg-12">
			<label class="h-label" style="width: 100%;">确认密码：</label>
			<input placeholder="请确认新密码信息" class="form-control" style="height: 30px; line-height: 30px; width: 100%;" type="password" name="surepasswd"/>
		</div>
	</form>
</script>
<script type="text/javascript" src="/static/laydate/laydate.js"></script>
<script type="text/javascript" src="/static/js/bootstrap-notify.min.js"></script>
<script src="/static/js/download.js"></script>
</body>
</html>