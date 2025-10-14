export function setup(host, { fadeOut = true } = {}) {
  const rand = Math.random() < 0.5;
  const state = {
    x: 0,
    y: rand ? 0 : host.canvas.height,
    targetY: rand ? 0.7 * host.canvas.height : 0.3 * host.canvas.height,
    life: 5,
    fade: 0.1,
    grain: 1000,
  };

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      return;
    }
    if (fadeOut && state.life < 1) {
      state.fade = Math.max(0, state.life / 1);
    } else if (state.life < 1.125) {
      state.fade = 0.3;
    } else if (state.life < 1.25) {
      state.fade = 0.25;
    } else if (state.life < 1.375) {
      state.fade = 0.2;
    } else if (state.life < 1.5) {
      state.fade = 0.15;
    }

    //process
    const diff = state.targetY - state.y;
    const ease = 1.5;
    state.y += diff * ease * dt;
    if (Math.abs(diff) < 0.1) state.y = state.targetY;
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;
    ctx.fillStyle = "#b30000";
    if (rand) {
      ctx.fillRect(0, 0, w, state.y);
    } else {
      ctx.fillRect(0, state.y, w, h - state.y);
    }

    ctx.globalAlpha = Math.max(10 * state.fade, 1);
    if (rand) {
      for (let i = 0; i < state.grain; i++) {
        const x = Math.random() * w;
        const y = Math.random() * state.y;
        const redness = Math.floor(Math.random() * 256);
        if (redness == 179) continue;
        ctx.fillStyle = `rgb(${redness},0,0)`;
        ctx.fillRect(x, y, 3, 10);
      }
    } else {
      for (let i = 0; i < state.grain; i++) {
        const x = Math.random() * w;
        const y = state.y + Math.random() * (h - state.y);
        const redness = Math.floor(Math.random() * 256);
        if (redness == 179) continue;
        ctx.fillStyle = `rgb(${redness},0,0)`;
        ctx.fillRect(x, y, 3, 10);
      }
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
