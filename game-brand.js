/* Enter the first game screen: tap the splash, optional button, or data-splash-autoadvance (ms). */
(function () {
  function init() {
    var splash = document.getElementById("game-brand-splash");
    if (!splash) return;
    var btn = document.getElementById("game-brand-continue");
    var nextId = splash.getAttribute("data-next") || (btn && btn.getAttribute("data-next"));
    if (!nextId) return;
    var next = document.getElementById(nextId);
    if (!next) return;
    var t = null;
    function go() {
      if (!splash.classList.contains("active")) return;
      if (t) {
        clearTimeout(t);
        t = null;
      }
      splash.classList.remove("active");
      next.classList.add("active");
    }
    var auto = splash.getAttribute("data-splash-autoadvance");
    if (auto) {
      var ms = parseInt(auto, 10);
      if (Number.isFinite(ms) && ms > 0) {
        t = setTimeout(go, ms);
      }
    }
    function onSplashClick(e) {
      if (e.target.closest && e.target.closest("a[href]")) return;
      go();
    }
    splash.addEventListener("click", onSplashClick);
    splash.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        go();
      });
    }
    if (btn && btn.tagName === "BUTTON") {
      btn.setAttribute("type", "button");
    }
    if (splash.getAttribute("tabindex") == null) {
      splash.setAttribute("tabindex", "0");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
