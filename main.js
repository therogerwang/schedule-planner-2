//for treeview collapsing

(function ($) {
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
        
        
    

    //Fetc
   
                
})(jQuery);

$(document).ready(function(){ //start jquery
    
    
    
const proxyurl = "https://cors-anywhere.herokuapp.com/"; // to avoid cors access issues

fetch(proxyurl + "https://courses.rice.edu/courses/!SWKSCAT.info?action=SUBJECTS&year=2020", {"credentials":"omit","headers":{"accept":"application/xml, text/xml, */*; q=0.01","accept-language":"en-US,en;q=0.9","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"},"referrer":"https://courses.rice.edu/courses/!SWKSCAT.info?action=SUBJECTS&year=2020","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
.then((resp) => resp.text()) // Transform the data into text
.then(xmlString => $.parseXML(xmlString))
.then(function(data) {

    // console.log(data);
    
    var $data = $(data);
    var $course = $data.find("SUBJECT");
    $course.each(function() {
        var code = $(this).find('VAL').text();
        $("#subj_select").append('<option value="1">' + code + '</option>');
        console.log(code);
    });
});

$("#retrieveBtn").click(function(){
        
        var subj = $("#subj_select option:selected").text();
        
        fetch(proxyurl + "http://courses.rice.edu/admweb/!SWKSECX.main?term=202020&subj=" + subj)
            .then((resp) => resp.text())
            .then(x => console.log(x));
        
        
      });


// fetch(proxyurl+ "https://courses.rice.edu/courses/!SWKSCAT.info?action=SUBJECTS&year=2020", {"credentials":"omit","headers":{"accept":"application/xml, text/xml, */*; q=0.01","accept-language":"en-US,en;q=0.9","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"},"referrer":"https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=cata","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})

}); // end jquery