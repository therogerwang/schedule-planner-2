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
})(jQuery);