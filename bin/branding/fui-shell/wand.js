/* BrionAI26 — FUI-shell v2 tegelwand (B1: statisch, B2: live data).
 * Data: fui-data daemon op localhost:7633 (alleen lokaal).
 * Hover/klik-state-machine: B3 — basis al aanwezig (pinned). */
"use strict";

const $ = (id) => document.getElementById(id);

/* ---- B3-kern: hover/klik-state-machine (200 ms debounce) ---- */
let pinnedTegel = null;

document.querySelectorAll(".tegel").forEach((tegel) => {
  tegel.addEventListener("click", () => {
    if (pinnedTegel === tegel) {
      tegel.classList.remove("pinned");
      pinnedTegel = null;
    } else {
      if (pinnedTegel) pinnedTegel.classList.remove("pinned");
      tegel.classList.add("pinned");
      pinnedTegel = tegel;
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".tegel.pinned").forEach((t) => t.classList.remove("pinned"));
    pinnedTegel = null;
  }
});

/* ---- Klok (lokaal, altijd live zelfs zonder data-bus) ---- */
function klok() {
  const n = new Date();
  $("klok-tijd").textContent = n.toLocaleTimeString("nl-NL");
  $("klok-datum").textContent = n.toLocaleDateString("nl-NL", {
    weekday: "long", day: "numeric", month: "long"
  });
}
setInterval(klok, 1000); klok();

/* ---- B2: live data via fui-data (localhost:7633) ---- */
const HIST = { cpu: [], net: [] };

function led(el, niveau) {
  if (!el) return;
  el.classList.remove("warn", "crit");
  if (niveau === "warn") el.classList.add("warn");
  if (niveau === "crit") el.classList.add("crit");
}

function balk(el, pct, warn = 70, crit = 90) {
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
    /* fui-data nog niet op — tegels houden '--' tot hij er is */
    return;
  }

  if (d.cpu) {
    $("cpu-pct").textContent = d.cpu.pct.toFixed(0);
    balk($("cpu-balk"), d.cpu.pct);
    led($("led-cpu"), d.cpu.pct >= 90 ? "crit" : d.cpu.pct >= 70 ? "warn" : null);
    $("cpu-sub").textContent = "kernen: " + d.cpu.kernen;
    HIST.cpu.push(d.cpu.pct); if (HIST.cpu.length > 60) HIST.cpu.shift();
  }
  if (d.ram) {
    $("ram-pct").textContent = d.ram.pct.toFixed(0);
    balk($("ram-balk"), d.ram.pct);
    led($("led-ram"), d.ram.pct >= 90 ? "crit" : d.ram.pct >= 80 ? "warn" : null);
    $("ram-sub").textContent = d.ram.gebruikt + " / " + d.ram.totaal + " GB";
  }
  if (d.disk) {
    $("disk-pct").textContent = d.disk.pct.toFixed(0);
    balk($("disk-balk"), d.disk.pct);
    led($("led-disk"), d.disk.pct >= 90 ? "crit" : d.disk.pct >= 75 ? "warn" : null);
    $("disk-sub").textContent = d.disk.gebruikt + " / " + d.disk.totaal + " GB";
  }
  if (d.net) {
    $("net-down").textContent = fmtBytes(d.net.down);
    $("net-up").textContent = fmtBytes(d.net.up);
    $("net-if").textContent = "interfaces: " + d.net.interfaces;
    led($("led-net"), d.net.interfaces > 0 ? null : "warn");
  }
  if (d.tailscale) {
    $("ts-status").textContent = d.tailscale.state || "--";
    $("ts-lijst").innerHTML = (d.tailscale.peers || [])
      .slice(0, 4).map((p) => '<span class="ok">●</span> ' + p).join("<br>") || "geen peers";
    led($("led-ts"), d.tailscale.state === "running" ? null : "warn");
  }
  if (d.pm2) {
    $("pm2-online").textContent = d.pm2.online;
    $("pm2-lijst").innerHTML = (d.pm2.processen || [])
      .slice(0, 4).map((p) => '<span class="ok">●</span> ' + p).join("<br>") || "geen processen";
    led($("led-pm2"), d.pm2.online > 0 ? null : "warn");
  }
  if (d.n8n) {
    $("n8n-status").textContent = d.n8n.status || "--";
    $("n8n-sub").textContent = "flows: " + (d.n8n.flows ?? "--");
    led($("led-n8n"), d.n8n.status === "up" ? null : "warn");
  }
  if (d.sysdash) {
    $("sysdash-status").textContent = d.sysdash.bereikbaar ? "HUB ●" : "OFFLINE";
    $("sysdash-sub").textContent = "status: " + (d.sysdash.bereikbaar ? "bereikbaar" : "fallback");
    led($("led-sysdash"), d.sysdash.bereikbaar ? null : "warn");
  }
  if (d.logs) {
    $("logs-tail").innerHTML = d.logs
      .slice(-6).map((l) => l.replace(/</g, "&lt;")).join("<br>");
  }
  if (d.services) {
    $("svc-lijst").innerHTML = d.services
      .slice(0, 6).map((s) =>
        '<span class="' + (s.ok ? "ok" : "") + '">' + (s.ok ? "●" : "○") + "</span> " + s.naam
      ).join("<br>");
    led($("led-svc"), d.services.every((s) => s.ok) ? null : "warn");
  }
  if (d.uptime) {
    $("uptime").textContent = d.uptime;
    $("load-sub").textContent = "load: " + d.load;
  }
}

setInterval(haalData, 1000); haalData();
