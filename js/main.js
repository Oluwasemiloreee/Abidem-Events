(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    
})(jQuery);


});

// Get the navbar and the collapsible menu elements
const myNavbar = document.getElementById('myNavbar');
const navbarCollapse = document.getElementById('navbarCollapse');

// Add an event listener for when the collapse menu is about to be shown
navbarCollapse.addEventListener('show.bs.collapse', function () {
  // Add the background class (e.g., bg-dark, bg-primary, etc.) to the navbar
  myNavbar.classList.add('bg-warning'); 
});

// Add an event listener for when the collapse menu is about to be hidden
navbarCollapse.addEventListener('hide.bs.collapse', function () {
  // Remove the background class from the navbar
  myNavbar.classList.remove('bg-warning');
});
