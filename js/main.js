/* Nav toggle, gallery lightbox, email assembly. Nothing else. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* Email assembly: the address never appears as a mailto: string in the static HTML. */
  var address = 'zeiter.farah' + '@' + 'gmail.com';
  document.querySelectorAll('[data-email]').forEach(function (el) {
    var a = document.createElement('a');
    a.href = 'mailto:' + address;
    a.textContent = el.getAttribute('data-email-label') || address;
    el.replaceWith(a);
  });

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var mq = window.matchMedia('(max-width: 40rem)');
    var sync = function () {
      nav.hidden = mq.matches && toggle.getAttribute('aria-expanded') !== 'true';
    };
    toggle.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
      sync();
    });
    mq.addEventListener('change', sync);
    sync();
  }

  /* Gallery lightbox: <dialog> gives Esc-to-close and focus trapping natively. */
  var dialog = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (dialog && items.length && typeof dialog.showModal === 'function') {
    var img = dialog.querySelector('img');
    var caption = dialog.querySelector('.lightbox-caption');
    var current = 0;
    var show = function (i) {
      current = (i + items.length) % items.length;
      var thumb = items[current].querySelector('img');
      img.src = items[current].getAttribute('data-full') || thumb.src;
      img.alt = thumb.alt;
      caption.textContent = thumb.alt;
    };
    items.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); dialog.showModal(); });
    });
    dialog.querySelector('[data-prev]').addEventListener('click', function () { show(current - 1); });
    dialog.querySelector('[data-next]').addEventListener('click', function () { show(current + 1); });
    dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    dialog.addEventListener('close', function () { items[current].focus(); });
  }
})();
