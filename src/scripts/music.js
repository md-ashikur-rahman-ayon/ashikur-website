// The jazz record: one engine for the whole visit, so the music keeps playing between pages.
var ctx = null, master = null, timer = null, playing = false, step = 0, nextT = 0, userMuted = false, everRan = false;
  var BPM = 66, beat = 60 / BPM;
// ii-V-I-vi in D flat, voiced like a quiet electric piano
var mtof = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
var chords = [[63, 66, 70, 73], [56, 60, 63, 66], [61, 65, 68, 72], [58, 61, 65, 68]];
var roots = [39, 44, 37, 46];
var walk = [[39, 42, 46, 44], [44, 48, 51, 49], [37, 41, 44, 42], [46, 49, 53, 51]];
function noiseBuf(sec) {
  var b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0);
  for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function crackle() {
  var len = 4, b = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate), d = b.getChannelData(0);
  for (var i = 0; i < d.length; i++) {
    d[i] = (Math.random() * 2 - 1) * 0.012;
    if (Math.random() < 0.0004) d[i] += (Math.random() * 2 - 1) * 0.5;
  }
  var s = ctx.createBufferSource(); s.buffer = b; s.loop = true;
  var f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 900;
  var g = ctx.createGain(); g.gain.value = 0.5;
  s.connect(f); f.connect(g); g.connect(master); s.start();
}
function epiano(m, t, dur, v) {
  var o = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = mtof(m);
  mod.frequency.value = mtof(m) * 1; mg.gain.setValueAtTime(mtof(m) * 0.9, t); mg.gain.exponentialRampToValueAtTime(mtof(m) * 0.05, t + 1.2);
  mod.connect(mg); mg.connect(o.frequency);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); mod.start(t); o.stop(t + dur + 0.05); mod.stop(t + dur + 0.05);
}
function bass(m, t, dur) {
  var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  o.type = 'triangle'; o.frequency.value = mtof(m);
  f.type = 'lowpass'; f.frequency.value = 420;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function brush(t, v, len) {
  var s = ctx.createBufferSource(); s.buffer = noiseBuf(len + 0.05);
  var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 5200; f.Q.value = 0.6;
  var g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + len * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + len + 0.05);
}
function schedule() {
  while (nextT < ctx.currentTime + 0.3) {
    var bar = Math.floor(step / 4) % 4, b = step % 4, t = nextT;
    var swing = (b % 2 === 1) ? beat * 0.08 : 0;
    bass(walk[bar][b], t, beat * 0.9);
    brush(t, b % 2 ? 0.05 : 0.03, beat * 0.55);
    if (b === 1 || b === 3) brush(t + beat * 0.66, 0.02, beat * 0.25);
    if (b === 0) chords[bar].forEach(function (m, j) { epiano(m, t + j * 0.012, beat * 3.2, 0.055); });
    if (b === 2 && bar % 2 === 1) chords[bar].slice(1).forEach(function (m, j) { epiano(m + 12, t + beat * 0.66 + swing + j * 0.01, beat * 1.2, 0.028); });
    nextT += beat; step++;
  }
}

function sync() {
  // the button always shows what you actually hear, not what we hoped would happen
  var on = isOn();
  var btn = document.getElementById('rec'), pg = document.querySelector('.pg');
  if (btn) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? 'Pause the music' : 'Play the music'); }
  if (pg) pg.classList.toggle('paused', !on);
}
function isOn() { return !!(playing && ctx && ctx.state === 'running'); }
function build() {
  if (ctx) return true;
  var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = 0;
  var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3800;
  master.connect(lp); lp.connect(ctx.destination); crackle();
  ctx.onstatechange = sync;
  return true;
}
function begin() {
  if (playing) return;
  nextT = ctx.currentTime + 0.1;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.setTargetAtTime(0.55, ctx.currentTime, 0.6);
  clearInterval(timer); timer = setInterval(schedule, 80); playing = true;
}
function start() {
  if (!build()) return;
  var p = ctx.resume();
  var go = function () { if (ctx.state === 'running') { begin(); everRan = true; } sync(); };
  if (p && p.then) p.then(go, sync); else go();
}
function stop(keepIntent) {
  clearInterval(timer); timer = null; playing = false;
  if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, keepIntent ? 0.05 : 0.35);
    var c = ctx; setTimeout(function () { if (!playing && c.state === 'running') c.suspend().then(sync, sync); }, keepIntent ? 120 : 1200);
  }
  sync();
}
window.__ashikAudioResume = function () { userMuted = false; start(); };

// Browsers keep sound off until the visitor first taps, clicks or presses a key.
// The first such action anywhere on the site starts the record (unless they have paused it themselves).
var unlock = function (e) {
  var btn = document.getElementById('rec');
  if (btn && e && e.target && btn.contains(e.target)) return; // the button handles itself
  if (userMuted || isOn()) return;
  start();
};
['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (n) { document.addEventListener(n, unlock, { capture: true, passive: true }); });

// Leaving the tab, locking the phone or closing the browser pauses the music; coming back picks it up again.
var pausedByHiding = false;
var hide = function () { if (isOn() || playing) { pausedByHiding = true; stop(true); } };
var show = function () { if (pausedByHiding && !userMuted) { pausedByHiding = false; start(); } };
document.addEventListener('visibilitychange', function () { if (document.hidden) hide(); else show(); });
window.addEventListener('pagehide', hide);
window.addEventListener('blur', function () { if (document.hidden) hide(); });

var bound = new WeakSet();
export function bindMusic() {
  var btn = document.getElementById('rec');
  if (!btn) return;
  if (!bound.has(btn)) {
    bound.add(btn);
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isOn()) { userMuted = true; stop(); } else { userMuted = false; pausedByHiding = false; start(); }
    });
  }
  sync();
}
