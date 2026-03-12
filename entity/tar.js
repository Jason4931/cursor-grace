import { tar } from "../main.js";
export function setup(host, { fadeOut = true } = {}) {
  const state = {
    life: 10,
    fade: 1,
    x: Math.random() * host.canvas.width,
    y: Math.random() * host.canvas.height,
    r: 120,
    pts: Array.from({ length: 1000 }, (_, i) => ({
      a: (i / 10) * Math.PI * 2,
      d: 0.7 + Math.random() * 0.6,
    })),
    t: 0,
    rot: 0,
    splat: 0,
    color: "black",
    insideTime: 0,
    ringR: 10,
    ringMax: 40,
  };

  const mouse = { x: 0, y: 0 };
  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;

    const dx = mouse.x - state.x;
    const dy = mouse.y - state.y;
    tar.inside = Math.hypot(dx, dy) < state.r * 1.2;
  }
  host.canvas.addEventListener("mousemove", onMouseMove);

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      tar.inside = false;
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    }
    if (fadeOut && state.life < 1) {
      state.fade = Math.max(0, state.life);
    }

    //process
    state.t += dt;
    state.rot += dt * 0.4;

    if (state.splat < 1) {
      state.splat += dt * 3;
      if (state.splat > 1) state.splat = 1;
    }

    if (tar.inside) {
      state.insideTime += dt;

      const speed = 1 + state.insideTime;
      state.ringR += dt * 80 * speed;

      if (state.ringR > state.ringMax) {
        state.ringR = 10;
      }

      if (state.insideTime >= 3) {
        state.color = "#808080";
      }
    } else {
      state.insideTime = 0;
      state.ringR = 10;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;
    ctx.fillStyle = state.color;

    ctx.translate(state.x, state.y);
    ctx.rotate(state.rot);

    const s = state.splat;
    const sx = s;
    const sy = 0.4 + s * 0.6;
    ctx.scale(sx, sy);

    ctx.beginPath();
    state.pts.forEach((p, i) => {
      const r = state.r * (p.d + Math.sin(state.t * 2 + i) * 0.05);
      const x = Math.cos(p.a) * r;
      const y = Math.sin(p.a) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 6 + Math.random() * 6; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? "#111" : "#222";
      const a = Math.random() * Math.PI * 2;
      const r = state.r * 1.2 * Math.sqrt(Math.random()) * 0.9;

      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;

      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (tar.inside && state.ringR > 0) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, state.ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
