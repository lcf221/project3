(function () {
  var STORAGE_END = "line-laughs-line-end";
  var STORAGE_TOTAL = "line-laughs-total-sec";
  var navTimer = document.getElementById("nav-timer");
  if (!navTimer) return;

  function formatTime(sec) {
    if (sec <= 0) return "0:00";
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function tick() {
    var end = parseInt(sessionStorage.getItem(STORAGE_END) || "0", 10);
    var total = parseInt(sessionStorage.getItem(STORAGE_TOTAL) || "0", 10);
    if (!end || !total) {
      navTimer.textContent = "—:—";
      return;
    }
    var rem = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    navTimer.textContent = formatTime(rem);
  }

  tick();
  setInterval(tick, 500);
})();
