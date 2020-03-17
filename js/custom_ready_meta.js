jQuery(document).ready(function($){
     if ($('.crm_colorpicker').length>0) {
               $('.crm_colorpicker').iris({
                                             hide: true,
                                             change: function(event, ui) {
                                             var colorshow = $(this).closest('.crm_fieldbox').find('.crm_colorpicker_show');
                                             colorshow.css( 'color', ui.color.toString());
                                             colorshow.html(ui.color.toString());
                                             }
               });
               $('.crm_colorpicker_toggle').on('click', function(e) {
                    e.preventDefault();
                    var pickerfield = $(this).closest('.crm_fieldbox').find('.crm_colorpicker');
                    pickerfield.iris('toggle');
               });
     }
     //Start Functions For Upload Fields  
     if ($('.crm_upload_field').length>0) {
         $('.crm_upload_field').on('click', ".upload_bttn", function(e) {
               var frame = $(this).closest('.crm_upload_field').find('iframe');
               var input = $(this).closest('.crm_upload_field').find('input');
               e.preventDefault();
               var image = wp.media({ 
               title: 'Upload Image',
               type : 'image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field
                    frame.attr('src',image_url );
                    input.attr('value',image_id);      
               }); 
         });
         $('.crm_upload_field').on('click', ".remove_upload_bttn", function(e) {
               var frame = $(this).closest('.crm_upload_field').find('iframe');
               var input = $(this).closest('.crm_upload_field').find('input');
               frame.attr('src', "" );
               input.attr('value', "");                 
         });         
     }
     //End Functions For Upload Fields     

     //Start Functions For Upload PDF Fields  
     if ($('.crm_upload_pdf_field').length>0) {
         $('.crm_upload_pdf_field').on('click', ".upload_pdf_bttn", function(e) {
               var frame = $(this).closest('.crm_upload_pdf_field').find('iframe');
               var input = $(this).closest('.crm_upload_pdf_field').find('input');
               var message = $(this).closest('.crm_upload_pdf_field').find('.crm_upload_pdf_message');
               e.preventDefault();
               message.html('');
               var image = wp.media({ 
               title: 'Upload PDF',
               type : 'image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field
                    if (image_url.substr(image_url.length - 4) == '.pdf') {
                         message.html('');
                    }else{
                         message.html('This Field Only Accepts PDF Uploads');
                         return false;
                    }                    
                    frame.attr('src',image_url );
                    input.attr('value',image_id);      
               }); 
         });
         $('.crm_upload_pdf_field').on('click', ".remove_upload_pdf_bttn", function(e) {
               e.preventDefault();
               var frame = $(this).closest('.crm_upload_pdf_field').find('iframe');
               var input = $(this).closest('.crm_upload_pdf_field').find('input');
               var message = $(this).closest('.crm_upload_pdf_field').find('.crm_upload_pdf_message');
               frame.attr('src', "" );
               input.attr('value', "");   
               message.html('');              
         });         
     }
     //End Functions For Upload PDF Fields  

     //Start Functions For Upload Video Fields  
     if ($('.crm_upload_video_field').length>0) {
          $('.crm_upload_video_field').on('click', ".upload_video_src_bttn", function(e) {
               var input = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               message.html('');
               e.preventDefault();
               var video = wp.media({ 
               title: 'Upload Video',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_video = video.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var video_url = uploaded_video.toJSON().url;
                    var video_id = uploaded_video.toJSON().id;        
                    // Let's assign the url value to the input field
                    var accepted_vid_formats = ['.mp4', ".m4v", ".ogv", ".wmv", ".flv"];
                    var video_format = video_url.substr(video_url.length - 4);
                    if (accepted_vid_formats.indexOf(video_format) != -1) {
                         message.html('');
                    }else{
                         message.html('This Field Only Accepts One Of The Following Video Formats.<br> .mp4, .m4v, .ogv, .wmv, .flv');
                         return false;
                    }                    
                    input.val(video_url);
               });
          });

          $('.crm_upload_video_field').on('click', ".save_video_src_bttn", function(e) {           
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var input = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var frame = $(this).closest('.crm_upload_video_field').find('iframe');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];
               var siteurl = document.location.origin;
               message.html('');   
               e.preventDefault();    
               if ( input.val() == "") {
                    message.html('Please insert a url into the field. Once complete the url will be saved and the expected Front End result will appear to the left. ');
                    return false;
               }                                       
               var videosrc = input.val(); 
               if (videosrc.includes('https') == false && videosrc.includes('http') == false) {
                    message.html('Please ensure your URL begins with "https://" or "http://"');
                    return false;                    
               }                               
               if (videosrc.includes('youtu.be') == true) {
                    message.html('Youtube Videos Must be in the https://youtube.com/embed/"Video ID" Format.');
                    return false;                    
               }                
               if (videosrc.includes('https://youtube.com') == true ) {
                    if (videosrc.includes('/embed/') == false){
                         message.html('Youtube Videos Must be in the https://youtube.com/embed/"Video ID" Format.');
                         return false;                           
                    }else{
                         if (videosrc.includes('?autoplay=1') == false){
                              videosrc.replace('?autoplay=1', '');                        
                         }                                                     
                    }
               }     
               if (videosrc.includes(siteurl) == true){
                    frame.attr('sandbox', '');   
               }else{
                    frame.attr('sandbox', 'allow-scripts allow-same-origin');
               }              
               video_array.push({"thumbID":thumbid, "videosrc": videosrc});
               frame.attr('src', videosrc ); 
               input.val("");
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);         
               message.html('Your video has been saved. Simply update the page for the changes to take effect.<br> Please ensure the embedded video to the left is correct before updating the page.');                                                       
          });    

          $('.crm_upload_video_field').on('click', ".remove_video_src_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var frame = $(this).closest('.crm_upload_video_field').find('iframe');
               var input = $(this).closest('.crm_upload_video_field').find('input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];      
               frame.attr('src', "" );
               video_array.push({"thumbID":thumbid, "videosrc": ""});                        
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);                 
               input.html('');               
               message.html('The Video Source URL Has Been Removed.');              
          }); 

          $('.crm_upload_video_field').on('click', ".upload_video_thumb_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var videosrc = $(this).closest('.crm_upload_video_field').find('iframe').attr('src');
               var img = $(this).closest('.crm_upload_video_field').find('img');                    
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var video_array = [];    
               e.preventDefault();
               message.html('');
               var image = wp.media({ 
               title: 'Upload Image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field                 
                    img.attr('src', image_url);
                    img.attr('data-id', image_id);    
                    video_array.push({"thumbID":image_id, "videosrc": videosrc});   
                    var finalarray = JSON.stringify(video_array);
                    textarea.val(finalarray);                            
                    message.html('This Video Thumbnail Image Has Been Uploaded.<br>Please ensure the embedded video to the left is correct before updating the page.');                     
               });         
          });  

          $('.crm_upload_video_field').on('click', ".remove_video_thumb_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');               
               var videosrc = $(this).closest('.crm_upload_video_field').find('iframe').attr('src');
               var img = $(this).closest('.crm_upload_video_field').find('img');                    
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];    
               img.attr('src', "");
               img.attr('data-id', "");
               video_array.push({"thumbID":"", "videosrc": videosrc});       
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);                
               message.html('This Video Thumbnail Image Has Been Removed.');              
          });              
     }
     //End Functions For Upload Video Fields  


     //Start Functions For Regular Slideshow Fields     
     $('.crm_slideshow_field').ready(function($) {             
          $( ".crm_slideshow_image_container" ).sortable({
               stop: function( event, ui ) {
                    var container = $(this).attr('id');
                    slideshow_array_change(container);
               }
          }); 

          function slideshow_array_change(containerid){
               arraycount = 0;
               imgcount = 1;                           
               var totalarray = [];
               if (containerid.substring(0,1) != '#') {
                    containerid = '#'+containerid;
               } 
               var name = $(containerid).attr('data-field-name');
               var galleryarrayinput = $(containerid).closest('.crm_slideshow_field').find('.crm_slideshow_image_array');
               $(containerid).closest('.crm_slideshow_field').find('.single_crm_slideshow_image').each(function(){
                    $(this).attr('name', name+'_single_crm_slideshow_image_'+imgcount);
                    $(this).attr('id', name+'_single_crm_slideshow_image_'+imgcount);                                                               
                    var singleimg = $(this).find('img').attr('src');
                    var singledataid = $(this).attr('data-id');                           
                    totalarray.push({"ID":singledataid, "URL":singleimg});
                    imgcount++;
               });
               //unserialize the array of objects
               var finalarray = JSON.stringify(totalarray);
               galleryarrayinput.val(finalarray);
               $(containerid).closest('.crm_slideshow_field').find(".crm_slideshow_image_container" ).sortable( "refresh" );
          };        

          function slideshow_edit_image(container){               
               var orig_id = container.attr('data-id');
               //console.log(orig_id);
               ids = [orig_id];                
               var image = wp.media({ 
                    title: 'Add Image',
                    // mutiple: true if you want t1o upload multiple files at once
                    multiple: false
               });
               image.on('open', function(){
                    var selection = image.state().get('selection');
                    for (i = 0; i < ids.length; i++) {
                         attachment = wp.media.attachment(ids[i]);                         
                         attachment.fetch();
                         selection.add( attachment ? [ attachment ] : [] );                                
                    };
               }).on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;            
                    // Let's assign the url value to the input field
                    container.attr('data-id',image_id );
                    container.find('.single_crm_slideshow_image_wrapper img').attr('src',image_url );   
                    slideshow_array_change(container.attr('id'));      
             });
             image.open();         
          }     

          function slideshow_add_image(containerid){
               containerid = '#'+containerid;
               var name = $(containerid).attr('data-field-name');
               var imgframe = $(containerid);
               var nextpos = $(containerid).find('.single_crm_slideshow_image').length+1;
               var image = wp.media({ 
                      title: 'Upload Image',
                      type : 'image',
                      multiple: true
               });
               image.on('select', function(e){                    
                    var uploaded_images = image.state().get('selection');
                    uploaded_images.map( function( uploaded_image ) {
                         var showimage ='';
                         var image_url = uploaded_image.toJSON().url;
                         var image_id = uploaded_image.toJSON().id;                    
                         showimage +='<div class="single_crm_slideshow_image" name="'+name+'_single_crm_slideshow_image_'+nextpos+'" id="'+name+'_single_crm_slideshow_image_'+nextpos+'" data-id="'+image_id+'">';
                              showimage +='<div class="single_crm_slideshow_image_wrapper">';
                                   showimage +='<img src="'+image_url+'"/>';
                              showimage +='</div>';    
                              showimage +='<div class="crm_button_container">';
                                   showimage +='<span class="crm_slideshow_image_remove_image crm_bttn">Remove Image</span>';
                                   showimage +='<span class="crm_slideshow_image_edit_image crm_bttn">Edit Image</span>';
                              showimage +='</div>';                                       
                         showimage += '</div>';            
                         // Let's assign the url value to the input field
                         imgframe.append(showimage);   
                         slideshow_array_change(containerid);      
                    });
               }); 
               image.open();            
          }

          $('.crm_slideshow_field').on('click', ".crm_slideshow_image_remove_image", function() {
               if ($(this).closest('.crm_dynamic_field_box').length<=0) {
                    var container = $(this).closest('.crm_slideshow_field').find('.crm_slideshow_image_container').attr('id');
                    $(this).closest('.single_crm_slideshow_image').remove();                 
                    slideshow_array_change(container);                 
               }
          });   

          $('.crm_slideshow_field').on('click', ".crm_slideshow_image_edit_image", function() {
               if ($(this).closest('.crm_dynamic_field_box').length<=0) {
                    var selectedimage = $(this).closest('.single_crm_slideshow_image');       
                    slideshow_edit_image(selectedimage);                 
               }
          });   

         $('.crm_slideshow_field').on('click', '.crm_slideshow_image_add_image', function(e){
               if ($(this).closest('.crm_dynamic_field_box').length<=0) {
                    e.preventDefault();
                    var container = $(this).closest('.crm_slideshow_field').find('.crm_slideshow_image_container').attr('id');
                    slideshow_add_image(container);
               }
         });                            

     });
     //End Functions For Regular Slideshow Fields

     //Start Functions For Dynamic Fields
     if ($('.crm_dynamic_field_box').length>0) {
          //Start Functions For Dynamic Slideshow Fields
          function dynamic_slideshow_array_change(containerid){
               //console.log(containerid);
               arraycount = 0;
               imgcount = 1;                           
               var totalarray = [];
               if (containerid.substring(0,1) != '#') {
                    containerid = '#'+containerid;
               } 
               var name = $(containerid).attr('data-field-name');
               var galleryarrayinput = $(containerid).closest('.crm_slideshow_field').find('.crm_slideshow_image_array');
               $(containerid).closest('.crm_slideshow_field').find('.single_crm_slideshow_image').each(function(){
                    $(this).attr('name', name+'_single_crm_slideshow_image_'+imgcount);
                    $(this).attr('id', name+'_single_crm_slideshow_image_'+imgcount);                                                               
                    var singleimg = $(this).find('img').attr('src');
                    var singledataid = $(this).attr('data-id');                           
                    totalarray.push({"ID":singledataid, "URL":singleimg});
                    imgcount++;
               });
               //unserialize the array of objects
               var finalarray = JSON.stringify(totalarray);
               galleryarrayinput.val(finalarray);
               $(containerid).closest('.crm_slideshow_field').find(".crm_slideshow_image_container" ).sortable( "refresh" );
          };        

          function dynamic_slideshow_edit_image(selectedimg){
               var orig_id = $(selectedimg).attr('data-id');
               ////console.log(orig_id);
               ids = [orig_id]; 
               var image = wp.media({ 
                    title: 'Add Image',
                    // mutiple: true if you want t1o upload multiple files at once
                    multiple: false
               });
               image.on('open', function(){
                    var selection = image.state().get('selection');
                    for (i = 0; i < ids.length; i++) {
                         attachment = wp.media.attachment(ids[i]);                         
                         attachment.fetch();
                         selection.add( attachment ? [ attachment ] : [] );                                
                    };
               }).on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;            
                    // Let's assign the url value to the input field
                    $(selectedimg).attr('data-id',image_id );
                    $(selectedimg).find('.single_crm_slideshow_image_wrapper img').attr('src',image_url );   
                    var container = $(selectedimg).closest('.crm_slideshow_image_container').attr('id');                    
                    dynamic_slideshow_array_change(container);      
             });  
             image.open();       
          }  
           
          function dynamic_slideshow_add_image(containerid){
               containerid = '#'+containerid;
               var name = $(containerid).attr('data-field-name');
               var imgframe = $(containerid);
               var nextpos = $(containerid).find('.single_crm_slideshow_image').length+1;
               var image = wp.media({ 
                      title: 'Upload Image',
                      type : 'image',
                      multiple: true
               });               
               image.on('select', function(e){
                    var uploaded_images = image.state().get('selection');
                    uploaded_images.map( function( uploaded_image ) {
                         var image_url = uploaded_image.toJSON().url;
                         var image_id = uploaded_image.toJSON().id;
                         var showimage ='';
                         showimage +='<div class="single_crm_slideshow_image" name="'+name+'_single_crm_slideshow_image_'+nextpos+'" id="'+name+'_single_crm_slideshow_image_'+nextpos+'" data-id="'+image_id+'">';
                              showimage +='<div class="single_crm_slideshow_image_wrapper">';
                                   showimage +='<img src="'+image_url+'"/>';
                              showimage +='</div>';    
                              showimage +='<div class="crm_button_container">';
                                   showimage +='<span class="crm_slideshow_image_remove_image crm_bttn">Remove Image</span>';
                                   showimage +='<span class="crm_slideshow_image_edit_image crm_bttn">Edit Image</span>';
                              showimage +='</div>';                                       
                         showimage += '</div>';            
                         // Let's assign the url value to the input field
                         imgframe.append(showimage);   
                         dynamic_slideshow_array_change(containerid);     
                    }); 
               });    
               image.open();         
          } 

          function dynamic_field_change_slide_refresh(container){
               if ($('#'+container).find('.crm_slideshow_image_container').length>0) {
                    $('#'+container).closest('.crm_dynamic_field_box').find('.crm_slideshow_image_container').each(function(){
                         if ($(this).data( 'ui-sortable' )) {
                              $(this).sortable('refresh');
                         }else{
                              $(this).sortable({
                                   stop: function( event, ui ) {
                                        var container = $(this).attr('id');
                                        dynamic_slideshow_array_change(container);
                                   }
                              });   
                         }                  
                    })
               }
          }
          if ($('.crm_dynamic_field_box .crm_slideshow_field').length>0) {       
               $('.crm_dynamic_field_box .crm_slideshow_field').off();
          }
          $('.crm_dynamic_field_box').on('click', ".crm_slideshow_image_remove_image", function() {
               var container = $(this).closest('.crm_slideshow_field').find('.crm_slideshow_image_container').attr('id');
               $(this).closest('.single_crm_slideshow_image').remove();                 
               dynamic_slideshow_array_change(container);                 
          });   

          $('.crm_dynamic_field_box').on('click', ".crm_slideshow_image_edit_image", function() {
               var selectedimage = $(this).closest('.single_crm_slideshow_image');   
               dynamic_slideshow_edit_image(selectedimage);                 
          });   

          $('.crm_dynamic_field_box').on('click', '.crm_slideshow_image_add_image', function(e){
                  e.preventDefault();
                  var container = $(this).closest('.crm_slideshow_field').find('.crm_slideshow_image_container').attr('id');
                  dynamic_slideshow_add_image(container);
          });           
          //End Functions For Dynamic Slideshow Fields
          function dynamic_field_change(container){
               var int = 1;
               $('#'+container).find('.crm_fieldbox_subsection').each( function(){
                    $(this).find('label').each( function(){
                         currlabel = $(this).html();
                         currlabelfor = $(this).attr('for');
                         nextlabel = parseInt();
                         //$(this).html(currlabel.replace(/[0-9]/g,'')+int );
                         //$(this).attr(currlabelfor.replace(/[0-9]/g,'')+int );                         
                         $(this).html(currlabel.replace(/[0-9]/g,'') );
                         $(this).attr(currlabelfor.replace(/[0-9]/g,'') );
                    });
                    $(this).find('input[name]').each( function(){
                         currname = $(this).attr('name');
                         currid = $(this).attr('id');
                         if(typeof currname !== "undefined"){
                              $(this).attr('name', currname.replace(/[0-9]/g,'')+int );
                         }
                         if(typeof currid !== "undefined"){
                              $(this).attr('id', currid.replace(/[0-9]/g,'')+int );
                              if(typeof tinyMCE != 'undefined'){
                                   if (tinyMCE.editors[currid]) {
                                        tinyMCE.execCommand("mceRemoveEditor", true, currid);
                                        tinyMCE.execCommand('mceAddControl', false, currid); 
                                   }                              
                              }                            
                         }
                    }); 
                    $(this).find('textarea[name]').each( function(){
                         currname = $(this).attr('name');
                         currid = $(this).attr('id');
                         if(typeof currname !== "undefined"){
                              $(this).attr('name', currname.replace(/[0-9]/g,'')+int );
                         }
                         if(typeof currid !== "undefined"){
                              $(this).attr('id', currid.replace(/[0-9]/g,'')+int );
                              if(typeof tinyMCE != 'undefined'){
                                   if (tinyMCE.editors[currid]) {
                                        tinyMCE.execCommand("mceRemoveEditor", true, currid);
                                        tinyMCE.execCommand('mceAddControl', false, currid); 
                                   }                              
                              }                            
                         }
                    });         
                    $(this).find('.crm_bttn').each( function(){     
                         currbttn = $(this).html();
                         $(this).html(currbttn.replace(/[0-9]/g,' ') );
                    });                         
                    int++;                                           
               });
               $('#'+container).closest('.crm_dynamic_field_box').find('.crm_dynamic_field_box_count').attr('value', int-1);
               dynamic_field_change_slide_refresh(container);
          }
          $( ".crm_dynamic_field_box_container" ).sortable({
             stop: function( event, ui ) {
               var container = $(this).attr('id');
               dynamic_field_change(container);
             }
          });          
          //Start Functions For Dynamic Color Picker  
          $('.crm_dynamic_field_box').on('click', '.crm_colorpicker_toggle', function(e) {
               e.preventDefault();
               var pickerfield = $(this).closest('.crm_fieldbox').find('.crm_colorpicker');
               if ($(this).closest('.crm_fieldbox').find('.iris_picker').length>0) {
                    pickerfield.iris('toggle');
               }else{
                    pickerfield.iris({
                         hide: false,
                         change: function(event, ui) {
                         var colorshow = $(this).closest('.crm_fieldbox').find('.crm_colorpicker_show');
                         colorshow.css( 'color', ui.color.toString());
                         colorshow.html(ui.color.toString());
                         }
                    });                    
               }    
          });
          //End Functions For Dynamic Color Picker

          //Start Functions For Dynamic Upload Fields  
          $('.crm_dynamic_field_box .crm_upload_field').off();
          $('.crm_dynamic_field_box').on('click', ".upload_bttn", function(e) {
               var frame = $(this).closest('.crm_upload_field').find('iframe');
               var input = $(this).closest('.crm_upload_field').find('input');
               e.preventDefault();
               var image = wp.media({ 
               title: 'Upload Image',
               type : 'image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field
                    frame.attr('src',image_url );
                    input.attr('value',image_id);      
               }); 
          });          
          //End Functions For Dynamic Upload Fields 

          //Start Functions For Dynamic Upload PDF Fields  
          $('.crm_dynamic_field_box .crm_upload_pdf_field').off();
          $('.crm_dynamic_field_box .remove_upload_pdf_bttn').off();
          $('.crm_dynamic_field_box').on('click', ".upload_pdf_bttn", function(e) {
               var frame = $(this).closest('.crm_upload_pdf_field').find('iframe');
               var input = $(this).closest('.crm_upload_pdf_field').find('input');
               var message = $(this).closest('.crm_upload_pdf_field').find('.crm_upload_pdf_message');
               e.preventDefault();
               var image = wp.media({ 
               title: 'Upload PDF',
               type : 'image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field
                    if (image_url.substr(image_url.length - 4) == '.pdf') {
                         message.html('');
                    }else{
                         message.html('This Field Only Accepts PDF Uploads');
                         return false;
                    }                       
                    frame.attr('src',image_url );
                    input.attr('value',image_id);      
               }); 
          }); 
          $('.crm_dynamic_field_box').on('click', ".remove_upload_pdf_bttn", function(e) {
               e.preventDefault();
               var frame = $(this).closest('.crm_upload_pdf_field').find('iframe');
               var input = $(this).closest('.crm_upload_pdf_field').find('input');
               var message = $(this).closest('.crm_upload_pdf_field').find('.crm_upload_pdf_message');
               frame.attr('src', "" );
               input.attr('value', "");       
               message.html('');               
          });          
          //End Functions For Dynamic Upload PDF Fields 

          //Start Functions For Dynamic Upload Video Fields  
          $('.crm_dynamic_field_box .crm_upload_video_field').off();
          $('.crm_dynamic_field_box').on('click', ".upload_video_src_bttn", function(e) {
               var input = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               message.html('');
               e.preventDefault();
               var video = wp.media({ 
               title: 'Upload Video',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_video = video.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var video_url = uploaded_video.toJSON().url;
                    var video_id = uploaded_video.toJSON().id;        
                    // Let's assign the url value to the input field
                    var accepted_vid_formats = ['.mp4', ".m4v", ".ogv", ".wmv", ".flv"];
                    var video_format = video_url.substr(video_url.length - 4);
                    if (accepted_vid_formats.indexOf(video_format) != -1) {
                         message.html('');
                    }else{
                         message.html('This Field Only Accepts One Of The Following Video Formats.<br> .mp4, .m4v, .ogv, .wmv, .flv');
                         return false;
                    }                    
                    input.val(video_url);
               });
          });

          $('.crm_dynamic_field_box').on('click', ".save_video_src_bttn", function(e) {           
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var input = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var frame = $(this).closest('.crm_upload_video_field').find('iframe');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];
               var siteurl = document.location.origin;
               message.html('');   
               e.preventDefault();    
               if ( input.val() == "") {
                    message.html('Please insert a url into the field. Once complete the url will be saved and the expected Front End result will appear to the left. ');
                    return false;
               }                                       
               var videosrc = input.val(); 
               if (videosrc.includes('https') == false && videosrc.includes('http') == false) {
                    message.html('Please ensure your URL begins with "https://" or "http://"');
                    return false;                    
               }                   
               if (videosrc.includes('youtu.be') == true ) {
                    message.html('Youtube Videos Must be in the https://youtube.com/embed/"Video ID" Format.');
                    return false;                    
               }                
               if (videosrc.includes('youtube.com') == true ) {
                    if (videosrc.includes('/embed/') == false){
                         message.html('Youtube Videos Must be in the https://youtube.com/embed/"Video ID" Format.');
                         return false;                           
                    }else{
                         if (videosrc.includes('?autoplay=1') == false){
                              videosrc.replace('?autoplay=1', '');                        
                         }                                                  
                    }
               }       
               if (videosrc.includes(siteurl) == true){
                    frame.attr('sandbox', '');   
               }else{
                    frame.attr('sandbox', 'allow-scripts allow-same-origin');
               }
               video_array.push({"thumbID":thumbid, "videosrc": videosrc});
               frame.attr('src', videosrc ); 
               input.val("");
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);         
               message.html('Your video has been saved. Simply update the page for the changes to take effect.<br> Please ensure the embedded video to the left is correct before updating the page.');                           
          });    

          $('.crm_dynamic_field_box').on('click', ".remove_video_src_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var frame = $(this).closest('.crm_upload_video_field').find('iframe');
               var input = $(this).closest('.crm_upload_video_field').find('input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];      
               frame.attr('src', "" );
               video_array.push({"thumbID":thumbid, "videosrc": ""});                        
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);                 
               input.html('');               
               message.html('The Video Source URL Has Been Removed.');              
          }); 

          $('.crm_dynamic_field_box').on('click', ".upload_video_thumb_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var videosrc = $(this).closest('.crm_upload_video_field').find('iframe').attr('src');
               var img = $(this).closest('.crm_upload_video_field').find('img');                    
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var video_array = [];    
               e.preventDefault();
               message.html('');
               var image = wp.media({ 
               title: 'Upload Image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field                 
                    img.attr('src', image_url);
                    img.attr('data-id', image_id);    
                    video_array.push({"thumbID":image_id, "videosrc": videosrc});   
                    var finalarray = JSON.stringify(video_array);
                    textarea.val(finalarray);                            
                    message.html('This Video Thumbnail Image Has Been Uploaded.<br>Please ensure the embedded video to the left is correct before updating the page.');                     
               });         
          });  

          $('.crm_dynamic_field_box').on('click', ".remove_video_thumb_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');               
               var videosrc = $(this).closest('.crm_upload_video_field').find('iframe').attr('src');
               var img = $(this).closest('.crm_upload_video_field').find('img');                    
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];    
               img.attr('src', "");
               img.attr('data-id', "");
               video_array.push({"thumbID":"", "videosrc": videosrc});       
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);                
               message.html('This Video Thumbnail Image Has Been Removed.');              
          });              
          //End Functions For Dynamic Upload Video Fields  
             
          $('.crm_dynamic_field_box').on('click', ".crm_dynamic_field_box_add", function(e) { 
               e.preventDefault();
               var dynamicfields = JSON.parse($(this).closest('.crm_dynamic_field_box').attr('data_dynamic_fields'));
               $(this).closest('.crm_dynamic_field_box').addClass('crm_fieldbox_loading');
               var fieldboxname = $(this).closest('.crm_dynamic_field_box').attr('data_original_name');
               var container = $(this).closest('.crm_dynamic_field_box').find('.crm_dynamic_field_box_container');
               var storage = $(this).closest('.crm_dynamic_field_box').find('.crm_dynamic_field_box_storage');
               var storagecheck = '';
               var expectedidarray = [];
               var sectioncount = container.find('.crm_fieldbox_subsection').length + 1;
               for (var i = 0; i < dynamicfields.length; i++) {
                   expectedidarray.push('#custom_ready_meta_'+fieldboxname+'_'+dynamicfields[i]['name']+'_'+sectioncount); 
               }
               for (var i = 0; i < dynamicfields.length; i++) {
                    jQuery.post('/wp-admin/admin-ajax.php',{
                          action:'custom_ready_meta_createinput_dynamic',
                          dynamic_type:dynamicfields[i]['type'],
                          dynamic_name:fieldboxname+'_'+dynamicfields[i]['name']+'_'+sectioncount,
                          dynamic_label:dynamicfields[i]['label']+' '+sectioncount,
                          dynamic_instructions:dynamicfields[i]['instructions'],
                          dynamic_selections:dynamicfields[i]['selections'],
                          dynamic_attributes:dynamicfields[i]['attributes'],
                          async:false
                    },
                    function(response){
                         storage.append(response);
                         setTimeout(function(){
                              storagecheck = expectedidarray.every(
                                   function(id_attr){
                                        if (storage.find(id_attr).length>0) {
                                             return true;
                                        }else{
                                             return false;
                                        }
                                   }
                              );
                              if (storagecheck == true) {
                                   container.append('<div class="crm_fieldbox_subsection">'+storage.html()+'<div class="clear" style="order:1000;"><br><button class="crm_dynamic_field_box_remove crm_bttn">Remove Fields</button></div></div>');
                                   storage.html('');
                                   container.closest('.crm_dynamic_field_box').find('.crm_dynamic_field_box_count').val(sectioncount);
                                   dynamic_field_change(container.attr('id'));
                                   container.closest('.crm_dynamic_field_box').removeClass('crm_fieldbox_loading');
                              }
                         }, 1000);
                    });
               }
          }); 

          $('.crm_dynamic_field_box').on('click', ".crm_dynamic_field_box_remove", function(e) {         
               var container = $(this).closest(".crm_dynamic_field_box_container").attr('id');
               $(this).closest('.crm_fieldbox_subsection').remove();               
               dynamic_field_change(container);
          });
          // Start Function For Dynamic Add On Options Pages
          $('.crm_dynamic_field_box').on('click', ".crm_dynamic_field_box_options_add", function(e) { 
               e.preventDefault();
               var dynamicfields = JSON.parse($(this).closest('.crm_dynamic_field_box').attr('data_dynamic_fields'));
               $(this).closest('.crm_dynamic_field_box').addClass('crm_fieldbox_loading');
               var fieldboxname = $(this).closest('.crm_dynamic_field_box').attr('data_original_name');
               var container = $(this).closest('.crm_dynamic_field_box').find('.crm_dynamic_field_box_container');
               var storage = $(this).closest('.crm_dynamic_field_box').find('.crm_dynamic_field_box_storage');
               var storagecheck = '';
               var expectedidarray = [];
               var sectioncount = container.find('.crm_fieldbox_subsection').length + 1;
               for (var i = 0; i < dynamicfields.length; i++) {
                   expectedidarray.push('#custom_ready_meta_'+fieldboxname+'_'+dynamicfields[i]['name']+'_'+sectioncount); 
               }               
               for (var i = 0; i < dynamicfields.length; i++) {
                    jQuery.post('/wp-admin/admin-ajax.php',{
                          action:'custom_ready_meta_options_createinput_dynamic',
                          dynamic_type:dynamicfields[i]['type'],
                          dynamic_name:fieldboxname+'_'+dynamicfields[i]['name']+'_'+sectioncount,
                          dynamic_label:dynamicfields[i]['label']+' '+sectioncount,
                          dynamic_instructions:dynamicfields[i]['instructions'],
                          dynamic_selections:dynamicfields[i]['selections'],
                          dynamic_attributes:dynamicfields[i]['attributes'],
                          async:false
                    },
                    function(response){
                         storage.append(response);
                         setTimeout(function(){
                              storagecheck = expectedidarray.every(
                                   function(id_attr){
                                        if (storage.find(id_attr).length>0) {
                                             return true;
                                        }else{
                                             return false;
                                        }
                                   }
                              );
                              if (storagecheck == true) {
                                   container.append('<div class="crm_fieldbox_subsection">'+storage.html()+'<div class="clear" style="order:1000;"><br><button class="crm_dynamic_field_box_remove crm_bttn">Remove Fields</button></div></div>');
                                   storage.html('');
                                   container.closest('.crm_dynamic_field_box').find('.crm_dynamic_field_box_count').val(sectioncount);
                                   dynamic_field_change(container.attr('id'));
                                   container.closest('.crm_dynamic_field_box').removeClass('crm_fieldbox_loading');
                              }
                         }, 1000);
                    });

               }
          });            
          // End Function For Dynamic Add On Options Pages
     }
          //End Functions For Dynamic Fields

     //Start Function For Nested Dynamic Fields
     if ($('.crm_dynamic_nested_field_box').length>0 || $('.crm_dynamic_field_box').length>0) {
          //Start Functions For Dynamic Color Picker  
          $('.crm_dynamic_nested_field_box').on('click', '.crm_colorpicker_toggle', function(e) {
               e.preventDefault();
               var pickerfield = $(this).closest('.crm_fieldbox').find('.crm_colorpicker');
               if ($(this).closest('.crm_fieldbox').find('.iris_picker').length>0) {
                    pickerfield.iris('toggle');
               }else{
                    pickerfield.iris({
                         hide: false,
                         change: function(event, ui) {
                         var colorshow = $(this).closest('.crm_fieldbox').find('.crm_colorpicker_show');
                         colorshow.css( 'color', ui.color.toString());
                         colorshow.html(ui.color.toString());
                         }
                    });                    
               }    
          });
          //End Functions For Dynamic Color Picker

          //Start Functions For Dynamic Upload Fields  
          $('.crm_dynamic_nested_field_box .crm_upload_field').off();
          $('.crm_dynamic_nested_field_box').on('click', ".upload_bttn", function(e) {
               var frame = $(this).closest('.crm_upload_field').find('iframe');
               var input = $(this).closest('.crm_upload_field').find('input');
               e.preventDefault();
               var image = wp.media({ 
               title: 'Upload Image',
               type : 'image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field
                    frame.attr('src',image_url );
                    input.attr('value',image_id);      
               }); 
          }); 
          $('.crm_upload_field').on('click', ".remove_upload_bttn", function(e) {
               e.preventDefault();
               var frame = $(this).closest('.crm_upload_field').find('iframe');
               var input = $(this).closest('.crm_upload_field').find('input');
               frame.attr('src', "" );
               input.attr('value', "");                 
          });          
          //End Functions For Dynamic Upload Fields 

          //Start Functions For Dynamic Upload PDF Fields  
          $('.crm_dynamic_nested_field_box .crm_upload_pdf_field').off();
          $('.crm_dynamic_nested_field_box .remove_upload_pdf_bttn').off();
          $('.crm_dynamic_nested_field_box').on('click', ".upload_pdf_bttn", function(e) {
               var frame = $(this).closest('.crm_upload_pdf_field').find('iframe');
               var input = $(this).closest('.crm_upload_pdf_field').find('input');
               var message = $(this).closest('.crm_upload_pdf_field').find('.crm_upload_pdf_message');
               e.preventDefault();
               var image = wp.media({ 
               title: 'Upload PDF',
               type : 'image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field
                    if (image_url.substr(image_url.length - 4) == '.pdf') {
                         message.html('');
                    }else{
                         message.html('This Field Only Accepts PDF Uploads');
                         return false;
                    }                       
                    frame.attr('src',image_url );
                    input.attr('value',image_id);      
               }); 
          }); 
          $('.crm_dynamic_nested_field_box').on('click', ".remove_upload_pdf_bttn", function(e) {
               e.preventDefault();
               var frame = $(this).closest('.crm_upload_pdf_field').find('iframe');
               var input = $(this).closest('.crm_upload_pdf_field').find('input');
               var message = $(this).closest('.crm_upload_pdf_field').find('.crm_upload_pdf_message');
               frame.attr('src', "" );
               input.attr('value', "");       
               message.html('');               
          });          
          //End Functions For Dynamic Upload PDF Fields 

          //Start Functions For Dynamic Upload Video Fields  
          $('.crm_dynamic_nested_field_box .crm_upload_video_field').off();
          $('.crm_dynamic_nested_field_box').on('click', ".upload_video_src_bttn", function(e) {
               var input = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               message.html('');
               e.preventDefault();
               var video = wp.media({ 
               title: 'Upload Video',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_video = video.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var video_url = uploaded_video.toJSON().url;
                    var video_id = uploaded_video.toJSON().id;        
                    // Let's assign the url value to the input field
                    var accepted_vid_formats = ['.mp4', ".m4v", ".ogv", ".wmv", ".flv"];
                    var video_format = video_url.substr(video_url.length - 4);
                    if (accepted_vid_formats.indexOf(video_format) != -1) {
                         message.html('');
                    }else{
                         message.html('This Field Only Accepts One Of The Following Video Formats.<br> .mp4, .m4v, .ogv, .wmv, .flv');
                         return false;
                    }                    
                    input.val(video_url);
               });
          });

          $('.crm_dynamic_nested_field_box').on('click', ".save_video_src_bttn", function(e) {           
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var input = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var frame = $(this).closest('.crm_upload_video_field').find('iframe');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];
               var siteurl = document.location.origin;
               message.html('');   
               e.preventDefault();    
               if ( input.val() == "") {
                    message.html('Please insert a url into the field. Once complete the url will be saved and the expected Front End result will appear to the left. ');
                    return false;
               }                                       
               var videosrc = input.val(); 
               if (videosrc.includes('https') == false && videosrc.includes('http') == false) {
                    message.html('Please ensure your URL begins with "https://" or "http://"');
                    return false;                    
               }                   
               if (videosrc.includes('youtu.be') == true ) {
                    message.html('Youtube Videos Must be in the https://youtube.com/embed/"Video ID" Format.');
                    return false;                    
               }                
               if (videosrc.includes('youtube.com') == true ) {
                    if (videosrc.includes('/embed/') == false){
                         message.html('Youtube Videos Must be in the https://youtube.com/embed/"Video ID" Format.');
                         return false;                           
                    }else{
                         if (videosrc.includes('?autoplay=1') == false){
                              videosrc.replace('?autoplay=1', '');                        
                         }                                                  
                    }
               }       
               if (videosrc.includes(siteurl) == true){
                    frame.attr('sandbox', '');   
               }else{
                    frame.attr('sandbox', 'allow-scripts allow-same-origin');
               }
               video_array.push({"thumbID":thumbid, "videosrc": videosrc});
               frame.attr('src', videosrc ); 
               input.val("");
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);         
               message.html('Your video has been saved. Simply update the page for the changes to take effect.<br> Please ensure the embedded video to the left is correct before updating the page.');                           
          });    

          $('.crm_dynamic_nested_field_box').on('click', ".remove_video_src_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var frame = $(this).closest('.crm_upload_video_field').find('iframe');
               var input = $(this).closest('.crm_upload_video_field').find('input');
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];      
               frame.attr('src', "" );
               video_array.push({"thumbID":thumbid, "videosrc": ""});                        
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);                 
               input.html('');               
               message.html('The Video Source URL Has Been Removed.');              
          }); 

          $('.crm_dynamic_nested_field_box').on('click', ".upload_video_thumb_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');
               var videosrc = $(this).closest('.crm_upload_video_field').find('iframe').attr('src');
               var img = $(this).closest('.crm_upload_video_field').find('img');                    
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var video_array = [];    
               e.preventDefault();
               message.html('');
               var image = wp.media({ 
               title: 'Upload Image',
               // mutiple: true if you want to upload multiple files at once
               multiple: false
               }).open().on('select', function(e){
                    // This will return the selected image from the Media Uploader, the result is an object
                    var uploaded_image = image.state().get('selection').first();
                    // We convert uploaded_image to a JSON object to make accessing it easier
                    // Output to the console uploaded_image
                    var image_url = uploaded_image.toJSON().url;
                    var image_id = uploaded_image.toJSON().id;        
                    // Let's assign the url value to the input field                 
                    img.attr('src', image_url);
                    img.attr('data-id', image_id);    
                    video_array.push({"thumbID":image_id, "videosrc": videosrc});   
                    var finalarray = JSON.stringify(video_array);
                    textarea.val(finalarray);                            
                    message.html('This Video Thumbnail Image Has Been Uploaded.<br>Please ensure the embedded video to the left is correct before updating the page.');                     
               });         
          });  

          $('.crm_dynamic_nested_field_box').on('click', ".remove_video_thumb_bttn", function(e) {
               e.preventDefault();
               var textarea = $(this).closest('.crm_upload_video_field').find('textarea');               
               var videosrc = $(this).closest('.crm_upload_video_field').find('iframe').attr('src');
               var img = $(this).closest('.crm_upload_video_field').find('img');                    
               var message = $(this).closest('.crm_upload_video_field').find('.crm_upload_video_field_message');
               var thumbid = $(this).closest('.crm_upload_video_field').find('img').attr('data-id');
               var video_array = [];    
               img.attr('src', "");
               img.attr('data-id', "");
               video_array.push({"thumbID":"", "videosrc": videosrc});       
               var finalarray = JSON.stringify(video_array);
               textarea.val(finalarray);                
               message.html('This Video Thumbnail Image Has Been Removed.');              
          });              
          //End Functions For Dynamic Upload Video Fields  

          $('.crm_dynamic_field_box').on('click', ".crm_dynamic_nested_field_box_options_add", function(e) {                
               e.preventDefault();
               e.stopPropagation()
               e.stopImmediatePropagation();
               var clickedbutton = e.target;
               var nesteddynamicfields = JSON.parse($(clickedbutton).closest('.crm_dynamic_nested_field_box').attr('data_dynamic_fields'));
               $(clickedbutton).closest('.crm_dynamic_nested_field_box').addClass('crm_fieldbox_loading');
               var fieldboxname = $(clickedbutton).closest('.crm_dynamic_nested_field_box').attr('data_original_name');
               var fieldboxid = $(clickedbutton).siblings('.crm_dynamic_nested_field_box_count').attr('id'); 
               var labelbase = $(clickedbutton).siblings('label').eq(0).html();
               var container = $(clickedbutton).siblings('.crm_dynamic_nested_field_box_container');
               var storage = $(clickedbutton).siblings('.crm_dynamic_nested_field_box_storage');
               var storagecheck = '';
               var expectedidarray = [];
               var curr_sections = container.children('.crm_dynamic_nested_fieldbox_subsection').length;
               var next_section_number = curr_sections+1;
               for (var i = 0; i < nesteddynamicfields.length; i++) {
                   expectedidarray.push(fieldboxid+nesteddynamicfields[i]['name']+'_'+curr_sections); 
               }
               for (var i = 0; i < nesteddynamicfields.length; i++) {
                    jQuery.post('/wp-admin/admin-ajax.php',{
                          action:'custom_ready_meta_options_createinput_dynamic',
                          dynamic_type:nesteddynamicfields[i]['type'],
                          dynamic_name:fieldboxname+nesteddynamicfields[i]['name']+'_'+curr_sections,
                          //dynamic_label:labelbase+' '+nesteddynamicfields[i]['label']+' '+next_section_number,
                          //dynamic_label:nesteddynamicfields[i]['label']+' '+next_section_number,
                          dynamic_label:nesteddynamicfields[i]['label'],
                          dynamic_instructions:nesteddynamicfields[i]['instructions'],
                          dynamic_selections:nesteddynamicfields[i]['selections'],
                          dynamic_attributes:nesteddynamicfields[i]['attributes'],
                          async:false
                    },
                    function(response){
                         storage.append(response);
                         setTimeout(function(){
                              storagecheck = expectedidarray.every(                                   
                                   function(id_attr){
                                        if (storage.find('#'+id_attr).length>0) {
                                             return true;
                                        }else{
                                             return false;
                                        }
                                   }
                              );
                              if (storagecheck == true) {
                                   container.append('<div class="crm_dynamic_nested_fieldbox_subsection">'+storage.html()+'<div class="clear" style="order:1000;"><br><button class="crm_dynamic_nested_field_box_remove crm_bttn">Remove Fields</button></div></div>');
                                   storage.html('');
                                   container.closest('.crm_dynamic_nested_field_box').find('.crm_dynamic_nested_field_box_count').val(next_section_number);
                                   container.closest('.crm_dynamic_nested_field_box').removeClass('crm_fieldbox_loading');
                              }
                         }, 2000);
                    });
               }
          }); 

          $('.crm_fieldset').on('click', ".crm_dynamic_nested_field_box_remove", function(e) {
               e.preventDefault();
               var clickedbutton = e.target;
               var nested_container = $(clickedbutton).closest('.crm_dynamic_nested_field_box_container');
               var nested_count = 1;               
               $(clickedbutton).closest('.crm_dynamic_nested_fieldbox_subsection').remove();                              
               ////console.log(nested_container);
               nested_container.find('.crm_dynamic_nested_fieldbox_subsection').each(function(){
                    $(this).find('label').each( function(){
                         currlabel = $(this).html();
                         currlabelfor = $(this).attr('for');
                         nextlabel = parseInt();
                         //$(this).html(currlabel.replace(/[0-9]/g,'')+int );
                         //$(this).attr(currlabelfor.replace(/[0-9]/g,'')+int );                         
                         //$(this).html(currlabel.replace(/[0-9]/g,'') );
                         $(this).attr(currlabelfor.replace(/.$/, nested_count) );
                    });
                    $(this).find('input[name]').each( function(){
                         currname = $(this).attr('name');
                         currid = $(this).attr('id');
                         if(typeof currname !== "undefined"){
                              $(this).attr('name', currname.replace(/.$/, nested_count) );
                         }
                         if(typeof currid !== "undefined"){
                              $(this).attr('id', currid.replace(/.$/, nested_count) );
                              if(typeof tinyMCE != 'undefined'){
                                   if (tinyMCE.editors[currid]) {
                                        tinyMCE.execCommand("mceRemoveEditor", true, currid);
                                        tinyMCE.execCommand('mceAddControl', false, currid); 
                                   }                              
                              }                            
                         }
                    }); 
                    $(this).find('textarea').each( function(){
                         currname = $(this).attr('name');
                         currid = $(this).attr('id');
                         if(typeof currname !== "undefined"){
                              $(this).attr('name', currname.replace(/.$/, nested_count) );
                         }
                         if(typeof currid !== "undefined"){
                              $(this).attr('id', currid.replace(/.$/, nested_count) );
                              if(typeof tinyMCE != 'undefined'){
                                   if (tinyMCE.editors[currid]) {
                                        tinyMCE.execCommand("mceRemoveEditor", true, currid);
                                        tinyMCE.execCommand('mceAddControl', false, currid); 
                                   }                              
                              }                            
                         }
                    });         
                    $(this).find('.crm_bttn').each( function(){     
                         currbttn = $(this).html();
                         $(this).html(currbttn.replace(/.$/, nested_count) );
                    });   
                    nested_count++;  
               });
          });

          $('.crm_fieldset').on('click', ".crm_dynamic_nested_field_box_add", function(e) {                
               e.preventDefault();
               e.stopPropagation()
               e.stopImmediatePropagation();
               var clickedbutton = e.target;
               var nesteddynamicfields = JSON.parse($(clickedbutton).closest('.crm_dynamic_nested_field_box').attr('data_dynamic_fields'));
               $(clickedbutton).closest('.crm_dynamic_nested_field_box').addClass('crm_fieldbox_loading');
               var fieldboxname = $(clickedbutton).closest('.crm_dynamic_nested_field_box').attr('data_original_name');
               var fieldboxid = $(clickedbutton).siblings('.crm_dynamic_nested_field_box_count').attr('id'); 
               var labelbase = $(clickedbutton).siblings('label').eq(0).html();
               var container = $(clickedbutton).siblings('.crm_dynamic_nested_field_box_container');
               var storage = $(clickedbutton).siblings('.crm_dynamic_nested_field_box_storage');
               var storagecheck = '';
               var expectedidarray = [];
               var curr_sections = container.children('.crm_dynamic_nested_fieldbox_subsection').length;
               var next_section_number = curr_sections+1;
               for (var i = 0; i < nesteddynamicfields.length; i++) {
                   expectedidarray.push(fieldboxid+'_'+nesteddynamicfields[i]['name']+'_'+next_section_number); 
               }
               for (var i = 0; i < nesteddynamicfields.length; i++) {
                    jQuery.post('/wp-admin/admin-ajax.php',{
                          action:'custom_ready_meta_createinput_dynamic',
                          dynamic_type:nesteddynamicfields[i]['type'],
                          dynamic_name:fieldboxname+'_'+nesteddynamicfields[i]['name']+'_'+next_section_number,
                          //dynamic_label:labelbase+' '+nesteddynamicfields[i]['label']+' '+next_section_number,
                          //dynamic_label:nesteddynamicfields[i]['label']+' '+next_section_number,
                          dynamic_label:nesteddynamicfields[i]['label'],
                          dynamic_instructions:nesteddynamicfields[i]['instructions'],
                          dynamic_selections:nesteddynamicfields[i]['selections'],
                          dynamic_attributes:nesteddynamicfields[i]['attributes'],
                          async:false
                    },
                    function(response){
                         storage.append(response);
                         setTimeout(function(){
                              storagecheck = expectedidarray.every(                                   
                                   function(id_attr){
                                        if (storage.find('#'+id_attr).length>0) {
                                             return true;
                                        }else{
                                             return false;
                                        }
                                   }
                              );
                              if (storagecheck == true) {
                                   container.append('<div class="crm_dynamic_nested_fieldbox_subsection">'+storage.html()+'<div class="clear" style="order:1000;"><br><button class="crm_dynamic_nested_field_box_remove crm_bttn" id="'+fieldboxname+'_nested_field_box_remove_'+next_section_number+'">Remove Fields</button></div></div>');
                                   storage.html('');
                                   container.closest('.crm_dynamic_nested_field_box').find('.crm_dynamic_nested_field_box_count').val(next_section_number);
                                   container.closest('.crm_dynamic_nested_field_box').removeClass('crm_fieldbox_loading');
                              }
                         }, 2000);
                    });
               }
          });                     
     }

     //End Function For Nested Dynamic Fields

     //Start Function For Saving custom ready meta options
     if ($('.crm_dynamic_options_field_save').length>0) {
          function options_field_save(textarea){
               var inputarray = [];
               $('select:contains("custom_ready_meta_")').each(function(){
                    inputid = $(this).attr('id');
                    inputvalue = $(this).attr('value');
                    inputarray.push([inputid, inputvalue]);
               });
               $('input:contains("custom_ready_meta_")').each(function(){
                    inputid = $(this).attr('id');
                    inputvalue = $(this).attr('value');
                    inputarray.push([inputid, inputvalue]);
               });      
               $('textarea:contains("custom_ready_meta_")').each(function(){
                    inputid = $(this).attr('id');
                    inputvalue = $(this).attr('value');
                    inputarray.push([inputid, inputvalue]);
               });     
               $finalarray = JSON.stringify(inputarray);
               textarea.val($finalarray);                   
          }
          $('body').on('change', 'select:contains("custom_ready_meta_")', function(){
               var savearea = $('.crm_dynamic_options_field_save').eq(0);
               options_field_save(savearea);
          });
          $('body').on('change', 'textarea:contains("custom_ready_meta_")', function(){
               var savearea = $('.crm_dynamic_options_field_save').eq(0);
               options_field_save(savearea);
          });     
          $('body').on('change', 'input:contains("custom_ready_meta_")', function(){
               var savearea = $('.crm_dynamic_options_field_save').eq(0);
               options_field_save(savearea);
          });               
     }     
     //End Function For Saving custom ready meta options

     
     //Start crm_fieldbox display toggle script
     $('.crm_fieldset').on('click', '.crm_display_toggle', function(e){
          e.preventDefault();
          var clicked_button = e.target;       
          $(clicked_button).closest('.crm_fieldbox').toggleClass('crm_fieldbox_hidden');
     });
     $('.crm_fieldset').on('click', '.crm_nested_fieldbox_display_toggle', function(e){
          e.preventDefault();
          var clicked_button = e.target;
          $(clicked_button).closest('.crm_dynamic_nested_fieldbox_subsection').toggleClass('crm_fieldbox_subsection_hidden');
     });  
     $('.crm_fieldset').on('click', '.crm_subsection_display_toggle', function(e){
          e.preventDefault();
          var clicked_button = e.target;
          $(clicked_button).closest('.crm_fieldbox_subsection').toggleClass('crm_fieldbox_subsection_hidden');
     });          
     //End crm_fieldbox display toggle script
     
     //Start Functions For Create Meta - Imagemap
     if ($('.crm_imagemap_creator').length>0) {
          if ($('.crm_imagemap_creator .crm_image_map_add_img ').length>0) {
               $('.crm_imagemap_creator .crm_image_map_add_img').click(function(e){
                    e.preventDefault();
                    var specific_map_size = $(this).closest('.crm_imagemap_creator').attr('data-image_size');
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_show').find('img').length <= 0) {
                         var image_wrapper = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show');
                         var image_wrapper_width = $(this).closest('.crm_imagemap_creator').width();
                         var textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var image_map_array_string = textarea.val(); 
                         if (image_map_array_string != '') {
                              var image_map_array = JSON.parse(image_map_array_string);
                         }else{
                              var image_map_array = {};
                         }
                         var image = wp.media({ 
                              title: 'Add Image',
                              // mutiple: true if you want t1o upload multiple files at once
                              multiple: false
                         }).open(
                              /*function(){
                                   var selection = image.state().get('selection');
                                   ids = jQuery('#my_field_id').val().split(',');
                                   ids.forEach(function(id) {
                                   attachment = wp.media.attachment(id);
                                   attachment.fetch();
                                   selection.add( attachment ? [ attachment ] : [] );
                              }*/
                         ).on('select', function(e){
                              // This will return the selected image from the Media Uploader, the result is an object
                              var uploaded_image = image.state().get('selection').first();
                              // We convert uploaded_image to a JSON object to make accessing it easier
                              // Output to the console uploaded_image
                              if (specific_map_size != '' && $.inArray(specific_map_size, uploaded_image.toJSON().sizes) != -1) {
                                   console.log(uploaded_image.toJSON().sizes[specific_map_size].url);
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;  
                              }else{
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;                                    
                              }                            
                              // Let's assign the url value to the input field                 
                              image_map_array.image_url = image_url;
                              image_map_array.image_id = image_id;
                              image_map_array.image_width = image_width;
                              image_map_array.image_height = image_height;
                              image_map_array.image_max_width = image_max_width;
                              image_map_array.image_max_height = image_max_height;
                              var finalarray = JSON.stringify(image_map_array);
                              textarea.val(finalarray);                            
                              image_wrapper.html('<img src="'+image_url+'" data_id="'+image_id+'" data_width="'+image_width+'" data_height="'+image_height+'" data_max_width="'+image_max_width+'" data_max_height="'+image_max_height+'">');
                         });                          
                    }else{
                         var image_wrapper = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show');
                         var image_wrapper_width = $(this).closest('.crm_imagemap_creator').width();
                         var textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var image_map_array_string = textarea.val(); 
                         if (image_map_array_string != '') {
                              var image_map_array = JSON.parse(image_map_array_string);
                         }else{
                              var image_map_array = {};
                         }
                         ids = [image_map_array.image_id]; 
                         var image = wp.media({ 
                              title: 'Add Image',
                              // mutiple: true if you want t1o upload multiple files at once
                              multiple: false
                         }).on('open', function(){
                              var selection = image.state().get('selection');
                              for (i = 0; i < ids.length; i++) {
                                   attachment = wp.media.attachment(ids[i]);
                                   attachment.fetch();
                                   selection.add( attachment ? [ attachment ] : [] );                                
                              };
                         }).on('select', function(e){
                              // This will return the selected image from the Media Uploader, the result is an object
                              var uploaded_image = image.state().get('selection').first();
                              // We convert uploaded_image to a JSON object to make accessing it easier
                              // Output to the console uploaded_image
                              if (specific_map_size != '' && uploaded_image.toJSON().sizes.hasOwnProperty(specific_map_size) !== false) {
                                   var image_url = uploaded_image.toJSON().sizes[specific_map_size].url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().sizes[specific_map_size].width;   
                                   var image_height = uploaded_image.toJSON().sizes[specific_map_size].height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;                 
                              }else{
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;  
                              }                             
                              // Let's assign the url value to the input field                 
                              image_map_array.image_url = image_url;
                              image_map_array.image_id = image_id;
                              image_map_array.image_width = image_width;
                              image_map_array.image_height = image_height;
                              image_map_array.image_max_width = image_max_width;
                              image_map_array.image_max_height = image_max_height;
                              var finalarray = JSON.stringify(image_map_array);
                              textarea.val(finalarray);                            
                              image_wrapper.html('<img src="'+image_url+'" data_id="'+image_id+'" data_width="'+image_width+'" data_height="'+image_height+'" data_max_width="'+image_max_width+'" data_max_height="'+image_max_height+'">');
                         });  
                         image.open();                          
                    }
               });               
          }
          if ($('.crm_imagemap_creator .crm_image_map_add_point').length>0) {
               $('.crm_imagemap_creator .crm_image_map_add_point').click(function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').length > 0) {   
                         var static_point_image = $(this).closest('.crm_imagemap_creator').attr('data-static_point');           
                         var clicked_bttn = $(this);
                         var map_creator = $(this).closest('.crm_imagemap_creator')      
                         if (typeof static_point_image !== typeof undefined && static_point_image !== '') {
                              $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('<img src="'+static_point_image+'"/>');
                              $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });

                              $(this).closest('.crm_imagemap_creator').addClass('dragging');
                              var container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields');    
                              container.html('');
                              var dynamicfields = JSON.parse($(this).closest('.crm_imagemap_creator').attr('data_dynamic_fields'));
                              $(this).closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');
                              var fieldboxname = $(this).closest('.crm_imagemap_creator').attr('data_original_name');                            
                              for (var i = 0; i < dynamicfields.length; i++) {
                                   jQuery.post('/wp-admin/admin-ajax.php',{
                                         action:'custom_ready_meta_options_createinput_dynamic',
                                         dynamic_type:dynamicfields[i]['type'],
                                         dynamic_name:dynamicfields[i]['name'],
                                         dynamic_label:dynamicfields[i]['label'],
                                         dynamic_instructions:dynamicfields[i]['instructions'],
                                         dynamic_selections:dynamicfields[i]['selections'],
                                         dynamic_attributes:dynamicfields[i]['attributes'],
                                         async:false
                                   },
                                   function(response){
                                        container.append(response);
                                        container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');                              
                                   });
                              }  
                              container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_save_point crm_bttn">Save Point</button></div><div class="crm_image_map_change_point_text">Drag point to preferred position and click "Save Point"</div>');                                                                   
                         }else{
                              var image = wp.media({ 
                                   title: 'Add Point Image',
                                   // mutiple: true if you want t1o upload multiple files at once
                                   multiple: false
                              }).open(
                                   /*function(){
                                        var selection = image.state().get('selection');
                                        ids = jQuery('#my_field_id').val().split(',');
                                        ids.forEach(function(id) {
                                        attachment = wp.media.attachment(id);
                                        attachment.fetch();
                                        selection.add( attachment ? [ attachment ] : [] );
                                   }*/
                              ).on('select', function(e){
                                   // This will return the selected image from the Media Uploader, the result is an object
                                   var uploaded_image = image.state().get('selection').first();
                                   // We convert uploaded_image to a JSON object to make accessing it easier
                                   // Output to the console uploaded_image
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;   
                                   //console.log(image_url);   
                                   // Let's assign the url value to the input field                                           
                                   map_creator.find('.crm_image_map_add_points_wrapper').html('<img src="'+image_url+'"/>');
                                   map_creator.find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });

                                   map_creator.addClass('dragging');
                                   var container = map_creator.find('.crm_image_map_point_fields');    
                                   container.html('');
                                   //console.log( $(this).closest('.crm_imagemap_creator') );
                                   var dynamicfields = JSON.parse(map_creator.attr('data_dynamic_fields'));
                                   map_creator.addClass('crm_fieldbox_loading');
                                   var fieldboxname = map_creator.attr('data_original_name');                            
                                   for (var i = 0; i < dynamicfields.length; i++) {
                                        jQuery.post('/wp-admin/admin-ajax.php',{
                                              action:'custom_ready_meta_options_createinput_dynamic',
                                              dynamic_type:dynamicfields[i]['type'],
                                              dynamic_name:dynamicfields[i]['name'],
                                              dynamic_label:dynamicfields[i]['label'],
                                              dynamic_instructions:dynamicfields[i]['instructions'],
                                              dynamic_selections:dynamicfields[i]['selections'],
                                              dynamic_attributes:dynamicfields[i]['attributes'],
                                              async:false
                                        },
                                        function(response){
                                             container.append(response);
                                             container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');                              
                                        });
                                   }  
                                   container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_save_point crm_bttn">Save Point</button></div><div class="crm_image_map_change_point_text">Drag point to preferred position and click "Save Point"</div>');                                                                        
                              });                                
                         }
                    }
               });
          }    
          function crm_update_image_map_array(image_map_array_textarea){
               var images = image_map_array_textarea.closest('.crm_imagemap_creator').find('.crm_image_map_show_points img[data_point_pos]');
               var image_map_array_string = image_map_array_textarea.val();
               var image_map_array = JSON.parse(image_map_array_string);
               var points_array = {};
               images.each(function(){   
                    ////console.log($(this)); 
                    var point_pos = $(this).attr('data_point_pos');    
                    points_array[point_pos] = {};
                    $.each(this.attributes, function(i, attrib){
                         var name = attrib.name;
                         var value = attrib.value;
                         points_array[point_pos][name] = value;
                    });
                    ////console.log(points_array);
                    ////console.log(image_map_array);                 
               });
               image_map_array.points = points_array; 
               var finalarray = JSON.stringify(image_map_array);
               image_map_array_textarea.val(finalarray);                   
          }
          if ($('.crm_imagemap_creator .crm_image_map_point_fields').length>0) {
               $('.crm_imagemap_creator .crm_image_map_point_fields').on('click', '.crm_image_map_save_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var point_count = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos]').length;
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_src = save_point_img.attr('src');
                         var save_point_img_left = save_point_img.css('left');
                         var save_point_img_top = save_point_img.css('top');
                         var save_point_img_height = save_point_img.height();
                         var save_point_img_width = save_point_img.width(); 
                         var save_point_data_attr = 'data_point_pos="'+(point_count+1)+'" data_point_left="'+(save_point_img_left)+'" data_point_top="'+(save_point_img_top)+'" data_point_src="'+(save_point_img_src)+'"';
                         save_point_data_attr += ' data_point_height="'+(save_point_img_height)+'" data_point_width="'+(save_point_img_width)+'"'
                         var save_point_params = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').find('select, input, textarea');
                         save_point_params.each(function(){
                              save_point_param_name = $(this).attr('name');
                              if (save_point_param_name.indexOf("custom_ready_meta_") > -1) {
                                   save_point_param_name_split = save_point_param_name.split('custom_ready_meta_');
                                   save_point_param_name_split_final = save_point_param_name_split[1];
                                   save_point_param_value = $(this).val();
                                   save_point_data_attr = save_point_data_attr + 'data_point_parameter_'+save_point_param_name_split_final+'="'+save_point_param_value+'"';
                              }
                         });
                         var save_point_final_image = '<img src="'+save_point_img_src+'" style="position:absolute; left:'+save_point_img_left+'; top:'+save_point_img_top+';" '+save_point_data_attr+'/>';
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').append(save_point_final_image);
                         crm_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                         
                    }
               });
               $('.crm_imagemap_creator .crm_image_map_point_fields').on('click', '.crm_image_map_edit_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var point_count = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos]').length;
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_src = save_point_img.attr('src');
                         var save_point_img_left = save_point_img.css('left');
                         var save_point_img_top = save_point_img.css('top');
                         var save_point_img_height = save_point_img.height();
                         var save_point_img_width = save_point_img.width(); 
                         var save_point_img_pos = save_point_img.attr('data_point_pos'); 
                         var save_point_data_attr = 'data_point_pos="'+save_point_img_pos+'" data_point_left="'+(save_point_img_left)+'" data_point_top="'+(save_point_img_top)+'" data_point_src="'+(save_point_img_src)+'"';
                         save_point_data_attr += ' data_point_height="'+(save_point_img_height)+'" data_point_width="'+(save_point_img_width)+'"'
                         var save_point_params = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').find('select, input, textarea');
                         save_point_params.each(function(){
                              save_point_param_name = $(this).attr('name');
                              if (save_point_param_name.indexOf("custom_ready_meta_") > -1) {
                                   save_point_param_name_split = save_point_param_name.split('custom_ready_meta_');
                                   save_point_param_name_split_final = save_point_param_name_split[1];
                                   save_point_param_value = $(this).val();
                                   save_point_data_attr = save_point_data_attr + 'data_point_parameter_'+save_point_param_name_split_final+'="'+save_point_param_value+'"';
                              }
                         });
                         var save_point_final_image = '<img src="'+save_point_img_src+'" style="position:absolute; left:'+save_point_img_left+'; top:'+save_point_img_top+';" '+save_point_data_attr+'/>';
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos="'+save_point_img_pos+'"]').remove();
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').append(save_point_final_image);
                         crm_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                         
                    }
               });       
               $('.crm_imagemap_creator .crm_image_map_point_fields').on('click', '.crm_image_map_delete_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_pos = save_point_img.attr('data_point_pos');    
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos="'+save_point_img_pos+'"]').remove();                     
                         crm_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                           
                    }
               });                                                
          }  
          if ($('.crm_imagemap_creator .crm_image_map_show_points').length>0) {
               $('.crm_imagemap_creator .crm_image_map_show_points').on('click', 'img[data_point_pos]', function(e){
                    e.preventDefault();      
                    $(this).addClass('selected');              
                    $(this).closest('.crm_imagemap_creator').addClass('dragging');
                    var container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields');   
                    container.closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');    
                    var add_point_container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper');   
                    $(this).clone().appendTo(add_point_container); 
                    container.html('');
                    var dynamicfields = JSON.parse($(this).closest('.crm_imagemap_creator').attr('data_dynamic_fields'));
                    $(this).closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');
                    var fieldboxname = $(this).closest('.crm_imagemap_creator').attr('data_original_name');                            
                    for (var i = 0; i < dynamicfields.length; i++) {
                         jQuery.post('/wp-admin/admin-ajax.php',{
                               action:'custom_ready_meta_options_createinput_dynamic',
                               dynamic_type:dynamicfields[i]['type'],
                               dynamic_name:dynamicfields[i]['name'],
                               dynamic_label:dynamicfields[i]['label'],
                               dynamic_instructions:dynamicfields[i]['instructions'],
                               dynamic_selections:dynamicfields[i]['selections'],
                               dynamic_attributes:dynamicfields[i]['attributes'],
                               async:false
                         },
                         function(response){
                              container.append(response);                          
                         });
                    }  
                    container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_edit_point crm_bttn">Edit Point</button><button class="crm_image_map_delete_point crm_bttn">Delete Point</button></div>');  
                    container.append('<div class="crm_image_map_change_point_text">Drag point to preferred position, adjust fields associated to the point, and click "Edit Point" to update it.<br>Press "Delete Point" to remove it entirely.</div>');
                    container.closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });
                    var edit_interval = setInterval(function(){
                         if (add_point_container.find('img').length == 1) {
                              var edit_image_check = '';
                              var edit_image = add_point_container.find('img');
                              edit_image.each(function(){                                                                      
                                   $.each($(this).get(0).attributes, function(i, attrib){                                        
                                        var name = attrib.name;
                                        var value = attrib.value;
                                        if (name.indexOf('data_point_parameter_') > -1) {
                                             edit_image_name_split = name.split('data_point_parameter_');
                                             //edit_image_name_split = save_point_param_name.split('custom_ready_meta_');
                                             edit_image_name_field = container.find('#custom_ready_meta_'+edit_image_name_split[1]);
                                             if (edit_image_name_field.val() != value) {
                                                  edit_image_name_field.val(value);
                                                  edit_image_check = 'false';
                                             }
                                        };
                                   });                                      
                              });                           
                              if (edit_image_check == '') {                                   
                                   container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');
                                   clearInterval(edit_interval);
                              }
                         }
                    }, 1000);                                                       
               });
          }                
     }
     //End Functions For Create Meta - Imagemap

     //Start Functions For Create Meta - Imagemap For Dynamic Fields
          if ($('.crm_dynamic_field_box').length>0) {
               $('.crm_dynamic_field_box .crm_imagemap_creator .crm_image_map_add_img').off();
               $('.crm_dynamic_field_box').on('click', '.crm_imagemap_creator .crm_image_map_add_img', function(e){
                    ////console.log('add_img clicked');
                    e.preventDefault();
                    var specific_map_size = $(this).closest('.crm_imagemap_creator').attr('data-image_size');
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_show').find('img').length <= 0) {
                         var image_wrapper = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show');
                         var image_wrapper_width = $(this).closest('.crm_imagemap_creator').width();
                         var textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var image_map_array_string = textarea.val(); 
                         if (image_map_array_string != '') {
                              var image_map_array = JSON.parse(image_map_array_string);
                         }else{
                              var image_map_array = {};
                         }
                         var image = wp.media({ 
                              title: 'Add Image',
                              // mutiple: true if you want t1o upload multiple files at once
                              multiple: false
                         }).open(
                              /*function(){
                                   var selection = image.state().get('selection');
                                   ids = jQuery('#my_field_id').val().split(',');
                                   ids.forEach(function(id) {
                                   attachment = wp.media.attachment(id);
                                   attachment.fetch();
                                   selection.add( attachment ? [ attachment ] : [] );
                              }*/
                         ).on('select', function(e){
                              // This will return the selected image from the Media Uploader, the result is an object
                              var uploaded_image = image.state().get('selection').first();
                              // We convert uploaded_image to a JSON object to make accessing it easier
                              // Output to the console uploaded_image
                              //console.log(uploaded_image.toJSON().sizes[specific_map_size]);
                              //console.log(uploaded_image.toJSON().sizes.hasOwnProperty(specific_map_size));
                              if (specific_map_size != '' && uploaded_image.toJSON().sizes.hasOwnProperty(specific_map_size) !== false) {
                                   var image_url = uploaded_image.toJSON().sizes[specific_map_size].url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().sizes[specific_map_size].width;   
                                   var image_height = uploaded_image.toJSON().sizes[specific_map_size].height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;       
                                   console.log(uploaded_image.toJSON().sizes[specific_map_size]);          
                              }else{
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;  
                              }
                              //console.log(uploaded_image);
                              ////console.log(image_max_width);
                              // Let's assign the url value to the input field                 
                              image_map_array.image_url = image_url;
                              image_map_array.image_id = image_id;
                              image_map_array.image_width = image_width;
                              image_map_array.image_height = image_height;
                              image_map_array.image_max_width = image_max_width;
                              image_map_array.image_max_height = image_max_height;
                              var finalarray = JSON.stringify(image_map_array);
                              textarea.val(finalarray);                            
                              image_wrapper.html('<img src="'+image_url+'" data_id="'+image_id+'" data_width="'+image_width+'" data_height="'+image_height+'" data_max_width="'+image_max_width+'" data_max_height="'+image_max_height+'">');
                         });                          
                    }else{
                         var image_wrapper = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show');
                         var image_wrapper_width = $(this).closest('.crm_imagemap_creator').width();
                         var textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var image_map_array_string = textarea.val(); 
                         if (image_map_array_string != '') {
                              var image_map_array = JSON.parse(image_map_array_string);
                         }else{
                              var image_map_array = {};
                         }
                         ids = [image_map_array.image_id]; 
                         var image = wp.media({ 
                              title: 'Add Image',
                              // mutiple: true if you want t1o upload multiple files at once
                              multiple: false
                         }).on('open', function(){
                              var selection = image.state().get('selection');
                              for (i = 0; i < ids.length; i++) {
                                   attachment = wp.media.attachment(ids[i]);
                                   attachment.fetch();
                                   selection.add( attachment ? [ attachment ] : [] );                                
                              };
                         }).on('select', function(e){
                              // This will return the selected image from the Media Uploader, the result is an object
                              var uploaded_image = image.state().get('selection').first();
                              // We convert uploaded_image to a JSON object to make accessing it easier
                              // Output to the console uploaded_image
                              if (specific_map_size != '' && uploaded_image.toJSON().sizes.hasOwnProperty(specific_map_size) !== false) {
                                   var image_url = uploaded_image.toJSON().sizes[specific_map_size].url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().sizes[specific_map_size].width;   
                                   var image_height = uploaded_image.toJSON().sizes[specific_map_size].height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;    
                                   console.log(uploaded_image.toJSON().sizes[specific_map_size]);             
                              }else{
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;    
                                   var image_max_width = Math.min(image_width, image_wrapper_width);
                                   var image_max_height = (image_max_width / image_width) * image_height;  
                              }
                              ////console.log(image_max_width);
                              //console.log(uploaded_image);
                              // Let's assign the url value to the input field                 
                              image_map_array.image_url = image_url;
                              image_map_array.image_id = image_id;
                              image_map_array.image_width = image_width;
                              image_map_array.image_height = image_height;
                              image_map_array.image_max_width = image_max_width;
                              image_map_array.image_max_height = image_max_height;
                              var finalarray = JSON.stringify(image_map_array);
                              textarea.val(finalarray);                            
                              image_wrapper.html('<img src="'+image_url+'" data_id="'+image_id+'" data_width="'+image_width+'" data_height="'+image_height+'" data_max_width="'+image_max_width+'" data_max_height="'+image_max_height+'">');
                         });  
                         image.open();                          
                    }
               });     

               $('.crm_dynamic_field_box .crm_imagemap_creator .crm_image_map_add_point').off();
               $('.crm_dynamic_field_box').on('click', '.crm_imagemap_creator .crm_image_map_add_point', function(e){
                    //console.log('add_point clicked');
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').length > 0) {   
                         var static_point_image = $(this).closest('.crm_imagemap_creator').attr('data-static_point');           
                         var clicked_bttn = $(this);
                         var map_creator = $(this).closest('.crm_imagemap_creator')      
                         if (typeof static_point_image !== typeof undefined && static_point_image !== '') {
                              $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('<img src="'+static_point_image+'"/>');
                              $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });

                              $(this).closest('.crm_imagemap_creator').addClass('dragging');
                              var container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields');    
                              container.html('');
                              var dynamicfields = JSON.parse($(this).closest('.crm_imagemap_creator').attr('data_dynamic_fields'));
                              $(this).closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');
                              var fieldboxname = $(this).closest('.crm_imagemap_creator').attr('data_original_name');                            
                              for (var i = 0; i < dynamicfields.length; i++) {
                                   jQuery.post('/wp-admin/admin-ajax.php',{
                                         action:'custom_ready_meta_options_createinput_dynamic',
                                         dynamic_type:dynamicfields[i]['type'],
                                         dynamic_name:dynamicfields[i]['name'],
                                         dynamic_label:dynamicfields[i]['label'],
                                         dynamic_instructions:dynamicfields[i]['instructions'],
                                         dynamic_selections:dynamicfields[i]['selections'],
                                         dynamic_attributes:dynamicfields[i]['attributes'],
                                         async:false
                                   },
                                   function(response){
                                        container.append(response);
                                        container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');                              
                                   });
                              }  
                              container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_save_point crm_bttn">Save Point</button></div><div class="crm_image_map_change_point_text">Drag point to preferred position and click "Save Point"</div>');                                                                   
                         }else{
                              var image = wp.media({ 
                                   title: 'Add Point Image',
                                   // mutiple: true if you want t1o upload multiple files at once
                                   multiple: false
                              }).open(
                                   /*function(){
                                        var selection = image.state().get('selection');
                                        ids = jQuery('#my_field_id').val().split(',');
                                        ids.forEach(function(id) {
                                        attachment = wp.media.attachment(id);
                                        attachment.fetch();
                                        selection.add( attachment ? [ attachment ] : [] );
                                   }*/
                              ).on('select', function(e){
                                   // This will return the selected image from the Media Uploader, the result is an object
                                   var uploaded_image = image.state().get('selection').first();
                                   // We convert uploaded_image to a JSON object to make accessing it easier
                                   // Output to the console uploaded_image
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;   
                                   //console.log(image_url);   
                                   // Let's assign the url value to the input field                                           
                                   map_creator.find('.crm_image_map_add_points_wrapper').html('<img src="'+image_url+'"/>');
                                   map_creator.find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });

                                   map_creator.addClass('dragging');
                                   var container = map_creator.find('.crm_image_map_point_fields');    
                                   container.html('');
                                   //console.log( $(this).closest('.crm_imagemap_creator') );
                                   var dynamicfields = JSON.parse(map_creator.attr('data_dynamic_fields'));
                                   map_creator.addClass('crm_fieldbox_loading');
                                   var fieldboxname = map_creator.attr('data_original_name');                            
                                   for (var i = 0; i < dynamicfields.length; i++) {
                                        jQuery.post('/wp-admin/admin-ajax.php',{
                                              action:'custom_ready_meta_options_createinput_dynamic',
                                              dynamic_type:dynamicfields[i]['type'],
                                              dynamic_name:dynamicfields[i]['name'],
                                              dynamic_label:dynamicfields[i]['label'],
                                              dynamic_instructions:dynamicfields[i]['instructions'],
                                              dynamic_selections:dynamicfields[i]['selections'],
                                              dynamic_attributes:dynamicfields[i]['attributes'],
                                              async:false
                                        },
                                        function(response){
                                             container.append(response);
                                             container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');                              
                                        });
                                   }  
                                   container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_save_point crm_bttn">Save Point</button></div><div class="crm_image_map_change_point_text">Drag point to preferred position and click "Save Point"</div>');                                                                        
                              });                                
                         }
                    }
               });

               function crm_dynamic_update_image_map_array(image_map_array_textarea){
                    var images = image_map_array_textarea.closest('.crm_imagemap_creator').find('.crm_image_map_show_points img[data_point_pos]');
                    var image_map_array_string = image_map_array_textarea.val();
                    var image_map_array = JSON.parse(image_map_array_string);
                    var points_array = {};
                    images.each(function(){   
                         ////console.log($(this)); 
                         var point_pos = $(this).attr('data_point_pos');    
                         points_array[point_pos] = {};
                         $.each(this.attributes, function(i, attrib){
                              var name = attrib.name;
                              var value = attrib.value;
                              points_array[point_pos][name] = value;
                         });
                         ////console.log(points_array);
                         ////console.log(image_map_array);                 
                    });
                    image_map_array.points = points_array; 
                    var finalarray = JSON.stringify(image_map_array);
                    image_map_array_textarea.val(finalarray);                   
               }

               $('.crm_dynamic_field_box .crm_imagemap_creator .crm_image_map_point_fields').off();
               $('.crm_dynamic_field_box').on('click', '.crm_imagemap_creator .crm_image_map_point_fields .crm_image_map_save_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var point_count = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos]').length;
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_src = save_point_img.attr('src');
                         var save_point_img_left = save_point_img.css('left');
                         var save_point_img_top = save_point_img.css('top');
                         var save_point_img_height = save_point_img.height();
                         var save_point_img_width = save_point_img.width(); 
                         var save_point_data_attr = 'data_point_pos="'+(point_count+1)+'" data_point_left="'+(save_point_img_left)+'" data_point_top="'+(save_point_img_top)+'" data_point_src="'+(save_point_img_src)+'"';
                         save_point_data_attr += ' data_point_height="'+(save_point_img_height)+'" data_point_width="'+(save_point_img_width)+'"'
                         var save_point_params = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').find('select, input, textarea');
                         save_point_params.each(function(){
                              save_point_param_name = $(this).attr('name');
                              if (save_point_param_name.indexOf("custom_ready_meta_") > -1) {
                                   save_point_param_name_split = save_point_param_name.split('custom_ready_meta_');
                                   save_point_param_name_split_final = save_point_param_name_split[1];
                                   save_point_param_value = $(this).val();
                                   save_point_data_attr = save_point_data_attr + 'data_point_parameter_'+save_point_param_name_split_final+'="'+save_point_param_value+'"';
                              }
                         });
                         var save_point_final_image = '<img src="'+save_point_img_src+'" style="position:absolute; left:'+save_point_img_left+'; top:'+save_point_img_top+';" '+save_point_data_attr+'/>';
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').append(save_point_final_image);
                         crm_dynamic_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                         
                    }
               });

               $('.crm_dynamic_field_box').on('click', '.crm_imagemap_creator .crm_image_map_point_fields .crm_image_map_edit_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var point_count = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos]').length;
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_src = save_point_img.attr('src');
                         var save_point_img_left = save_point_img.css('left');
                         var save_point_img_top = save_point_img.css('top');
                         var save_point_img_height = save_point_img.height();
                         var save_point_img_width = save_point_img.width(); 
                         var save_point_img_pos = save_point_img.attr('data_point_pos'); 
                         var save_point_data_attr = 'data_point_pos="'+save_point_img_pos+'" data_point_left="'+(save_point_img_left)+'" data_point_top="'+(save_point_img_top)+'" data_point_src="'+(save_point_img_src)+'"';
                         save_point_data_attr += ' data_point_height="'+(save_point_img_height)+'" data_point_width="'+(save_point_img_width)+'"'
                         var save_point_params = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').find('select, input, textarea');
                         save_point_params.each(function(){
                              save_point_param_name = $(this).attr('name');
                              if (save_point_param_name.indexOf("custom_ready_meta_") > -1) {
                                   save_point_param_name_split = save_point_param_name.split('custom_ready_meta_');
                                   save_point_param_name_split_final = save_point_param_name_split[1];
                                   save_point_param_value = $(this).val();
                                   save_point_data_attr = save_point_data_attr + 'data_point_parameter_'+save_point_param_name_split_final+'="'+save_point_param_value+'"';
                              }
                         });
                         var save_point_final_image = '<img src="'+save_point_img_src+'" style="position:absolute; left:'+save_point_img_left+'; top:'+save_point_img_top+';" '+save_point_data_attr+'/>';
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos="'+save_point_img_pos+'"]').remove();
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').append(save_point_final_image);
                         crm_dynamic_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                         
                    }
               });   

               $('.crm_dynamic_field_box').on('click', '.crm_imagemap_creator .crm_image_map_point_fields .crm_image_map_delete_point', function(e){  
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_pos = save_point_img.attr('data_point_pos');    
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos="'+save_point_img_pos+'"]').remove();                     
                         crm_dynamic_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                           
                    }
               });                                                

               $('.crm_dynamic_field_box .crm_imagemap_creator .crm_image_map_show_points').off();
               $('.crm_dynamic_field_box').on('click', '.crm_imagemap_creator .crm_image_map_show_points img[data_point_pos]', function(e){
                    e.preventDefault();      
                    $(this).addClass('selected');              
                    $(this).closest('.crm_imagemap_creator').addClass('dragging');
                    var container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields');   
                    container.closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');    
                    var add_point_container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper');                       
                    $(this).clone().appendTo(add_point_container); 
                    container.html('');
                    var dynamicfields = JSON.parse($(this).closest('.crm_imagemap_creator').attr('data_dynamic_fields'));
                    $(this).closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');
                    var fieldboxname = $(this).closest('.crm_imagemap_creator').attr('data_original_name');                            
                    for (var i = 0; i < dynamicfields.length; i++) {
                         jQuery.post('/wp-admin/admin-ajax.php',{
                               action:'custom_ready_meta_options_createinput_dynamic',
                               dynamic_type:dynamicfields[i]['type'],
                               dynamic_name:dynamicfields[i]['name'],
                               dynamic_label:dynamicfields[i]['label'],
                               dynamic_instructions:dynamicfields[i]['instructions'],
                               dynamic_selections:dynamicfields[i]['selections'],
                               dynamic_attributes:dynamicfields[i]['attributes'],
                               async:false
                         },
                         function(response){
                              container.append(response);                          
                         });
                    }  
                    container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_edit_point crm_bttn">Edit Point</button><button class="crm_image_map_delete_point crm_bttn">Delete Point</button></div>');  
                    container.append('<div class="crm_image_map_change_point_text">Drag point to preferred position, adjust fields associated to the point, and click "Edit Point" to update it.<br>Press "Delete Point" to remove it entirely.</div>');
                    container.closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });
                    var edit_interval = setInterval(function(){
                         if (add_point_container.find('img').length == 1) {
                              //console.log('interval check');
                              var edit_image_check = '';
                              var edit_image = add_point_container.find('img');
                              edit_image.each(function(){                                                                      
                                   $.each($(this).get(0).attributes, function(i, attrib){                                        
                                        var name = attrib.name;
                                        var value = attrib.value;
                                        if (name.indexOf('data_point_parameter_') > -1) {
                                             edit_image_name_split = name.split('data_point_parameter_');
                                             //edit_image_name_split = save_point_param_name.split('custom_ready_meta_');
                                             edit_image_name_field = container.find('#custom_ready_meta_'+edit_image_name_split[1]);
                                             ////console.log(edit_image_name_field);
                                             if (edit_image_name_field.val() != value) {
                                                  edit_image_name_field.val(value);
                                                  edit_image_check = 'false';
                                             }
                                        };
                                   });                                      
                              });                           
                              if (edit_image_check == '') {                                   
                                   container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');
                                   clearInterval(edit_interval);
                              }
                         }
                    }, 1000);                                                       
               });
          }
     //End Functions For Create Meta - Imagemap For Dynamic Fields

     //Start Functions For Create Meta - Imagemap For Nested Dynamic Fields
          if ($('.crm_dynamic_nested_field_box').length>0) {
               $('.crm_dynamic_nested_field_box .crm_imagemap_creator .crm_image_map_add_img').off();
               $('.crm_dynamic_nested_field_box').on('click', '.crm_imagemap_creator .crm_image_map_add_img', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_show').find('img').length <= 0) {
                         var image_wrapper = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show');
                         var image_wrapper_width = $(this).closest('.crm_imagemap_creator').width();
                         var textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var image_map_array_string = textarea.val(); 
                         if (image_map_array_string != '') {
                              var image_map_array = JSON.parse(image_map_array_string);
                         }else{
                              var image_map_array = {};
                         }
                         var image = wp.media({ 
                              title: 'Add Image',
                              // mutiple: true if you want t1o upload multiple files at once
                              multiple: false
                         }).open(
                              /*function(){
                                   var selection = image.state().get('selection');
                                   ids = jQuery('#my_field_id').val().split(',');
                                   ids.forEach(function(id) {
                                   attachment = wp.media.attachment(id);
                                   attachment.fetch();
                                   selection.add( attachment ? [ attachment ] : [] );
                              }*/
                         ).on('select', function(e){
                              // This will return the selected image from the Media Uploader, the result is an object
                              var uploaded_image = image.state().get('selection').first();
                              // We convert uploaded_image to a JSON object to make accessing it easier
                              // Output to the console uploaded_image
                              var image_url = uploaded_image.toJSON().url;
                              var image_id = uploaded_image.toJSON().id; 
                              var image_width = uploaded_image.toJSON().width;   
                              var image_height = uploaded_image.toJSON().height;    
                              var image_max_width = Math.min(image_width, image_wrapper_width);
                              var image_max_height = (image_max_width / image_width) * image_height;  
                              // Let's assign the url value to the input field                 
                              image_map_array.image_url = image_url;
                              image_map_array.image_id = image_id;
                              image_map_array.image_width = image_width;
                              image_map_array.image_height = image_height;
                              image_map_array.image_max_width = image_max_width;
                              image_map_array.image_max_height = image_max_height;
                              var finalarray = JSON.stringify(image_map_array);
                              textarea.val(finalarray);                            
                              image_wrapper.html('<img src="'+image_url+'" data_id="'+image_id+'" data_width="'+image_width+'" data_height="'+image_height+'" data_max_width="'+image_max_width+'" data_max_height="'+image_max_height+'">');
                         });                          
                    }else{
                         var image_wrapper = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show');
                         var image_wrapper_width = $(this).closest('.crm_imagemap_creator').width();
                         var textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var image_map_array_string = textarea.val(); 
                         if (image_map_array_string != '') {
                              var image_map_array = JSON.parse(image_map_array_string);
                         }else{
                              var image_map_array = {};
                         }
                         ids = [image_map_array.image_id]; 
                         var image = wp.media({ 
                              title: 'Add Image',
                              // mutiple: true if you want t1o upload multiple files at once
                              multiple: false
                         }).on('open', function(){
                              var selection = image.state().get('selection');
                              for (i = 0; i < ids.length; i++) {
                                   attachment = wp.media.attachment(ids[i]);
                                   attachment.fetch();
                                   selection.add( attachment ? [ attachment ] : [] );                                
                              };
                         }).on('select', function(e){
                              // This will return the selected image from the Media Uploader, the result is an object
                              var uploaded_image = image.state().get('selection').first();
                              // We convert uploaded_image to a JSON object to make accessing it easier
                              // Output to the console uploaded_image
                              var image_url = uploaded_image.toJSON().url;
                              var image_id = uploaded_image.toJSON().id; 
                              var image_width = uploaded_image.toJSON().width;   
                              var image_height = uploaded_image.toJSON().height;    
                              var image_max_width = Math.min(image_width, image_wrapper_width);
                              var image_max_height = (image_max_width / image_width) * image_height;  
                              // Let's assign the url value to the input field                 
                              image_map_array.image_url = image_url;
                              image_map_array.image_id = image_id;
                              image_map_array.image_width = image_width;
                              image_map_array.image_height = image_height;
                              image_map_array.image_max_width = image_max_width;
                              image_map_array.image_max_height = image_max_height;
                              var finalarray = JSON.stringify(image_map_array);
                              textarea.val(finalarray);                            
                              image_wrapper.html('<img src="'+image_url+'" data_id="'+image_id+'" data_width="'+image_width+'" data_height="'+image_height+'" data_max_width="'+image_max_width+'" data_max_height="'+image_max_height+'">');
                         });  
                         image.open();                          
                    }
               });     

               $('.crm_dynamic_nested_field_box .crm_imagemap_creator .crm_image_map_add_point').off();
               $('.crm_dynamic_nested_field_box').on('click', '.crm_imagemap_creator .crm_image_map_add_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').length > 0) {   
                         var static_point_image = $(this).closest('.crm_imagemap_creator').attr('data-static_point');           
                         var clicked_bttn = $(this);
                         var map_creator = $(this).closest('.crm_imagemap_creator')      
                         if (typeof static_point_image !== typeof undefined && static_point_image !== '') {
                              $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('<img src="'+static_point_image+'"/>');
                              $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });

                              $(this).closest('.crm_imagemap_creator').addClass('dragging');
                              var container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields');    
                              container.html('');
                              var dynamicfields = JSON.parse($(this).closest('.crm_imagemap_creator').attr('data_dynamic_fields'));
                              $(this).closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');
                              var fieldboxname = $(this).closest('.crm_imagemap_creator').attr('data_original_name');                            
                              for (var i = 0; i < dynamicfields.length; i++) {
                                   jQuery.post('/wp-admin/admin-ajax.php',{
                                         action:'custom_ready_meta_options_createinput_dynamic',
                                         dynamic_type:dynamicfields[i]['type'],
                                         dynamic_name:dynamicfields[i]['name'],
                                         dynamic_label:dynamicfields[i]['label'],
                                         dynamic_instructions:dynamicfields[i]['instructions'],
                                         dynamic_selections:dynamicfields[i]['selections'],
                                         dynamic_attributes:dynamicfields[i]['attributes'],
                                         async:false
                                   },
                                   function(response){
                                        container.append(response);
                                        container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');                              
                                   });
                              }  
                              container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_save_point crm_bttn">Save Point</button></div><div class="crm_image_map_change_point_text">Drag point to preferred position and click "Save Point"</div>');                                                                   
                         }else{
                              var image = wp.media({ 
                                   title: 'Add Point Image',
                                   // mutiple: true if you want t1o upload multiple files at once
                                   multiple: false
                              }).open(
                                   /*function(){
                                        var selection = image.state().get('selection');
                                        ids = jQuery('#my_field_id').val().split(',');
                                        ids.forEach(function(id) {
                                        attachment = wp.media.attachment(id);
                                        attachment.fetch();
                                        selection.add( attachment ? [ attachment ] : [] );
                                   }*/
                              ).on('select', function(e){
                                   // This will return the selected image from the Media Uploader, the result is an object
                                   var uploaded_image = image.state().get('selection').first();
                                   // We convert uploaded_image to a JSON object to make accessing it easier
                                   // Output to the console uploaded_image
                                   var image_url = uploaded_image.toJSON().url;
                                   var image_id = uploaded_image.toJSON().id; 
                                   var image_width = uploaded_image.toJSON().width;   
                                   var image_height = uploaded_image.toJSON().height;   
                                   ////console.log(image_url);   
                                   // Let's assign the url value to the input field                                           
                                   map_creator.find('.crm_image_map_add_points_wrapper').html('<img src="'+image_url+'"/>');
                                   map_creator.find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });

                                   map_creator.addClass('dragging');
                                   var container = map_creator.find('.crm_image_map_point_fields');    
                                   container.html('');
                                   ////console.log( $(this).closest('.crm_imagemap_creator') );
                                   var dynamicfields = JSON.parse(map_creator.attr('data_dynamic_fields'));
                                   map_creator.addClass('crm_fieldbox_loading');
                                   var fieldboxname = map_creator.attr('data_original_name');                            
                                   for (var i = 0; i < dynamicfields.length; i++) {
                                        jQuery.post('/wp-admin/admin-ajax.php',{
                                              action:'custom_ready_meta_options_createinput_dynamic',
                                              dynamic_type:dynamicfields[i]['type'],
                                              dynamic_name:dynamicfields[i]['name'],
                                              dynamic_label:dynamicfields[i]['label'],
                                              dynamic_instructions:dynamicfields[i]['instructions'],
                                              dynamic_selections:dynamicfields[i]['selections'],
                                              dynamic_attributes:dynamicfields[i]['attributes'],
                                              async:false
                                        },
                                        function(response){
                                             container.append(response);
                                             container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');                              
                                        });
                                   }  
                                   container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_save_point crm_bttn">Save Point</button></div><div class="crm_image_map_change_point_text">Drag point to preferred position and click "Save Point"</div>');                                                                        
                              });                                
                         }
                    }
               });

               function crm_nested_dynamic_update_image_map_array(image_map_array_textarea){
                    var images = image_map_array_textarea.closest('.crm_imagemap_creator').find('.crm_image_map_show_points img[data_point_pos]');
                    var image_map_array_string = image_map_array_textarea.val();
                    var image_map_array = JSON.parse(image_map_array_string);
                    var points_array = {};
                    images.each(function(){   
                         ////console.log($(this)); 
                         var point_pos = $(this).attr('data_point_pos');    
                         points_array[point_pos] = {};
                         $.each(this.attributes, function(i, attrib){
                              var name = attrib.name;
                              var value = attrib.value;
                              points_array[point_pos][name] = value;
                         });
                         ////console.log(points_array);
                         ////console.log(image_map_array);                 
                    });
                    image_map_array.points = points_array; 
                    var finalarray = JSON.stringify(image_map_array);
                    image_map_array_textarea.val(finalarray);                   
               }

               $('.crm_dynamic_nested_field_box .crm_imagemap_creator .crm_image_map_point_fields').off();
               $('.crm_dynamic_nested_field_box').on('click', '.crm_imagemap_creator .crm_image_map_point_fields .crm_image_map_save_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var point_count = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos]').length;
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_src = save_point_img.attr('src');
                         var save_point_img_left = save_point_img.css('left');
                         var save_point_img_top = save_point_img.css('top');
                         var save_point_img_height = save_point_img.height();
                         var save_point_img_width = save_point_img.width(); 
                         var save_point_data_attr = 'data_point_pos="'+(point_count+1)+'" data_point_left="'+(save_point_img_left)+'" data_point_top="'+(save_point_img_top)+'" data_point_src="'+(save_point_img_src)+'"';
                         save_point_data_attr += ' data_point_height="'+(save_point_img_height)+'" data_point_width="'+(save_point_img_width)+'"'
                         var save_point_params = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').find('select, input, textarea');
                         save_point_params.each(function(){
                              save_point_param_name = $(this).attr('name');
                              if (save_point_param_name.indexOf("custom_ready_meta_") > -1) {
                                   save_point_param_name_split = save_point_param_name.split('custom_ready_meta_');
                                   save_point_param_name_split_final = save_point_param_name_split[1];
                                   save_point_param_value = $(this).val();
                                   save_point_data_attr = save_point_data_attr + 'data_point_parameter_'+save_point_param_name_split_final+'="'+save_point_param_value+'"';
                              }
                         });
                         var save_point_final_image = '<img src="'+save_point_img_src+'" style="position:absolute; left:'+save_point_img_left+'; top:'+save_point_img_top+';" '+save_point_data_attr+'/>';
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').append(save_point_final_image);
                         crm_nested_dynamic_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                         
                    }
               });

               $('.crm_dynamic_nested_field_box').on('click', '.crm_imagemap_creator .crm_image_map_point_fields .crm_image_map_edit_point', function(e){
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var point_count = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos]').length;
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_src = save_point_img.attr('src');
                         var save_point_img_left = save_point_img.css('left');
                         var save_point_img_top = save_point_img.css('top');
                         var save_point_img_height = save_point_img.height();
                         var save_point_img_width = save_point_img.width(); 
                         var save_point_img_pos = save_point_img.attr('data_point_pos'); 
                         var save_point_data_attr = 'data_point_pos="'+save_point_img_pos+'" data_point_left="'+(save_point_img_left)+'" data_point_top="'+(save_point_img_top)+'" data_point_src="'+(save_point_img_src)+'"';
                         save_point_data_attr += ' data_point_height="'+(save_point_img_height)+'" data_point_width="'+(save_point_img_width)+'"'
                         var save_point_params = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').find('select, input, textarea');
                         save_point_params.each(function(){
                              save_point_param_name = $(this).attr('name');
                              if (save_point_param_name.indexOf("custom_ready_meta_") > -1) {
                                   save_point_param_name_split = save_point_param_name.split('custom_ready_meta_');
                                   save_point_param_name_split_final = save_point_param_name_split[1];
                                   save_point_param_value = $(this).val();
                                   save_point_data_attr = save_point_data_attr + 'data_point_parameter_'+save_point_param_name_split_final+'="'+save_point_param_value+'"';
                              }
                         });
                         var save_point_final_image = '<img src="'+save_point_img_src+'" style="position:absolute; left:'+save_point_img_left+'; top:'+save_point_img_top+';" '+save_point_data_attr+'/>';
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos="'+save_point_img_pos+'"]').remove();
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').append(save_point_final_image);
                         crm_nested_dynamic_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                         
                    }
               });   

               $('.crm_dynamic_nested_field_box').on('click', '.crm_imagemap_creator .crm_image_map_point_fields .crm_image_map_delete_point', function(e){  
                    e.preventDefault();
                    if ($(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').length == 1) {
                         var image_map_array_textarea = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_array');
                         var save_point_img = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img');
                         var save_point_img_pos = save_point_img.attr('data_point_pos');    
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_show_points').find('img[data_point_pos="'+save_point_img_pos+'"]').remove();                     
                         crm_nested_dynamic_update_image_map_array(image_map_array_textarea);
                         $(this).closest('.crm_imagemap_creator').removeClass('dragging');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').html('');
                         $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields').html('');                           
                    }
               });                                                

               $('.crm_dynamic_nested_field_box .crm_imagemap_creator .crm_image_map_show_points').off();
               $('.crm_dynamic_nested_field_box').on('click', '.crm_imagemap_creator .crm_image_map_show_points img[data_point_pos]', function(e){
                    e.preventDefault();      
                    $(this).addClass('selected');              
                    $(this).closest('.crm_imagemap_creator').addClass('dragging');
                    var container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_point_fields');   
                    container.closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');    
                    var add_point_container = $(this).closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper');   
                    $(this).clone().appendTo(add_point_container); 
                    container.html('');
                    var dynamicfields = JSON.parse($(this).closest('.crm_imagemap_creator').attr('data_dynamic_fields'));
                    $(this).closest('.crm_imagemap_creator').addClass('crm_fieldbox_loading');
                    var fieldboxname = $(this).closest('.crm_imagemap_creator').attr('data_original_name');                            
                    for (var i = 0; i < dynamicfields.length; i++) {
                         jQuery.post('/wp-admin/admin-ajax.php',{
                               action:'custom_ready_meta_options_createinput_dynamic',
                               dynamic_type:dynamicfields[i]['type'],
                               dynamic_name:dynamicfields[i]['name'],
                               dynamic_label:dynamicfields[i]['label'],
                               dynamic_instructions:dynamicfields[i]['instructions'],
                               dynamic_selections:dynamicfields[i]['selections'],
                               dynamic_attributes:dynamicfields[i]['attributes'],
                               async:false
                         },
                         function(response){
                              container.append(response);                          
                         });
                    }  
                    container.append('<div class="crm_image_map_change_point"><button class="crm_image_map_edit_point crm_bttn">Edit Point</button><button class="crm_image_map_delete_point crm_bttn">Delete Point</button></div>');  
                    container.append('<div class="crm_image_map_change_point_text">Drag point to preferred position, adjust fields associated to the point, and click "Edit Point" to update it.<br>Press "Delete Point" to remove it entirely.</div>');
                    container.closest('.crm_imagemap_creator').find('.crm_image_map_add_points_wrapper').find('img').draggable({ containment: 'parent' });
                    var edit_interval = setInterval(function(){
                         if (add_point_container.find('img').length == 1) {
                              var edit_image_check = '';
                              var edit_image = add_point_container.find('img');
                              edit_image.each(function(){                                                                      
                                   $.each($(this).get(0).attributes, function(i, attrib){                                        
                                        var name = attrib.name;
                                        var value = attrib.value;
                                        if (name.indexOf('data_point_parameter_') > -1) {
                                             edit_image_name_split = name.split('data_point_parameter_');
                                             //edit_image_name_split = save_point_param_name.split('custom_ready_meta_');
                                             edit_image_name_field = container.find('#custom_ready_meta_'+edit_image_name_split[1]);
                                             if (edit_image_name_field.val() != value) {
                                                  edit_image_name_field.val(value);
                                                  edit_image_check = 'false';
                                             }
                                        };
                                   });                                      
                              });                           
                              if (edit_image_check == '') {                                   
                                   container.closest('.crm_imagemap_creator').removeClass('crm_fieldbox_loading');
                                   clearInterval(edit_interval);
                              }
                         }
                    }, 1000);                                                       
               });
          }
     //End Functions For Create Meta - Imagemap For Nested Dynamic Fields

});

