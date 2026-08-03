/* Static site enhancements: reveal-on-scroll + mobile nav */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // 1. Elements captured mid-animation keep inline opacity/transform. Reveal them on scroll.
    var hidden = [].slice.call(document.querySelectorAll('[style*="opacity"]')).filter(function (el) {
      var o = el.style.opacity;
      return o !== "" && parseFloat(o) < 0.05;
    });

    hidden.forEach(function (el) {
      el.style.transition = "opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)";
    });

    function show(el) {
      el.style.opacity = "1";
      if (el.style.transform) el.style.transform = "none";
      if (el.style.filter && el.style.filter.indexOf("blur") > -1) el.style.filter = "none";
      if (el.style.clipPath) el.style.clipPath = "none";
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
      hidden.forEach(function (el) { io.observe(el); });
    } else {
      hidden.forEach(show);
    }

    // 2. Mobile nav toggle
    var toggle = document.querySelector("[data-nav-toggle], header button");
    var panel = document.querySelector("[data-nav-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.getAttribute("data-open") === "true";
        panel.setAttribute("data-open", open ? "false" : "true");
        panel.style.display = open ? "none" : "block";
      });
    }

    // 3. Smooth in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var t = document.querySelector(a.getAttribute("href"));
        if (t) { ev.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
      });
    });
  });

})();
/* ==========================================
   Custom Cursor (Restored)
========================================== */

function initCursor() {
  var cursorDot = document.querySelector(".cursor-dot");
  var cursorRing = document.querySelector(".cursor-ring");

  if (!cursorDot || !cursorRing) return;
  if (!window.matchMedia || !window.matchMedia("(pointer:fine)").matches) {
    cursorDot.style.display = "none";
    cursorRing.style.display = "none";
    return;
  }

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;
  var dotScale = 1;
  var ringScale = 1;
  var active = false;

  function updateCursor() {
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
    cursorDot.style.transform =
      "translate3d(" + mouseX + "px," + mouseY + "px,0) translate(-50%,-50%) scale(" + dotScale + ")";
    cursorRing.style.transform =
      "translate3d(" + ringX + "px," + ringY + "px,0) translate(-50%,-50%) scale(" + ringScale + ")";
  }

  function animate() {
    if (!active) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
    }
    updateCursor();
    requestAnimationFrame(animate);
  }

  function onPointerMove(e) {
    active = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onPointerLeave() {
    active = false;
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("mousedown", function () {
    dotScale = 0.75;
    ringScale = 0.9;
    updateCursor();
  });

  window.addEventListener("mouseup", function () {
    dotScale = 1;
    ringScale = 1;
    updateCursor();
  });

  var hoverTargets = document.querySelectorAll(
    "a, button, input, textarea, select, label, [role='button'], .cursor-hover-target"
  );

  hoverTargets.forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      document.body.classList.add("cursor-hover");
    });

    el.addEventListener("mouseleave", function () {
      document.body.classList.remove("cursor-hover");
    });
  });

  updateCursor();
  animate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCursor);
} else {
  initCursor();
}