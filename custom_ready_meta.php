<?php
/* 
Plugin Name:  Custom Ready Meta
Plugin URI: https://ari-senpai.ninja/ 
Description: Plugin For Repeatedly Coding Backend Meta Assets Easily. Copyright Ari Patwary 2017. No duplication or redistributing.
Version: 1.0
Author: Ari
Author URI: https://ari-senpai.ninja/
*/

/*
Version 1.1 Update - Added custom_ready_meta_save_term_meta function for saving custom ready meta taxonomies. Adjusted stylesheet for upload fields in form#addtag
Version 1.2 Update - Added custom ready meta functionality for option pages.
     Note: Dynamic Meta Doesn't Work With Options For Now
Version 1.3 Update - 
     Note: Added custom ready meta image maps.
     Note: updated with front end scripts.
     Note: Added Toggle Display For Post Type add Meta.
*/

define( 'CUSTOMREADYMETA_URL', plugin_dir_url(__FILE__) );
define( 'CUSTOMREADYMETA_PATH', plugin_dir_path(__FILE__) );
define( 'CUSTOMREADYMETA_BASENAME', plugin_basename( __FILE__ ) );
//include( plugin_dir_path( __FILE__ ) . 'custom_ready_meta_options.php');

//Start Custom Ready Meta Admin 
function custom_ready_meta_admin_scripts(){
          wp_enqueue_script('jquery');      
          wp_enqueue_script('jquery-ui-draggable');
          wp_enqueue_script('tiny_mce');
          wp_enqueue_script('media-upload');
          wp_enqueue_script('iris');
          wp_register_script('custom_meta_js', CUSTOMREADYMETA_URL.'/js/custom_ready_meta.js', array('jquery'), false, true );
          wp_enqueue_script('custom_meta_js');             
          wp_register_style('custom_meta_css', CUSTOMREADYMETA_URL.'/css/custom_ready_meta.css',false );
          wp_enqueue_style('custom_meta_css');             
}
add_action('admin_enqueue_scripts','custom_ready_meta_admin_scripts'); 
//End Custom Ready Meta Admin 

//Start Custom Ready Post Meta Functions
function custom_ready_meta_createinput($type, $name, $label, $instructions, $selections, $attributes){
     global $post;                       
     // get current values
     $original_name = $name;
     $name = 'custom_ready_meta_'.$name; 
     $postcustom = get_post_custom($post->ID);
     if(!$postcustom){
          $postcustom[$name][0] = '';
     }            
     $limit = ''; 
     $orderstyle = '';
     $upload_video_number = '';
     $toggle_display = '';
     $fieldbox_attributes = '';
     $image_map_thumb_size = '';
     if (isset($attributes['limit'])) {
          $limit = $attributes['limit'];
     }  
     if (isset($attributes['order'])) {
          $orderstyle = ' order:'.$attributes['order'].';';
     }     
     if (isset($attributes['upload_video_number'])) {
          $upload_video_number = $attributes['upload_video_number'];
     }         
     if (isset($attributes['toggle_display']) && $attributes['toggle_display'] == true) {
          $toggle_display = true;
     }            
     if (isset($attributes['static_image_map_point'])) {
          $static_image_map_point = $attributes['static_image_map_point'];
     }       
     if (isset($attributes['fieldbox_attributes'])) {
          $fieldbox_attributes = $attributes['fieldbox_attributes'];
     } 
     if (isset($attributes['fieldbox_classes'])) {
          $fieldbox_classes = $attributes['fieldbox_classes'];
     } 
     if (isset($attributes['image_map_thumb_size'])) {
          $image_map_thumb_size = $attributes['image_map_thumb_size'];
     }                             
     // output input fields
     switch($type){
          case 'html':
               $input = '';
               if(!empty($instructions)){
                    $input .= $instructions;
               }
               break;
          case 'input_text':
               $input = '
                    <div class="crm_fieldbox '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="text" name="'.$name.'" id="' .$name.'" value="'.get_post_meta($post->ID, $name, true).'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'input_hidden':          
               $input = '
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .get_post_meta($post->ID, $name, true) .'" class="crm_field '.$fieldbox_classes.'"  style="'.$orderstyle.'" />
               ';
               break;
          case 'input_radio':            
               $input = '
                    <div class="crm_fieldbox '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="radio" name="' .$name .'" id="' .$name .'" value="' .get_post_meta($post->ID, $name, true) .'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'input_checkbox':  
               $field_id_checked = '';         
               $field_id_value = get_post_meta($post->ID, $name, true);
               if($field_id_value == "yes") $field_id_checked = 'checked="checked"';
               $input = '
                    <div class="crm_fieldbox '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="checkbox" name="' .$name .'" id="' .$name .'" value="yes" class="crm_field" '.$field_id_checked.' />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'textarea':           
                    $input = '
                    <div class="crm_fieldbox '.$fieldbox_classes.'" style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label><br clear="all" />
                    <textarea name="' .$name .'" id="' .$name .'" class="crm_field">' .$postcustom[$name][0].'</textarea>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;               
          case 'wptexteditor':           
                  $settings =array(
                      'textarea_rows' => 5,
                      'quicktags' => true,
                      'media_buttons' => true,
                      'wpautop'=>false,
                      'drag_drop_upload' => true,
                      'tinymce'=> true
                  );           
                  ob_start();
                  wp_editor(get_post_meta($post->ID, $name, true),$name, $settings);
                  $editor = ob_get_contents();
                  ob_end_clean();
                  $input = '
                  <div class="crm_fieldbox '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                  '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                  <hr />
                  <h4 class="crm_formbreak">' .$label .': <small>'.$instructions.'</small></h4><hr />'
                  .$editor.'
                  </div>';
               break;
          case 'select':
               $list = '';
               $currentselect = get_post_meta($post->ID, $name, true);
               foreach($selections as $select => $value){
                    $list .= '<option value="' .$select .'"';
                    if($currentselect==$select){
                         $list .= ' selected="selected"';
                    }
                    $list .= '>' .$value .'</option>';
               }
               $input = '
                    <div class="crm_fieldbox '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <select name="' .$name .'" id="' .$name .'" class="crm_field">
                    ' .$list .'
                    </select>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'tax':
               $input = '
                    <div class="crm_fieldbox '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>';
                    $input .= custom_ready_meta_tax_dropdown($original_name);
               $input .= '</div>';
               break;
          case 'upload':
          $uploadthumb = wp_get_attachment_image_src(get_post_meta($post->ID, $name, true), 'medium');
          $input = '
               <div class="crm_fieldbox crm_upload_field '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_field_iframe_wrapper"><iframe src="'.$uploadthumb[0].'"></iframe></div>
                    <button class="crm_bttn upload_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_bttn">Remove '.$label.'</button>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.get_post_meta($post->ID, $name, true).'"/>
               </div>';
               break;  
          case 'upload_pdf':
          $uploadthumb = wp_get_attachment_url((get_post_meta($post->ID, $name, true)));
          $input = '
               <div class="crm_fieldbox crm_upload_pdf_field '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_pdf_field_iframe_wrapper"><iframe src="'.$uploadthumb.'"></iframe></div>
                    <button class="crm_bttn upload_pdf_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_pdf_bttn">Remove '.$label.'</button>
                    <p class="crm_upload_pdf_message"></p>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.get_post_meta($post->ID, $name, true).'"/>
               </div>';
               break;     
          case 'upload_video':
          $galleryarray = get_post_meta($post->ID, $name, true);
          $finalarray= json_decode($galleryarray);
          $videosrc = $finalarray[0]->videosrc;
          $thumbnail = wp_get_attachment_image_src($finalarray[0]->thumbID, 'medium');
          $input = '
               <div class="crm_fieldbox crm_upload_video_field '.$fieldbox_classes.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }    
          $input .= '
                    <div class="clear"></div>                    
                    <span class="crm_instructions">Use the white input field to manually add videos or use the "Upload Video Field" button to add an uploaded video URL to the field.<br><b>If you are having trouble selecting the white input field right click the field and paste your URL</b><br>Use the "Save '.$label.' Source" button to save the URL.<br>The gray embed box should populate with the expected result.<br>If you do not get the expected result please check your video URL and make sure it is a proper video embed URL<br>i.e. includes http/https, Youtube Video URL is in "https://youtube.com/embed/Video ID" format, etc... </span>  
                    <div><p class="crm_upload_video_field_message"></p></div>
                    <div class="crm_upload_video_field_video_src">';
                    if (strpos($videosrc, $_SERVER['SERVER_NAME'])) {
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper clear">
                                   <iframe src="'.$videosrc.'" sandbox=""></iframe>                                   
                                   <input type="text" class="crm_upload_video_field_input crm_field" value="" placeholder="Insert video URL and press &quot;Save '.$label.' Source&quot; to use remote video."/>                             
                              </div>';                               
                    }else{
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper clear">
                                   <iframe src="'.$videosrc.'" sandbox="allow-scripts allow-same-origin"></iframe>
                                   <input type="text" class="crm_upload_video_field_input crm_field" value="" placeholder="Insert video URL and press &quot;Save '.$label.' Source&quot; to use remote video."/>                               
                              </div>';
                    }
          $input .='
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_src_bttn">Upload '.$label.' Source</button>
                              <button class="crm_bttn remove_video_src_bttn">Remove '.$label.' Source</button>          
                              <button class="crm_bttn save_video_src_bttn">Save '.$label.' Source</button>                              
                         </div>
                    </div>
                    <span class="crm_instructions">(Optional) Please include a video thumbnail for performance purposes.<br>Any video without a thumbnail adds a video player and uses additional server resources even if a user does not click to watch the video.<br>(Youtube Note) The Front-End automatically uses the default Youtube thumbnail for Youtube videos using the https://youtube.com/embed/ URL format unless a video thumbnail is specified.</span>
                    <div class="crm_upload_video_field_thumbnail">
                         <div class="crm_upload_video_field_thumbnail_wrapper">
                              <img src="'.$thumbnail[0].'" data-id="'.$finalarray[0]->thumbID.'"/>
                         </div>
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_thumb_bttn">Upload Video Thumb</button>
                              <button class="crm_bttn remove_video_thumb_bttn">Remove Video Thumb</button>                              
                         </div>
                    </div>
                    <textarea class="crm_upload_video_field_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>    
               </div>';
          break; 

          case 'slideshow':
          $galleryarray = get_post_meta($post->ID, $name, true);
          $finalarray= json_decode($galleryarray);
          $input = '
               <div class="crm_fieldbox crm_slideshow_field '.$fieldbox_classes.'" data_crm_field_limit="'.$limit.'"  style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="clear"></div>
                    <div class="crm_slideshow_image_container" id="'.$name.'_crm_slideshow_image_container" data-field-name="'.$name.'">';
                        if ($galleryarray!='') {
                              $imgcount = 1;
                              $arraylength = count($finalarray);
                              for ($i=0; $i < $arraylength ; $i++) {  
                                $slideimage = wp_get_attachment_image_src($finalarray[$i]->ID, 'medium');
                                $input.='
                                      <div class="single_crm_slideshow_image" name="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" id="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" data-id="'.$finalarray[$i]->ID.'">
                                          <div class="single_crm_slideshow_image_wrapper">
                                              <img src="'.$slideimage[0].'"/>
                                          </div>
                                          <div class="crm_button_container">
                                              <span class="crm_slideshow_image_remove_image crm_bttn">Remove Image</span>
                                              <span class="crm_slideshow_image_edit_image crm_bttn">Edit Image</span>
                                          </div>
                                      </div>
                                ';
                                $imgcount++;
                              }
                        }
          $input .= '
                    </div>
                    <div class="clear">
                        <button class="crm_slideshow_image_add_image crm_bttn">Add '.$label.' Image</button>
                    </div>
                    <textarea class="crm_slideshow_image_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>                   
               </div>';
          break;      

          case 'colorpicker':
               $input = '
                    <div class="crm_fieldbox '.$fieldbox_classes.'" style="'.$orderstyle.'" '.htmlspecialchars($fieldbox_attributes).'>
                    '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <div class="clear"></div>
                    <div>
                         <div class="crm_colorpicker_show">' .get_post_meta($post->ID, $name, true) .'</div>
                         <button class="crm_colorpicker_toggle crm_bttn">Add/Edit '.$label.'</button>
                    </div>
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .get_post_meta($post->ID, $name, true) .'" class="crm_field crm_colorpicker" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;   

          case 'imagemap':
               $image_map_array = get_post_meta($post->ID, $name, true);
               $finalarray= json_decode($image_map_array);  
               $dynamic_fields_allowed = array('input_text', 'input_radio', 'input_checkbox', 'textarea', 'select', 'upload', 'upload_pdf', 'upload_video', 'colorpicker');
               foreach ($selections as $select) {
                    if (in_array($select['type'], $dynamic_fields_allowed) == false) {
                         unset($selections[$select]);
                    }
               }
               $dynamic_fields = json_encode($selections);                               
               $primary_image = ($finalarray->image_url != '' ? '<img src="'.$finalarray->image_url.'" data_id="'.$finalarray->image_id.'" data_width="'.$finalarray->image_width.'" data_height="'.$finalarray->image_height.'" data_max_width="'.$finalarray->image_max_width.'" data_max_height="'.$finalarray->image_max_height.'"/>' : '');
               $points = $finalarray->points;
               $show_points = '';
               foreach ($points as $point) {
                    $point_html = '';
                    foreach ($point as $attr => $value) {
                         $point_html .= $attr.'="'.htmlspecialchars($value).'"';
                    }
                    $show_points .= '<img '.$point_html.'/>';
               }
               $input = '
                    <div class="crm_fieldbox crm_imagemap_creator '.$fieldbox_classes.'" style="'.$orderstyle.'" data_original_name="'.$original_name.'" data_dynamic_fields="'.htmlspecialchars($dynamic_fields).'" data-static_point="'.htmlspecialchars($static_image_map_point).'" data-image_size="'.$image_map_thumb_size.'" '.htmlspecialchars($fieldbox_attributes).'>
                         '.($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' ).'
               ';
                         if($instructions){
                              $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                         }   
                         $input .= '                 
                              <label for="' .$name .'" class="crm_label">' .$label .'</label>
                              <div class="clear"></div>
                              <div>                                   
                                   <button class="crm_image_map_add_img crm_bttn">Add/Edit Image</button>
                                   <button class="crm_image_map_add_point crm_bttn">Add Point</button>
                                   <div class="clear"></div>
                                   <div class="crm_image_map_point_fields">

                                   </div>
                                   <div class="clear"></div>
                                   <div class="crm_image_map_show_wrapper">
                                        <div class="crm_image_map_show">
                                             '.$primary_image.'                                        
                                        </div>
                                        <div class="crm_image_map_show_points">
                                             '.$show_points.'
                                        </div>
                                        <div class="crm_image_map_add_points_wrapper">

                                        </div>                                        
                                   </div>
                                   <div class="crm_image_map_fields"></div>
                              </div>
                              <textarea class="crm_image_map_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($image_map_array, ENT_QUOTES, "UTF-8").'</textarea>                       
                         ';
               $input .= '
                    </div>
               ';
          break; 

          case 'dynamic_fields': 
               $fieldcount =  get_post_meta($post->ID, $name, true);         
               $dynamic_fields_allowed = array('input_text', 'input_radio', 'input_checkbox', 'textarea', 'select', 'tax', 'upload', 'upload_pdf', 'upload_video', 'colorpicker', 'slideshow', 'imagemap');
               foreach ($selections as $select) {
                    if (in_array($select['type'], $dynamic_fields_allowed) == false) {
                         unset($selections[$select]);
                    }
               }
               $dynamic_fields = json_encode($selections);
               $input = "
                    <div class='crm_fieldbox crm_dynamic_field_box ".$fieldbox_classes."' id='".$name."_dynamic_field_box' data_original_name='".$original_name."' data_dynamic_fields='".$dynamic_fields."' data_crm_field_limit='".$limit."' style='".$orderstyle."' ".htmlspecialchars($fieldbox_attributes)."'>";
               $input .= ($toggle_display == true ? '<i class="crm_display_toggle"><span></span></i>' : '' );
               $input .= '
                         <label for="' .$name.'" class="crm_label">' .$label .'</label>
               ';    

                         if($instructions){
                              $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                         }                     
               $input .= '
                         <div class="clear"></div>
                         <div class="crm_dynamic_field_box_container" id= "'.$name.'_dynamic_field_box_container">
               ';
                              for ($i=1; $i <= $fieldcount ; $i++) { 
                                   $input .= '
                                        <div class="crm_fieldbox_subsection">
                                   ';
                                        foreach ($selections as $field) {
                                             $input .= custom_ready_meta_createinput($field['type'], $original_name.'_'.$field['name'].'_'.$i, $field['label'].' '.$i, $field['instructions'], $field['selections'], $field['attributes']);
                                        }   
                                   $input .= '
                                             <div class="clear" style="order: 1000000;"><br/><button class="crm_dynamic_field_box_remove crm_bttn">Remove '.$label.' '.$i.'</button></div>
                                        </div>
                                   ';                             
                              }               
               $input .= '
                         </div>
                         <div class="clear"><br/></div>
                         <button class="crm_dynamic_field_box_add crm_bttn">Add '.$label.'</button>
                         <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .$fieldcount.'" class="crm_field crm_dynamic_field_box_count" />       
                         <div style="display:none;" class="crm_dynamic_field_box_storage"></div>               
                    </div>';
          break; 
     }
     return $input;
}
// End 


function custom_ready_meta_createinput_dynamic(){
     $type = $_POST['dynamic_type'];
     $name = $_POST['dynamic_name'];
     $label = $_POST['dynamic_label'];   
     $instructions = $_POST['dynamic_instructions'];   
     $selections = $_POST['dynamic_selections'];   
     $attributes = $_POST['dynamic_attributes'];         
     echo custom_ready_meta_createinput($type, $name, $label, $instructions, $selections, $attributes);
     die();          
}

add_action('wp_ajax_custom_ready_meta_createinput_dynamic', 'custom_ready_meta_createinput_dynamic');
add_action('wp_ajax_nopriv_custom_ready_meta_createinput_dynamic', 'custom_ready_meta_createinput_dynamic');

function custom_ready_meta_tax_dropdown($tax){
     global $post;
     $taxselect = '';
     $taxterms = get_terms($tax, 'hide_empty=0'); 
          $taxselect .= '<select name="custom_ready_meta_tax_' .$tax .'" id="custom_ready_meta_tax_' .$tax .'">';
        $names = wp_get_object_terms($post->ID, $tax); 
        $taxselect .= '<option value="">None</option>';
          foreach ($taxterms as $term) {
               if (!is_wp_error($names) && !empty($names) && !strcmp($term->slug, $names[0]->slug)) 
                    $taxselect .= "<option value='" . $term->slug . "' selected>" . $term->name . "</option>\n"; 
               else
                    $taxselect .= "<option value='" . $term->slug . "'>" . $term->name . "</option>\n"; 
          }
          $taxselect .= '</select>';    
          $metaname = 'tagsdiv-' .$tax;
          remove_meta_box($metaname,'page','core');
     return $taxselect;
}

// Start save custom meta data

add_action('save_post', 'custom_ready_meta_save_meta');
function custom_ready_meta_save_meta($post_id) {   
     if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ){ 
          error_log($post_id); 
          return $post_id;
     }
     if ( !empty($_POST['custom_ready_meta_metaboxes_noncename']) || !wp_verify_nonce($_POST['custom_ready_meta_metaboxes_noncename'],'custom_ready_meta_metaboxes_verify')){
          error_log($post_id.' Nonce not found during update'); 
          return $post_id;   
     }         
     if ( !current_user_can( 'edit_post', $post_id )){
          error_log($post_id);
          return $post_id;
     }
     $custom_post_meta = get_post_custom($post_id);
     foreach ($custom_post_meta as $key => $value) {
          if((strpos($key,'custom_ready_meta_')!==false)){ 
               //error_log($key);
               if(array_key_exists($key, $_POST) == false) {
                    error_log($key.' not in array');
                    update_post_meta($post_id, $key, "");
                    delete_post_meta($post_id, $key, "");
               }
          }                    
     }  
     foreach($_POST as $key=>$value){
          
          if((strpos($key,'custom_ready_meta_')!==false)){           
               if((strpos($key,'custom_ready_meta_tax_')!==false)){
                    $taxname = str_replace('custom_ready_meta_tax_','',$key);
                    wp_set_object_terms( $post_id, $value, $taxname );
               } elseif((strpos($key,'custom_ready_meta_taxarray_')!==false)){
                    $taxname = str_replace('custom_ready_meta_taxarray_','',$key);
                    wp_set_object_terms( $post_id, '', $taxname, true );
                    $i=0;
                    foreach($_POST[$key] as $v){
                         if($i==0){
                              wp_set_object_terms( $post_id,intval($v), $taxname, false );
                         } else {
                              wp_set_object_terms( $post_id, intval($v), $taxname, true );
                         }
                         $i++;
                    }
               }else {
                    // checkboxes
                    if(is_array($_POST[$key])){
                         delete_post_meta($post_id, $key);
                         foreach($_POST[$key] as $value){
                              add_post_meta($post_id, $key, $value);
                         }
                    } else {
                         // text/select input fields
                         update_post_meta($post_id,$key,$value);
                    }
               }
          }
     }   
}
// End save custom meta data
//End Custom Ready Post Meta Functions


//Start Custom Ready Term Meta Functions
function custom_ready_meta_term_createinput($type, $name, $label, $instructions, $selections, $attributes){    
     $term_id = '';
     // get current values
     $original_name = $name;
     $name = 'custom_ready_meta_'.$name; 
     $postcustom = get_term_meta($term_id);
     if(!$postcustom){
          $postcustom[$name][0] = '';
     }            
     $limit = ''; 
     $orderstyle = '';
     $upload_video_number = '';
     if (isset($attributes['limit'])) {
          $limit = $attributes['limit'];
     }  
     if (isset($attributes['order'])) {
          $orderstyle = ' order:'.$attributes['order'].';';
     }     
     if (isset($attributes['upload_video_number'])) {
          $upload_video_number = $attributes['upload_video_number'];
     }            
     // output input fields
     switch($type){
          case 'html':
               $input = '';
               if(!empty($instructions)){
                    $input .= $instructions;
               }
               break;
          case 'input_text':
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="text" name="'.$name.'" id="' .$name.'" value="'.get_term_meta($term_id, $name, true).'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'input_hidden':          
               $input = '
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .get_term_meta($term_id, $name, true) .'" class="crm_field"  style="'.$orderstyle.'" />
               ';
               break;
          case 'input_radio':            
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="radio" name="' .$name .'" id="' .$name .'" value="' .get_term_meta($term_id, $name, true) .'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'input_checkbox':  
               $field_id_checked = '';         
               $field_id_value = get_term_meta($term_id, $name, true);
               if($field_id_value == "yes") $field_id_checked = 'checked="checked"';
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="checkbox" name="' .$name .'" id="' .$name .'" value="yes" class="crm_field" '.$field_id_checked.' />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'textarea':           
                    $input = '
                    <div class="crm_fieldbox">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label><br clear="all" />
                    <textarea name="' .$name .'" id="' .$name .'" class="crm_field">' .$postcustom[$name][0].'</textarea>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;               
          case 'wptexteditor':           
                  $settings =array(
                      'textarea_rows' => 5,
                      'quicktags' => true,
                      'media_buttons' => true,
                      'wpautop'=>false,
                      'drag_drop_upload' => true,
                      'tinymce'=> true
                  );           
                  ob_start();
                  wp_editor(get_term_meta($term_id, $name, true),$name, $settings);
                  $editor = ob_get_contents();
                  ob_end_clean();
                  $input = '
                  <div class="crm_fieldbox"  style="'.$orderstyle.'">
                  <hr />
                  <h4 class="crm_formbreak">' .$label .': <small>'.$instructions.'</small></h4><hr />'
                  .$editor.'
                  </div>';
               break;
          case 'select':
               $list = '';
               $currentselect = get_term_meta($term_id, $name, true);
               foreach($selections as $select => $value){
                    $list .= '<option value="' .$select .'"';
                    if($currentselect==$select){
                         $list .= ' selected="selected"';
                    }
                    $list .= '>' .$value .'</option>';
               }
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <select name="' .$name .'" id="' .$name .'" class="crm_field">
                    ' .$list .'
                    </select>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'upload':
          $uploadthumb = wp_get_attachment_image_src(get_term_meta($term_id, $name, true));
          $input = '
               <div class="crm_fieldbox crm_upload_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_field_iframe_wrapper"><iframe src="'.$uploadthumb[0].'"></iframe></div>
                    <button class="crm_bttn upload_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_bttn">Remove '.$label.'</button>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.get_term_meta($term_id, $name, true).'"/>
               </div>';
               break;  
          case 'upload_pdf':
          $uploadthumb = wp_get_attachment_url((get_term_meta($term_id, $name, true)));
          $input = '
               <div class="crm_fieldbox crm_upload_pdf_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_pdf_field_iframe_wrapper"><iframe src="'.$uploadthumb.'"></iframe></div>
                    <button class="crm_bttn upload_pdf_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_pdf_bttn">Remove '.$label.'</button>
                    <p class="crm_upload_pdf_message"></p>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.get_term_meta($term_id, $name, true).'"/>
               </div>';
               break;     
          case 'upload_video':
          $galleryarray = get_term_meta($term_id, $name, true);
          $finalarray= json_decode($galleryarray);
          $videosrc = $finalarray[0]->videosrc;
          $thumbnail = wp_get_attachment_image_src($finalarray[0]->thumbID, 'medium');
          $input = '
               <div class="crm_fieldbox crm_upload_video_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }    
          $input .= '
                    <div class="clear"></div>                    
                    <span class="crm_instructions">Use the white input field to manually add videos or use the "Upload Video Field" button to add an uploaded video URL to the field.<br><b>If you are having trouble selecting the white input field right click the field and paste your URL</b><br>Use the "Save '.$label.' Source" button to save the URL.<br>The gray embed box should populate with the expected result.<br>If you do not get the expected result please check your video URL and make sure it is a proper video embed URL<br>i.e. includes http/https, Youtube Video URL is in "https://youtube.com/embed/Video ID" format, etc... </span>
                    <div><p class="crm_upload_video_field_message"></p></div>
                    <div class="crm_upload_video_field_video_src">';
                    if (strpos($videosrc, $_SERVER['SERVER_NAME'])) {
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper">
                                   <iframe src="'.$videosrc.'" sandbox=""></iframe>
                                   <p contenteditable class="crm_upload_video_field_input">Right Click to Type or Paste URL</p>                              
                              </div>';                               
                    }else{
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper">
                                   <iframe src="'.$videosrc.'" sandbox="allow-scripts allow-same-origin"></iframe>
                                   <p contenteditable class="crm_upload_video_field_input">Right Click to Type or Paste URL</p>                              
                              </div>';
                    }
          $input .='
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_src_bttn">Upload '.$label.' Source</button>
                              <button class="crm_bttn remove_video_src_bttn">Remove '.$label.' Source</button>          
                              <button class="crm_bttn save_video_src_bttn">Save '.$label.' Source</button>                              
                         </div>
                    </div>
                    <span class="crm_instructions">(Optional) Please include a video thumbnail for performance purposes.<br>Any video without a thumbnail adds a video player and uses additional server resources even if a user does not click to watch the video.<br>(Youtube Note) The Front-End automatically uses the default Youtube thumbnail for Youtube videos using the https://youtube.com/embed/ URL format unless a video thumbnail is specified.</span>
                    <div class="crm_upload_video_field_thumbnail">
                         <div class="crm_upload_video_field_thumbnail_wrapper">
                              <img src="'.$thumbnail[0].'" data-id="'.$finalarray[0]->thumbID.'"/>
                         </div>
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_thumb_bttn">Upload Video Thumb</button>
                              <button class="crm_bttn remove_video_thumb_bttn">Remove Video Thumb</button>                              
                         </div>
                    </div>
                    <textarea class="crm_upload_video_field_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>    
               </div>';
          break; 

          case 'slideshow':
          $galleryarray = get_term_meta($term_id, $name, true);
          $finalarray= json_decode($galleryarray);
          $input = '
               <div class="crm_fieldbox crm_slideshow_field" data_crm_field_limit="'.$limit.'"  style="'.$orderstyle.'">

                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="clear"></div>
                    <div class="crm_slideshow_image_container" id="'.$name.'_crm_slideshow_image_container" data-field-name="'.$name.'">';
                        if ($galleryarray!='') {
                              $imgcount = 1;
                              $arraylength = count($finalarray);
                              for ($i=0; $i < $arraylength ; $i++) {  
                                $slideimage = wp_get_attachment_image_src($finalarray[$i]->ID, 'medium');
                                $input.='
                                      <div class="single_crm_slideshow_image" name="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" id="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" data-id="'.$finalarray[$i]->ID.'">
                                          <div class="single_crm_slideshow_image_wrapper">
                                              <img src="'.$slideimage[0].'"/>
                                               </div>
                                          <div class="crm_button_container">
                                              <span class="crm_slideshow_image_remove_image crm_bttn">Remove Image</span>
                                              <span class="crm_slideshow_image_edit_image crm_bttn">Edit Image</span>
                                          </div>
                                      </div>
                                ';
                                $imgcount++;
                              }
                        }
          $input .= '
                    </div>
                    <div class="clear">
                        <button class="crm_slideshow_image_add_image crm_bttn">Add '.$label.' Image</button>
                    </div>
                    <textarea class="crm_slideshow_image_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>                   
               </div>';
          break;      

          case 'colorpicker':
               $input = '
                    <div class="crm_fieldbox" style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <div class="clear"></div>
                    <div>
                         <div class="crm_colorpicker_show">' .get_term_meta($term_id, $name, true) .'</div>
                         <button class="crm_colorpicker_toggle crm_bttn">Add/Edit '.$label.'</button>
                    </div>
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .get_term_meta($term_id, $name, true) .'" class="crm_field crm_colorpicker" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;   

          case 'dynamic_fields': 
               $fieldcount =  get_term_meta($term_id, $name, true);         
               $dynamic_fields_allowed = array('input_text', 'input_radio', 'input_checkbox', 'textarea', 'select', 'tax', 'upload', 'upload_pdf', 'upload_video', 'colorpicker', 'dynamic_fields');
               foreach ($selections as $select) {
                    if (in_array($select['type'], $dynamic_fields_allowed) == false) {
                         unset($selections[$select]);
                    }
               }
               $dynamic_fields = json_encode($selections);
               $input = "
                    <div class='crm_fieldbox crm_dynamic_field_box' id='".$name."_dynamic_field_box' data_original_name='".$original_name."' data_dynamic_fields='".$dynamic_fields."' data_crm_field_limit='".$limit."' style='".$orderstyle."'>";
               $input .= '
                         <label for="' .$name.'" class="crm_label">' .$label .'</label>
               ';    

                         if($instructions){
                              $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                         }                     
               $input .= '
                         <div class="clear"></div>
                         <div class="crm_dynamic_field_box_container" id= "'.$name.'_dynamic_field_box_container">
               ';
                              for ($i=1; $i <= $fieldcount ; $i++) { 
                                   $input .= '
                                        <div class="crm_fieldbox_subsection">
                                   ';
                                        foreach ($selections as $field) {
                                             $input .= custom_ready_meta_term_createinput($field['type'], $original_name.'_'.$field['name'].'_'.$i, $field['label'].' '.$i, $field['instructions'], $field['selections'], $field['attributes']);
                                        }   
                                   $input .= '
                                             <div class="clear" style="order: 1000000;"><br/><button class="crm_dynamic_field_box_remove crm_bttn">Remove '.$label.' '.$i.'</button></div>
                                        </div>
                                   ';                             
                              }               
               $input .= '
                         </div>
                         <div class="clear"><br/></div>
                         <button class="crm_dynamic_field_box_add crm_bttn">Add '.$label.'</button>
                         <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .$fieldcount.'" class="crm_field crm_dynamic_field_box_count" />       
                         <div style="display:none;" class="crm_dynamic_field_box_storage"></div>               
                    </div>';
          break; 
     }
     return $input;
}


function custom_ready_meta_term_edit_createinput($term, $type, $name, $label, $instructions, $selections, $attributes){    
     $term_id = $term->term_id;
     // get current values
     $original_name = $name;
     $name = 'custom_ready_meta_'.$name; 
     $postcustom = get_term_meta($term_id);
     if(!$postcustom){
          $postcustom[$name][0] = '';
     }            
     $limit = ''; 
     $orderstyle = '';
     $upload_video_number = '';
     if (isset($attributes['limit'])) {
          $limit = $attributes['limit'];
     }  
     if (isset($attributes['order'])) {
          $orderstyle = ' order:'.$attributes['order'].';';
     }     
     if (isset($attributes['upload_video_number'])) {
          $upload_video_number = $attributes['upload_video_number'];
     }             
     // output input fields
     switch($type){
          case 'html':
               $input = '';
               if(!empty($instructions)){
                    $input .= $instructions;
               }
               break;
          case 'input_text':
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="text" name="'.$name.'" id="' .$name.'" value="'.get_term_meta($term_id, $name, true).'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'input_hidden':          
               $input = '
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .get_term_meta($term_id, $name, true) .'" class="crm_field"  style="'.$orderstyle.'" />
               ';
               break;
          case 'input_radio':            
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="radio" name="' .$name .'" id="' .$name .'" value="' .get_term_meta($term_id, $name, true) .'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'input_checkbox':  
               $field_id_checked = '';         
               $field_id_value = get_term_meta($term_id, $name, true);
               if($field_id_value == "yes") $field_id_checked = 'checked="checked"';
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="checkbox" name="' .$name .'" id="' .$name .'" value="yes" class="crm_field" '.$field_id_checked.' />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'textarea':           
                    $input = '
                    <div class="crm_fieldbox">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label><br clear="all" />
                    <textarea name="' .$name .'" id="' .$name .'" class="crm_field">' .$postcustom[$name][0].'</textarea>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;               
          case 'wptexteditor':           
                  $settings =array(
                      'textarea_rows' => 5,
                      'quicktags' => true,
                      'media_buttons' => true,
                      'wpautop'=>false,
                      'drag_drop_upload' => true,
                      'tinymce'=> true
                  );           
                  ob_start();
                  wp_editor(get_term_meta($term_id, $name, true),$name, $settings);
                  $editor = ob_get_contents();
                  ob_end_clean();
                  $input = '
                  <div class="crm_fieldbox"  style="'.$orderstyle.'">
                  <hr />
                  <h4 class="crm_formbreak">' .$label .': <small>'.$instructions.'</small></h4><hr />'
                  .$editor.'
                  </div>';
               break;
          case 'select':
               $list = '';
               $currentselect = get_term_meta($term_id, $name, true);
               foreach($selections as $select => $value){
                    $list .= '<option value="' .$select .'"';
                    if($currentselect==$select){
                         $list .= ' selected="selected"';
                    }
                    $list .= '>' .$value .'</option>';
               }
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <select name="' .$name .'" id="' .$name .'" class="crm_field">
                    ' .$list .'
                    </select>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'upload':
          $uploadthumb = wp_get_attachment_image_src(get_term_meta($term_id, $name, true));
          $input = '
               <div class="crm_fieldbox crm_upload_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_field_iframe_wrapper"><iframe src="'.$uploadthumb[0].'"></iframe></div>
                    <button class="crm_bttn upload_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_bttn">Remove '.$label.'</button>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.get_term_meta($term_id, $name, true).'"/>
               </div>';
               break;  
          case 'upload_pdf':
          $uploadthumb = wp_get_attachment_url((get_term_meta($term_id, $name, true)));
          $input = '
               <div class="crm_fieldbox crm_upload_pdf_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_pdf_field_iframe_wrapper"><iframe src="'.$uploadthumb.'"></iframe></div>
                    <button class="crm_bttn upload_pdf_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_pdf_bttn">Remove '.$label.'</button>
                    <p class="crm_upload_pdf_message"></p>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.get_term_meta($term_id, $name, true).'"/>
               </div>';
               break;     
          case 'upload_video':
          $galleryarray = get_term_meta($term_id, $name, true);
          $finalarray= json_decode($galleryarray);
          $videosrc = $finalarray[0]->videosrc;
          $thumbnail = wp_get_attachment_image_src($finalarray[0]->thumbID, 'medium');
          $input = '
               <div class="crm_fieldbox crm_upload_video_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }    
          $input .= '
                    <div class="clear"></div>                    
                    <span class="crm_instructions">Use the white input field to manually add videos or use the "Upload Video Field" button to add an uploaded video URL to the field.<br><b>If you are having trouble selecting the white input field right click the field and paste your URL</b><br>Use the "Save '.$label.' Source" button to save the URL.<br>The gray embed box should populate with the expected result.<br>If you do not get the expected result please check your video URL and make sure it is a proper video embed URL<br>i.e. includes http/https, Youtube Video URL is in "https://youtube.com/embed/Video ID" format, etc... </span>
                    <div><p class="crm_upload_video_field_message"></p></div>
                    <div class="crm_upload_video_field_video_src">';
                    if (strpos($videosrc, $_SERVER['SERVER_NAME'])) {
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper">
                                   <iframe src="'.$videosrc.'" sandbox=""></iframe>
                                   <p contenteditable class="crm_upload_video_field_input">Right Click to Type or Paste URL</p>                              
                              </div>';                               
                    }else{
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper">
                                   <iframe src="'.$videosrc.'" sandbox="allow-scripts allow-same-origin"></iframe>
                                   <p contenteditable class="crm_upload_video_field_input">Right Click to Type or Paste URL</p>                              
                              </div>';
                    }
          $input .='
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_src_bttn">Upload '.$label.' Source</button>
                              <button class="crm_bttn remove_video_src_bttn">Remove '.$label.' Source</button>          
                              <button class="crm_bttn save_video_src_bttn">Save '.$label.' Source</button>                              
                         </div>
                    </div>
                    <span class="crm_instructions">(Optional) Please include a video thumbnail for performance purposes.<br>Any video without a thumbnail adds a video player and uses additional server resources even if a user does not click to watch the video.<br>(Youtube Note) The Front-End automatically uses the default Youtube thumbnail for Youtube videos using the https://youtube.com/embed/ URL format unless a video thumbnail is specified.</span>
                    <div class="crm_upload_video_field_thumbnail">
                         <div class="crm_upload_video_field_thumbnail_wrapper">
                              <img src="'.$thumbnail[0].'" data-id="'.$finalarray[0]->thumbID.'"/>
                         </div>
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_thumb_bttn">Upload Video Thumb</button>
                              <button class="crm_bttn remove_video_thumb_bttn">Remove Video Thumb</button>                              
                         </div>
                    </div>
                    <textarea class="crm_upload_video_field_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>    
               </div>';
          break; 

          case 'slideshow':
          $galleryarray = get_term_meta($term_id, $name, true);
          $finalarray= json_decode($galleryarray);
          $input = '
               <div class="crm_fieldbox crm_slideshow_field" data_crm_field_limit="'.$limit.'"  style="'.$orderstyle.'">

                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="clear"></div>
                    <div class="crm_slideshow_image_container" id="'.$name.'_crm_slideshow_image_container" data-field-name="'.$name.'">';
                        if ($galleryarray!='') {
                              $imgcount = 1;
                              $arraylength = count($finalarray);
                              for ($i=0; $i < $arraylength ; $i++) {  
                                $slideimage = wp_get_attachment_image_src($finalarray[$i]->ID, 'medium');
                                $input.='
                                      <div class="single_crm_slideshow_image" name="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" id="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" data-id="'.$finalarray[$i]->ID.'">
                                          <div class="single_crm_slideshow_image_wrapper">
                                              <img src="'.$slideimage[0].'"/>
                                          </div>
                                          <div class="crm_button_container">
                                              <span class="crm_slideshow_image_remove_image crm_bttn">Remove Image</span>
                                              <span class="crm_slideshow_image_edit_image crm_bttn">Edit Image</span>
                                          </div>
                                      </div>
                                ';
                                $imgcount++;
                              }
                        }
          $input .= '
                    </div>
                    <div class="clear">
                        <button class="crm_slideshow_image_add_image crm_bttn">Add '.$label.' Image</button>
                    </div>
                    <textarea class="crm_slideshow_image_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>                   
               </div>';
          break;      

          case 'colorpicker':
               $input = '
                    <div class="crm_fieldbox" style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <div class="clear"></div>
                    <div>
                         <div class="crm_colorpicker_show">' .get_term_meta($term_id, $name, true) .'</div>
                         <button class="crm_colorpicker_toggle crm_bttn">Add/Edit '.$label.'</button>
                    </div>
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .get_term_meta($term_id, $name, true) .'" class="crm_field crm_colorpicker" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;   
          case 'dynamic_fields': 
               $fieldcount =  get_term_meta($term_id, $name, true);         
               $dynamic_fields_allowed = array('input_text', 'input_radio', 'input_checkbox', 'textarea', 'select', 'tax', 'upload', 'upload_pdf', 'upload_video', 'colorpicker', 'dynamic_fields');
               foreach ($selections as $select) {
                    if (in_array($select['type'], $dynamic_fields_allowed) == false) {
                         unset($selections[$select]);
                    }
               }
               $dynamic_fields = json_encode($selections);
               $input = "
                    <div class='crm_fieldbox crm_dynamic_field_box' id='".$name."_dynamic_field_box' data_original_name='".$original_name."' data_dynamic_fields='".$dynamic_fields."' data_crm_field_limit='".$limit."' style='".$orderstyle."'>";
               $input .= '
                         <label for="' .$name.'" class="crm_label">' .$label .'</label>
               ';    

                         if($instructions){
                              $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                         }                     
               $input .= '
                         <div class="clear"></div>
                         <div class="crm_dynamic_field_box_container" id= "'.$name.'_dynamic_field_box_container">
               ';
                              for ($i=1; $i <= $fieldcount ; $i++) { 
                                   $input .= '
                                        <div class="crm_fieldbox_subsection">
                                   ';
                                        foreach ($selections as $field) {
                                             $input .= custom_ready_meta_term_createinput($field['type'], $original_name.'_'.$field['name'].'_'.$i, $field['label'].' '.$i, $field['instructions'], $field['selections'], $field['attributes']);
                                        }   
                                   $input .= '
                                             <div class="clear" style="order: 1000000;"><br/><button class="crm_dynamic_field_box_remove crm_bttn">Remove '.$label.' '.$i.'</button></div>
                                        </div>
                                   ';                             
                              }               
               $input .= '
                         </div>
                         <div class="clear"><br/></div>
                         <button class="crm_dynamic_field_box_add crm_bttn">Add '.$label.'</button>
                         <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .$fieldcount.'" class="crm_field crm_dynamic_field_box_count" />       
                         <div style="display:none;" class="crm_dynamic_field_box_storage"></div>               
                    </div>';
          break; 
     }
     return $input;
}

function custom_ready_meta_term_createinput_dynamic(){
     $type = $_POST['dynamic_type'];
     $name = $_POST['dynamic_name'];
     $label = $_POST['dynamic_label'];   
     $instructions = $_POST['dynamic_instructions'];   
     $selections = $_POST['dynamic_selections'];   
     $attributes = $_POST['dynamic_attributes'];         
     echo custom_ready_meta_term_createinput($type, $name, $label, $instructions, $selections, $attributes);
     die();          
}

add_action('wp_ajax_custom_ready_meta_term_createinput_dynamic', 'custom_ready_meta_term_createinput_dynamic');
add_action('wp_ajax_nopriv_custom_ready_meta_term_createinput_dynamic', 'custom_ready_meta_term_createinput_dynamic');

function custom_ready_meta_save_term_meta($term_id) {   
     if ( !empty($_POST['custom_ready_meta_metaboxes_noncename']) && !wp_verify_nonce($_POST['custom_ready_meta_metaboxes_noncename'],'custom_ready_meta_metaboxes_verify')){
          return $term_id;   
     }            
     $custom_term_meta = get_term_meta($term_id);
     foreach ($custom_term_meta as $key => $value) {
          if((strpos($key,'custom_ready_meta_')!==false)){ 
               if(array_key_exists($key, $_POST) == false) {
                    error_log($key.' not in array');
                    update_term_meta($term_id, $key, "");
                    delete_term_meta($term_id, $key);
               }
          }                    
     }  
     foreach($_POST as $key=>$value){
          
          if((strpos($key,'custom_ready_meta_')!==false)){           
               // checkboxes
               if(is_array($_POST[$key])){
                    delete_term_meta($term_id, $key);
                    foreach($_POST[$key] as $value){
                         add_term_meta($term_id, $key, $value);
                    }
               } else {
                    $currtermmeta = '';
                    $currtermmeta = get_term_meta($term_id, $key, true);
                    $currtermarray = get_term_meta($term_id, $key);
                    error_log($currtermmeta);
                    error_log(print_r($currtermarray, true));
                    if (count($currtermarray) > 1) {
                         delete_term_meta($term_id, $key);
                         add_term_meta($term_id, $key, $value);
                    }else if ($currtermmeta != '') {
                         update_term_meta($term_id,$key,$value);
                    }else{
                         add_term_meta($term_id,$key,$value);
                    }
               }
          }
     }   
}
// End save custom meta data

//End Custom Ready Term Meta Functions

//Start Custom Ready Options Meta Functions
function custom_ready_meta_options_createinput($type, $name, $label, $instructions, $selections, $attributes){                      
     // get current values
     $original_name = esc_js($name);
     $name = esc_js('custom_ready_meta_'.$name); 
     $option = get_option( $name );         
     $limit = ''; 
     $orderstyle = '';
     $upload_video_number = '';
     if (isset($attributes['limit'])) {
          $limit = $attributes['limit'];
     }  
     if (isset($attributes['order'])) {
          $orderstyle = ' order:'.$attributes['order'].';';
     }     
     if (isset($attributes['upload_video_number'])) {
          $upload_video_number = $attributes['upload_video_number'];
     }     
     if (isset($attributes['inputvalue'])) {
          
     }              
     // output input fields
     switch($type){
          case 'html':
               $input = '';
               if(!empty($instructions)){
                    $input .= $instructions;
               }
          break;
          case 'input_text':
               $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="text" name="'.$name.'" id="' .$name.'" value="'.$option.'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;
          case 'input_hidden':       
               $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);   
               $input = '
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .$option .'" class="crm_field"  style="'.$orderstyle.'" />
               ';
          break;
          case 'input_radio':            
               $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="radio" name="' .$name .'" id="' .$name .'" value="' .$option .'" class="crm_field" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;
          case 'input_checkbox':  
               $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
               $field_id_checked = '';         
               $field_id_value = $option;
               if($field_id_value == "yes") $field_id_checked = 'checked="checked"';
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <input type="checkbox" name="' .$name .'" id="' .$name .'" value="yes" class="crm_field" '.$field_id_checked.' />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;
          case 'textarea':          
                    $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option); 
                    $input = '
                    <div class="crm_fieldbox">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label><br clear="all" />
                    <textarea name="' .$name .'" id="' .$name .'" class="crm_field">' .$postcustom[$name][0].'</textarea>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;               
          case 'wptexteditor':      
               $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);     
               $settings =array(
                    'textarea_rows' => 5,
                    'quicktags' => true,
                    'media_buttons' => true,
                    'wpautop'=>false,
                    'drag_drop_upload' => true,
                    'tinymce'=> true
               );           
               ob_start();
               wp_editor($option,$name, $settings);
               $editor = ob_get_contents();
               ob_end_clean();
               $input = '
               <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <hr />
                    <h4 class="crm_formbreak">' .$label .': <small>'.$instructions.'</small></h4><hr />'
                    .$editor.'
               </div>';
          break;
          case 'select':
               $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
               $list = '';
               $currentselect = $option;
               foreach($selections as $select => $value){
                    $list .= '<option value="' .$select .'"';
                    if($currentselect==$select){
                         $list .= ' selected="selected"';
                    }
                    $list .= '>' .$value .'</option>';
               }
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <select name="' .$name .'" id="' .$name .'" class="crm_field">
                    ' .$list .'
                    </select>
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
               break;
          case 'tax':
               $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
               $input = '
                    <div class="crm_fieldbox"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>';
                    $input .= custom_ready_meta_tax_dropdown($original_name);
               $input .= '</div>';
               break;
          case 'upload':
          $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
          $uploadthumb = wp_get_attachment_image_src($option, 'medium');
          $input = '
               <div class="crm_fieldbox crm_upload_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_field_iframe_wrapper"><iframe src="'.$uploadthumb[0].'"></iframe></div>
                    <button class="crm_bttn upload_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_bttn">Remove '.$label.'</button>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.$option.'"/>
               </div>';
               break;  
          case 'upload_pdf':
          $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
          $uploadthumb = wp_get_attachment_url(($option));
          $input = '
               <div class="crm_fieldbox crm_upload_pdf_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="crm_upload_pdf_field_iframe_wrapper"><iframe src="'.$uploadthumb.'"></iframe></div>
                    <button class="crm_bttn upload_pdf_bttn">Upload '.$label.'</button>
                    <button class="crm_bttn remove_upload_pdf_bttn">Remove '.$label.'</button>
                    <p class="crm_upload_pdf_message"></p>
                    <input type="hidden" name="'.$name.'" id="'.$name.'" value="'.$option.'"/>
               </div>';
               break;     
          case 'upload_video':
          $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
          $galleryarray = $option;
          $finalarray= json_decode($galleryarray);
          $videosrc = $finalarray[0]->videosrc;
          $thumbnail = wp_get_attachment_image_src($finalarray[0]->thumbID, 'medium');
          $input = '
               <div class="crm_fieldbox crm_upload_video_field"  style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }    
          $input .= '
                    <div class="clear"></div>                    
                    <span class="crm_instructions">Use the white input field to manually add videos or use the "Upload Video Field" button to add an uploaded video URL to the field.<br><b>If you are having trouble selecting the white input field right click the field and paste your URL</b><br>Use the "Save '.$label.' Source" button to save the URL.<br>The gray embed box should populate with the expected result.<br>If you do not get the expected result please check your video URL and make sure it is a proper video embed URL<br>i.e. includes http/https, Youtube Video URL is in "https://youtube.com/embed/Video ID" format, etc... </span>
                    <div><p class="crm_upload_video_field_message"></p></div>
                    <div class="crm_upload_video_field_video_src">';
                    if (strpos($videosrc, $_SERVER['SERVER_NAME'])) {
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper">
                                   <iframe src="'.$videosrc.'" sandbox=""></iframe>
                                   <p contenteditable class="crm_upload_video_field_input">Right Click to Type or Paste URL</p>                              
                              </div>';                               
                    }else{
                         $input .='
                              <div class="crm_upload_video_field_iframe_wrapper">
                                   <iframe src="'.$videosrc.'" sandbox="allow-scripts allow-same-origin"></iframe>
                                   <p contenteditable class="crm_upload_video_field_input">Right Click to Type or Paste URL</p>                              
                              </div>';
                    }
          $input .='
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_src_bttn">Upload '.$label.' Source</button>
                              <button class="crm_bttn remove_video_src_bttn">Remove '.$label.' Source</button>          
                              <button class="crm_bttn save_video_src_bttn">Save '.$label.' Source</button>                              
                         </div>
                    </div>
                    <span class="crm_instructions">(Optional) Please include a video thumbnail for performance purposes.<br>Any video without a thumbnail adds a video player and uses additional server resources even if a user does not click to watch the video.<br>(Youtube Note) The Front-End automatically uses the default Youtube thumbnail for Youtube videos using the https://youtube.com/embed/ URL format unless a video thumbnail is specified.</span>
                    <div class="crm_upload_video_field_thumbnail">
                         <div class="crm_upload_video_field_thumbnail_wrapper">
                              <img src="'.$thumbnail[0].'" data-id="'.$finalarray[0]->thumbID.'"/>
                         </div>
                         <div class="crm_button_container">
                              <button class="crm_bttn upload_video_thumb_bttn">Upload Video Thumb</button>
                              <button class="crm_bttn remove_video_thumb_bttn">Remove Video Thumb</button>                              
                         </div>
                    </div>
                    <textarea class="crm_upload_video_field_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>    
               </div>';
          break; 

          case 'slideshow':
          $option = (isset($attributes['inputvalue']) ? $attributes['inputvalue'] : $option);
          $galleryarray = $option;
          $finalarray= json_decode($galleryarray);
          $input = '
               <div class="crm_fieldbox crm_slideshow_field" data_crm_field_limit="'.$limit.'"  style="'.$orderstyle.'">

                    <label for="' .$name .'" class="crm_label">' .$label .': <small>'.$instructions.'</small></label>
                    <div class="clear"></div>
                    <div class="crm_slideshow_image_container" id="'.$name.'_crm_slideshow_image_container" data-field-name="'.$name.'">';
                        if ($galleryarray!='') {
                              $imgcount = 1;
                              $arraylength = count($finalarray);
                              for ($i=0; $i < $arraylength ; $i++) {  
                                $slideimage = wp_get_attachment_image_src($finalarray[$i]->ID, 'medium');
                                $input.='
                                      <div class="single_crm_slideshow_image" name="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" id="'.$name.'_single_crm_slideshow_image_'.$imgcount.'" data-id="'.$finalarray[$i]->ID.'">
                                          <div class="single_crm_slideshow_image_wrapper">
                                              <img src="'.$slideimage[0].'"/>
                                          </div>
                                          <div class="crm_button_container">
                                              <span class="crm_slideshow_image_remove_image crm_bttn">Remove Image</span>
                                              <span class="crm_slideshow_image_edit_image crm_bttn">Edit Image</span>
                                          </div>
                                      </div>
                                ';
                                $imgcount++;
                              }
                        }
          $input .= '
                    </div>
                    <div class="clear">
                        <button class="crm_slideshow_image_add_image crm_bttn">Add '.$label.' Image</button>
                    </div>
                    <textarea class="crm_slideshow_image_array" style="display:none;" name="'.$name.'" id="'.$name.'" />'.htmlentities($galleryarray, ENT_QUOTES, "UTF-8").'</textarea>                   
               </div>';
          break;      

          case 'colorpicker':
               $input = '
                    <div class="crm_fieldbox" style="'.$orderstyle.'">
                    <label for="' .$name .'" class="crm_label">' .$label .'</label>
                    <div class="clear"></div>
                    <div>
                         <div class="crm_colorpicker_show">' .$option .'</div>
                         <button class="crm_colorpicker_toggle crm_bttn">Add/Edit '.$label.'</button>
                    </div>
                    <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .$option .'" class="crm_field crm_colorpicker" />
                    ';
                    if($instructions){
                         $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                    }
                    $input .= '
                    </div>';
          break;   
          case 'dynamic_fields': 
               $fieldcount =  $option;  
               print_r($option);       
               $dynamic_fields_allowed = array('input_text', 'input_radio', 'input_checkbox', 'textarea', 'select', 'tax', 'upload', 'upload_pdf', 'upload_video', 'colorpicker');
               foreach ($selections as $select) {
                    if (in_array($select['type'], $dynamic_fields_allowed) == false) {
                         unset($selections[$select]);
                    }
               }
               $dynamic_fields = json_encode($selections);
               $input = "
                    <div class='crm_fieldbox crm_dynamic_field_box' id='".$name."_dynamic_field_box' data_original_name='".$original_name."' data_dynamic_fields='".$dynamic_fields."' data_crm_field_limit='".$limit."' style='".$orderstyle."'>";
               $input .= '
                         <label for="' .$name.'" class="crm_label">' .$label .'</label>
               ';    

                         if($instructions){
                              $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                         }                     
               $input .= '
                         <div class="clear"></div>
                         <div class="crm_dynamic_field_box_container" id= "'.$name.'_dynamic_field_box_container">
               ';
                              for ($i=1; $i <= $fieldcount ; $i++) { 
                                   $input .= '
                                        <div class="crm_fieldbox_subsection">
                                   ';
                                        foreach ($selections as $field) {
                                             $input .= custom_ready_meta_options_createinput($field['type'], $original_name.'_'.$field['name'].'_'.$i, $field['label'].' '.$i, $field['instructions'], $field['selections'], $field['attributes']);
                                        }   
                                   $input .= '
                                             <div class="clear" style="order: 1000000;"><br/><button class="crm_dynamic_field_box_remove crm_bttn">Remove '.$label.' '.$i.'</button></div>
                                        </div>
                                   ';                             
                              }               
               $input .= '
                         </div>
                         <div class="clear"><br/></div>
                         <button class="crm_dynamic_field_box_options_add crm_bttn">Add '.$label.'</button>
                         <input type="hidden" name="' .$name .'" id="' .$name .'" value="' .$fieldcount.'" class="crm_field crm_dynamic_field_box_count" />       
                         <div style="display:none;" class="crm_dynamic_field_box_storage"></div>               
                    </div>';
          break; 
          case 'nested_dynamic_fields': 
               $fieldcount =  $option;  
               $restore = get_option($name.'_restore');
               print_r($option);       
               $dynamic_fields_allowed = array('input_text', 'input_radio', 'input_checkbox', 'textarea', 'select', 'tax', 'upload', 'upload_pdf', 'upload_video', 'colorpicker', 'nested_dynamic_fields');
               foreach ($selections as $select) {
                    if (in_array($select['type'], $dynamic_fields_allowed) == false) {
                         unset($selections[$select]);
                    }
               }
               $dynamic_fields = json_encode($selections);
               $input = "
                    <div class='crm_fieldbox crm_dynamic_nested_field_box' id='crm_dynamic_nested_field_box_".$original_name."' data_original_name='".$original_name."' data_dynamic_fields='".$dynamic_fields."' data_crm_field_limit='".$limit."' style='".$orderstyle."'>";
               $input .= '
                         <label for="' .$name.'" class="crm_label">' .$label .'</label>
               ';    

                         if($instructions){
                              $input .= '<span class="crm_instructions">' .$instructions .'</span>';
                         }                     
               $input .= '
                         <div class="clear"></div>
                         <div class="crm_dynamic_nested_field_box_container">
               ';
                              for ($i=1; $i <= $fieldcount ; $i++) { 
                                   $input .= '
                                        <div class="crm_dynamic_nested_fieldbox_subsection">
                                   ';
                                        foreach ($selections as $field) {
                                             $input .= custom_ready_meta_options_createinput($field['type'], $original_name.$field['name'], $field['label'].' '.$i, $field['instructions'], $field['selections'], $field['attributes']);
                                        }   
                                   $input .= '
                                             <div class="clear" style="order: 1000000;"><br/><button class="crm_dynamic_nested_field_box_remove crm_bttn">Remove '.$label.' '.$i.'</button></div>
                                        </div>
                                   ';                             
                              }               
               $input .= '
                         </div>
                         <div class="clear"><br/></div>
                         <button class="crm_dynamic_nested_field_box_options_add crm_bttn" id="crm_dynamic_nested_field_box_options_add_'.$original_name.'" >Add '.$label.'</button>
                         <input type="hidden" name="' .$name.'" id="' .$name.'" value="' .$fieldcount.'" class="crm_field crm_dynamic_nested_field_box_count" />  
                         <div style="display:none;" class="crm_dynamic_nested_field_box_storage"></div>               
                    </div>';
          break;           
     }
     return $input;
}
// End 


function custom_ready_meta_options_createinput_dynamic(){
     $type = $_POST['dynamic_type'];
     $name = $_POST['dynamic_name'];
     $label = $_POST['dynamic_label'];   
     $instructions = $_POST['dynamic_instructions'];   
     $selections = $_POST['dynamic_selections'];   
     $attributes = $_POST['dynamic_attributes'];         
     echo custom_ready_meta_options_createinput($type, $name, $label, $instructions, $selections, $attributes);
     die();          
}

add_action('wp_ajax_custom_ready_meta_options_createinput_dynamic', 'custom_ready_meta_options_createinput_dynamic');
add_action('wp_ajax_nopriv_custom_ready_meta_options_createinput_dynamic', 'custom_ready_meta_options_createinput_dynamic');

function custom_ready_meta_options_field_render(array $args) { 
     $option = get_option('custom_ready_meta_options');
     echo '<input type="text" name="custom_ready_meta_options" id="custom_ready_meta_options" value="'.$option.'" class="crm_field" />';
     //echo '<input type="hidden" name="custom_ready_meta_options" id="custom_ready_meta_options" value="" class="crm_field" />';
}
function custom_ready_meta_options_callback(  ) { 
     echo __( '', 'wordpress' );
}

/*function custom_ready_meta_options_update( $new_value, $old_value ) {
     print_r($_POST, true);
}

function custom_ready_meta_options_update_init() {
     add_filter( 'pre_update_option_custom_ready_meta_options', 'custom_ready_meta_options_update', 10, 2 );
}

add_action( 'init', 'custom_ready_meta_options_update_init' );*/

//End Custom Ready Options Meta Functions


//Start Ajax Function For Pulling wp.media.attachment id by URL
function custom_ready_meta_get_attachment_id(){
     global $wpdb;
     $img_src = $_POST['img_src'];
     $attachment = $wpdb->get_col($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE guid='%s';", $img_src ));         
     echo $attachment[0];
     die();          
}

add_action('wp_ajax_custom_ready_meta_get_attachment_id', 'custom_ready_meta_get_attachment_id');
add_action('wp_ajax_nopriv_custom_ready_meta_get_attachment_id', 'custom_ready_meta_get_attachment_id');
//End Ajax Function For Pulling wp.media.attachment id by URL

function custom_ready_meta_display_load() {
     require_once 'custom_ready_meta_display.php';
     wp_register_script('custom_meta_display_js', CUSTOMREADYMETA_URL.'/js/custom_ready_meta_display.js', array('jquery') );
     wp_enqueue_script('custom_meta_display_js');
     wp_register_style('custom_meta_display_css', CUSTOMREADYMETA_URL.'/css/custom_ready_meta_display.css',false );
     wp_enqueue_style('custom_meta_display_css');                    
}

/*Start Add Attachment Sizes To WP.Media JS*/
function custom_ready_meta_wp_media_image_sizes_js( $response, $attachment, $meta ){

        $size_array = array( 'design_gallery') ;

        foreach ( $size_array as $size ):

            if ( isset( $meta['sizes'][ $size ] ) ) {
                $attachment_url = wp_get_attachment_url( $attachment->ID );
                $base_url = str_replace( wp_basename( $attachment_url ), '', $attachment_url );
                $size_meta = $meta['sizes'][ $size ];

                $response['sizes'][ $size ] = array(
                    'height'        => $size_meta['height'],
                    'width'         => $size_meta['width'],
                    'url'           => $base_url . $size_meta['file'],
                    'orientation'   => $size_meta['height'] > $size_meta['width'] ? 'portrait' : 'landscape',
                );
            }

        endforeach;

        return $response;
}
add_filter ( 'wp_prepare_attachment_for_js',  'custom_ready_meta_wp_media_image_sizes_js' , 10, 3  );
/*End Add Attachment Sizes To WP.Media JS*/

?>