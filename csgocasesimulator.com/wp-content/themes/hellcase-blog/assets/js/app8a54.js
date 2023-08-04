jQuery(document).ready(function($) {
  $('#button-nav').on('click', function() {
    $(this).toggleClass('menu-opens');
    $('body').toggleClass('opened');
    $('html').toggleClass('ovh');
  })
  if ($('#cases_slider').length > 0) {
    var owl = $('#cases_slider');
    owl.owlCarousel({
      loop: true,
      center: true,
      items: 3,
      margin: 24,
      autoplay: false,
      touchDrag: false,
      pullDrag: false,
      smartSpeed: 1000,
      nav: true,
      rewind: false,
      // mouseDrag: false,
      navText: ['<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.5" y="0.5" width="63" height="63" rx="31.5" fill="#151419"/> <path d="M36 42.5599L27.3066 33.8666C26.28 32.8399 26.28 31.1599 27.3066 30.1333L36 21.4399" stroke="#F3F4F4" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> <rect x="0.5" y="0.5" width="63" height="63" rx="31.5" stroke="url(#paint0_linear_51_2365)"/> <defs> <linearGradient id="paint0_linear_51_2365" x1="47.5294" y1="32" x2="64" y2="32" gradientUnits="userSpaceOnUse"> <stop stop-color="#574AE2" stop-opacity="0"/> <stop offset="1" stop-color="#574AE2"/> </linearGradient></defs></svg>',
        '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.5" y="0.5" width="63" height="63" rx="31.5" fill="#151419"/> <path d="M27.8799 42.5599L36.5732 33.8666C37.5999 32.8399 37.5999 31.1599 36.5732 30.1333L27.8799 21.4399" stroke="#F3F4F4" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> <rect x="0.5" y="0.5" width="63" height="63" rx="31.5" stroke="url(#paint0_linear_51_2363)"/> <defs> <linearGradient id="paint0_linear_51_2363" x1="0" y1="32" x2="22.1176" y2="32" gradientUnits="userSpaceOnUse"> <stop stop-color="#574AE2"/> <stop offset="1" stop-color="#574AE2" stop-opacity="0"/> </linearGradient> </defs> </svg>'
      ],
      responsive: {
        0: {
          items: 1,
          dots: true,
          nav: false,
          margin: 0,
          touchDrag: true,
        },
        320: {
          items: 1,
          dots: true,
          touchDrag: true,
          nav: false,
          margin: 0,
        },
        768: {
          items: 2,
          margin: 12,
          dots: true,
          touchDrag: true,
          nav: false,
        },
        1170: {
          items: 3,
          nav: true,
        }
      }
    });
  } 
  let allCases,
      dropItems,
      itemWinned
  $.ajax({
    url: 'https://api.hellcase.com/api/v1/case_list_for_wp?token=ebp9wqnpb5gbh90uwqy7gigco8znel6x',
    method: 'get',       
    dataType: 'json',
    // headers: {
    //   'Origin': window.location.origin,
    // },
    success: function(data) { 
	     allCases = data.cases;
       dropItems = data.drop_items
       apiReady = true;
       $('.slider__item-open a').removeClass('button--disabled')
    }
  });
  var caseopen_default_sound = new Howl({
    src: '/wp-content/themes/hellcase-blog/assets/sounds/default-open.mp3',
    preload: false,
    volume: 1,
    sprite: {
      box: [0, 930],
      roulette: [930, 6100],
      finish: [7200, 8000]
    },
    html5: true,
  });
  function playSoundCaseopenDefault(name) {
    caseopen_default_sound.play(name)
  }
  const itemWidth = 208;
  let winningItemIndex = 34;
  const gap = 22;
  const winningItemCenterOffset = 0;
  let rouletteWidth = $(".roulette-wrapper").width();
  let rouletteOffset = 0;
  let timeout = null;
  let timeoutSound = null;
  let caseName = '';
  let incr = 1;
  let apiReady = false;
  $('.slider__item-open a').addClass('button--disabled');
  function winningItemOffset() {
    return rouletteOffset = ((itemWidth + gap) * (winningItemIndex-1 + winningItemCenterOffset + 0.5) - rouletteWidth / 2) - gap / 2
  };
  Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  }
  function start(caseName, timeout_time) {
    $(".cases-slider").fadeOut(800,function() {
      $(`#case-${caseName}`).fadeIn();
      $(`#${caseName}`).fadeIn(800, function() {
        playSoundCaseopenDefault('roulette');
        rouletteWidth = $(`#${caseName} .roulette-wrapper`).width();
        winningItemOffset();
        $(`#${caseName} .roulette-wrapper`).animate({'left': `-${rouletteOffset}`}, 8000, 'easeOutExpo', function() {
          $(`#${caseName} .roulette__item:eq(32)`).addClass('semi-opacity');
          $(`#${caseName} .roulette__item:eq(31)`).addClass('opacity');
          $(`#${caseName} .roulette__item:eq(34)`).addClass('semi-opacity');
          $(`#${caseName} .roulette__item:eq(35)`).addClass('opacity');
          playSoundCaseopenDefault('finish');
          setTimeout(() => {
            $(`#case-${caseName}`).fadeOut(1000);
            $(`#${caseName}`).fadeOut(1000, function() {
              $('.section-win').fadeIn(1000)
            })
          }, 800);
        });
      });
    });
  }

  $.fn.moveDown = function() {
    $.each(this, function() {
         $(this).before($(this).next());   
    });
  };
  $('.slider__item-open a').on('click', function() {
    startRoulette($(this).parent().parent().find('input[type="hidden"').val(), 1)
    playSoundCaseopenDefault('box');
  });
   function startRoulette(currentCaseName, incrementer, timeout_time) {
    caseName = currentCaseName
    // caseName = $(this).parent().parent().find('input[type="hidden"').val()
    sessionStorage.setItem('caseName', caseName);

    if (incrementer >= 3) {
      $('#again_btn').hide();
      $('#go_case_btn').hide();
      $('#promo_btn').css('display','inline-flex');
      $('#get_without_btn').css('display','inline-flex');
    }
    let currentCase = allCases.filter(item=> item.name === caseName);
    let currentCasePrice = currentCase[0].case_price
    let possibleRewards = currentCase[0].case_items.filter(item => +item.steam_price_en > +currentCasePrice * incrementer)
    let choseForWin = possibleRewards.sort((a,b) => b.steam_price_en - a.steam_price_en).slice(0,5);
    if (caseName === 'revolution') {
      let randomIndex = Math.floor(Math.random() * 4)
      itemWinned = dropItems[caseName][randomIndex]
    } else {
      itemWinned = choseForWin.random()
    }
    // вставить выиграный айтем на 33 индекс в массив и вернуть его
    let element = $(`.roulette__item:contains(${itemWinned.skin_name})`)[0]
    $(`#${caseName} .roulette-wrapper`).prepend(element)
    $(`#${caseName} .roulette__item:eq(0)`).insertAfter(`#${caseName} .roulette__item:eq(33)`).addClass('winningItem');

    $('.case__info-name span').text(currentCase[0].casename)
    if (!itemWinned.steam_is_stattrak) {
      $('.is-stat-track').hide();
    }
    $('.win-drop').addClass(itemWinned.rarity)
    // if (caseName !== 'revolution') {
      $('#go_case_btn').attr('href', `${currentCase[0].url}?ref=SIMUL10ATE&utm_source=csgocasesimulator&utm_medium=referral&utm_campaign=csgocasesimulator_${caseName === 'dreams-and-nightmares' ? 'dreams' : caseName}&utm_content=10`)
      $('#get_without_btn').attr('href', `${currentCase[0].url}?utm_source=csgocasesimulator&utm_medium=referral&utm_campaign=csgocasesimulator_${caseName === 'dreams-and-nightmares' ? 'dreams' : caseName}&utm_content=3rdspin_getskins`)
      $('#promo_btn').attr('href', `${currentCase[0].url}?ref=SIMUL15ATE&utm_source=csgocasesimulator&utm_medium=referral&utm_campaign=csgocasesimulator_${caseName === 'dreams-and-nightmares' ? 'dreams' : caseName}&utm_content=15`)
    // }
    $('.win-drop__left img').attr('src', `${itemWinned.steam_image}`)
    $('.case__info-image img').attr('src', `${currentCase[0].icon_case_url}.png`);
    $('.drop__weapon-skin h3').text(itemWinned.skin_name)
    $('.drop-name span').text(itemWinned.weapon_name)
    $('.drop__weapon-exterior h6').text(itemWinned.steam_short_exterior)
    start(caseName, 6600);
  };
  $(`.skip`).on('click', function(event) {
    caseopen_default_sound.stop();
    $(`#${caseName} .roulette-wrapper`).stop();
    $(`#${caseName} .roulette-wrapper`).dequeue().animate({'left': `-${rouletteOffset}`}, 1200, 'easeOutExpo', function(){
      $(`#${caseName} .roulette__item:eq(32)`).addClass('semi-opacity');
      $(`#${caseName} .roulette__item:eq(31)`).addClass('opacity');
      $(`#${caseName} .roulette__item:eq(34)`).addClass('semi-opacity');
      $(`#${caseName} .roulette__item:eq(35)`).addClass('opacity');
      playSoundCaseopenDefault('finish');
      setTimeout(() => {
        $(`#case-${caseName}`).fadeOut(1000);
        $(`#${caseName}`).fadeOut(1000, function(){
          $('.section-win').fadeIn(1000)
        })
      }, 800);
    });
  });
  $('#again_btn').on('click', function() {
    // $(`#${caseName} .roulette__item:eq(33)`).remove()
    $(`#${caseName} .roulette__item`).shuffle();
    $('.section-win').fadeOut();
    let currentCaseName = sessionStorage.getItem('caseName');
    $('.roulette-wrapper').css({'left': ''});
    $('.roulette__item').removeClass('opacity');
    $('.roulette__item').removeClass('semi-opacity');
    $('.roulette__item').removeClass('winningItem');
    incr++;
    startRoulette(currentCaseName, incr, 6700)
  });
  $('.tnp-submit').on('click', function(e){
    e.preventDefault();
    var email = $('.tnp-email').val();

    if (email=='') {
      $('.input-error').html(`<p class="error"> The email field must contain a valid email address </p>`).show()
      $('.tnp-email').css('border', '1px solid rgba(241, 81, 81, 1)')
    } else {
      $.ajax({
        type:"POST",
        url:"/?na=ajaxsub",
        data:$('.subscribe').serialize(),
        success: function (da) {
          $('.tnp-email').css('border-color', 'transparent');
          $('.input-error').html('');
          if(da=='already_confirmed'){ $('.news-success-msg').html('<p>You have already subscribed to newsletter.</p>').show();}
          else if(da=='Wrong email'){ 
            $('.tnp-email').css('border', '1px solid rgba(241, 81, 81, 1)')
            $('.news-success-msg').html('<p class="error">The e-mail entered is not valid. Please check and resubmit.</p>').show(); 
          }
          else { 
            $('.news-success-msg').html('<p>You have successfully subscribed to newsletter.</p>').show(); $('.tnp-email').val('');
            setTimeout(() => {
              $('.news-success-msg').html('').hide()
            }, 3000);
          }
      },
        error: function (request, status, error) {
            const errorMsg = $.parseHTML(request.responseText).filter(item => item.className === 'wp-die-message')
            $('.input-error').html(`<p class="error"> ${errorMsg[0].innerText} </p>`).show()
            $('.tnp-email').css('border', '1px solid rgba(241, 81, 81, 1)')
        }
    })
    }
  });

/*
* Shuffle jQuery array of elements - see Fisher-Yates algorithm
*/
jQuery.fn.shuffle = function () {
  var j;
  for (var i = 0; i < this.length; i++) {
      j = Math.floor(Math.random() * this.length);
      $(this[i]).before($(this[j]));
  }
  return this;
};
  $("#show_modal_btn").on('click',function(e) {
	  e.preventDefault();
    $('.modal-verlay').fadeIn();
    $('body').addClass('ovh');
    $('html').addClass('ovh');
    $('.modal-window').fadeIn();
  });
  $('#close_modal').on('click', function() {
    $('.modal-verlay').fadeOut();
    $('.modal-window').fadeOut();
    $('body').removeClass('ovh');
    $('html').removeClass('ovh');
  })
  $('#submit-button').on('click', function() {
    fbq('track', 'SubmitApplication');
  })
  $('#hero-button').on('click', function() {
    fbq('track', 'InitiateCheckout');
  })
  $('#subscribe-btn').on('click', function() {
    fbq('track', 'Subscribe', {value: '0.00', currency: 'USD', predicted_ltv: '0.00'});
  })
  $('#go_case_btn').on('click', function() {
    fbq('track', 'Lead');
  })
  $('#promo_btn').on('click', function() {
    fbq('track', 'Lead');
  })
  $('.wpcf7-validates-as-required').on('input', function() { 
    $(this).val($(this).val().replace(/^\s+/,""));
  })
  $('input[name="your-name"]').on('input', function() {
    $(this).val($(this).val().replace(/[^a-zA-Zа-яА-Я'`\-.\s]+/, ""))
  })
  $('.wpcf7-textarea').on('input', function() {
    $(this).val($(this).val().replace(/[^a-zA-Z0-9_\-\s]+/, ""))
  })
  $('.wpcf7-validates-as-email').on('input', function(e) {
    validateEmail($(this) ,'0-9a-zA-Z@._\-')
  })
  function validateEmail(element, regex) {
    regReplace = new RegExp(`[^${regex}]`, 'ig');
    element.val(element.val().replace(regReplace, ''));
  }
});