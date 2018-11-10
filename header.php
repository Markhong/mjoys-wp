<!DOCTYPE html>
<?php 
	$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	
	
	function checkUrl($str,$str2)
	{
    	    return preg_match($str2,$str)?true:false;
	}
	if(!checkUrl($url, '/cdp-service/')) {
	  if(checkUrl($url, '/product/') || checkUrl($url, '/case/') || checkUrl($url, '/adnetwork/') || checkUrl($url, '/service/')) {
	    header("Location: http://www.mjoys.com/"); 
	    exit;
	  }
	}
	
	
?>
<?php 
	$urlArr = array ('/wuxiangpan' => '/wxp/', '/product' => '', '/yingxiaoyun' => '/big-data-marketing/rtb', '/data-service' => '/cdp-service', '/case' => '', '/case/vip' => '', '/case/cmcc' => '', '/adnetwork' => '', '/service' => '');
	$pathname = chop($_SERVER["REQUEST_URI"],"/");
	$url = $urlArr[$pathname];
	if (isset($url)) { 
		Header("Location: $url"); 
	} 
?> 
<?php 
    if (!isset($_COOKIE['landingUrl'])) {
        setcookie("landingUrl",'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'],time()+3600*24*365,"/",".mjoys.com");
    }
?>
<?php 
    if (!isset($_COOKIE['R_url'])) {
        setcookie("R_url",$_SERVER['HTTP_REFERER'],time()+3600*24*365,'/','.mjoys.com');
    }
    $parts = parse_url(strtolower('http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']));
    parse_str($parts['query'], $query);
    if (isset($query['c_cid'])) {
        if (!isset($_COOKIE['C_cId'])) {
            setcookie("C_cId",$query['c_cid'],time()+3600*24*365,'/');
        }
        else
        {
        if (strpos($_COOKIE['C_cId'],$query['c_cid'])===false) {
                setcookie("C_cId",$_COOKIE['C_cId'] . ',' . $query['c_cid'],time()+3600*24*365,'/');
        }
        }
    }
?>


<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->

<!-- BEGIN HEAD -->
<head>
<!--<meta name="description" content="<?php echo $description; ?>" />
<meta name="keywords" content="<?php echo $keywords; ?>" /> -->
<meta name="jd" content="<?php echo $result11 ?>"/>
<meta name="baidu-site-verification" content="Y9OlReionL" />
    <meta charset="utf-8">
	<?php if ($title) :?>
		<title><?php echo $title; ?></title>
    <?php elseif (is_author()) :?>
        <title><?php wp_title(''); $paged = get_query_var('paged'); $allpages = $wp_query->max_num_pages; if ($paged > 1) printf(' – Page %s of %s',$paged,$allpages);?></title>
    <?php else : ?>
        <title><?php wp_title(''); ?></title>
    <?php endif; ?>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--<link href="<?php bloginfo('template_url');?>/assets/css/style.css" id="style_components" rel="stylesheet"
        type="text/css" />-->
    <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>?ver=2.4" type="text/css" media="screen, projection" />
    <link href="<?php bloginfo('template_url');?>/assets/css/animate.min.css" rel="stylesheet"
        type="text/css" />
    <link href="<?php bloginfo('template_url');?>/assets/css/wow.min.css" rel="stylesheet"
        type="text/css" />
    <!-- END THEME STYLES -->
    <link rel="shortcut icon" href="<?php bloginfo('template_url');?>/assets/favicon.ico?v=20170221" />
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
    
    <?php wp_head(); ?>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?374d3e5a6636e73644a7ca507eefe3b7";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>

</head>
<!-- END HEAD -->

<body>
<!--[if lte IE 8]>
            <span class="ie7note">您正在使用的浏览器已经过时了，建议您<a href="//browsehappy.com/">更新</a>您的浏览器！</span>
    <![endif]-->   
<header class="navbar navbar-fixed">
    <!-- <div class="nav-top">
        <div class="container">
            <div class="f-r font-simsun">
                <span class="text-blue bg-tel">0571-86702320</span><span class="padding-l-20 padding-r-20 text-grey">|</span><span><a href="/adnetwork/" class="text-orange">广告联盟入口</a></span>
            </div>
        </div>
    </div> -->
    <!-- <div class="secmenu">
        <div class="secmenu-content"> -->
    <div class="nav-main" style="background: transparent;">
        <div class="container clearfix">
            <h1 class="logo-wrap">
                <a href="/" title="摸象大数据 – 中国领先的全域大数据科技公司" class="nav-overview">
                    <img src="/wp-content/uploads/logo-mjoys.png?v=1.0.1" alt="摸象大数据" width="145" height="34"/>
                </a>
            </h1>
          <!-- <div class="secmenu-dropdown">
          </div> -->
          <?php
              $defaults = array(
                'theme_location'  => 'primary',
                'menu'            => '',
                'container'       => 'nav',
                'container_class' => 'navbar-nav',
                'container_id'    => '',
                'menu_class'      => 'hidden-xs',
                'menu_id'         => 'dropdownmenu-menu',
                'echo'            => true,
                'fallback_cb'     => 'wp_page_menu',
                'before'          => '',
                'after'           => '',
                'link_before'     => '',
                'link_after'      => '',
                'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                'depth'           => 0,
                'walker'          => ''
              );
              wp_nav_menu( $defaults );
          ?>
          <ul class="bars-control visible-xs">
              <li>
                  <div class="bars">
                      <div class="bar"></div>
                      <div class="bar bar-2"></div>
                      <div class="bar bar-3"></div>
                  </div>
              </li>
          </ul>
            
        </div>
    </div>
        <!-- </div>
    </div> -->
</header>
