/**
 Core layout handlers and component wrappers
 **/
function setCookies(cookie_name, cookie_value, cookie_expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + cookie_expiredays);
	document.cookie = cookie_name + "=" + escape(cookie_value) + ((cookie_expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}
function getCookies(a) {
	return document.cookie.length > 0 && (c_start = document.cookie.indexOf(a + "="), -1 != c_start) ? (c_start = c_start + a.length + 1, c_end = document.cookie.indexOf(";", c_start), -1 == c_end && (c_end = document.cookie.length), unescape(document.cookie.substring(c_start, c_end))) : ""
}
function getRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function checkinput(i,tip){
    if(i.validity.typeMismatch==true){
        i.setCustomValidity(tip);
    }
    else{
        i.setCustomValidity('');
    }
}

//设置计数
$.fn.countTo = function (options) {
    options = options || {};
    return $(this).each(function () {
        //当前元素的选项
        var settings = $.extend({}, $.fn.countTo.defaults, {
            from:            $(this).data('from'),
            to:              $(this).data('to'),
            speed:           $(this).data('speed'),
            refreshInterval: $(this).data('refresh-interval'),
            decimals:        $(this).data('decimals')
        }, options);
        //更新值
        var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;
        //更改应用和变量
        var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};
        $self.data('countTo', data);
        //如果有间断，找到并清除
        if (data.interval) {
            clearInterval(data.interval);
        };
        data.interval = setInterval(updateTimer, settings.refreshInterval);
        //初始化起始值
        render(value);
        function updateTimer() {
            value += increment;
            loopCount++;
            render(value);
            if (typeof(settings.onUpdate) == 'function') {
                settings.onUpdate.call(self, value);
            }
            if (loopCount >= loops) {
                //移出间隔
                $self.removeData('countTo');
                clearInterval(data.interval);
                value = settings.to;
                if (typeof(settings.onComplete) == 'function') {
                    settings.onComplete.call(self, value);
                }
            }
        }
        function render(value) {
            var formattedValue = settings.formatter.call(self, value, settings);
            $self.html(formattedValue);
        }
    });
}
$.fn.countTo.defaults={
    from:0,               //数字开始的值
    to:0,                 //数字结束的值
    speed:1000,           //设置步长的时间
    refreshInterval:100,  //隔间值
    decimals:0,           //显示小位数
    formatter: formatter, //渲染之前格式化
    onUpdate:null,        //每次更新前的回调方法
    onComplete:null       //完成更新的回调方法
}
function formatter(value, settings){
    return value.toFixed(settings.decimals);
}
//自定义格式
$('#count-number').data('countToOptions',{
    formmatter:function(value, options){
        return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
    }
});
//定时器
$('.timer').each(count);
function count(options){
    var $this=$(this);
    options=$.extend({}, options||{}, $this.data('countToOptions')||{});
    $this.countTo(options);
}

$(function(){
    menuBg();
    $(window).scroll(function(event){
        menuBg();
    });
	$(".navbar .bars").click(function() {
        $(this).toggleClass('bars-active');
        $("#dropdownmenu-menu").slideToggle(400);
    });

    $('body')
        .on('click', '.financial-data-tabs>li>a', function(){
            $(this).addClass('tab-active').parent().addClass('active-li').siblings().removeClass('active-li').children('a').removeClass('tab-active');
        })
        .on('mouseenter', '.financial-data-tabs>li>a', function(){
            $(this).addClass('tab-active').parent().siblings().not('.active-li').children('a').removeClass('tab-active');
        })
        .on('mouseleave', '.financial-data-tabs>li>a', function(){
            var liactive = $(this).parent().hasClass('active-li');
            if(!liactive){
                $(this).removeClass('tab-active');
            }
        })
        .on('click', '.not-link', function(){
            return false;
        });

    function menuBg(){
        var winPos = $(window).scrollTop();
        var winHeight = $(window).height();
        if(winPos>winHeight/4){
            $('.nav-main').addClass('nav-main--fixed');
        }else{
            $('.nav-main').removeClass('nav-main--fixed');
        }
    }
    var ifmobile= false;
    for (var a = new Array("iphone", "ipod", "android", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire"), b = navigator.userAgent.toLowerCase(), ifmobile = !1, d = 0; d < a.length; d++)
        if (-1 != b.indexOf(a[d])) {
            ifmobile = !0;
            break
        }
    /*
    if(ifmobile){
        $(".menu-item-has-children > a").on("click",function(){
            $(this).next(".dropdown-menu").slideToggle(400);
            return false;
        });
        $('.home-banner-img').show();
    }else{
        $('.home-banner-img').hide();
        var video = '<video autoplay="autoplay" loop="loop"> <source src="http://static.mxassets.com/mjoys/media/index.mp4" type="video/mp4" /> <img src="http://static.mxassets.com/mjoys/img/banner.png" alt="AI + Big Data   For 鏅鸿兘鍟嗕笟鏈潵閲戣瀺"/> </video>';
        $('.home-banner').append(video);
    }
    */
    $(".play-icon  .play-icon-img").hover(function(){
        $(this).children("img").stop(true);
        $(this).children("img").animate({width:"0px",height:"0px"},500);
    },function(){
        $(this).children("img").animate({width:"118px",height:"118px"},10);
    });

    function querystr(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
    $('#coporation').on('change', function() {
        if($(this).val() === '4') {
            $('#applyOther').parents('.form-row').removeClass('none')
        } else {
            $('#applyOther').parents('.form-row').addClass('none')
        }
    });
    var coporation = querystr('coporation') || '';
    $('#coporation option').each(function(i, n) {
        if($(this).val() === coporation) {
            $(this).attr('selected', 'true');
        }
        if(coporation==4) $('#applyOther').parents('.form-row').removeClass('none');
    });

    $("#formapply").submit(function(){
        var data = {};
        data.username = $('#applyusername').val();
        data.email = $('#applyemail').val();
        data.tel = $('#applytel').val();
        data.company = $('#applycompany').val();
        data.website = $('#applywebsite').val();
        data.action = "apply_action";
        //$.post('http://www.mjoys.com/wp-admin/admin-ajax.php',data, onSuccess);
        $.ajax({
            url: "http://www.mjoys.com/wp-admin/admin-ajax.php",
            data: data,
            type: "POST",
            beforeSend: function () {
                // setCookies("whitepaper_name", $('#downloadwhitepaper_username').val(), 365);
                // setCookies("whitepaper_email", $('#downloadwhitepaper_email').val(), 365);
                // setCookies("whitepaper_tel", $('#downloadwhitepaper_tel').val(), 365);
                // setCookies("whitepaper_website", $('#downloadwhitepaper_website').val(), 365);
                // window.location.href = "/livechat/thankyoufordownload.aspx?whitepapertype=" + $('#thankyoupage').val();
            },
            error: function (request) {
            },
            success: function (data) {
                alert("鎻愪氦鎴愬姛锛�");
                $('#applyusername').val("");
                $('#applyemail').val("");
                $('#applytel').val("");
                $('#applycompany').val("");
                $('#applywebsite').val("");
            }
        });
        return false;
    });

    $("#formcoporation").submit(function(){
        var data = {};
        data.username = $('#applyusername').val();
        // data.email = $('#applyemail').val();
        data.tel = $('#applytel').val();
        // data.job = $('#applyJob').val();
        // data.company = $('#applycompany').val();
        // data.website = $('#applywebsite').val();
        data.coporation = getparm();
        data.beizhu = $('#applybeizhu').val();
        data.action = "coporation_action";
        //$.post('http://www.mjoys.com/wp-admin/admin-ajax.php',data, onSuccess);
        $(this).find('[type="submit"]').attr('disabled', 'disabled');
        $.ajax({
            url: "http://www.mjoys.com/wp-admin/admin-ajax.php",
            data: data,
            type: "POST",
            beforeSend: function () {
                // setCookies("whitepaper_name", $('#downloadwhitepaper_username').val(), 365);
                // setCookies("whitepaper_email", $('#downloadwhitepaper_email').val(), 365);
                // setCookies("whitepaper_tel", $('#downloadwhitepaper_tel').val(), 365);
                // setCookies("whitepaper_website", $('#downloadwhitepaper_website').val(), 365);
                // window.location.href = "/livechat/thankyoufordownload.aspx?whitepapertype=" + $('#thankyoupage').val();
            },
            error: function (request) {
            },
            success: function (data) {
                setTimeout(function(){
                    window.location.href = '/signup/success/';
                }, 500);
            }
        });
        return false;
    });
    function getparm() {
        var url = window.location.href;
        var arr = url.split('=');
        if (arr.length > 1) {
            return arr[1];
        } else {
            return '';
        }
    }
    $("#formadalliance").submit(function(){
        var data = {};
        data.username = $('#adusername').val();
        data.email = $('#ademail').val();
        data.tel = $('#adtel').val();
        data.url = $('#adurl').val();
        data.action = "adalliance_action";
        $.ajax({
            url: "http://www.mjoys.com/wp-admin/admin-ajax.php",
            data: data,
            type: "POST",
            beforeSend: function () {
                // setCookies("whitepaper_name", $('#downloadwhitepaper_username').val(), 365);
                // setCookies("whitepaper_email", $('#downloadwhitepaper_email').val(), 365);
                // setCookies("whitepaper_tel", $('#downloadwhitepaper_tel').val(), 365);
                // setCookies("whitepaper_website", $('#downloadwhitepaper_website').val(), 365);
                // window.location.href = "/livechat/thankyoufordownload.aspx?whitepapertype=" + $('#thankyoupage').val();
            },
            error: function (request) {
            },
            success: function (data) {
                alert("鎻愪氦鎴愬姛锛�");
                $('#adusername').val("");
                $('#ademail').val("");
                $('#adtel').val("");
                $('#adurl').val("");
            }
        });
        return false;
    });

    $(".list-job").on("click",function(){
        var $this = $(this);
        var $thisjobdetail = $this.next(".list-job-detail");
        $this.toggleClass("list-header-open");
        $thisjobdetail.slideToggle(400);
    });

    if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))){
        new WOW().init();
    };

    $('.show-datuidetails').on('click', function(){
        $(".datui-details").toggleClass("datui-details-show");
    });
    var ifHasShowMoreHonor = false;
    $('.honor-more').on('click', function(){
        if (!ifHasShowMoreHonor) {
            var $honormorecontent = $('.honor-morecontent');
            var moreContentWidth = $('.honor-morecontent > div').length * 150;
            $('.honor').animate({
                'height': $('.honor').height()+moreContentWidth
            }, 400);
            $('.honor-morecontent').show('400');
            ifHasShowMoreHonor = true;
        }

    });

    $("#from-quanyutong").submit(function(){
        // var data = {};
        // data.tel = $('#tel').val();
        // data.action = "quanyutong_action";
        // $(this).find('[type="submit"]').attr('disabled', 'disabled');
        // $.ajax({
        //     url: "http://www.mjoys.com/wp-admin/admin-ajax.php",
        //     data: data,
        //     type: "POST",
        //     beforeSend: function () {
        //     },
        //     error: function (request) {
        //     },
        //     success: function (data) {
        //         setTimeout(function(){
        //             window.location.href = '/signup/success/';
        //         }, 500);
        //     }
        // });
        // return false;
        window.location.href = 'http://www.mjoys.com/signup/?tel=' + $('#tel').val();
        return false;
    });   

    $("#applytel").val(getRequest()['tel']);


    $('.audio-player audio').each(function() {
        $(this).mediaelementplayer({
        alwaysShowControls: true,
        features: ['playpause','progress'],
        audioWidth: 222,
        audioHeight: 250,
        iPadUseNativeControls: true,
        iPhoneUseNativeControls: true,
        AndroidUseNativeControls: true
        });
    })
});