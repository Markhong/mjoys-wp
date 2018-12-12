function setCookies(e, t, a) {
    var o = new Date;
    o.setDate(o.getDate() + a),
    document.cookie = e + "=" + escape(t) + (null == a ? "" : ";expires=" + o.toGMTString()) + ";path=/"
}
function getCookies(e) {
    return document.cookie.length > 0 && (c_start = document.cookie.indexOf(e + "="),
    -1 != c_start) ? (c_start = c_start + e.length + 1,
    c_end = document.cookie.indexOf(";", c_start),
    -1 == c_end && (c_end = document.cookie.length),
    unescape(document.cookie.substring(c_start, c_end))) : ""
}

var lottery = {
    index: -1, //当前转动到哪个位置，起点位置
    count: 0, //总共有多少个位置
    timer: 0, //setTimeout的ID，用clearTimeout清除
    speed: 20, //初始转动速度
    times: 0, //转动次数
    cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1, //中奖位置
    init: function(id) {
        if($('#' + id).find('.lottery-unit').length > 0) {
            $lottery = $('#' + id);
            $units = $lottery.find('.lottery-unit');
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find('.lottery-unit.lottery-unit-' + this.index).addClass('active');
        };
    },
    roll: function() {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find('.lottery-unit.lottery-unit-' + index).removeClass('active');
        index += 1;
        if(index > count - 1) {
            index = 0;
        };
        $(lottery).find('.lottery-unit.lottery-unit-' + index).addClass('active');
        this.index = index;
        return false;
    },
    stop: function(index) {
        this.prize = index;
        return false;
    }
};

var click = false;
var prizeTime = 0;
var ifShared = false;

function roll() {
    lottery.times += 1;
    lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化

    if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
        clearTimeout(lottery.timer);
    
        setTimeout(function() {
            layer.open({
                type: 1,			           
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: ['793px', '600px'],
                content: !ifShared ? $("#info2").html() : $("#info").html()
            });
        }, 1000);
        
        
        lottery.prize = -1;
        lottery.times = 0;
        // click = false;
    } else {
        if(lottery.times < lottery.cycle) {
            lottery.speed -= 10;
        } else if(lottery.times == lottery.cycle) {
            var index = Math.random() * (lottery.count) | 0; //静态演示，随机产生一个奖品序号，实际需请求接口产生
            if (index >= 0 & index < 4) {
                index = 0;
            } else {
                index = 5;
            }
            lottery.prize = index;
        } else {
            if(lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                lottery.speed += 110;
            } else {
                lottery.speed += 20;
            }
        }
        if(lottery.speed < 40) {
            lottery.speed = 40;
        };
        lottery.timer = setTimeout(roll, lottery.speed); //循环调用
    }
    return false;
}

window.onload = function() {
    
    lottery.init('lottery');
    $('.draw-btn').click(function() {
        
        if (getCookies('prizeTime') !=='' && parseInt(getCookies('prizeTime')) >= 1 && !ifShared) {
            $('#modal-prizeTimesEnd').addClass('modal--show');
            return;
        }
        setCookies('prizeTime', 1, 30);
        if(click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            return false;

        } else {
            lottery.speed = 100;
            roll(); //转圈过程不响应click事件，会将click置为false
            click = true; //一次抽奖完成后，设置click为true，可继续抽奖		
            return false;
        }
    });

    $('.help').click(function() {
        var dataModal = $(this).data('modal');
        $("#" + dataModal).toggleClass('modal--show');
    });
    $('.gotocalc').click(function() {
        window.location.href="./calcCarXian.html";
    });
    $('.gotowin').click(function() {
        window.location.href="./luckydraw.html";
    });
    $('.modal-overlay').click(function() {
        $('.modal--show').toggleClass('modal--show');
    });

    var errorTime = 0;
    $("#formGetPrice").submit(function(){
        var data = {};
        data.insurance = $('#carcode').val();
        data.name = $('#name').val();
        data.mobile = $('#tel').val();
        data.action = "getPrice_action";
        $.ajax({
            url: 'https://batman.mjoys.com/bat/open/shanghai/getFee',
            data: data,
            beforeSend: function () {
                $("#waitingforprice").toggleClass('modal--show');
                $('.modal-overlay').unbind('click');
            },
            error: function (request) {
                errorTime++;
                $("#waitingforprice").removeClass('modal--show');
                $("#formError").addClass('modal--show');
                if (errorTime == 1) {
                    $("#formError #form-error1").show();
                    $("#formError #form-error2").hide();
                } else {
                    $("#formError #form-error2").show();
                    $("#formError #form-error1").hide();
                }
                
            },
            success: function (response) {
                if (response.data === null) {
                    errorTime++;
                    $("#waitingforprice").removeClass('modal--show');
                    $("#formError").addClass('modal--show');
                    if (errorTime == 1) {
                        $("#formError #form-error1").show();
                        $("#formError #form-error2").hide();
                    } else {
                        $("#formError #form-error2").show();
                        $("#formError #form-error1").hide();
                    }
                    return;
                }
                //https://batman.mjoys.com/bat/open/shanghai/getFee?insurance=%E6%B2%AAGC9262&name=%E6%9D%8E%E6%98%8E&mobile=13811238989
                //CPIC: {totalPremium: "2885.61", biPremium: "1635.61", ciPremium: "950.00", vehicleTaxPremium: "300.00", biDiscount: "0.4225"}
                //PICC: {totalPremium: "2885.61", biPremium: "1635.61", ciPremium: "950.00", vehicleTaxPremium: "300.00", biDiscount: "0.4225"}
                var objResponseData = {};
                JSON.parse(response.data.data).forEach(function(responseData) {
                    objResponseData[responseData.insureComCode] = {
                        'totalPremium': responseData.totalPremium,
                        'biPremium': responseData.biPremium,
                        'ciPremium': responseData.ciPremium,
                        'vehicleTaxPremium': responseData.vehicleTaxPremium,
                        'biDiscount': responseData.discountInfo.biDiscount
                    }
                });
                $("#waitingforprice").removeClass('modal--show');
                $('.form-calc').hide();
                $('.calc-result').show();
                // alert(objResponseData['PICC'].biDiscount);
                $('#carInfo-number').html(response.data.insurance);
                var myDate = new Date();
                $('#carInfo-date').html(myDate.getFullYear()+'.'+myDate.getMonth() + 1 +'.'+myDate.getDate() + ' - ' + (parseInt(myDate.getFullYear())+1)+'.'+myDate.getMonth()+'.'+myDate.getDate());
                
                for(var i in objResponseData) {
                    $('.insuranceinfo').append('<div class="insuranceinfo--details">' +
                            '<div class="insuranceinfo--title">' +
                                (i == 'CPIC' ? '太平洋保险' : '人民保险') +
                            '</div>' +
                            '<div>总保费：￥' + objResponseData[i].totalPremium + '</div>' +
                            '<div>交强险：￥' + objResponseData[i].ciPremium + '</div>' +
                            '<div>商业险：￥' + objResponseData[i].biPremium + '</div>' +
                            '<div>车船税：￥' + objResponseData[i].vehicleTaxPremium + '</div>' +
                            '<div>商业折扣：' + parseFloat(objResponseData[i].biDiscount)*10 + '折</div>' +
                        '</div>');
                }
            }
        });
        //https://batman.mjoys.com/open/bat/shanghai/getFee?insurance=%E6%B2%AAGC9262&name=%E6%9D%8E%E6%98%8E&mobile=13811238989
        // $.ajax({
        //     url: "http://www.mjoys.com/wp-admin/admin-ajax.php",
        //     data: data,
        //     type: "POST",
        //     beforeSend: function () {
        //         $("#waitingforprice").toggleClass('modal--show');
        //         $('.modal-overlay').unbind('click');
        //     },
        //     error: function (request) {
        //         errorTime++;
        //         $("#waitingforprice").removeClass('modal--show');
        //         $("#formError").addClass('modal--show');
        //         if (errorTime == 1) {
        //             $("#formError #form-error1").show();
        //             $("#formError #form-error2").hide();
        //         } else {
        //             $("#formError #form-error2").show();
        //             $("#formError #form-error1").hide();
        //         }
                
        //     },
        //     success: function (data) {
        //         // $('#adusername').val("");
        //         // $('#ademail').val("");
        //         // $('#adtel').val("");
        //         // $('#adurl').val("");
        //     }
        // });
        return false;
    });

    $('.modal-close').click(function() {
        $('.modal--show').removeClass('modal--show');
        $('.modal-overlay').bind('click', function() {
            $('.modal--show').toggleClass('modal--show');
        });
    });

    
};

$(function() {
    $(document).on("click", ".gotoforward", function(){ 
        $('#layui-m-layer0').hide();
        $('#modal-forward').addClass('modal--show');
    }); 
});


// function sendMessage(){
//     WeixinJSBridge.on('menu:share:timeline', function(argv){
//         alert("调用成功！现在可以通过右上角按钮分享给朋友或者朋友圈！");
//         WeixinJSBridge.invoke('shareTimeline', {
//                 "appid":"",          //appid 设置空就好了。
//                 "img_url":"",         //分享时所带的图片路径
//                 "img_width":"120",         //图片宽度
//                 "img_height":"120",        //图片高度
//                 "link":"//www.jb51.net",      //分享附带链接地址
//                 "desc":"极客标签--//www.jb51.net",    //分享内容介绍
//                 "title":"发现 极客标签 - 做最棒的极客知识分享平台"
//             }, function(res){/*** 回调函数，最好设置为空 ***/
//             });
//     });
    
// }

// function hideMenu(){
//     WeixinJSBridge.call('hideOptionMenu');
//    }

// if(document.addEventListener){
//     document.addEventListener('WeixinJSBridgeReady', sendMessage, false); 
// }else if(document.attachEvent){
//     document.attachEvent('WeixinJSBridgeReady' , sendMessage); 
//     document.attachEvent('onWeixinJSBridgeReady' , sendMessage); 
// }
   
//判断网页是否在微信中被调用
// var ua = navigator.userAgent.toLowerCase();
// if(ua.match(/MicroMessenger/i)=="micromessenger") {
// } else {
//     alert("调用失败，请用微信扫一扫，扫描下面二维码打开网页！");
// }
   