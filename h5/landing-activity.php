<?php
/*
Template Name:Landing Page Activity
*/
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://www.mjoys.com/wp-content/themes/mjoys/h5/landing.css">
</head>
<body>
  <?php if (have_posts()) : ?>
  <?php while (have_posts()) : the_post(); ?>
	   <?php the_content(__('<br/>Continue reading...')); ?>
  <?php endwhile; ?>
  <?php else : ?>
   
  <div class="post">
    <h2>Not found1!</h2>
    <p><?php _e('Sorry, this page does not exist.'); ?></p>
    <?php include (TEMPLATEPATH . "/searchform.php"); ?>	
  </div>
   
  <?php endif; ?>
  <script src="https://www.mjoys.com/wp-content/themes/mjoys/assets/js/jquery-1.10.1.min.js" type="text/javascript"></script>
  <script src="https://www.mjoys.com/wp-content/themes/mjoys/h5/luckydraw.js"></script>
  <script src="https://www.mjoys.com/wp-content/themes/mjoys/h5/main.js"></script>
</body>
</html>