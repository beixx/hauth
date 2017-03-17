/**
 * Created by hzwy23 on 2016/9/28.
 */
"use strict";

(function($){
    $.fn.Htree = function(param){
        // 1. 获取top节点
        // 2. 获取id，text，upId，将其他属性设置成data-属性
        // 3. 生成tree。
        // 4. 绑定单击按钮
        // 5. 伸缩按钮图标
        // function list:
        // 6. 删除节点
        // 7. 新增节点
        // 8. 更新节点

        // 保留节点索引
        var $this = this;

        /*
        * 插件默认参数列表。
        * */
        var __DEFAULT = {
            data: "",
            fontSize:"13px",
            showLiHeight:"30px",
            showFontSize:"14px",
            iconColor:"#030202",

            onChange:function (obj) {
                console.log("没有注册点击函数")
            },
        };

        $.extend(true,__DEFAULT,param);

        // 1.get top node, and sort array
        function sortTree(a){

            // load result sorted
            var list = [];

            // get select's options
            // append it to new select which simulate by ul li
            if (Object.prototype.toString.call(a) == '[object Array]'){

            } else {
                return [];
            }

            //set max dept val
            var MAXDEPT = 8;

            var INDEX = 1;

            function getRoots(arr){
                var Roots = [];
                for(var i = 0; i < arr.length;i++){
                    var rootFlag = true
                    for ( var j = 0; j < arr.length;j++){
                        if (arr[i].upId == arr[j].id){
                            rootFlag = false
                            break
                        }
                    }
                    if (rootFlag == true){
                        Roots.push(arr[i])
                    }
                }
                return Roots
            }

            function traversed(node,arr){
                if (++INDEX > MAXDEPT){
                    console.log("递归超过8层,为保护计算机,退出递归");
                    return
                }
                for (var i = 0; i < arr.length; i++){

                    if (node == arr[i].upId){
                        arr[i].dept = INDEX
                        list.push(arr[i])
                        traversed(arr[i].id,arr)
                    }
                }
                INDEX--;
            }

            function listElem(roots,arr){
                for (var i = 0; i < roots.length; i++){
                    roots[i].dept = INDEX
                    list.push(roots[i])
                    traversed(roots[i].id,arr)
                }
            }

            listElem(getRoots(a),a)

            return list
        }

        // 2. set data-*
        // 3. genUI
        function genTreeUI(a){

            var opt = "<ul>"
            for(var i = 0; i < a.length; i++){
                var pd = parseInt(a[i].dept)*20 - 10
                if (isNaN(pd)){
                    pd = 10
                }
                var li = '<li data-id="'+a[i].id+'" data-dept="'+a[i].dept+'" style="margin:0px; text-align: left;font-weight:500;padding-left:'+pd+'px; height:'+__DEFAULT.showLiHeight+'; line-height: '+__DEFAULT.showLiHeight+'; font-size: '+__DEFAULT.showFontSize+'; cursor: pointer;position: relative;">' +
                    '<hzw class="HTreeshowOrHideIconHzw" style="height: '+__DEFAULT.showLiHeight+'; line-height: '+__DEFAULT.showLiHeight+'; width: 20px;cursor: crosshair ;display: inline-block">' +
                    '<i style="border-color:'+__DEFAULT.iconColor+' transparent transparent transparent;border-style: solid;border-width: 6px 5px 0px 5px;height: 0;margin-left: 1px;margin-top: -5px;position: absolute;top: 50%;width: 0;"></i>' +
                    '</hzw>' +
                    '<span class="HTreeLi" style="height: '+__DEFAULT.showLiHeight+'; line-height: '+__DEFAULT.showLiHeight+'; position: absolute;">'+a[i].text+'</span></li>'
                opt+=li;
            }
            opt +='</ul>'
            return opt;
        }

        // 绑定伸缩按钮
        function showOrHide(e){

            var topBorderColor = __DEFAULT.iconColor+' transparent transparent transparent'
            var leftBorderColor = 'transparent transparent transparent '+__DEFAULT.iconColor
            var dept = $(e).attr("data-dept")
            var nextObj = $(e).next()
            var nextDept = $(nextObj).attr("data-dept")
            var nextDisplay = $(nextObj).css("display")
            if (nextDisplay == "none" && parseInt(nextDept)>parseInt(dept)){
                $(e).find("i").css({
                    "border-color":topBorderColor,
                    "border-width":"6px 5px 0px 5px"
                })

                $(e).nextAll().each(function(index,element){
                    if (parseInt(dept)+1==parseInt($(element).attr("data-dept"))){
                        $(element).find("i").css({
                            "border-color":leftBorderColor,
                            "border-width":"5px 0px 5px 6px",
                        });

                        $(element).fadeIn(400);
                    }else if (parseInt(dept)+1 < parseInt($(element).attr("data-dept"))){
                        $(element).find("i").css({
                            "border-color":leftBorderColor,
                            "border-width":"5px 0px 5px 6px",
                        })

                        $(element).fadeOut(200);
                    }else{
                        return false
                    }
                })
            }else if (nextDisplay == "none" && parseInt(nextDept)<=parseInt(dept)){
                return
            }else if (nextDisplay != "none" && parseInt(nextDept)>parseInt(dept)){

                $(e).find("i").css({
                    "border-color":leftBorderColor,
                    "border-width":"5px 0px 5px 6px",
                })

                $(e).nextAll().each(function(index,element){
                    if (parseInt(dept)<parseInt($(element).attr("data-dept"))){
                        $(element).find("i").css({
                            "border-color":leftBorderColor,
                            "border-width":"5px 0px 5px 6px",
                        })

                        $(element).fadeOut(200);
                    }else if (parseInt(dept)>=parseInt($(element).attr("data-dept"))){
                        return false
                    }
                })
            }else {
                return
            }
        }

        var li = sortTree(__DEFAULT.data)
        var opt = genTreeUI(li)

        $this.html(opt)

        /*
        * 如果这个节点没有下层信息，则将这个层级的伸缩按钮去掉。
        * */
        $this.find("ul li").each(function(index,element){
            var curDept = parseInt($(element).attr("data-dept"));
            var nextDept = parseInt($(element).next().attr("data-dept"));
            if (curDept>=nextDept || isNaN(nextDept)){
                $(element).find("hzw").remove()
            }
        });

        /*
        * 给ul中每一行li绑定点击事件
        * */
        $this.find("ul li").on("click",function(){
            $this.find(".HTreeLi").css("color","")
            $(this).find("span").css("color","red")
            $this.attr("data-selected",$(this).attr("data-id"))
            __DEFAULT.onChange(this)
        });

        /*
        * 给伸缩按钮绑定单击事件
        * */
        $this.find(".HTreeshowOrHideIconHzw").on("click",function () {
            window.event.cancelBubble = true;
            showOrHide($(this).parent())
        });

    };

    $.fn.Hselect = function(param){
        var sel = this
        var obj = document.createElement("div")

        if ( $(sel).attr("hselect") == "true"){
            // 重复初始化Hselect
            var hselect = $(sel).next()
            var displaycss = $(hselect).css("display")
            $(obj).attr("style",$(sel).attr("style"));
            $(obj).css("display",displaycss)

            $(hselect).remove()
            $(sel).html("");
        } else {
            // 第一次初始化Hselect
            $(obj).attr("style",$(sel).attr("style"));
        }
        //init div css
        //get parent class to it
        //get parent css to it
        $(obj).addClass($(sel).attr("class"));
        $(obj).css({"padding":"0px","border":"none"});

        $(sel).attr("hselect","true");
        // default parameters
        var __DEFAULT = {
            data: "",
            height:"26px",
            width:"100%",
            border:"#ccc solid 1px",
            fontSize:"13px",
            borderRadius:"5px",
            bgColor:"white",
            placeholder:"<i style='color: #959595;font-size: 12px;'>--请选择--</i>",

            showLiHeight:"30px",
            showHeight:"230px",
            showBorder:"",
            showFontSize:"14px",
            iconColor:"#ff5763",

            onChange:"",
        };

        $.extend(true,__DEFAULT,param);


        // set showBorder to border style
        if (__DEFAULT.showBorder==""){
            __DEFAULT.showBorder = __DEFAULT.border
        }

        /*
         * This function sort array.
         * Accept One Array Variable.
         * */
        function sortTree(a){

            // load result sorted
            var list = [];

            // get select's options
            // append it to new select which simulate by ul li
            if (Object.prototype.toString.call(a) == '[object Array]'){
                $(sel).find("option").each(function(index,element){
                    var ijs = {}
                    ijs.id = $(element).val();
                    ijs.text = $(element).text()
                    a.push(ijs)
                })
            } else {
                $(sel).find("option").each(function(index,element){
                    var ijs = {}
                    ijs.id = $(element).val();
                    ijs.text = $(element).text()
                    list.push(ijs)
                })
                return list
            }

            //set max dept val
            var MAXDEPT = 8;

            var INDEX = 1;

            function getRoots(arr){
                var Roots = [];
                for(var i = 0; i < arr.length;i++){
                    var rootFlag = true
                    for ( var j = 0; j < arr.length;j++){
                        if (arr[i].upId == arr[j].id){
                            rootFlag = false
                            break
                        }
                    }
                    if (rootFlag == true){
                        Roots.push(arr[i])
                    }
                }
                return Roots
            }

            function traversed(node,arr){
                if (++INDEX > MAXDEPT){
                    console.log("递归超过8层,为保护计算机,退出递归");
                    return
                }
                for (var i = 0; i < arr.length; i++){

                    if (node == arr[i].upId){
                        arr[i].dept = INDEX
                        list.push(arr[i])
                        traversed(arr[i].id,arr)
                    }
                }
                INDEX--;
            }

            function listElem(roots,arr){
                for (var i = 0; i < roots.length; i++){
                    roots[i].dept = INDEX
                    list.push(roots[i])
                    traversed(roots[i].id,arr)
                }
            }

            listElem(getRoots(a),a)

            return list
        }

        function genTreeUI(a){
            var odivStyle='cursor:pointer;background-color: '+__DEFAULT.bgColor+';padding:0px;text-align: left !important;width: '+__DEFAULT.width+'; border:'+__DEFAULT.border+'; height: '+__DEFAULT.height+'; line-height: '+__DEFAULT.height+';padding-left:10px; display:inline-block; border-radius:'+__DEFAULT.borderRadius+''
            var odiv = '<div class="HshowSelectValue" style="'+odivStyle+'">' +
                '<span style="height: '+__DEFAULT.height+'; font-size: '+__DEFAULT.fontSize+'">'+__DEFAULT.placeholder+'</span>' +
                '<hzw style="position: relative;width: 20px; float: right;height: '+__DEFAULT.height+'; line-height: '+__DEFAULT.height+';">' +
                '<i style="border-color:#888 transparent transparent transparent;border-style: solid;border-width: 5px 4px 0px 4px;height: 0;left: 50%;margin-left: -4px;margin-top:-3px ;position: absolute;top: 50%;width: 0;"></i>' +
                '</hzw></div>'
            odiv+='<div class="HselectShowAreaHuangZhanWei" style="white-space:nowrap;background-color: #fefefe;border: '+__DEFAULT.showBorder+';display: none; border-radius: 3px ;position: fixed;z-index:9999">' +
                '<input style="border:#6699CC solid 1px; padding-left:5px;margin:5px 5px;height:'+__DEFAULT.showLiHeight+';"/>'
            var opt = odiv+'<ul style="z-index: 9999;padding: 0px;list-style: none;margin:0px;' +
                'max-height:'+__DEFAULT.showHeight+';' +
                'overflow: auto;' +
                '">'
            for(var i = 0; i < a.length; i++){
                var pd = parseInt(a[i].dept)*20 - 10
                if (isNaN(pd)){
                    pd = 10
                }
                var li = '<li data-id="'+a[i].id+'" data-dept="'+a[i].dept+'" style="margin:0px; text-align: left;font-weight:500;padding-left:'+pd+'px; height:'+__DEFAULT.showLiHeight+'; line-height: '+__DEFAULT.showLiHeight+'; font-size: '+__DEFAULT.showFontSize+'; cursor: pointer;position: relative;">' +
                    '<hzw class="HshowOrHideIconHzw" style="height: '+__DEFAULT.showLiHeight+'; line-height: '+__DEFAULT.showLiHeight+'; width: 20px;cursor: cell;display: inline-block">' +
                    '<i style="border-color:'+__DEFAULT.iconColor+' transparent transparent transparent;border-style: solid;border-width: 6px 5px 0px 5px;height: 0;margin-left: 1px;margin-top: -5px;position: absolute;top: 50%;width: 0;"></i>' +
                    '</hzw>' +
                    '<span style="height: '+__DEFAULT.showLiHeight+'; line-height: '+__DEFAULT.showLiHeight+'; position: absolute;">'+a[i].text+'</span></li>'
                opt+=li;
            }
            opt +='</ul></div>'
            return opt;
        }

        function showUp(e){
            var dept = $(e).attr("data-dept")
            $(e).prevAll().each(function(index,element){
                if (parseInt(dept)>parseInt($(element).attr("data-dept"))){
                    $(element).show();
                    dept = $(element).attr("data-dept")
                }
            })
        }

        function initSelect(selObj,arr){
            var optHtml = ""
            for (var i = 0; i < arr.length; i++){
                optHtml+='<option value="'+arr[i].id+'">'+arr[i].text+'</option>'
            }
            $(selObj).append(optHtml)
            $(selObj).hide()
        }

        function showOrHide(e){
            var topBorderColor = __DEFAULT.iconColor+' transparent transparent transparent'
            var leftBorderColor = 'transparent transparent transparent '+__DEFAULT.iconColor
            var dept = $(e).attr("data-dept")
            var nextObj = $(e).next()
            var nextDept = $(nextObj).attr("data-dept")
            var nextDisplay = $(nextObj).css("display")
            if (nextDisplay == "none" && parseInt(nextDept)>parseInt(dept)){
                $(e).find("i").css({
                    "border-color":topBorderColor,
                    "border-width":"6px 5px 0px 5px"
                })

                $(e).nextAll().each(function(index,element){
                    if (parseInt(dept)+1==parseInt($(element).attr("data-dept"))){
                        $(element).find("i").css({
                            "border-color":leftBorderColor,
                            "border-width":"5px 0px 5px 6px",
                        });

                        $(element).show();
                    }else if (parseInt(dept)+1 < parseInt($(element).attr("data-dept"))){
                        $(element).find("i").css({
                            "border-color":leftBorderColor,
                            "border-width":"5px 0px 5px 6px",
                        })

                        $(element).hide();
                    }else{
                        return false
                    }
                })
            }else if (nextDisplay == "none" && parseInt(nextDept)<=parseInt(dept)){
                return
            }else if (nextDisplay != "none" && parseInt(nextDept)>parseInt(dept)){

                $(e).find("i").css({
                    "border-color":leftBorderColor,
                    "border-width":"5px 0px 5px 6px",
                })

                $(e).nextAll().each(function(index,element){
                    if (parseInt(dept)<parseInt($(element).attr("data-dept"))){
                        $(element).find("i").css({
                            "border-color":leftBorderColor,
                            "border-width":"5px 0px 5px 6px",
                        })

                        $(element).hide();
                    }else if (parseInt(dept)>=parseInt($(element).attr("data-dept"))){
                        return false
                    }
                })
            }else {
                return
            }
        }

        var ui = genTreeUI(sortTree(__DEFAULT.data))
        initSelect(sel,__DEFAULT.data)

        $(obj).html(ui)
        $(sel).after(obj)
        $(obj).find("input").focus();
        // 清楚select的默认选中状态，确保select初始化后，没有任何值被选中
        $(sel).val("");

        $(obj).find("ul li").each(function(index,element){
            var curDept = parseInt($(element).attr("data-dept"))
            var nextDept = parseInt($(element).next().attr("data-dept"))
            if (curDept>=nextDept || isNaN(nextDept)){
                $(element).find("hzw").remove()
            }
        })

        $(obj).find("input").on('input',function(){
            window.event.cancelBubble = true;
            var inpText = $(this).val();
            if (inpText == ""){
                $(obj).find("ul li").show();
                return
            }
            $(obj).find("ul li").each(function(index,element){
                if ($(element).find("span").html().indexOf(inpText)>=0){
                    $(element).show()
                    showUp(element)
                }else{
                    $(element).hide()
                }
            })
        })

        $(obj).find("input").on('click',function(){
            window.event.cancelBubble = true;
            $(this).focus();
        })

        $(obj).find(".HshowOrHideIconHzw").on("click",function(){
            window.event.cancelBubble = true;
            showOrHide($(this).parent())
        })

        $(obj).find("li").on('mouseover',function(){
            window.event.cancelBubble = true;

            var ul = $(this).closest("ul")

            $(ul).find("li").css({
                "background-color":"",
                "color":""
            })

            $(this).css({
                "background-color":"#6699CC",
                "color":"white"
            })
        })

        $(obj).find("li").on('click',function(){
            window.event.cancelBubble = true;

            var text = $(this).find("span").html();
            var id = $(this).attr("data-id");
            $(sel).val(id);
            $(this).closest("div").prev().find("span").html(text);
            $(this).closest("div").hide();
            $("body").find(".Hzwy23FillBodyForSelectItems").animate({height:'0px'},500,function(){
                $(this).remove()
            });

            $(obj).find(".HshowSelectValue i").css({
                "border-color":"#888 transparent transparent transparent",
                "border-width":"5px 4px 0px 4px"
            });

            if (typeof __DEFAULT.onChange == "function"){
                __DEFAULT.onChange();
            };
        })

        $(obj).find("ul").on('mousewheel',function(){
            window.event.cancelBubble = true;
        })

        $("div").scroll(function() {
            window.event.cancelBubble = true;
            var showUiStatus = $(obj).find(".HselectShowAreaHuangZhanWei").css("display")
            if (showUiStatus != "none"){
                var ptop = $(obj).offset().top
                var pleft = $(obj).offset().left;
                var tp = ptop+$(obj).find(".HshowSelectValue").height()
                $(obj).find(".HselectShowAreaHuangZhanWei").offset({top:tp,left:pleft})
            }
        });

        $(document).scroll(function() {
            window.event.cancelBubble = true;
            var showUiStatus = $(obj).find(".HselectShowAreaHuangZhanWei").css("display")
            if (showUiStatus != "none"){
                var ptop = $(obj).offset().top
                var pleft = $(obj).offset().left;
                var tp = ptop+$(obj).find(".HshowSelectValue").height()
                $(obj).find(".HselectShowAreaHuangZhanWei").offset({top:tp,left:pleft})
            }
        });

        $("body").scroll(function() {
            window.event.cancelBubble = true;
            var showUiStatus = $(obj).find(".HselectShowAreaHuangZhanWei").css("display")
            if (showUiStatus != "none"){
                var ptop = $(obj).offset().top
                var pleft = $(obj).offset().left;
                var tp = ptop+$(obj).find(".HshowSelectValue").height()
                $(obj).find(".HselectShowAreaHuangZhanWei").offset({top:tp,left:pleft})
            }
        });

        $(obj).find(".HshowSelectValue").on('click',function(){
            var showUiStatus = $(obj).find(".HselectShowAreaHuangZhanWei").css("display")
            window.event.cancelBubble = true;
            if (showUiStatus == "none"){
                $(".HselectShowAreaHuangZhanWei").hide()
                $(".HshowSelectValue i").css({
                    "border-color":"#888 transparent transparent transparent",
                    "border-width":"5px 4px 0px 4px",
                })
                var w = $(obj).width()
                $(obj).find(".HselectShowAreaHuangZhanWei").css("min-width",w)
                $(obj).find(".HselectShowAreaHuangZhanWei input").css("min-width",w-12)


                var nextObj = $(this).next()
                $(nextObj).find("input").val("")
                $(nextObj).show();
                $(nextObj).find("input").focus();
                $(nextObj).find("ul").scrollTop(0);
                $(nextObj).find("ul").scrollLeft(0);
                $(obj).find(".HshowSelectValue i").css({
                    "border-color":"transparent transparent #888 transparent",
                    "border-width":"0px 4px 5px 4px"
                })

                var ptop = $(obj).offset().top
                var pleft = $(obj).offset().left;
                var tp = ptop+$(this).height()
                var ulHeight = $(nextObj).height()
                if (tp+ulHeight > document.body.scrollHeight){
                    var addHeight = tp+ulHeight+30 - document.body.scrollHeight
                    var appdiv = document.createElement("div")
                    $(appdiv).css("height",addHeight).addClass("Hzwy23FillBodyForSelectItems")
                    $("body").append(appdiv)
                    var st = $("body").scrollTop();
                    $("body").animate({scrollTop:st+addHeight},500)
                }
                $(obj).find(".HselectShowAreaHuangZhanWei").offset({
                    top:tp,
                    left:pleft
                })

            }else{
                $(obj).find("li").closest("div").hide();
                $(obj).find(".HshowSelectValue i").css({
                    "border-color":"#888 transparent transparent transparent",
                    "border-width":"5px 4px 0px 4px"
                })

                $("body").find(".Hzwy23FillBodyForSelectItems").animate({height:'0px'},500,function(){
                    $(this).remove()
                })
            }
        })

        $(document).on('click',function(){
            $(obj).find("li").closest("div").hide();
            $(obj).find(".HshowSelectValue i").css({
                "border-color":"#888 transparent transparent transparent",
                "border-width":"5px 4px 0px 4px"
            })
            $("body").find(".Hzwy23FillBodyForSelectItems").animate({height:'0px'},500,function(){
                $(this).remove()
            })
        });


        //when select was change
        //change show values
        $(sel).on('change',function(){
            //window.event.cancelBubble = true;
            var text = $(this).find("option:selected").text()
            $(obj).find(".HshowSelectValue span").html(text)
            if (typeof __DEFAULT.onChange == "function"){
                __DEFAULT.onChange();
            }
        });
    }
}(jQuery));

/*
 * 弹出框效果
 * */
(function($){

    $.extend({
        Hmodal:function(param){
            var __DEFAULT = {
                callback : "",
                preprocess: "",
                width:"600px",
                height:"230px ",

                header:"弹框信息",
                headerHeight:"30px",
                headerColor :"#009966",
                headerFontSize:"14px",
                headerFontColor:"white",

                body:"",

                footer:"",

                footerBtnStatus:true,
            }
            $.extend(true,__DEFAULT,param)

            //初始化弹框主体
            function init(){
                var mframe='<div class="modal-dialog">'+
                    '<div class="modal-content" style="border: '+__DEFAULT.headerColor+' solid 2px; width: '+__DEFAULT.width+'; height: '+__DEFAULT.height+';">'+
                    '<div class="modal-header" style="background-color: '+__DEFAULT.headerColor+'; height: '+__DEFAULT.headerHeight+'; line-height: '+__DEFAULT.headerHeight+'; padding: 0px;">'+
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="height: '+__DEFAULT.headerHeight+'; line-height: '+__DEFAULT.headerHeight+'; width: 30px; padding-top: 2px;">×</button>'+
                    '<h4 class="modal-title" style="margin-left: 15px;height: '+__DEFAULT.headerFontSize+';color: '+__DEFAULT.headerFontColor+'; line-height: '+__DEFAULT.headerHeight+';font-weight: 600; font-size: '+__DEFAULT.headerFontSize+'">'+__DEFAULT.header+'</h4>'+
                    '</div>'+
                    '<div class="modal-body" style="width: '+__DEFAULT.width+'; overflow-y: auto">'+__DEFAULT.body+'</div>'+
                    '<div class="modal-footer btn-group-sm">'+
                    '<button type="button" class="btn btn-danger cancel" data-dismiss="modal"><i class="icon-remove"></i>&nbsp;关闭</button>'+
                    '<button type="button" class="btn btn-primary submit"><i class="icon-ok"></i>&nbsp;提交</button>'+
                    '</div>' +
                    '</div>' +
                    '</div>';
                return mframe;
            }
            //显示弹出框
            function showModal(mframe){
                var hmod=document.createElement("div");
                $(hmod).addClass("modal fade").attr({
                    "tabindex":"-1",
                    "role":"dialog",
                    "aria-labelledby":"myModalLabel",
                    "aria-hidden":"true",
                })
                hmod.innerHTML=mframe;
                document.body.appendChild(hmod);
                $(hmod).modal({backdrop:false});
                $(hmod).modal("show");
                return hmod
            }

            //根据类获取对象实例
            function getObj(mod,className,typeObj){
                if (typeof typeObj == "undefined"){
                    typeObj = "div"
                }
                var obj = {}
                $(mod).find(typeObj).each(function(index,element){
                    if ($(element).hasClass(className)){
                        obj = element
                    }
                })
                return obj
            }

            //调节body高度和宽度
            function modifyBodyHeightAndWidth(mod){
                var headerObj = getObj(mod,"modal-header")
                var contentObj = getObj(mod,"modal-content")
                var bodyObj = getObj(hmode,"modal-body")
                var headHeight = $(headerObj).height()
                var contentHeight = $(contentObj).height()

                $(bodyObj).css("height",contentHeight-headHeight-65)
                $(bodyObj).css("width","-=4")
            }

            //modify location
            function modifyLocation(mod){
                var ww = $(window).width()
                var wh = $(window).height();
                var mw = $(getObj(mod,"modal-content")).width()
                var mh = $(getObj(mod,"modal-content")).height()
                //var modifyY = (wh - 2*mh)/2
                var modifyX = (ww - mw)/2
                $(getObj(mod,"modal-content")).offset({
                    left:modifyX
                })
            }

            //
            var mframe =  init()
            var hmode = showModal(mframe)
            modifyBodyHeightAndWidth(hmode)
            modifyLocation(hmode)
            //close modal when click close button in right header
            $(getObj(hmode,"modal-header")).find("button").on("click",function(){
                $(hmode).remove();
            })

            // init footer
            //
            if (__DEFAULT.footerBtnStatus){
                var footer = $(getObj(hmode,"modal-body")).find(".h-modal-footer")
                if ($(footer).find("button").html()==""){
                    console.log("can not found button in modal body content")
                    $(getObj(getObj(hmode,"modal-footer"),"submit","button")).on("click",function(){
                        console.log("no button found, default submit")
                        $(hmode).remove()
                    })
                    $(getObj(getObj(hmode,"modal-footer"),"cancel","button")).on("click",function(){
                        console.log("no button found, default cancel")
                        $(hmode).remove()
                    })
                }else{
                    $(getObj(hmode,"modal-footer")).html($(footer).html())
                    $(footer).remove()
                    if (__DEFAULT.callback == "") {
                        $(getObj(getObj(hmode,"modal-footer"),"submit","button")).on("click",function(){
                            console.log("no callback found, default submit")
                            $(hmode).remove()
                        })
                        $(getObj(getObj(hmode,"modal-footer"),"cancel","button")).on("click",function(){
                            console.log("no callback found, default cancel")
                            $(hmode).remove()
                        })
                    } else if (typeof __DEFAULT.callback == "function"){
                        $(getObj(getObj(hmode,"modal-footer"),"cancel","button")).on("click",function(){
                            console.log("defined callback, cancel")
                            $(hmode).remove()
                        })
                        $(getObj(getObj(hmode,"modal-footer"),"submit","button")).on("click",function(){
                            console.log("defined callback, submit")
                            __DEFAULT.callback(hmode)
                        })
                    }
                }
            }else{
                $(getObj(hmode,"modal-footer")).remove();
                var h = $(getObj(hmode,"modal-body")).height();
                $(getObj(hmode,"modal-body")).height(h+57);
            }


            // preprocess function
            if (typeof  __DEFAULT.preprocess == "function"){
                __DEFAULT.preprocess(hmode)
            }


            // 拖动绑定
            var d = "getSelection" in window?function(){
                window.getSelection().removeAllRanges()
            }:function(){
                document.selection.empty()
            };

            var f=0,c=0,e=0,b=0,a=0;
            $(getObj(hmode,"modal-header")).bind("mousemove",function(h){
                if(a==1){
                    f=h.pageX-e;
                    c=h.pageY-b;
                    if(c<=0){
                        c=0
                    }
                    $(this).parent().offset({left:f,top:c})
                }
            }).bind("mousedown",function(h){
                d();
                e=h.pageX-$(this).parent().offset().left;
                b=h.pageY-$(this).parent().offset().top;
                a=1;
                $(getObj(hmode,"modal-header")).css({"cursor":"move"})}
            ).bind("mouseup",function(h){
                $(getObj(hmode,"modal-header")).css({"cursor":"default"});
                a=0;
                e=0;
                b=0
            }).bind("mouseleave",function(h){
                a=0;
                $(getObj(hmode,"modal-header")).css({"cursor":"default"})
            })
        },
        Hconfirm:function(param){
            var __DEFAULT = {
                callback : "",
                preprocess: "",
                width:"360px",
                height:"230px ",

                header:"弹框信息",
                headerHeight:"30px",
                headerColor :"#009966",
                headerFontSize:"14px",
                headerFontColor:"white",

                body:"",
                footer:"",
                cancelBtn:true,
                submitBtn:true,
            }
            $.extend(true,__DEFAULT,param)

            //初始化弹框主体
            function init(){
                var mframe='<div class="modal-dialog">'+
                    '<div class="modal-content" style="border: '+__DEFAULT.headerColor+' solid 2px; width: '+__DEFAULT.width+'; height: '+__DEFAULT.height+';">'+
                    '<div class="modal-header" style="background-color: '+__DEFAULT.headerColor+'; height: '+__DEFAULT.headerHeight+'; line-height: '+__DEFAULT.headerHeight+'; padding: 0px;">'+
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="height: '+__DEFAULT.headerHeight+'; line-height: '+__DEFAULT.headerHeight+'; width: 30px; padding-top: 2px;">×</button>'+
                    '<h4 class="modal-title" style="margin-left: 15px;height: '+__DEFAULT.headerFontSize+';color: '+__DEFAULT.headerFontColor+'; line-height: '+__DEFAULT.headerHeight+';font-weight: 600; font-size: '+__DEFAULT.headerFontSize+'; margin-right: 30px;">'+__DEFAULT.header+'</h4>'+
                    '</div>'+
                    '<div class="modal-body" style="width: '+__DEFAULT.width+'; overflow-y: auto">'+__DEFAULT.body+'</div>'+
                    '<div class="modal-footer btn-group-sm">'+
                    '<button type="button" class="btn btn-danger cancel" data-dismiss="modal"><i class="icon-remove"></i>&nbsp;取消</button>'+
                    '<button type="button" class="btn btn-primary submit"><i class="icon-ok"></i>&nbsp;确定</button>'+
                    '</div>' +
                    '</div>' +
                    '</div>';
                return mframe;
            }

            //显示弹出框
            function showModal(mframe){
                var hmod=document.createElement("div");
                $(hmod).addClass("modal fade").attr({
                    "tabindex":"-1",
                    "role":"dialog",
                    "aria-labelledby":"myModalLabel",
                    "aria-hidden":"true",
                })
                hmod.innerHTML=mframe;
                document.body.appendChild(hmod);
                $(hmod).modal({backdrop:false});
                $(hmod).modal("show");
                return hmod
            }

            //根据类获取对象实例
            function getObj(mod,className,typeObj){
                if (typeof typeObj == "undefined"){
                    typeObj = "div"
                }
                var obj = {}
                $(mod).find(typeObj).each(function(index,element){
                    if ($(element).hasClass(className)){
                        obj = element
                    }
                })
                return obj
            }

            //调节body高度和宽度
            function modifyBodyHeightAndWidth(mod){
                var headerObj = getObj(mod,"modal-header")
                var contentObj = getObj(mod,"modal-content")
                var bodyObj = getObj(hmode,"modal-body")
                var headHeight = $(headerObj).height()
                var contentHeight = $(contentObj).height()

                $(bodyObj).css("height",contentHeight-headHeight-65)
                $(bodyObj).css("width","-=4")
            }

            //modify location
            function modifyLocation(mod){
                var ww = $(window).width()
                var wh = $(window).height();
                var mw = $(getObj(mod,"modal-content")).width()
                var mh = $(getObj(mod,"modal-content")).height()
                var modifyY = (wh - 2*mh)/2
                var modifyX = (ww - mw)/2
                $(getObj(mod,"modal-content")).offset({
                    left:modifyX,
                    top:modifyY
                })
            }

            function initfooter(mode){
                if (!__DEFAULT.cancelBtn){
                    $(getObj(mode,"cancel","button")).remove();
                }
                if (!__DEFAULT.submitBtn){
                    $(getObj(mode,"submit","button")).remove();
                }
            }

            //
            var mframe =  init()
            var hmode = showModal(mframe)
            modifyBodyHeightAndWidth(hmode)
            modifyLocation(hmode);

            //close modal when click close button in right header
            $(getObj(hmode,"modal-header")).find("button").on("click",function(){
                $(hmode).remove();
            })

            // init footer
            var footer = $(getObj(hmode,"modal-body")).find(".h-modal-footer")
            if ($(footer).find("button").html()==""){
                console.log("can not found button in modal body content")
                $(getObj(getObj(hmode,"modal-footer"),"submit","button")).on("click",function(){
                    console.log("no button found, default submit")
                    $(hmode).remove()
                })
                $(getObj(getObj(hmode,"modal-footer"),"cancel","button")).on("click",function(){
                    console.log("no button found, default cancel")
                    $(hmode).remove()
                })
            }else{
                $(getObj(hmode,"modal-footer")).html($(footer).html())
                $(footer).remove()
                if (__DEFAULT.callback == ""){
                    $(getObj(getObj(hmode,"modal-footer"),"submit","button")).on("click",function(){
                        console.log("no callback found, default submit")
                        $(hmode).remove()
                    })
                    $(getObj(getObj(hmode,"modal-footer"),"cancel","button")).on("click",function(){
                        console.log("no callback found, default cancel")
                        $(hmode).remove()
                    })
                }else if (typeof __DEFAULT.callback == "function"){
                    $(getObj(getObj(hmode,"modal-footer"),"cancel","button")).on("click",function(){
                        console.log("defined callback, cancel")
                        $(hmode).remove()
                    })
                    $(getObj(getObj(hmode,"modal-footer"),"submit","button")).on("click",function(){
                        console.log("defined callback, submit")
                        __DEFAULT.callback()
                        $(hmode).remove()
                    })
                }
            }
            initfooter(hmode)
            // preprocess function
            if (typeof  __DEFAULT.preprocess == "function"){
                __DEFAULT.preprocess()
            }
            // 拖动绑定
            var d = "getSelection" in window?function(){
                window.getSelection().removeAllRanges()
            }:function(){
                document.selection.empty()
            };

            var f=0,c=0,e=0,b=0,a=0;
            $(getObj(hmode,"modal-header")).bind("mousemove",function(h){
                if(a==1){
                    f=h.pageX-e;
                    c=h.pageY-b;
                    if(c<=0){
                        c=0
                    }
                    $(this).parent().offset({left:f,top:c})
                }
            }).bind("mousedown",function(h){
                d();
                e=h.pageX-$(this).parent().offset().left;
                b=h.pageY-$(this).parent().offset().top;
                a=1;
                $(getObj(hmode,"modal-header")).css({"cursor":"move"})}
            ).bind("mouseup",function(h){
                $(getObj(hmode,"modal-header")).css({"cursor":"default"});
                a=0;
                e=0;
                b=0
            }).bind("mouseleave",function(h){
                a=0;
                $(getObj(hmode,"modal-header")).css({"cursor":"default"})
            })
        },
        /*
         * 这个函数，用户显示提示框。
         * */
        Notify:function(param){
            var DEFAULT = {
                icon:"icon-ok",
                caption:"",
                title:"执行成功",
                message:"执行成功",
                content:"",
                type:"success",
                position:null,
                placement: {
                    from: "top",
                    align: "center"
                },
            };

            $.extend(true,DEFAULT,param);
            switch (DEFAULT.type){
                case "success":DEFAULT.icon = "icon-ok";break;
                case "danger":DEFAULT.icon = "icon-remove" ; break;
                case "info" : DEFAULT.icon = "icon-bullhorn";break;
                case "primary": DEFAULT.icon = "icon-bell" ; break;
                case "warning": DEFAULT.icon = "icon-warning-sign"; break;
                default :
                    DEFAULT.icon = "icon-bullhorn"
            }

            if (DEFAULT.caption !=""){
                DEFAULT.title = DEFAULT.caption
            }

            if (DEFAULT.content !=""){
                DEFAULT.message = DEFAULT.content
            }

            $.notify({
                // options
                icon: DEFAULT.icon,
                title: DEFAULT.title,
                message:DEFAULT.message,
                url: '',
                target: '_blank'
            },{
                // settings
                element: 'body',
                position: DEFAULT.position,
                type: DEFAULT.type,
                allow_dismiss: true,
                newest_on_top: true,
                showProgressbar: false,
                placement:DEFAULT.placement,
                offset: 20,
                spacing: 10,
                z_index: 2147483647,
                delay: 3000,
                timer: 1000,
                url_target: '_blank',
                mouse_over: null,
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                onShow: null,
                onShown: null,
                onClose: null,
                onClosed: null,
                icon_type: 'class',
            });
        },
        HAjaxRequest:function(a){
            var b = {
                type:"get",
                url:"",
                data:"",
                cache:false,
                async:false,
                dataType:"json",
                error:function(m) {
                    var msg = JSON.parse(m.responseText);
                    jQuery.Notify({
                        title: "温馨提示：",
                        message: msg.error_msg,
                        type: "danger",
                    });
                    console.log("return code is :",msg.error_code);
                    console.log("return details error info:",msg.error_details);
                    console.log("return version: ",msg.version);
                },
                success:function(b){

                }
            };
            $.extend(!0,b,a);
            "delete"==b.type.toLowerCase()?(
                    b.data._method="DELETE",
                        $.ajax({
                            type:"post",
                            url:b.url,
                            cache:b.cache,
                            async:b.async,
                            data:b.data,
                            dataType:b.dataType,
                            error:b.error,
                            success:function(a){
                                b.success(a)}
                        })
                ):$.ajax({
                    type:b.type,
                    url:b.url,
                    cache:b.cache,
                    async:b.async,
                    data:b.data,
                    dataType:b.dataType,
                    error:b.error,
                    success:function(a){b.success(a)}
                })
        },
    })
}(jQuery));