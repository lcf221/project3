(function () {
  var roots = document.querySelectorAll("#games .coaster-root:not(.coaster-mini)");
  if (!roots.length) return;

  function pointOnRailAtX(rail, targetX) {
    var len = rail.getTotalLength();
    if (!len) return { x: targetX, y: 0 };
    var lo = 0;
    var hi = len;
    var i;
    for (i = 0; i < 48; i += 1) {
      var mid = (lo + hi) / 2;
      var p = rail.getPointAtLength(mid);
      if (p.x < targetX) lo = mid;
      else hi = mid;
    }
    return rail.getPointAtLength((lo + hi) / 2);
  }

  var SUPPORT_PALETTE = ["#7fd6ff", "#b2d16d", "#ffa500"];

  function buildCoasterSupports() {
    var groundY = 104;
    roots.forEach(function (root) {
      var rail = root.querySelector(".coaster-rail-path");
      var group = root.querySelector(".coaster-supports");
      if (!rail || !group || group.getAttribute("data-supports-ok") === "1") return;
      if (!rail.getTotalLength()) return;
      var x;
      var idx = 0;
      for (x = 20; x <= 380; x += 28) {
        var p = pointOnRailAtX(rail, x);
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p.x);
        line.setAttribute("y1", p.y);
        line.setAttribute("x2", p.x);
        line.setAttribute("y2", groundY);
        line.setAttribute("stroke-width", "8");
        line.setAttribute("stroke", SUPPORT_PALETTE[idx % 3]);
        line.setAttribute("stroke-opacity", "0.92");
        group.appendChild(line);
        idx += 1;
      }
      group.setAttribute("data-supports-ok", "1");
    });
  }

  function readState() {
    var end = parseInt(sessionStorage.getItem("line-laughs-line-end") || "0", 10);
    var total = parseInt(sessionStorage.getItem("line-laughs-total-sec") || "0", 10);
    var now = Date.now();
    var rem = end > 0 && total > 0 ? Math.max(0, Math.ceil((end - now) / 1000)) : 0;
    var lineComplete = end > 0 && total > 0 && rem <= 0;
    return { end: end, total: total, rem: rem, lineComplete: lineComplete };
  }

  function coasterProgress(state) {
    if (state.lineComplete) return 1;
    if (state.total <= 0 || state.end <= 0) return 0;
    var t = 1 - (state.end - Date.now()) / (state.total * 1000);
    return Math.min(1, Math.max(0, t));
  }

  function updateCoasters() {
    var state = readState();
    var pTimer = coasterProgress(state);
    roots.forEach(function (root) {
      var mode = root.getAttribute("data-coaster-mode");
      var progress = mode === "timer" ? pTimer : 0;
      var rail = root.querySelector(".coaster-rail-path");
      var car = root.querySelector(".coaster-car");
      var body = root.querySelector(".coaster-car-body");
      if (!rail || !car) return;
      var len = rail.getTotalLength();
      if (!len) return;
      var dist = progress * len;
      var pt = rail.getPointAtLength(dist);
      var ahead = Math.min(dist + 4, len);
      var pt2 = rail.getPointAtLength(ahead);
      var ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
      var lift = 9;
      car.setAttribute(
        "transform",
        "translate(" + pt.x + "," + pt.y + ") rotate(" + ang + ") translate(0," + -lift + ")"
      );
      if (body) {
        var bobSec;
        if (state.lineComplete) {
          bobSec = 2.85;
        } else if (state.total > 0 && state.end > 0 && state.rem > 0) {
          var fracRem = Math.max(0, (state.end - Date.now()) / (state.total * 1000));
          bobSec = Math.max(0.42, 0.48 + fracRem * 2.35);
        } else {
          bobSec = 2.2;
        }
        body.style.animationDuration = bobSec + "s";
      }
    });
  }

  buildCoasterSupports();
  updateCoasters();
  requestAnimationFrame(function () {
    buildCoasterSupports();
    updateCoasters();
  });
  setInterval(updateCoasters, 200);
  window.addEventListener("storage", updateCoasters);
})();
