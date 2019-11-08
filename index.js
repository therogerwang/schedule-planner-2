
//for treeview collapsing

// var tree_collapse = (function ($) {
//     let $allPanels = $('.nested').hide();
//     let $elements = $('.treeview-animated-element');

//     $('.closed').click(function () {
            
//         $this = $(this);
//         $target = $this.siblings('.nested');
//         $pointer = $this.children('.fa-angle-right');

//         $this.toggleClass('open')
//         $pointer.toggleClass('down');

//         !$target.hasClass('active') ? $target.addClass('active').slideDown() : 
//         $target.removeClass('active').slideUp();
        
//         return false;
//     });

//     $elements.click(function () {
            
//         $this = $(this);
        
//         if ($this.hasClass('opened')) {
//                 ($this.removeClass('opened'));
//         } else {
//                 ($elements.removeClass('opened'), $this.addClass('opened'));
//         }

//         })
        
        
    

//     //Fetc
   
                
// })(jQuery);


$(document).ready(function(){ //start jquery
    
    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    
    function tree_collapse() {
        let $allPanels = $('.nested').hide();
    let $elements = $('.treeview-animated-element');

    $('.closed').click(function () {
            
        $this = $(this);
        $target = $this.siblings('.nested');
        $pointer = $this.children('.fa-angle-right');

        $this.toggleClass('open')
        $pointer.toggleClass('down');

        !$target.hasClass('active') ? $target.addClass('active').slideDown() : 
        $target.removeClass('active').slideUp();
        
        return false;
    });

    $elements.click(function () {
            
        $this = $(this);
        
        if ($this.hasClass('opened')) {
                ($this.removeClass('opened'));
        } else {
                ($elements.removeClass('opened'), $this.addClass('opened'));
        }

        })
    }
    
    
    
    
    
    
    
// const proxyurl = "https://cors-anywhere.herokuapp.com/"; // to avoid cors access issues

fetch("https://courses.rice.edu/courses/!SWKSCAT.info?action=SUBJECTS&year=2020", {"credentials":"omit","headers":{"accept":"application/xml, text/xml, */*; q=0.01","accept-language":"en-US,en;q=0.9","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"},"referrer":"https://courses.rice.edu/courses/!SWKSCAT.info?action=SUBJECTS&year=2020","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
.then(handleErrors)
.then((resp) => resp.text()) // Transform the data into text
.then(xmlString => $.parseXML(xmlString))
.then(function(data) {

    console.log(data);
    
    var $data = $(data);
    var $course = $data.find("SUBJECT");
    $course.each(function() {
        var code = $(this).find('VAL').text();
        $("#subj_select").append('<option value="1">' + code + '</option>');
        // console.log(code);
    });
});


//Retrive Courses Button Fetch Call
$("#retrieveBtn").click(function(){
        
        //empty already retrieved courses
        $("#categories_layer").empty();
    
        var subj = $("#subj_select option:selected").text();
        
        fetch("https://courses.rice.edu/admweb/!SWKSECX.main?term=202020&subj=" + subj, {"credentials":"omit","headers":{"accept":"application/xml, text/xml, */*; q=0.01","accept-language":"en-US,en;q=0.9","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"}})
            .then(handleErrors)
            .catch(e => {
                console.log(e);
            })
            .then((resp) => resp.text())
            .then(xmlString => $.parseXML(xmlString))
            .then(function(data) {

                console.log(data);
                
                var $data = $(data);
                var $course = $data.find("course");
                $course.each(function() {
                    //each xml course
                    
                    var SUBJ = $(this).find("subject").text();
                    var NUMB = $(this).find("course-number").text();
                    var TITLE = $(this).find("title").text();
                    var CRN = $(this).find("crn").text();
                    var INSTRUCTOR = $(this).find("instructor").text();
                    var DESCRIPTION = $(this).find("description").text();
                    var CREDIT_HRS = $(this).find("credit-hours").text();
                    var PREREQS = $(this).find("pre-requisites").text();
                    
                    // console.log("NUMBER = " + NUMB)
                    
                    //check if subject category already exists in tree
                    if ($("#" + SUBJ + "_category").length) {
                        //already exists
                    } else {
                        //does not exist yet
                        $("#categories_layer").append(`
                        
                        <li class="treeview-animated-items">
                            <a class="closed">
                                <i class="fas fa-angle-right"></i>
                                <span>` + SUBJ+`</span>
                            </a>
                                <ul class="nested" id="` +SUBJ+`_category">
                                
                                </ul>
                        </li>
                        `);
                    }
                    
                    
                    
                    //check if course number already exists in category
                    if ($("#" + SUBJ + NUMB + "_course").length) {
                        //already exists
                    } else {
                        //does not exist yet
                        $("#" + SUBJ + "_category").append(`
                        
                        <li class="treeview-animated-items">
                            <a class="closed"><i class="fas fa-angle-right"></i>
                            <span>`+ NUMB +" - " +TITLE+`</span></a>
                            <ul class="nested" id="`+ SUBJ + NUMB +`_course">
                            
                            </ul>
                        </li>
                        `);
                    }
                
                    
                    //add sections with description
                    $("#" + SUBJ + NUMB + "_course").append(`
                        <li>
                        
                            <div class="treeview-animated-element"><a class="closed"><i class="far fa-circle ic-w mr-1"></i>
                            <span> `+CRN+ " - "
                            + INSTRUCTOR + `</span></a>
                            <ul class="nested"">
                            <li>`+DESCRIPTION+ 
                            "<br> Credit Hours: "+CREDIT_HRS +
                            "<br> Prerequisites: "+PREREQS+`</li>
                            </ul>
                        </li>
                        `);
                    
                    
                    // var code = $(this).find('VAL').text();
                    // $("#subj_select").append('<option value="1">' + code + '</option>');
                    // console.log(code);
                    
                    
                });
                
                
                tree_collapse();
                
            });
        
        
      });


// fetch(proxyurl+ "https://courses.rice.edu/courses/!SWKSCAT.info?action=SUBJECTS&year=2020", {"credentials":"omit","headers":{"accept":"application/xml, text/xml, */*; q=0.01","accept-language":"en-US,en;q=0.9","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"},"referrer":"https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=cata","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})

}); // end jquery