
$(document).ready(function(){ //start jquery
    
    //Initialize variables
    const Dexie = require('dexie');
    var db = new Dexie("courses_database");
    db.version(1).stores({
        courses: 'crn,subject,distribution'
    });
    const TERM = 202020;
    
    
    
    
    //get storage location               TODO: Remove this
    const remote = require('electron').remote;
    const app = remote.app;
    console.log(app.getPath('userData'));
    
    //Error handling
    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    
    // Enables tree nav to be collapsed
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
    
    //Initial Fetch for all courses 
    function fetchAllCoursesAndStoreInDataBase() {
        fetch("http://courses.rice.edu/admweb/!SWKSECX.main?term=202020")
        .then(handleErrors)
        .then((resp) => resp.text()) // Transform the data into text
        .then(xmlString => $.parseXML(xmlString))
        .then(function(data) {
            // console.log(data);
            
            var $data = $(data);
            var $course = $data.find("course");
            
            
            //open transaction, read-write to update any old entries
            db.transaction('rw', db.courses, () => {
                
                //refresh all courses
                db.courses.clear().then(function() {
                    $course.each(function() {
                    
                        var SUBJ = $(this).find("subject").text();
                        var NUMB = $(this).find("course-number").text();
                        var TITLE = $(this).find("title").text();
                        var CRN = $(this).find("crn").text();
                        var INSTRUCTOR = $(this).find("instructor").text();
                        var DESCRIPTION = $(this).find("description").text();
                        var CREDIT_HRS = $(this).find("credit-hours").text();
                        var PREREQS = $(this).find("pre-requisites").text();
                        var DISTRIBUTION = $(this).find("distribution-group").text();
                        
                        
                        
                        var courseObj = {
                            crn: CRN,
                            subject : SUBJ,
                            number : NUMB,
                            title : TITLE,
                            instructor : INSTRUCTOR,
                            description : DESCRIPTION,
                            distribution : DISTRIBUTION,
                            prereqs : PREREQS 
                        };
                        
                        
                        db.courses.put(courseObj);
                        
                        
                        
                    });
                });

            });
            
            
        });
    }
    
    
    fetchAllCoursesAndStoreInDataBase();
    // db.courses.clear();
    
    
    
    // Get available subjects
    db.courses.orderBy('subject').uniqueKeys(function(subj_codes) {
        
        subj_codes.forEach(function(code) {
            $("#subj_select").append('<option value="1">' + code + '</option>');
        });
    })



//Retrive Courses Button Fetch Call
$("#retrieveBtn").click(function(){
        
        //empty already retrieved courses
        $("#categories_layer").empty();
    
        var subj = $("#subj_select option:selected").text();
        var dist = $("#dist_select option:selected").val();
        
        
        var queryObj = {};
        
        if (subj != "Subject") {
            queryObj.subject = subj;
        }
        
        if (dist != "not_selected") {
            queryObj.distribution = dist;
        }
        
        //nothing selected
        if (queryObj == {}) {
            return;
        }
        
        db.courses.where(queryObj).toArray().then(function(retrievedCoursesArray) {
            
            //sort by subject first, then number
            retrievedCoursesArray.sort(function(a, b) {
                
                var comparison = a.subject.localeCompare(b.subject);
                if (comparison !== 0) {
                    return comparison;
                }
                return a.number.localeCompare(b.number);
            });
            
            //load each course into html tree nav
            retrievedCoursesArray.forEach(courseObj => {
                console.log(courseObj);
                
                
                //each course
                
                var SUBJ = courseObj.subject;
                var NUMB = courseObj.number;
                var TITLE = courseObj.title;
                var CRN = courseObj.crn;
                var INSTRUCTOR = courseObj.instructor;
                var DESCRIPTION = courseObj.description;
                var CREDIT_HRS = "[TODO: add this]";
                var PREREQS = courseObj.prereqs;
                
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
            
            //add animation to newly added html elements
            tree_collapse();
            
        });
        
        
      });



}); // end jquery