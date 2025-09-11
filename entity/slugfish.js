export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 400 + Math.random() * (host.canvas.width - 800),
    y: 200 + Math.random() * (host.canvas.height - 400),
    radius: 0,
    maxRadius: 400,
    life: 5,
    fade: 0.3,
    ease: 1.5,
  };

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      return;
    }
    if (fadeOut && state.life < 1) {
      state.fade = Math.max(0, state.life / 1);
      state.maxRadius = 0;
      state.ease = 2;
    } else if (state.life < 1.1) {
      state.fade = 0.3;
    } else if (state.life < 1.2) {
      state.fade = 0.5;
    } else if (state.life < 1.3) {
      state.fade = 0.3;
    } else if (state.life < 1.4) {
      state.fade = 0.5;
    }

    //process
    const diff = state.maxRadius - state.radius;
    const ease = state.ease;
    state.radius += diff * ease * dt;
    if (Math.abs(diff) < 0.1) state.radius = state.maxRadius;
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;
    ctx.fillStyle = "#808080";
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius, 0, Math.PI * 2);
    ctx.fill();

    if (state.maxRadius > 0) {
      ctx.globalAlpha = 0.1 * state.fade;
      ctx.fillStyle = "#f00";
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.1 * state.fade;
      ctx.fillStyle = "#f00";
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
