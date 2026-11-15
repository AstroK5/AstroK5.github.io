// Twinkling starfield background. Static if the visitor prefers reduced motion.
(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  var canvas = document.getElementById("sky");
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [];
  var w = 0, h = 0, raf = 0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.min(260, Math.round((w * h) / 6000));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        base: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 1.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() < 0.15
      });
    }
    draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = still ? s.base : s.base + 0.3 * Math.sin(s.phase + (t / 1000) * s.speed);
      ctx.globalAlpha = Math.max(0.05, Math.min(1, a));
      ctx.fillStyle = s.warm ? "#ffd28a" : "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    draw(t);
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (still) return;
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(loop);
  });

  resize();
  if (!still) raf = requestAnimationFrame(loop);
})();
