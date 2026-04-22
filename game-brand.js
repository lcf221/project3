/* Tap anywhere (or the Continue button) on the splash to enter the first game screen. */
(function () {
  function init() {
    var splash = document.getElementById("game-brand-splash");
    if (!splash) return;
    var btn = document.getElementById("game-brand-continue");
    var nextId = splash.getAttribute("data-next") || (btn && btn.getAttribute("data-next"));
    if (!nextId) return;
    var next = document.getElementById(nextId);
    if (!next) return;
    function go() {
      if (!splash.classList.contains("active")) return;
      splash.classList.remove("active");
      next.classList.add("active");
    }
    splash.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest('a[href]')) return;
      go();
    });
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
