/* 마우스 포인터를 따라다니는 이음유니언 로고.
   마우스를 쓰는 기기에서만 켜지고, 움직임 줄이기 설정을 켠 사용자에게는 표시하지 않습니다.
   기본 커서는 그대로 두고 로고가 살짝 뒤따라옵니다. 링크·버튼 위에서는 커집니다. */
(function () {
  if (!window.matchMedia || !matchMedia('(pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var src = (document.currentScript && document.currentScript.dataset.logo) || 'assets/ieu-logo-96.png';
  var el = document.createElement('img');
  el.src = src;
  el.alt = '';
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = [
    'position:fixed', 'left:0', 'top:0', 'width:30px', 'height:auto', 'z-index:9999',
    'pointer-events:none', 'opacity:0', 'will-change:transform',
    'filter:drop-shadow(0 4px 10px rgba(25,195,255,.55))',
    'transition:opacity .25s, width .25s'
  ].join(';');
  document.body.appendChild(el);

  var x = -100, y = -100, cx = -100, cy = -100, angle = 0, shown = false;
  var OFFSET = 14; // 커서 오른쪽 아래로 살짝 띄움

  document.addEventListener('mousemove', function (e) {
    x = e.clientX; y = e.clientY;
    if (!shown) { cx = x; cy = y; el.style.opacity = '1'; shown = true; }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { el.style.opacity = '0'; shown = false; });
  document.addEventListener('mouseover', function (e) {
    var hot = e.target.closest && e.target.closest('a, button, label, [role=button]');
    el.style.width = hot ? '44px' : '30px';
  });

  (function tick() {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    angle += 1.2;
    el.style.transform = 'translate(' + (cx + OFFSET) + 'px,' + (cy + OFFSET) + 'px) rotate(' + angle + 'deg)';
    requestAnimationFrame(tick);
  })();
})();
