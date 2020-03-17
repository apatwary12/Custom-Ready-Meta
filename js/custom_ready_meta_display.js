jQuery(document).ready(function($){
     var custom_ready_meta_wait_for_final_event = (function () {
             var custom_ready_meta_wait_for_final_event_timers = {};
             return function (callback, ms, uniqueId) {
               console.log(uniqueId);
                 if (!uniqueId) {
                     uniqueId = "Don't call this twice without a uniqueId";
                 }
                 if (custom_ready_meta_wait_for_final_event_timers[uniqueId]) {
                     clearTimeout(custom_ready_meta_wait_for_final_event_timers[uniqueId]);
                 }
                 custom_ready_meta_wait_for_final_event_timers[uniqueId] = setTimeout(callback, ms);
             };
     })();

     if ($('.custom_ready_meta_image_map').length>0 || $('body.page-template-page_dc_gallery-php').length>0) {
          function custom_ready_meta_image_map_tweak() {
               $('.custom_ready_meta_image_map').each(function(){
                    image_map = $(this);
                    var primary_image = image_map.find('.custom_ready_meta_image_map_primary_image img');
                    var primary_image_height = Math.min(primary_image.attr('data_height'), primary_image.attr('data_max_height'));
                    var primary_image_width = Math.min(primary_image.attr('data_width'), primary_image.attr('data_max_width'));
                    var primary_image_height_curr = primary_image.height();
                    var primary_image_width_curr = primary_image.width();
                    if (primary_image_height != primary_image_height_curr || primary_image_width != primary_image_width_curr ) {
                         var height_tweak = primary_image_height_curr/primary_image_height;
                         var width_tweak = primary_image_width_curr/primary_image_width;
                         //console.log(primary_image.attr('data_height'));
                         //console.log(primary_image.attr('data_max_height'));
                         //console.log(primary_image_height_curr);
                         console.log(height_tweak);                                        
                         image_map.find('.custom_ready_meta_image_map_show_points img').each(function(){
                              var point_height = $(this).attr('data_point_height');
                              var point_width = $(this).attr('data_point_width');
                              var point_top = parseFloat($(this).attr('data_point_top'));
                              var point_left = parseFloat($(this).attr('data_point_left'));
                              var point_tweak_height = point_height*height_tweak;
                              var point_tweak_width = point_width*width_tweak;
                              var point_tweak_top = point_top*height_tweak;
                              var point_tweak_left = point_left*width_tweak;
                              $(this).css({'height': point_tweak_height, 'width': point_tweak_width, 'top': point_tweak_top, 'left': point_tweak_left });
                         });
                         image_map.find('.custom_ready_meta_image_map_show_points .info_parent').each(function(){
                              var point_height_dc = $(this).css('max-height');
                              var point_width_dc = $(this).css('width');
                              var point_top_dc = parseFloat($(this).attr('data_point_top'))+45;
                              var point_left_dc = parseFloat($(this).attr('data_point_left'));
                              var point_tweak_height_dc = point_height_dc*height_tweak;
                              var point_tweak_width_dc = point_width_dc*width_tweak;
                              var point_tweak_top_dc = point_top_dc*height_tweak;
                              var point_tweak_left_dc = point_left_dc*width_tweak;
                              $(this).css({'height': point_tweak_height_dc, 'width': point_tweak_width_dc, 'top': point_tweak_top_dc, 'left': point_tweak_left_dc });
                         });
                    }
               });
          }
          custom_ready_meta_image_map_timer = setTimeout( function(){
               
               custom_ready_meta_image_map_tweak($(this));
               
          },400);          
          $('.custom_ready_meta_image_map .custom_ready_meta_image_map_primary_image img').load(function(){
               clearTimeout(custom_ready_meta_image_map_timer);
               custom_ready_meta_image_map_timer = setTimeout( function(){
                    
                    custom_ready_meta_image_map_tweak($(this));
                    
               },400);
          });
           $('.custom_ready_meta_image_map .custom_ready_meta_image_map_primary_image .info_parent').load(function(){
               clearTimeout(custom_ready_meta_image_map_timer);
               custom_ready_meta_image_map_timer = setTimeout( function(){
                    
                    custom_ready_meta_image_map_tweak($(this));
                    
               },400);
          });

          $(window).resize(function(){
               custom_ready_meta_wait_for_final_event(function() {
                    
                    custom_ready_meta_image_map_tweak($(this));
                                        
               }, 400, 'custom_ready_meta_image_map_resize_final_timer')               
          });
           jQuery(document).ready(function (){
            jQuery('body.page-template-page_design-php #design_center_filter_wrapper').on('click','.design_center_img' , function(){
                 var image_map_pos_value = jQuery(this).attr('data-ajax_pos');
                 var page_id = jQuery(this).closest('.design_center_image').attr('data_page_id');
                 console.log(image_map_pos_value);
                 console.log(page_id);

                //jQuery('.design_center_img').addClass('.selected_image');
                jQuery.ajax({  
                            type: "POST",
                            url: '/wp-admin/admin-ajax.php',
                            data: {
                                 action:'custom_ready_meta_display_image_map_ajax',    
                                 image_map_id: image_map_pos_value,
                                 page_id: page_id,
                                 element_id: 'crm_home_image_map_0',
                                 attributes: ''
                            },    
                           success: function(response){
                                  console.log(response);
                                 jQuery('#P_selected_image').html(response);
                            },
                            complete: function(){
                                jQuery('#P_selected_image img').on('load',function(){
                                 clearTimeout(custom_ready_meta_image_map_timer);
                                 custom_ready_meta_image_map_timer = setTimeout( function(){
                                      
                                      custom_ready_meta_image_map_tweak(jQuery(this));
                                      
                                 },400);
                            });                                               
                            },
                           async: true  
                      });  


               });
jQuery('body.page-template-page_dc_gallery-php #design_center_filter_wrapper').on('click','.design_center_img' , function(){
     var items = [];
     var image_map_pos_value_global = jQuery(this).attr('data-ajax_pos');
     jQuery(this).closest('.design_center_image').find('.design_center_img').each(function(){
          var image_map_pos_value = jQuery(this).attr('data-ajax_pos');
          var page_id = jQuery(this).closest('.design_center_image').attr('data_page_id');     
          jQuery.ajax({  
               type: 'POST',
               url: '/wp-admin/admin-ajax.php',
               data: {
                    action:'custom_ready_meta_display_image_map_ajax',    
                    image_map_id: image_map_pos_value,
                    page_id: page_id,
                    element_id: 'crm_home_image_map_0',
                    attributes: ''
               },    
               success: function(response){
                    items[image_map_pos_value -1] = {
                         src: response, 
                         type: 'inline'
                         
                    };
               },   
               async: true        
          });                     
     }); console.log(parseInt(image_map_pos_value_global) -1);
     var index = parseInt(image_map_pos_value_global) -1; 
     setTimeout(function(){
     jQuery.magnificPopup.open({
          preloader: true,
          items: items,
          mainClass: 'mfp-img-mobile',
          gallery:{
              enabled:true
              
          }, 
          callbacks: {
              elementParse: function() {
                  
                        clearTimeout(custom_ready_meta_image_map_timer);
                        custom_ready_meta_image_map_timer = setTimeout( function(){
                             custom_ready_meta_image_map_tweak(jQuery(this));
                        },400);
                    
              },
              change: function() {
                  
                        clearTimeout(custom_ready_meta_image_map_timer);
                        custom_ready_meta_image_map_timer = setTimeout( function(){
                             custom_ready_meta_image_map_tweak(jQuery(this));
                        },400);
                    
              }
              
          }                                         
     },index);
     console.log(jQuery.magnificPopup.instance);
     console.log(items);
}, 2000);
});


          });
     }
          
        
        //var newtop = $('.info_parent').css('top');

        //$('.info_parent').css('top', (parseInt(newtop, 10)+78) + 'px');

         $('body').on('click','.custom_ready_meta_image_map_show_points > img' , function(){ 
          var tag_position = $(this).attr('data_point_pos');
          $(this).closest('.custom_ready_meta_image_map_show_points').find('.info_parent[data_point_pos = '+tag_position+']').fadeToggle();
       
    });


});