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
$(function(){
    menuBg();
    $(window).scroll(function(event){
        menuBg();
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
    
    $("#from-quanyutong").submit(function(){
        var data = {};
        data.tel = $('#tel').val();
        data.action = "quanyutong_action";
        //$.post('http://www.mjoys.com/wp-admin/admin-ajax.php',data, onSuccess);
        $(this).find('[type="submit"]').attr('disabled', 'disabled');
        $.ajax({
            url: "http://www.mjoys.com/wp-admin/admin-ajax.php",
            data: data,
            type: "POST",
            beforeSend: function () {
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
    
});