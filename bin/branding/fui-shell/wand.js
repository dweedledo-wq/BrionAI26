/* BrionAI26 — FUI-shell v2.1: foto-als-scherm + dunne live HUD-overlays.
 * Data: fui-data daemon op localhost:7633 (alleen lokaal, alles ECHT).
 * Alle elementen null-safe: ontbrekende HUD = gewoon geen update.
 */
"use strict";

const $ = (id) => document.getElementById(id);
const set = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };

/* ---- Klok (lokaal, altijd live zelfs zonder data-bus) ---- */
function klok() {
  const n = new Date();
  set("klok-tijd", n.toLocaleTimeString("nl-NL"));
  set("klok-datum", n.toLocaleDateString("nl-NL", {
    weekday: "long", day: "numeric", month: "long"
  }));
}
setInterval(klok, 1000); klok();

/* ---- Live data via fui-data (localhost:7633) ---- */
function led(el, niveau) {
  if (!el) return;
  el.classList.remove("warn", "crit");
  if (niveau === "warn") el.classList.add("warn");
  if (niveau === "crit") el.classList.add("crit");
}

function balk(el, pct, warn = 70, crit = 90) {
  if (!el) return;
  el.style.width = Math.min(100, pct) + "%";
  el.classList.remove("warn", "crit");
  if (pct >= crit) el.classList.add("crit");
  else if (pct >= warn) el.classList.add("warn");
}

function fmtBytes(b) {
  if (b > 1048576) return (b / 1048576).toFixed(1) + " MB/s";
  if (b > 1024) return (b / 1024).toFixed(0) + " kB/s";
  return b + " B/s";
}

async function haalData() {
  let d;
  try {
    const r = await fetch("http://localhost:7633/json", { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    d = await r.json();
  } catch {
    return;
  }

  if (d.cpu) {
    set("cpu-pct", d.cpu.pct.toFixed(0));
    balk($("cpu-balk"), d.cpu.pct);
    led($("led-cpu"), d.cpu.pct >= 90 ? "crit" : d.cpu.pct >= 70 ? "warn" : null);
    set("cpu-sub", "kernen: " + d.cpu.kernen);
  }
  if (d.ram) {
    set("ram-pct", d.ram.pct.toFixed(0));
    balk($("ram-balk"), d.ram.pct);
    led($("led-ram"), d.ram.pct >= 90 ? "crit" : d.ram.pct >= 80 ? "warn" : null);
    set("ram-sub", d.ram.gebruikt + " / " + d.ram.totaal + " GB");
  }
  if (d.disk) {
    set("disk-pct", d.disk.pct.toFixed(0));
    balk($("disk-balk"), d.disk.pct);
    led($("led-disk"), d.disk.pct >= 90 ? "crit" : d.disk.pct >= 75 ? "warn" : null);
    set("disk-sub", d.disk.gebruikt + " / " + d.totaal + " GB");
  }
  if (d.net) {
    set("net-down", fmtBytes(d.net.down));
    set("net-up", fmtBytes(d.net.up));
    set("net-if", "interfaces: " + d.net.interfaces);
    led($("led-net"), d.net.interfaces > 0 ? null : "warn");
  }
  if (d.tailscale) {
    set("ts-status", d.tailscale.state || "--");
    led($("led-ts"), d.tailscale.state === "running" ? null : "warn");
  }
  if (d.pm2) {
    set("pm2-online", d.pm2.online);
    led($("led-pm2"), d.pm2.online > 0 ? null : "warn");
  }
  if (d.sysdash) {
    set("sysdash-status", d.sysdash.bereikbaar ? "HUB ●" : "OFFLINE");
    led($("led-sysdash"), d.sysdash.bereikbaar ? null : "warn");
  }
  if (d.services) {
    led($("led-svc"), d.services.every((s) => s.ok) ? null : "warn");
  }
  if (d.uptime) {
    set("uptime", d.uptime);
    set("load-sub", "load: " + d.load);
  }
}
setInterval(haalData, 1000); haalData();

/* ---- B3: hover/klik-state-machine (SPB 3D shell-gevoel) ----
   IDLE -> muis erop >=200 ms -> EXPANDED (groot + gloed)
   EXPANDED -> muis eraf >=200 ms -> IDLE
   klik -> PINNED (blijft groot ook zonder muis; gouden rand)
   klik op andere tegel -> die PINNED, rest IDLE
   Esc of nogmaals klikken -> IDLE
   GPU-vrij: css-transforms + picom xrender. */
(function () {
  var timers = new WeakMap();
  var pinned = null;

  function naarVoren(el) {
    el.classList.add("expanded");
    el.classList.remove("idle");
  }

  function terug(el) {
    el.classList.remove("expanded");
    if (el !== pinned) el.classList.remove("pinned");
  }

  document.querySelectorAll(".hud, .tegel, .mini").forEach(function (el) {
    el.classList.add("idle");
    el.addEventListener("mouseenter", function () {
      var t = timers.get(el); if (t) clearTimeout(t);
      timers.set(el, setTimeout(function () { naarVoren(el); }, 200));
    });
    el.addEventListener("mouseleave", function () {
      var t = timers.get(el); if (t) clearTimeout(t);
      timers.set(el, setTimeout(function () { terug(el); }, 200));
    });
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      if (pinned === el) { pinned = null; terug(el); return; }
      if (pinned) { pinned.classList.remove("pinned", "expanded"); }
      pinned = el;
      el.classList.add("pinned");
      naarVoren(el);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".hud.pinned, .hud.expanded").forEach(function (el) {
        el.classList.remove("pinned", "expanded");
      });
      pinned = null;
    }
  });

  document.addEventListener("click", function () {
    if (pinned) { pinned.classList.remove("pinned", "expanded"); pinned = null; }
  });
})();
