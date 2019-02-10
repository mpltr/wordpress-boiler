<?php
// enqueues scripts and styles for admin
function enqueue_admin_scripts(){
  wp_enqueue_script('admin-script',  get_template_directory_uri() . "js/admin.js", array(), null);
  wp_enqueue_style('admin-style', get_template_directory_uri() . "admin.css", false, null);
}
add_action('admin_enqueue_scripts', 'enqueue_scripts');