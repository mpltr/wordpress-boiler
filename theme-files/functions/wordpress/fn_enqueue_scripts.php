<?php
// enqueues scripts and styles for frontend
function enqueue_scripts(){
  wp_enqueue_script('script',  get_template_directory_uri() . "js/script.js", array(), null);
  wp_enqueue_style('style', get_template_directory_uri() . "style.css", false, null);
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');