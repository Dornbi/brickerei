// Click a gallery photo to view it large; arrows/swipe to browse, Esc to close.
(function () {
  var box = document.querySelector('.lightbox');
  if (!box) return;
  var img = box.querySelector('img'), cap = box.querySelector('.lb-cap');
  var items = [], i = 0, startX = null;

  function show(n) {
    i = (n + items.length) % items.length;
    img.src = items[i].href;
    var alt = items[i].querySelector('img').alt;
    img.alt = alt;
    cap.textContent = alt;
  }
  function close() { box.hidden = true; img.src = ''; }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('.gallery a[data-lightbox]');
    if (!a) return;
    e.preventDefault();
    items = Array.prototype.slice.call(a.closest('.gallery').querySelectorAll('a[data-lightbox]'));
    show(items.indexOf(a));
    box.hidden = false;
  });
  box.querySelector('.lb-close').onclick = close;
  box.querySelector('.lb-prev').onclick = function () { show(i - 1); };
  box.querySelector('.lb-next').onclick = function () { show(i + 1); };
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
    startX = null;
  });
})();
