/* globals $, svg, mock */
$(() => {
  const hovered = {
  	portrait: false,
  	projects: false,
  	contact: false,
  };
  
  $('#portrait').on('mouseenter', function() {
    if (!hovered.portrait) {
  	  $(this).animate({ height: '19vw', width: '19vw' }, 'fast', function() {
  	  	hovered.portrait = true;
  	  	if (!($(this).is(':hover'))) {
  	  	  $(this).animate({ height: '17vw', width: '17vw' }, 'fast');
  	  	  hovered.portrait = false;
  	  	}
  	  });
  	}
  });
  
  $('#portrait').on('mouseleave', function() {
    if (hovered.portrait) {
  	  $(this).animate({ height: '17vw', width: '17vw' }, 'fast', function() {
  	    hovered.portrait = false;
  	  });
  	}
  });
  
  $('#projects').on('mouseenter', function() {
    if (!hovered.projects) {
  	  $('.fa-pencil').animate({ fontSize: '11vw' });
  	  $(this).animate({ height: '16vw', width: '16vw' }, 'fast', function() {
  	  	hovered.projects = true;
  	  	if (!($(this).is(':hover'))) {
  	  	  $('.fa-pencil').animate({ fontSize: '9vw' });
  	  	  $(this).animate({ height: '14vw', width: '14vw' }, 'fast');
  	  	  hovered.projects = false;
  	  	}
  	  });
  	}
  });
  
  $('#projects').on('mouseleave', function() {
    if (hovered.projects) {
  	  $('.fa-pencil').animate({ fontSize: '9vw' });
  	  $(this).animate({ height: '14vw', width: '14vw' }, 'fast', function() {
  	  	hovered.projects = false;
  	  });
  	}
  });
  
  $('#contact').on('mouseenter', function() {
    if (!hovered.contact) {
  	  $('.fa-address-book').animate({ fontSize: '9.5vw', paddingTop: '2.9vw' });
  	  $(this).animate({ height: '16vw', width: '16vw' }, 'fast', function() {
  	  	hovered.contact = true;
  	  	if (!($(this).is(':hover'))) {
  	  	  $('.fa-address-book').animate({ fontSize: '8.5vw', paddingTop: '2.35vw' });
  	  	  $(this).animate({ height: '14vw', width: '14vw' }, 'fast');
  	  	  hovered.contact = false;
  	  	}
  	  });
  	}
  });
  
  $('#contact').on('mouseleave', function() {
     if (hovered.contact) {
  	  $('.fa-address-book').animate({ fontSize: '8.5vw', paddingTop: '2.35vw' });
  	  $(this).animate({ height: '14vw', width: '14vw' }, 'fast', function() {
  	  	hovered.contact = false;
  	  });
  	}
  });

  svg.init('.svg-container');
  window.onresize = () => svg.resize();
  
  mock.init();
  
  // var header = $('header');
  // var range = 250;

  // $(window).on('scroll', function () {
    
  //   var scrollTop = $(this).scrollTop(),
  //       height = header.outerHeight(),
  //       offset = height / 2,
  //       calc = 1 - (scrollTop - offset + range) / range;
  
  //   header.css({ 'opacity': calc });
  
  //   if (calc > '1') {
  //     header.css({ 'opacity': 1 });
  //   } else if ( calc < '0' ) {
  //     header.css({ 'opacity': 0 });
  //   }
  // });
  
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
});
