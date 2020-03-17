<?php 
function custom_ready_meta_display_image_map($image_map_array, $id, $attributes) {
     if ($image_map_array != '') {
          $finalarray= json_decode($image_map_array);
          $primary_image = ($finalarray->image_url != '' ? '<img src="'.$finalarray->image_url.'" data_id="'.$finalarray->image_id.'" data_width="'.$finalarray->image_width.'" data_height="'.$finalarray->image_height.'" data_max_width="'.$finalarray->image_max_width.'" data_max_height="'.$finalarray->image_max_height.'"/>'  : '');
          if ($primary_image != '') {
               $points = $finalarray->points;
               $show_points = '';
               foreach ($points as $point) {
                    $point_html = '';
                    $point_title = '';
                    $point_text = '';
                    $point_styles = '';
                    foreach ($point as $attr => $value) {
                         $point_html .= $attr.'="'.htmlspecialchars($value).'"';
                         if($attr == 'data_point_parameter_title') {$point_title = $value;}
                         if($attr == 'data_point_parameter_text') {$point_text = $value;}
                         if ($attr == 'style'){$point_styles = $value;}
                    }

                    $show_points .= '<img '.$point_html.'/>';
                    $show_points .= '<div '.$point_html .' class="info_parent"><p class=info_title>'.$point_title. '</p><p>'.$point_text. '</p></div>';
               }    
               $attr_str = '';
               if (isset($attributes)) {
                    
                    if (is_array($attributes)) {
                         foreach ($attributes as $attr => $value) {
                             $attr_str .= ' '.$attr.'="'.$value.'"'; 
                         }
                    }else{
                         $attr_str = $attributes; 
                    }
               }
               ?>   
                    <div class="custom_ready_meta_image_map_wrapper">
                         <div class="custom_ready_meta_image_map" id="<?php echo $id?>" <?php echo $attr_str?>>
                              <div class="custom_ready_meta_image_map_primary_image">
                                   <?php echo $primary_image?>
                              </div>
                              <div class="custom_ready_meta_image_map_show_points">
                                   <?php echo $show_points?>
                              </div>                    
                         </div>
                    </div>
               <?php          
          }
     }
}


?>