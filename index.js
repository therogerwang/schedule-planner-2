
//Initialize variables
const Dexie = require('dexie');
var db = new Dexie("courses_database");
db.version(1).stores({
    courses: 'crn,subject,distribution',
    schedule: 'crn'
});
const TERM = 202020;

// db.delete();


$(document).ready(function(){ //start jquery
    
    
    
    
    
    
    //get storage location               TODO: Remove this
    // const remote = require('electron').remote;
    // const app = remote.app;
    // console.log(app.getPath('userData'));
    
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
                        var START_TIMES = $(this).find("start-time").text();
                        var END_TIMES = $(this).find("end-time").text();
                        var MEET_DAYS = $(this).find("meeting-days").text();
                        
                        
                        var courseObj = {
                            crn: CRN,
                            subject : SUBJ,
                            number : NUMB,
                            title : TITLE,
                            instructor : INSTRUCTOR,
                            description : DESCRIPTION,
                            distribution : DISTRIBUTION,
                            prereqs : PREREQS,
                            credit_hrs: CREDIT_HRS,
                            start_times: START_TIMES,
                            end_times : END_TIMES,
                            meet_days : MEET_DAYS
                        };
                        
                        
                        db.courses.put(courseObj);
                        
                        
                        
                    });
                });

            });
            
            
        });
    }
    
    
    fetchAllCoursesAndStoreInDataBase();
    // db.courses.clear();
    
    // db.schedule.put()
    
    //Load/Fill in detailed schedule              
    //  TODO: make schedule only posses CRN objects and have it reference courses database.
    // This Way, the course enrollment actually gets updated
    db.schedule.each(function(courseObj) {
        
        console.log(courseObj);
        $('#detailed_tablebody').append(`
            <tr>
            <th scope="row">` + courseObj.crn + `</th>
            <td>`+ courseObj.subject + " " + courseObj.number+`</td>
            <td>` + courseObj.title + `</td>
            <td>` + courseObj.instructor + `</td>
            <td>` + courseObj.credit_hrs + `</td>
            <td>` + "TODO: meeting times" + `</td>
            <td>` + courseObj.prereqs + `</td>
            <td>` + "TODO: enrollment" + `</td>
            <td>` + "TODO: remove/show/hide" + `</td>
            </tr>
        `);
    });
    
    
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
                var CREDIT_HRS = courseObj.credit_hrs;
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
                    
                        <a class="closed"><i class="far fa-circle ic-w mr-1"></i>
                        <span> `+CRN+ " - "
                        + INSTRUCTOR + `</span> </a>
                        <ul class="nested"">
                        <li>`+DESCRIPTION+ 
                        "<br> Credit Hours: "+CREDIT_HRS +
                        "<br> Prerequisites: "+PREREQS+
                        "<br> <button type='button' val="+CRN+" id='"+CRN+"_addcourse' class='btn btn-primary btn-sm'> Add </button>" +
                        `</li>
                        </ul>
                    </li>
                    `);
                
                
                //add click event to the Add Button
                $("#"+CRN +"_addcourse").click(function() {
                    
                    db.schedule.put(courseObj);
                });
                    
                // var code = $(this).find('VAL').text();
                // $("#subj_select").append('<option value="1">' + code + '</option>');
                // console.log(code);
                
            });
            
            //add animation to newly added html elements
            tree_collapse();
            
            
            
        });
        
        
      });



}); // end jquery


//Full Calendar stuff
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'timeGrid', 'list', 'interaction' ],
      header: {
        left: '',
        center: 'title',
        right: 'timeGridWeek,listWeek'
      },
      aspectRatio: 2.4,
      defaultDate: '2019-08-12',
      defaultView: 'timeGridWeek',
      allDaySlot: false,
      columnHeaderText: function(date) {
        switch(date.getDay()) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return"Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
        }
      },
      minTime: "08:00:00",
      maxTime: "20:00:00",
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: [
        {
          title: 'All Day Event',
          start: '2019-08-01',
        },
        {
          title: 'Long Event',
          start: '2019-08-07',
          end: '2019-08-10'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2019-08-09T16:00:00'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2019-08-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2019-08-11',
          end: '2019-08-13'
        },
        {
          title: 'Meeting',
          start: '2019-08-12T10:30:00',
          end: '2019-08-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2019-08-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2019-08-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2019-08-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2019-08-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2019-08-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2019-08-28'
        }
      ]
    });

    calendar.render();
  });