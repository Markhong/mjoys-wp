<?php
/**
	* Search SQL filter for matching against post title only.
	* @param   string      $search
	* @param   WP_Query    $wp_query
*/
function wp_search_by_title( $search, $wp_query ) {
    if ( ! empty( $search ) && ! empty( $wp_query->query_vars['search_terms'] ) ) {
        global $wpdb;

        $q = $wp_query->query_vars;
        $n = ! empty( $q['exact'] ) ? '' : '%';

        $search = array();

        foreach ( ( array ) $q['search_terms'] as $term )
            $search[] = $wpdb->prepare( "$wpdb->posts.post_title LIKE %s", $n . $wpdb->esc_like( $term ) . $n );

        if ( ! is_user_logged_in() )
            $search[] = "$wpdb->posts.post_password = ''";

        $search = ' AND ' . implode( ' AND ', $search );
    }

    return $search;
}

add_filter( 'posts_search', 'wp_search_by_title', 10, 2 );

function add_menuclass($ulclass) {
   return $output = preg_replace('/<a /', '<a class="c-link dropdown-toggle" ', $ulclass);
}
add_filter('wp_nav_menu','add_menuclass');

function change_submenu_class($menu) {  
  $menu = preg_replace('/ class="sub-menu"/',' class="dropdown-menu c-menu-type-classic c-pull-left" ',$menu);  
  return $menu;  
}  
add_filter('wp_nav_menu','change_submenu_class'); 

function roots_wp_nav_menu($text) {
  $replace = array(
    'current-menu-item'     => 'childmenu-active',
    'current-menu-parent'   => 'childmenu-active',
    'menu-item-type-post_type' => '',
    'menu-item-object-page' => '',
    'menu-item-type-custom' => '',
    'menu-item-object-custom' => '',
  );

  $text = str_replace(array_keys($replace), $replace, $text);
  return $text;
}

add_filter('wp_nav_menu', 'roots_wp_nav_menu');

register_nav_menus(array(
    'primary' => 'Primary Navigation'
    // 'livechat' => 'Live Chat Navigation',
    // 'company' => 'Company Navigation',
    // 'ticket' => 'Ticket Navigation',
    // 'knowledgebase' => 'Knowledgebase Navigation',
    // 'helpdesk' => 'Helpdesk Navigation',
    // 'forum' => 'Forum Navigation',
    // 'livechatnomenu' => 'Live Chat No Menu Navigation'
    )
);


// remove header element
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wp_print_styles', 8 );  
// REMOVE WP EMOJI
remove_action( 'wp_head', 'print_emoji_detection_script', 7);
remove_action( 'wp_print_styles', 'print_emoji_styles');
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );
remove_action( 'wp_head', 'wp_oembed_add_discovery_links', 10 );

add_action( 'widgets_init', 'my_remove_recent_comments_style' );
function my_remove_recent_comments_style() {
    global $wp_widget_factory;
    remove_action( 'wp_head', array( $wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'  ) );
}

add_action('get_header', 'remove_admin_login_header');
function remove_admin_login_header() {
    remove_action('wp_head', '_admin_bar_bump_cb');
}

// Remove p tags from category description
remove_filter('term_description','wpautop');
// Remove p and br tags from page content
remove_filter( 'the_content', 'wpautop' );

// Define Sidebars
if ( function_exists('register_sidebar') )
    register_sidebar(array(
        'id' => 'home-sidebar',
        'name' => 'Sidebar',
        'before_widget' => '<div class="sidebarbox">', 
        'after_widget' => '</div>', 
        'before_title' => '<h3>', 
        'after_title' => '</h3>', 
    )
);

if ( function_exists('register_sidebar') )
    register_sidebar(array(
        'id' => 'single-sidebar',
        'name' => 'Post Sidebar',
        'before_widget' => '<div class="sidebarbox">', 
        'after_widget' => '</div>', 
        'before_title' => '<h3>', 
        'after_title' => '</h3>', 
    )
);
    

//Customize Search Style
function widget_web_search() {
?>
    <div class="sidebarbox">
        <?php include (TEMPLATEPATH . "/searchform.php"); ?>
    </div>
    
<?php
}
if ( function_exists('register_sidebar_widget') )
    register_sidebar_widget(__('Search'), 'widget_web_search');


//Customize Search Style in Post
function widget_post_search() {
?>
    <div class="sidebarbox">
        <?php include (TEMPLATEPATH . "/searchform.php"); ?>
    </div>
<?php
}
if ( function_exists('register_sidebar_widget') )
    register_sidebar_widget(__('Post Search'), 'widget_post_search');


// Add "Popular Posts" and "Related Posts" Widgets
if ( function_exists( 'register_sidebar_widget' ) ) {
    register_sidebar_widget('Popular Posts','popularposts');
    register_sidebar_widget('Related Posts','relatedposts');
}

function popularposts() { include(TEMPLATEPATH . '/popularposts.php'); }
function relatedposts() { include(TEMPLATEPATH . '/relatedposts.php'); }


//Count Post Views
function getPostViews($postID){
    $count_key = 'post_views_count';
    $count = get_post_meta($postID, $count_key, true);
    
    if($count==''){
        delete_post_meta($postID, $count_key);
        add_post_meta($postID, $count_key, '0');
        return "0";
    }
    return $count;
}

function setPostViews($postID) {
    $count_key = 'post_views_count';
    $count = get_post_meta($postID, $count_key, true);
    
    if($count==''){
        $count = 0;
        delete_post_meta($postID, $count_key);
        add_post_meta($postID, $count_key, '0');
    }
    else{
        $count++;
        update_post_meta($postID, $count_key, $count);
    }
}


//Add Featured Image
add_theme_support( 'post-thumbnails' );
set_post_thumbnail_size( 800, 250 ); // 680 pixels wide by 200 pixels tall, resize mode


//Remove [...] string using Filters
function new_excerpt_more( $more ) {
    return '...';
}
add_filter('excerpt_more', 'new_excerpt_more');

function new_excerpt_length($length) {
    return 150;
}
add_filter('excerpt_length', 'new_excerpt_length');


//Add Page Navigations
function pagenavi( $before = '', $after = '', $p = 2 ) {

    if ( is_singular() ) return;
    
    global $wp_query, $paged;
    $max_page = $wp_query->max_num_pages;
    
    if ( $max_page == 1 ) return;
    
    if ( empty( $paged ) )
        $paged = 1;
    
    echo $before.'<ul class="c-content-pagination c-theme">'."\n";
    //echo '<span class="pages">Page: ' . $paged . ' of ' . $max_page . ' </span>';
    
        if ( $paged > 1 ) p_link( $paged - 1, 'Previous Page', '上一页 '.get_template_directory() );
        if ( $paged > $p + 1 ) p_link( 1, 'First Page' );
        if ( $paged > $p + 2 ) echo "<li><a href='javascript:void(0);' class='page-numbers'>...</a></li>";
        for( $i = $paged - $p; $i <= $paged + $p; $i++ ) {   
            if ( $i > 0 && $i <= $max_page ) $i == $paged ? print "<li class='c-active'><a href='javascript:void(0);'>{$i}</a></li>" : p_link( $i );
        }
        if ( $paged < $max_page - $p - 1 ) echo "<li><a href='javascript:void(0);' class='page-numbers'>...</a></li>";
        if ( $paged < $max_page - $p ) p_link( $max_page, 'Last Page' );
        if ( $paged < $max_page ) p_link( $paged + 1,'Next Page', '下一页' );
        echo '</ul>'.$after."\n";
    }

function p_link( $i, $title = '', $linktype = '' ) {

    if ( $title == '' ) $title = "Page {$i}";
    if ( $linktype == '' ) { $linktext = $i; } else { $linktext = $linktype; }
    echo "<li><a href='", esc_html( get_pagenum_link( $i ) ), "'>{$linktext}</a></li>";
}

function geturlEncode(){
    echo urlencode(esc_url( apply_filters( 'the_permalink', get_permalink() ) ));
}

function curPageURL() 
{
    $pageURL = 'http';
    if ($_SERVER["HTTPS"] == "on") 
    {
        $pageURL .= "s";
    }
    $pageURL .= "://";
    if ($_SERVER["SERVER_PORT"] != "80") 
    {
        $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
    } 
    else 
    {
        $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
    }
    //return $pageURL;
    return urlencode(esc_url( apply_filters( 'the_permalink', $pageURL ) ));
}

// Display User IP in WordPress
function get_the_user_ip() {
    if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
        //check ip from share internet
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
        //to check ip is pass from proxy
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    //$longip = ip2long(apply_filters( 'wpb_get_ip', $ip ));
    $unsignedlongip = sprintf("%u\n", ip2long(apply_filters( 'wpb_get_ip', $ip )));
    return $unsignedlongip;
}
function object2array($object) {
    $object =  json_decode( json_encode( $object),true);
    return  $object;
}
function getcountry(){
    $longip = get_the_user_ip();
    $iptolocation = 'https://hosted.comm100.com/ipcacheservice/IP2Geo.ashx?key=KSj4Pi8dhldf343j&ipnum=' . $longip;
    $creatorlocation = file_get_contents($iptolocation);
    $arrayinfo = object2array(json_decode($creatorlocation));
    return $arrayinfo["_country"];
}

//申请试用
add_action('wp_ajax_apply_action', 'apply_try');
add_action('wp_ajax_nopriv_apply_action', 'apply_try');

function apply_try(){
    //record to txt
    $username = $_POST['username'];
    $email = $_POST['email'];
    $tel = $_POST['tel'];
    $company = $_POST['company'];
    $website = $_POST['website'];
    $myfile = $myfile = fopen(get_template_directory() . "/txt/apply_form.txt", "a") or die("Unable to open file!");
    $refererURL = $_COOKIE['R_url'];
    $c_cid = $_COOKIE['C_cId'];
    $landingpage = $_COOKIE['landingUrl'];
    // $requestpage = "";
    // $country = getcountry();
    $today = date("Y-m-d");
    // $mailtosalessubject = "";
   
    $txt = $username . "," . $email . "," . $tel . "," . $company . "," . $website . "," . $refererURL . "," . $c_cid . "," . $landingpage . "," . $today . ";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}

//马上合作
add_action('wp_ajax_coporation_action', 'coporation_action');
add_action('wp_ajax_nopriv_coporation_action', 'coporation_action');

function coporation_action(){
 $coporationArr = array("1"=>"摸象小精灵","2"=>"机器人效果营销","3"=>"全域通", "4"=>"微精灵","5"=>"其他");
 $postCoporation = $_POST['coporation'];
    //record to txt
    $username = $_POST['username'];
    // $email = $_POST['email'];
    $tel = $_POST['tel'];
    // $qq = $_POST['qq'];
    // $company = $_POST['company'];
    // $website = $_POST['website'];
    $coporation = $coporationArr[$postCoporation];
    // $other = $_POST['other'];
    // $href = $_POST['location'];
    $beizhu = $_POST['beizhu'];
    $myfile = $myfile = fopen(get_template_directory() . "/txt/corporation_form.txt", "a") or die("Unable to open file!");
    $refererURL = $_COOKIE['R_url'];
    $webRef = $_HEADER['Referer'];
    $c_cid = $_COOKIE['C_cId'];
    $landingpage = $_COOKIE['landingUrl'];
    // $requestpage = "";
    // $country = getcountry();
    $today = date("Y-m-d");
    // $mailtosalessubject = "";

   
    $txt = $today . ",姓名：" .$username . ",联系电话：" . $tel . ",备注：" . $beizhu . ",来源：" . $coporation . "," . $refererURL .  $c_cid . "," . $landingpage . "," .$href .";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}


//form 医美
add_action('wp_ajax_formyimei_action', 'formyimei_action');
add_action('wp_ajax_nopriv_formyimei_action', 'formyimei_action');

function formyimei_action(){
    //record to txt
    $company = $_POST['company'];
    $tel = $_POST['tel'];
    $name = $_POST['name'];
    $qq = $_POST['qq'];
    $myfile = $myfile = fopen(get_template_directory() . "/txt/yimei_form.txt", "a") or die("Unable to open file!");
    $refererURL = $_COOKIE['R_url'];
    $c_cid = $_COOKIE['C_cId'];
    $landingpage = $_COOKIE['landingUrl'];
    // $requestpage = "";
    // $country = getcountry();
    $today = date("Y-m-d");
    // $mailtosalessubject = "";
   
    $txt = $company . "," . $tel . "," . $name . "," . $qq . "," . $refererURL . "," . $c_cid . "," . $landingpage . "," . $today . ";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}

//form huiliubao
add_action('wp_ajax_formhuiliubao_action', 'formhuiliubao_action');
add_action('wp_ajax_nopriv_formhuiliubao_action', 'formhuiliubao_action');

function formhuiliubao_action(){
    //record to txt
    $company = $_POST['company'];
    $tel = $_POST['tel'];
    $name = $_POST['name'];
    $qq = $_POST['qq'];
    $myfile = $myfile = fopen(get_template_directory() . "/txt/huiliubao_form.txt", "a") or die("Unable to open file!");
    $refererURL = $_COOKIE['R_url'];
    $c_cid = $_COOKIE['C_cId'];
    $landingpage = $_COOKIE['landingUrl'];
    // $requestpage = "";
    // $country = getcountry();
    $today = date("Y-m-d");
    // $mailtosalessubject = "";
   
    $txt = $company . "," . $tel . "," . $name . "," . $qq . "," . $refererURL . "," . $c_cid . "," . $landingpage . "," . $today . ";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}


//form wuxiangpan
add_action('wp_ajax_formwuxiangpan_action', 'formwuxiangpan_action');
add_action('wp_ajax_nopriv_formwuxiangpan_action', 'formwuxiangpan_action');

function formwuxiangpan_action(){
    //record to txt
    $company = $_POST['company'];
    $tel = $_POST['tel'];
    $name = $_POST['name'];
    $qq = $_POST['qq'];
    $myfile = $myfile = fopen(get_template_directory() . "/txt/wuxiangpan_form.txt", "a") or die("Unable to open file!");
    $refererURL = $_COOKIE['R_url'];
    $c_cid = $_COOKIE['C_cId'];
    $landingpage = $_COOKIE['landingUrl'];
    // $requestpage = "";
    // $country = getcountry();
    $today = date("Y-m-d");
    // $mailtosalessubject = "";
   
    $txt = $company . "," . $tel . "," . $name . "," . $qq . "," . $refererURL . "," . $c_cid . "," . $landingpage . "," . $today . ";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}




//广告联盟
add_action('wp_ajax_adalliance_action', 'apply_adalliance');
add_action('wp_ajax_nopriv_adalliance_action', 'apply_adalliance');

function apply_adalliance(){
    //record to txt
    $username = $_POST['username'];
    $email = $_POST['email'];
    $tel = $_POST['tel'];
    $url = $_POST['url'];
    $myfile = $myfile = fopen(get_template_directory() . "/txt/ad_alliance.txt", "a") or die("Unable to open file!");
    $refererURL = $_COOKIE['R_url'];
    $c_cid = $_COOKIE['C_cId'];
    $landingpage = $_COOKIE['landingUrl'];
    // $requestpage = "";
    // $country = getcountry();
    $today = date("Y-m-d");
    // $mailtosalessubject = "";
   
    $txt = $username . "," . $email . "," . $tel . "," . $url . "," . $refererURL . "," . $c_cid . "," . $landingpage . "," . $today . ";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}


//全域通
add_action('wp_ajax_quanyutong_action', 'quanyutong_action');
add_action('wp_ajax_nopriv_quanyutong_action', 'quanyutong_action');

function quanyutong_action(){
    //record to txt
    $tel = $_POST['tel'];
    $refererURL = $_COOKIE['R_url'];
    $c_cid = $_COOKIE['C_cId'];
    $landingpage = $_COOKIE['landingUrl'];
    $today = date("Y-m-d");

    $myfile = $myfile = fopen(get_template_directory() . "/txt/corporation_form.txt", "a") or die("Unable to open file!");

    $txt = "电话：" . $tel . "," . $refererURL . "," . $c_cid . "," . $landingpage . "," . $today . ";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}

//全域通
add_action('wp_ajax_getPriseUser_action', 'getPriseUser_action');
add_action('wp_ajax_nopriv_getPriseUser_action', 'getPriseUser_action');

function getPriseUser_action(){
    //record to txt
    $tel = $_POST['tel'];
    $carcode = $_POST['carcode'];
    $name = $_POST['name'];
    $today = date("Y-m-d");

    $ifSuccessGetPrice = $_POST['ifSuccessGetPrice'];

    $myfile = $myfile = fopen(get_template_directory() . "/txt/youzichexian_form.txt", "a") or die("Unable to open file!");

    $txt = "车牌号：" . $carcode . "," . "姓名：" . $name . "," . "电话：" . $tel . "," . "是否获取报价：" . $ifSuccessGetPrice . "," . $today . ";\r\n";
    fwrite($myfile, $txt);
    fclose($myfile);
}


?>