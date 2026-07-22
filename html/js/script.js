/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Author URI: https://themeforest.net/user/askbootstrap
Version: 1.0
*/

/*
-- Navbar
-- OTP Countdown
-- Shop Category
-- Popular Products
-- Coupons
-- Cold Drinks
-- Top Picks
-- Product Detail
*/

(function($) {
  "use strict"; // Start of use strict

  // Navbar
  if ($(".dropdown-menu a.dropdown-toggle").length && $(".dropdown-menu a.dropdown-toggle").on("click", (function(e) {
          return $(this).next().hasClass("show") || $(this).parents(".dropdown-menu").first().find(".show").removeClass("show"), $(this).next(".dropdown-menu").toggleClass("show"), $(this).parents("li.nav-item.dropdown.show").on("hidden.bs.dropdown", (function(e) {
              $(".dropdown-submenu .show").removeClass("show")
          })), !1
      })), $('[data-bs-toggle="tooltip"]').length)[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map((function(e) {
      return new bootstrap.Tooltip(e)
  }));

  // OTP Countdown
  function countdown() {
      var timerEl = document.getElementById("timer");
      if (!timerEl) return;
      var timeleft = 60;
      var countdownTimer = setInterval(function() {
          timeleft--;
          timerEl.textContent = timeleft;
          if (timeleft <= 0) {
              clearInterval(countdownTimer);
              setTimeout(countdown, 1000);
          }
      }, 1000);
  }
  countdown();

  // Shop Category
  $(window).on('load', function() {
      $('.shop-category').slick({
          infinite: true,
          slidesToShow: 10,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          prevArrow: "<i class='lni lni-chevron-left osahan-arrow osahan-left'></i>",
          nextArrow: "<i class='lni lni-chevron-right osahan-arrow osahan-right'></i>",
          responsive: [{
                  breakpoint: 1024,
                  settings: {
                      slidesToShow: 6,
                      slidesToScroll: 1,
                      infinite: true,
                  }
              },
              {
                  breakpoint: 600,
                  settings: {
                      slidesToShow: 4.1,
                      slidesToScroll: 1
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      slidesToShow: 4.1,
                      slidesToScroll: 1
                  }
              }
          ]
      });
      $('.shop-category').fadeIn();
  });


  // Hero Slider Homepage
  $(window).on('load', function() {
      $('.hero-slider').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          autoplay: true

      });
      $('.hero-slider').fadeIn();
  });

  // Popular Products
  $(window).on('load', function() {
      $('.popular-products').slick({
          infinite: true,
          slidesToShow: 6,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          prevArrow: "<i class='lni lni-chevron-left osahan-arrow osahan-left'></i>",
          nextArrow: "<i class='lni lni-chevron-right osahan-arrow osahan-right'></i>",
          responsive: [{
                  breakpoint: 1024,
                  settings: {
                      slidesToShow: 3,
                      slidesToScroll: 1,
                      infinite: true,
                  }
              },
              {
                  breakpoint: 600,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1
                  }
              }
          ]
      });
      $('.popular-products').fadeIn();
  });

  // Coupons
  $(window).on('load', function() {
      $('.coupons').slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 2,
          arrows: true,
          autoplay: true,
          prevArrow: "<i class='lni lni-chevron-left osahan-arrow osahan-left'></i>",
          nextArrow: "<i class='lni lni-chevron-right osahan-arrow osahan-right'></i>",
          responsive: [{
                  breakpoint: 1024,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      infinite: true,
                  }
              },
              {
                  breakpoint: 600,
                  settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1
                  }
              }
          ]
      });
      $('.coupons').fadeIn();
  });

  // Cold Drinks
  $(window).on('load', function() {
      $('.cold-drinks').slick({
          infinite: true,
          slidesToShow: 6,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          prevArrow: "<i class='lni lni-chevron-left osahan-arrow osahan-left'></i>",
          nextArrow: "<i class='lni lni-chevron-right osahan-arrow osahan-right'></i>",
          responsive: [{
                  breakpoint: 1024,
                  settings: {
                      slidesToShow: 4,
                      slidesToScroll: 1,
                      infinite: true,
                  }
              },
              {
                  breakpoint: 600,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1
                  }
              }
          ]
      });
      $('.cold-drinks').fadeIn();
  });

  // Top Picks
  $(window).on('load', function() {
      $('.top-picks').slick({
          infinite: true,
          slidesToShow: 6,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          prevArrow: "<i class='lni lni-chevron-left osahan-arrow osahan-left'></i>",
          nextArrow: "<i class='lni lni-chevron-right osahan-arrow osahan-right'></i>",
          responsive: [{
                  breakpoint: 1024,
                  settings: {
                      slidesToShow: 4,
                      slidesToScroll: 1,
                      infinite: true,
                  }
              },
              {
                  breakpoint: 600,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1
                  }
              }
          ]
      });
      $('.top-picks').fadeIn();
  });

  // Product Detail
  $(window).on('load', function() {
      $('.big-img').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          arrows: true,
          prevArrow: "<i class='lni lni-chevron-left osahan-arrow osahan-left'></i>",
          nextArrow: "<i class='lni lni-chevron-right osahan-arrow osahan-right'></i>",
          fade: true,
          asNavFor: '.small-img'
      });
      $('.big-img').fadeIn();
  });

  $(window).on('load', function() {
      $('.small-img').slick({
          slidesToShow: 5,
          slidesToScroll: 1,
          centerMode: true,
          infinite: true,
          asNavFor: '.big-img',
          autoplay: true,
          prevArrow: "<i class='lni lni-chevron-left osahan-arrow osahan-left'></i>",
          nextArrow: "<i class='lni lni-chevron-right osahan-arrow osahan-right'></i>",
          arrows: true,
          focusOnSelect: true,
          responsive: [{
                  breakpoint: 1024,
                  settings: {
                      slidesToShow: 4,
                      slidesToScroll: 1,
                      infinite: true,
                  }
              },
              {
                  breakpoint: 600,
                  settings: {
                      slidesToShow: 4,
                      slidesToScroll: 1
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      slidesToShow: 3,
                      slidesToScroll: 1
                  }
              }
          ]
      });
      $('.small-img').fadeIn();
  });

})(jQuery);