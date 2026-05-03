(function(){
  'use strict';

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) entry.target.classList.add('vis');
    });
  },{threshold:.08});
  document.querySelectorAll('.fi').forEach(function(el){ io.observe(el); });

  function updateCountdown(){
    var now = new Date();
    var end = new Date(now);
    end.setHours(23,59,59,999);
    var d = end - now;
    document.getElementById('ch').textContent = String(Math.floor(d/36e5)).padStart(2,'0');
    document.getElementById('cm').textContent = String(Math.floor((d%36e5)/6e4)).padStart(2,'0');
    document.getElementById('cs').textContent = String(Math.floor((d%6e4)/1e3)).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown,1000);

  var stk = document.getElementById('stk');
  window.addEventListener('scroll', function(){
    stk.style.transform = window.scrollY > 500 ? 'translateY(0)' : 'translateY(100%)';
  });

  document.querySelectorAll('[data-track]').forEach(function(el){
    el.addEventListener('click', function(){
      var label = this.getAttribute('data-track');
      if(typeof fbq === 'function') fbq('track','InitiateCheckout',{content_name:'PFR-'+label});
      if(typeof clarity === 'function') clarity('set','cta',label);
    });
  });

  var fired = {};
  window.addEventListener('scroll', function(){
    var p = Math.round(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
    [25,50,75,100].forEach(function(m){
      if(p >= m && !fired[m]){
        fired[m] = 1;
        if(typeof fbq === 'function') fbq('trackCustom','ScrollDepth',{depth:m+'%'});
      }
    });
  });

  var slIdx = 0, slTotal = 3;
  function updateSlider(){
    document.getElementById('sliderTrack').style.transform = 'translateX(-' + (slIdx*100) + '%)';
    document.querySelectorAll('.sl-dot').forEach(function(d,i){ d.classList.toggle('active', i === slIdx); });
  }
  window.moveSlider = function(dir){ slIdx = (slIdx + dir + slTotal) % slTotal; updateSlider(); };
  window.goSlide = function(i){ slIdx = i; updateSlider(); };
  setInterval(function(){ window.moveSlider(1); }, 4000);

  window.addEventListener('load', function(){
    setTimeout(function(){
      var pixelId = (window.PFR_CONFIG && window.PFR_CONFIG.fbPixelId) || '';
      var clarityId = (window.PFR_CONFIG && window.PFR_CONFIG.clarityId) || '';
      if(pixelId){
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', pixelId);
        fbq('track','PageView');
      }
      if(clarityId){
        (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script', clarityId);
      }
    }, 1500);
  });
})();
