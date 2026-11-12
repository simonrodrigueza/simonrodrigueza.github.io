// ─────────────────────────────────────────────────────────────
//  Detector animado: una nube de gas que colapsa en un disco
//  protoplanetario a medida que se baja por la página. Se dibuja
//  como una imagen de detector (píxeles + mapa de color) y la
//  "exposición" aumenta con el scroll. El nombre vive en la esquina
//  y se deshace alrededor del cursor.
// ─────────────────────────────────────────────────────────────

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const sm = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function lut(stops) {
  const cs = stops.map(rgb), out = new Float32Array(768), n = cs.length - 1;
  for (let i = 0; i < 256; i++) {
    const u = (i / 255) * n, k = Math.min(n - 1, Math.floor(u)), f = u - k;
    for (let c = 0; c < 3; c++) out[i * 3 + c] = cs[k][c] + (cs[k + 1][c] - cs[k][c]) * f;
  }
  return out;
}

// Campo de estrellas para la última etapa: posiciones fijas (semilla) y brillos con ley de potencias
function buildField(n) {
  let seed = 29;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = 0.06 + 0.86 * rnd(), y = 0.1 + 0.8 * rnd();
    if (Math.abs(x - 0.52) < 0.09 && Math.abs(y - 0.46) < 0.09) continue; // deja libre el sistema central
    out.push({ x, y, b: 0.25 + 1.6 * Math.pow(rnd(), 6) });
  }
  return out;
}

function buildParticles(n) {
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = 0.35 + 10.2 * Math.pow(rnd(), 1.25);
    const g = (rnd() + rnd() + rnd() - 1.5) * 0.8;
    const u = rnd(), v = rnd(), rc = 11 * Math.cbrt(rnd());
    const th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1);
    out.push({
      r, th: rnd() * Math.PI * 2, z: g * 0.05 * Math.pow(r, 1.25), w: 0.5 + 1.2 * Math.max(0, 1 - r / 6) + rnd() * 0.3, ph: rnd(),
      cx: rc * Math.sin(ph) * Math.cos(th), cy: rc * Math.sin(ph) * Math.sin(th), cz: rc * Math.cos(ph) * 0.8, delay: rc / 11,
    });
  }
  return out;
}

export class Detector {
  constructor(canvas, { stages, nameLines, lang }) {
    this.canvas = canvas;
    this.stages = stages;
    this.nameLines = nameLines;
    this.lang = lang;
    this.luts = stages.map((s) => lut(s.stops));
    this.Lbuf = new Float32Array(768);
    this.S = 0;
    this.Starget = 0;
    this.mouse = { x: -999, y: -999, on: false };
    this.my = 0.5;
    this.nameExp = 0;
    this.ray = null;
    this.planets = [{ r: 4.8, th: 0.6 }, { r: 7.05, th: 3.4 }];
    this.field = buildField(90);
    this.target = { x: 0.7, y: 0.25 }; // estrella marcada como el próximo objetivo
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 760 && (navigator.hardwareConcurrency || 8) <= 4;
    this.parts = buildParticles(small ? 2400 : window.innerWidth < 760 ? 3000 : 4200);
    this.enabled = true;
    this.visible = true;
    this.running = false;
    this.runUntil = 0;

    this.frame = (t) => {
      this.draw(t);
      if (this.shouldRun(t)) this.raf = requestAnimationFrame(this.frame);
      else this.running = false;
    };

    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
      this.mouse.on = true;
      this.my = this.mouse.y / Math.max(r.height, 1);
      this.wake(400);
    };
    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('pointerdown', onPointer);
    canvas.addEventListener('pointerleave', () => { this.mouse.on = false; this.wake(800); });

    new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; if (this.visible) this.start(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.start(); });

    const ready = () => { this.fontsReady = true; this.nameDirty = true; this.wake(2000); };
    if (document.fonts && document.fonts.load) document.fonts.load("600 20px 'Lexend'").then(ready, ready);
    else ready();
    setTimeout(ready, 2000);

    this.last = performance.now();
    this.t0 = this.last;
    this.wake(2500);
  }

  shouldRun(t) {
    if (!this.enabled || !this.visible || document.hidden) return false;
    if (this.reduced) return t < this.runUntil;
    return true;
  }
  start() {
    if (this.running || !this.enabled) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }
  wake(ms) {
    this.runUntil = Math.max(this.runUntil, performance.now() + ms);
    this.start();
  }
  enable(on) {
    this.enabled = on;
    if (on) this.wake(1500);
  }
  setStage(S) {
    if (Math.abs(S - this.Starget) > 1e-4) {
      this.Starget = S;
      this.wake(1500);
    }
  }

  buildNameText(W, H, dpr, narrow) {
    const lines = this.nameLines;
    const font = (s) => `600 ${s}px 'Lexend', system-ui, sans-serif`;
    const meas = document.createElement('canvas').getContext('2d');
    let fs = narrow ? 30 : 52;
    meas.font = font(fs);
    const widest = () => Math.max(...lines.map((l) => meas.measureText(l).width));
    let tw = widest();
    const maxW = W * (narrow ? 0.62 : 0.5);
    if (tw > maxW) { fs = Math.floor((fs * maxW) / tw); meas.font = font(fs); tw = widest(); }
    const pad = 40, lh = Math.round(fs);
    const bw = Math.ceil(tw + pad * 2), bh = Math.ceil(lh * (lines.length - 1) + fs * 1.2 + pad * 2);
    const mk = () => { const c = document.createElement('canvas'); c.width = Math.ceil(bw * dpr); c.height = Math.ceil(bh * dpr); return c; };
    const mask = mk(), col = mk(), warp = mk();
    const mx = mask.getContext('2d', { willReadFrequently: true });
    mx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mx.font = font(fs); mx.fillStyle = '#fff'; mx.textBaseline = 'alphabetic';
    lines.forEach((l, i) => mx.fillText(l, pad, pad + fs * 0.9 + lh * i));

    const cell = 3, MW = mask.width, MH = mask.height, img = mx.getImageData(0, 0, MW, MH).data;
    const hxs = [], hys = [];
    for (let yy = 0; yy < bh; yy += cell) for (let xx = 0; xx < bw; xx += cell) {
      let hit = false;
      for (let sy = 0; sy < 3 && !hit; sy++) for (let sx = 0; sx < 3 && !hit; sx++) {
        const X = Math.min(MW - 1, Math.floor((xx + ((sx + 0.5) * cell) / 3) * dpr));
        const Y = Math.min(MH - 1, Math.floor((yy + ((sy + 0.5) * cell) / 3) * dpr));
        if (img[(Y * MW + X) * 4 + 3] > 10) hit = true;
      }
      if (hit) { hxs.push(xx + cell / 2); hys.push(yy + cell / 2); }
    }
    const n = hxs.length;
    const F = { n, hx: new Float32Array(hxs), hy: new Float32Array(hys), px: new Float32Array(hxs), py: new Float32Array(hys), vx: new Float32Array(n), vy: new Float32Array(n), j: new Float32Array(n) };
    for (let z = 0; z < n; z++) F.j[z] = Math.random() * 2 - 1;
    const m = narrow ? 10 : 18;
    this.nm = { mask, col, cctx: col.getContext('2d'), warp, wctx: warp.getContext('2d'), bw, bh, pad, tw, fs, dpr, frag: F, cell,
      x: m + (narrow ? 6 : 18) - pad, y: H - m - (narrow ? 12 : 22) - bh + pad };
    if (!this.reduced) this.scatterReq = true;
  }

  drawName(ctx, L, time, acc) {
    const nm = this.nm;
    if (!nm) return;
    const e = this.nameExp, ee = e * e * (3 - 2 * e), dpr = nm.dpr;
    const cw = nm.col.width, ch = nm.col.height, cx = nm.cctx, wx = nm.wctx;

    cx.globalCompositeOperation = 'source-over';
    cx.clearRect(0, 0, cw, ch);
    cx.drawImage(nm.mask, 0, 0);
    cx.globalCompositeOperation = 'source-in';
    const gr = cx.createLinearGradient(nm.pad * dpr, 0, (nm.pad + nm.tw) * dpr, ch * 0.6);
    for (let k = 0; k <= 6; k++) {
      const u = k / 6, idx = Math.round(130 + 125 * (0.5 + 0.5 * Math.sin(2 * Math.PI * (u * 0.9 - time * 0.12)))) * 3;
      gr.addColorStop(u, `rgb(${L[idx] | 0},${L[idx + 1] | 0},${L[idx + 2] | 0})`);
    }
    cx.fillStyle = gr; cx.fillRect(0, 0, cw, ch);
    cx.globalCompositeOperation = 'source-over';

    const F = nm.frag, n = F.n, cell = nm.cell, mo = this.mouse;
    if (this.scatterReq) {
      for (let s = 0; s < n; s++) {
        const a = Math.random() * Math.PI * 2, rr = 30 + Math.random() * 110;
        F.px[s] = F.hx[s] + Math.cos(a) * rr; F.py[s] = F.hy[s] + Math.sin(a) * rr; F.vx[s] = 0; F.vy[s] = 0;
      }
      this.scatterReq = false;
    }
    const R = nm.fs * 0.75;
    const interactive = mo.on && !this.reduced;
    const mx = interactive ? mo.x - nm.x : -9999, my = interactive ? mo.y - nm.y : -9999;
    const moved = [];
    for (let i = 0; i < n; i++) {
      const hx = F.hx[i], hy = F.hy[i];
      let tx = hx, ty = hy;
      const ddx = hx - mx, ddy = hy - my, d2 = ddx * ddx + ddy * ddy;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) + 0.001, ring = R + F.j[i] * 9 + 2.5 * Math.sin(time * 4 + i * 0.7);
        tx = mx + (ddx / d) * ring; ty = my + (ddy / d) * ring;
      }
      F.vx[i] = (F.vx[i] + (tx - F.px[i]) * 0.14) * 0.74;
      F.vy[i] = (F.vy[i] + (ty - F.py[i]) * 0.14) * 0.74;
      F.px[i] += F.vx[i]; F.py[i] += F.vy[i];
      const ox = F.px[i] - hx, oy = F.py[i] - hy;
      if (ox * ox + oy * oy > 0.25) moved.push(i);
      else { F.px[i] = hx; F.py[i] = hy; }
    }

    wx.globalCompositeOperation = 'source-over';
    wx.clearRect(0, 0, cw, ch);
    wx.drawImage(nm.mask, 0, 0);
    const cd = cell * dpr, half = cell / 2;
    if (moved.length) {
      wx.globalCompositeOperation = 'destination-out';
      wx.fillStyle = '#000';
      for (const q of moved) wx.fillRect((F.hx[q] - half) * dpr, (F.hy[q] - half) * dpr, cd, cd);
      wx.globalCompositeOperation = 'source-over';
    }

    ctx.save();
    const vx = nm.x + nm.bw * 0.4, vy = nm.y + nm.bh * 0.55, vr = nm.bw * 0.6;
    const vg = ctx.createRadialGradient(vx, vy, 0, vx, vy, vr);
    vg.addColorStop(0, 'rgba(0,0,0,0.5)'); vg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = vg; ctx.fillRect(vx - vr, vy - vr, vr * 2, vr * 2);
    ctx.globalAlpha = 0.25 + 0.75 * ee;
    ctx.shadowColor = acc(0.55); ctx.shadowBlur = 22;
    ctx.drawImage(nm.warp, nm.x, nm.y, nm.bw, nm.bh);
    ctx.shadowBlur = 0;
    for (const q of moved) {
      ctx.drawImage(nm.col, (F.hx[q] - half) * dpr, (F.hy[q] - half) * dpr, cd, cd, nm.x + F.px[q] - half, nm.y + F.py[q] - half, cell, cell);
    }
    ctx.restore();
    if (moved.length) this.runUntil = Math.max(this.runUntil, performance.now() + 300);
  }

  draw(t) {
    const c = this.canvas;
    const W = c.clientWidth, H = c.clientHeight;
    if (!W || !H) return;
    const narrow = W < 600;
    const pix = narrow ? 4 : 5;
    const gw = Math.ceil(W / pix), gh = Math.ceil(H / pix);
    if (!this.buf || this.gw !== gw || this.gh !== gh) {
      this.gw = gw; this.gh = gh; this.pix = pix; this.buf = new Float32Array(gw * gh);
      this.off = document.createElement('canvas'); this.off.width = gw; this.off.height = gh;
      this.octx = this.off.getContext('2d'); this.img = this.octx.createImageData(gw, gh);
      this.nameDirty = true;
    }
    const dpr = window.devicePixelRatio || 1;
    if (this.nameDirty && this.fontsReady) { this.buildNameText(W, H, dpr, narrow); this.nameDirty = false; }
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    const dt = Math.min(0.05, (t - this.last) / 1000); this.last = t;
    const time = (t - this.t0) / 1000;
    this.nameExp = Math.min(1, this.nameExp + dt / 1.4);

    // etapa actual (continua) y mezcla entre la etapa i0 y la siguiente
    this.S += (this.Starget - this.S) * (this.reduced ? 1 : Math.min(1, dt * 2.2));
    const S = this.S, st = this.stages;
    const i0 = Math.min(st.length - 1, Math.floor(S)), i1 = Math.min(st.length - 1, i0 + 1), f = Math.min(1, S - i0);
    const La = this.luts[i0], Lb = this.luts[i1], L = this.Lbuf;
    for (let q = 0; q < 768; q++) L[q] = La[q] + (Lb[q] - La[q]) * f;
    const ca = rgb(st[i0].color), cb = rgb(st[i1].color);
    const A = [ca[0] + (cb[0] - ca[0]) * f, ca[1] + (cb[1] - ca[1]) * f, ca[2] + (cb[2] - ca[2]) * f];
    const acc = (al) => `rgba(${A[0] | 0},${A[1] | 0},${A[2] | 0},${al})`;
    const zoom = st[i0].zoom + (st[i1].zoom - st[i0].zoom) * f;
    const incD = st[i0].inc + (st[i1].inc - st[i0].inc) * f + (this.reduced ? 0 : (this.my - 0.5) * 14);

    // cada proceso ocupa una ventana amplia del scroll y se solapa con el siguiente
    const e = sm(0, 2.2, S), texp = Math.pow(10, 3.556 * e);
    const noise = 0.34 * (1 - e) + 0.04, gain = 0.35 + 0.65 * e, decay = 0.42 + 0.33 * e;
    const collapse = Math.min(1, Math.max(0, S / 1.3));
    const gapG = sm(1.0, 2.6, S), planetsP = sm(2.1, 3.5, S), trunc = sm(3.2, 4.8, S), dissip = sm(4.1, 5.0, S);
    const wind = sm(3.1, 4.3, S) * (1 - 0.8 * sm(4.4, 5.0, S));
    const star = sm(0.5, 1.3, S) + 0.9 * Math.exp(-Math.pow((S - 1.05) / 0.18, 2));
    const far = st.length > 6 ? sm(5.0, 5.9, S) : 0; // etapa VII: nos alejamos y aparece el campo de estrellas

    const buf = this.buf, N = gw * gh;
    for (let k = 0; k < N; k++) buf[k] = buf[k] * decay + Math.random() * noise;
    const add = (xx, yy, v) => { xx |= 0; yy |= 0; if (xx >= 0 && yy >= 0 && xx < gw && yy < gh) buf[yy * gw + xx] += v; };

    const cx = (W * 0.52) / pix, cy = (H * 0.46) / pix;
    const s = ((Math.min(W, H * 1.5) / 24) * zoom) / pix;
    const inc = (incD * Math.PI) / 180, ci = Math.cos(inc), si = Math.sin(inc);
    const phi = time * 0.05, rcut = 11 - 4.5 * trunc, spin = this.reduced ? 0 : dt;
    for (const p of this.parts) {
      const cc = sm(0, 1, (collapse - 0.35 * p.delay) / 0.65);
      p.th += 0.55 * Math.pow(p.r, -1.5) * spin * (0.08 + 0.92 * cc);
      const dx = p.r * Math.cos(p.th), dy = p.r * Math.sin(p.th);
      const a = phi + cc * 2.2, cA = Math.cos(a), sA = Math.sin(a);
      const qx = p.cx * cA - p.cy * sA, qy = p.cx * sA + p.cy * cA, qz = p.cz;
      const x = qx + (dx - qx) * cc, y = qy + (dy - qy) * cc, z = qz + (p.z - qz) * cc;
      let X = cx + s * x, Y = cy + s * (y * ci - z * si);
      let w = p.w * 0.8 * gain * (0.55 + 0.45 * cc);
      if (gapG > 0) {
        const r = p.r;
        if ((r > 4.35 && r < 5.2) || (r > 6.7 && r < 7.4)) w *= 1 - 0.95 * gapG;
        else if ((r > 3.8 && r <= 4.35) || (r >= 5.2 && r < 5.8) || (r >= 7.4 && r < 8.0)) w *= 1 + 1.1 * gapG;
        else w *= 1 - 0.25 * gapG;
      }
      if (wind > 0.02 && p.r > 6.5) {
        const off = (time * 0.12 + p.ph) % 1, push = wind * Math.pow((p.r - 6.5) / 4, 1.2) * off;
        X -= push * s * 9; Y += push * s * 1.3 * (y > 0 ? 1 : -1); w *= 1 - off * 0.8;
      } else if (p.r > rcut) w *= 0.15;
      w *= (1 - 0.88 * dissip) * (1 - 0.97 * far);
      add(X, Y, w);
    }

    if (planetsP > 0.01) {
      for (const pl of this.planets) {
        pl.th += 0.55 * Math.pow(pl.r, -1.5) * spin;
        const PX = cx + s * pl.r * Math.cos(pl.th), PY = cy + s * pl.r * Math.sin(pl.th) * ci;
        const pw = 2.4 * planetsP * (1 - 0.35 * far), pr = 1.6 * (1 - 0.6 * far);
        for (let py = -3; py <= 3; py++) for (let px = -3; px <= 3; px++) add(PX + px, PY + py, pw * Math.exp(-(px * px + py * py) / pr));
      }
    }
    if (star > 0.01) {
      const core = Math.max(1.5, s * 0.05);
      for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) add(cx + dx, cy + dy, 3 * star * Math.exp(-(dx * dx + dy * dy) / (2 * core * core)));
      const spikeLen = (narrow ? 34 : 56) * (1 - 0.45 * far);
      for (let a6 = 0; a6 < 6; a6++) {
        const ang = (a6 * Math.PI) / 3 + Math.PI / 2, cg = Math.cos(ang), sg = Math.sin(ang);
        for (let r2 = 2; r2 < spikeLen; r2++) add(cx + cg * r2, cy + sg * r2, (0.9 * Math.min(star, 1.6)) / (1 + r2 * 0.12));
      }
    }
    if (wind > 0.02) {
      const ox = gw * 0.88, oy = gh * 0.14;
      for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) add(ox + dx, oy + dy, 3 * wind * Math.exp(-(dx * dx + dy * dy) / 4));
      for (let a2 = 0; a2 < 6; a2++) { const an = (a2 * Math.PI) / 3 + Math.PI / 2; for (let r4 = 2; r4 < 30; r4++) add(ox + Math.cos(an) * r4, oy + Math.sin(an) * r4, (wind * 0.8) / (1 + r4 * 0.15)); }
    }
    if (far > 0.01) {
      const psf = (x0, y0, b, spikes) => {
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) add(x0 + dx, y0 + dy, b * Math.exp(-(dx * dx + dy * dy) / 1.1));
        if (spikes) for (let a7 = 0; a7 < 6; a7++) {
          const an = (a7 * Math.PI) / 3 + Math.PI / 2;
          for (let r7 = 2; r7 < spikes; r7++) add(x0 + Math.cos(an) * r7, y0 + Math.sin(an) * r7, (b * 0.18) / (1 + r7 * 0.35));
        }
      };
      for (const fs of this.field) psf(fs.x * gw, fs.y * gh, 0.32 * fs.b * far, fs.b > 1.3 ? (narrow ? 6 : 9) : 0);
      psf(this.target.x * gw, this.target.y * gh, 1.8 * far, narrow ? 10 : 15);
    }
    if (!this.reduced) {
      if (!this.ray && Math.random() < dt * (0.2 + 0.8 * e)) this.ray = { x: Math.random() * gw, y: Math.random() * gh * 0.6, a: Math.random() * Math.PI, len: 3 + Math.random() * 6, life: 1 };
      if (this.ray) {
        for (let r5 = 0; r5 < this.ray.len; r5++) add(this.ray.x + Math.cos(this.ray.a) * r5, this.ray.y + Math.sin(this.ray.a) * r5, 4 * this.ray.life);
        this.ray.life -= dt * 1.5;
        if (this.ray.life <= 0) this.ray = null;
      }
    }

    const data = this.img.data, kk = 8, norm = Math.log(1 + kk * 4);
    for (let j = 0; j < N; j++) {
      const v = Math.log(1 + kk * buf[j]) / norm;
      const li = (v >= 1 ? 255 : (v * 255) | 0) * 3, o = j * 4;
      data[o] = L[li]; data[o + 1] = L[li + 1]; data[o + 2] = L[li + 2]; data[o + 3] = 255;
    }
    this.octx.putImageData(this.img, 0, 0);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.off, 0, 0, gw * pix, gh * pix);

    // marco con reglas, barra de color y textos
    const m = narrow ? 10 : 18, fw = W - 2 * m, fh = H - 2 * m, step = narrow ? 20 : 24;
    ctx.strokeStyle = 'rgba(236,232,223,0.28)'; ctx.lineWidth = 1;
    ctx.strokeRect(m + 0.5, m + 0.5, fw - 1, fh - 1);
    ctx.beginPath();
    for (let tx = 0; tx <= fw; tx += step) {
      const len = tx % (step * 8) === 0 ? 8 : 4;
      ctx.moveTo(m + tx + 0.5, m); ctx.lineTo(m + tx + 0.5, m + len); ctx.moveTo(m + tx + 0.5, m + fh); ctx.lineTo(m + tx + 0.5, m + fh - len);
    }
    for (let ty = 0; ty <= fh; ty += step) {
      const len = ty % (step * 6) === 0 ? 8 : 4;
      ctx.moveTo(m, m + ty + 0.5); ctx.lineTo(m + len, m + ty + 0.5); ctx.moveTo(m + fw, m + ty + 0.5); ctx.lineTo(m + fw - len, m + ty + 0.5);
    }
    ctx.stroke();

    const cbx = W - m - (narrow ? 20 : 28), cbt = m + 26, cbb = H - m - (narrow ? 30 : 64), cbh = cbb - cbt;
    if (cbh > 60) {
      for (let yy = 0; yy < cbh; yy++) {
        const li2 = Math.floor((1 - yy / cbh) * 255) * 3;
        ctx.fillStyle = `rgb(${L[li2] | 0},${L[li2 + 1] | 0},${L[li2 + 2] | 0})`;
        ctx.fillRect(cbx, cbt + yy, 7, 1);
      }
      ctx.strokeStyle = 'rgba(236,232,223,0.5)'; ctx.strokeRect(cbx - 0.5, cbt - 0.5, 8, cbh + 1);
    }

    const stg = st[Math.min(st.length - 1, Math.floor(S + 0.5))];
    const word = this.lang === 'es' ? 'ETAPA' : 'STAGE';
    ctx.textAlign = 'left'; ctx.fillStyle = acc(0.95);
    ctx.font = `500 ${narrow ? 9 : 10}px 'Martian Mono', monospace`;
    const head = `${word} ${stg.roman}`.toUpperCase();
    ctx.fillText(head, m + 12, m + 20);
    const hw = ctx.measureText(head).width;
    ctx.fillStyle = 'rgba(236,232,223,0.85)';
    ctx.fillText(stg.name[this.lang].toUpperCase(), m + 12 + hw + 14, m + 20);
    ctx.fillStyle = 'rgba(236,232,223,0.85)';
    ctx.font = `400 ${narrow ? 9 : 10}px 'Martian Mono', monospace`;
    const tf = texp < 10 ? texp.toFixed(1) : String(Math.round(texp));
    ctx.fillText(`t_exp = ${tf} s   S/N ≈ ${Math.round(1 + Math.sqrt(texp) * 1.6)}`, m + 12, m + 36);

    // Indicación inicial para hacer scroll: grande, con fondo oscuro y una flecha que rebota
    if (S < 0.3) {
      const fade = 1 - S / 0.3;
      const label = this.lang === 'es' ? 'Baja para formar el disco' : 'Scroll to form the disk';
      const fsz = narrow ? 13 : 16;
      ctx.font = `500 ${fsz}px 'Martian Mono', monospace`;
      const tw2 = ctx.measureText(label).width;
      const bx2 = W * 0.52, by2 = narrow ? H * 0.42 : H * 0.36;
      const padX = 18, boxH = fsz + 22;
      ctx.globalAlpha = 0.72 * fade;
      ctx.fillStyle = '#0B0C10';
      ctx.fillRect(bx2 - tw2 / 2 - padX, by2 - boxH / 2, tw2 + padX * 2, boxH);
      ctx.globalAlpha = fade;
      ctx.strokeStyle = acc(0.9); ctx.lineWidth = 1;
      ctx.strokeRect(bx2 - tw2 / 2 - padX + 0.5, by2 - boxH / 2 + 0.5, tw2 + padX * 2 - 1, boxH - 1);
      ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, bx2, by2 + 1);
      const bob = this.reduced ? 0 : Math.abs(Math.sin(time * 2.4)) * 8;
      const ay = by2 + boxH / 2 + 14 + bob;
      const arrow = () => { ctx.beginPath(); ctx.moveTo(bx2, ay); ctx.lineTo(bx2, ay + 20); ctx.moveTo(bx2 - 8, ay + 12); ctx.lineTo(bx2, ay + 20); ctx.lineTo(bx2 + 8, ay + 12); ctx.stroke(); };
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(11,12,16,0.85)'; ctx.lineWidth = 6; arrow();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2.5; arrow();
      ctx.lineCap = 'butt';
      ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = acc(0.95); ctx.lineWidth = 1;
    const cm = (x0, y0, dx, dy) => { ctx.beginPath(); ctx.moveTo(x0 + dx * 18, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + dy * 18); ctx.stroke(); };
    const g = 5;
    cm(m - g + 0.5, m - g + 0.5, 1, 1); cm(W - m + g - 0.5, m - g + 0.5, -1, 1); cm(m - g + 0.5, H - m + g - 0.5, 1, -1); cm(W - m + g - 0.5, H - m + g - 0.5, -1, -1);

    // Etapa VII: órbitas de los planetas y retícula sobre el próximo objetivo
    if (far > 0.01) {
      ctx.save();
      ctx.globalAlpha = far;
      ctx.strokeStyle = acc(0.45); ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      for (const pl of this.planets) {
        ctx.beginPath();
        ctx.ellipse(cx * pix, cy * pix, s * pl.r * pix, s * pl.r * pix * ci, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      const tx2 = (Math.floor(this.target.x * gw) + 0.5) * pix, ty2 = (Math.floor(this.target.y * gh) + 0.5) * pix;
      const pulse = this.reduced ? 0 : Math.sin(time * 2.2) * 2;
      const rr = (narrow ? 16 : 24) + pulse, arm = narrow ? 6 : 9;
      ctx.strokeStyle = acc(0.95); ctx.lineWidth = 1.5;
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        ctx.beginPath();
        ctx.moveTo(tx2 + sx * rr, ty2 + sy * (rr - arm)); ctx.lineTo(tx2 + sx * rr, ty2 + sy * rr); ctx.lineTo(tx2 + sx * (rr - arm), ty2 + sy * rr);
        ctx.stroke();
      }
      ctx.font = `500 ${narrow ? 9 : 10}px 'Martian Mono', monospace`;
      ctx.textAlign = 'right';
      // En celular solo va el rótulo, al lado de la retícula; en computador, debajo y con coordenadas
      const l1 = this.lang === 'es' ? 'PRÓXIMO OBJETIVO' : 'NEXT TARGET', l2 = 'RA 05 35 16.5  DEC −05 23 23';
      const lx = tx2 - rr - 10, ly = narrow ? ty2 + 4 : ty2 + rr + 16;
      const bw2 = (narrow ? ctx.measureText(l1).width : Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width)) + 12;
      ctx.fillStyle = 'rgba(11,12,16,0.6)';
      ctx.fillRect(lx - bw2 + 6, ly - 13, bw2, narrow ? 18 : 34);
      ctx.fillStyle = acc(1); ctx.fillText(l1, lx, ly);
      if (!narrow) { ctx.fillStyle = 'rgba(236,232,223,0.8)'; ctx.fillText(l2, lx, ly + 15); }
      ctx.restore();
      ctx.textAlign = 'left';
    }

    this.drawName(ctx, L, time, acc);
  }
}
