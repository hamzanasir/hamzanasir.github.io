/* globals Clipboard, $, svg, mock */
$(() => {
  new Clipboard('#email');
  $('[data-toggle="popover"]').popover();
  $('#email').on('mouseleave', function() {
    $('[data-toggle="popover"]').popover('hide');
  });

  svg.gas.init('.gas-svg');
  svg.reactor.init('.reactor-svg');
  svg.filter.init('.filter-svg');
  window.onresize = () => {
    svg.gas.resize();
    svg.reactor.resize();
    svg.filter.resize();
  };
  
  mock.init();
  
  var fadeStart=100, // 100px scroll or less will equiv to 1 opacity
      fadeUntil=300, // 200px scroll or more will equiv to 0 opacity
      fading = $('header');

  $(window).bind('scroll', function(){
      var offset = $(document).scrollTop(),
          opacity=0;
  
      if (offset <= fadeStart) {
        opacity=1;
      } else if (offset <= fadeUntil) {
        opacity = 1 - offset / fadeUntil;
      }

      fading.css('opacity',opacity);
  });
  
  $('#projects').click(function() {
    $('html,body').animate({
        scrollTop: $('#projects-header').position().top
    }, 1000 );
  });
  
  $('#contact').click(function() {
    $('html,body').animate({
        scrollTop: $('#contact-header').position().top
    }, 1000 );
  });
  
  $('#mobile-icons #projects').click(function() {
    $('html,body').animate({
        scrollTop: $('#projects-header').position().top
    }, 1000 );
  });
  
  $('#mobile-icons #contact').click(function() {
    $('html,body').animate({
        scrollTop: $('#contact-header').position().top
    }, 1000 );
  });
});
