export function setup(host, { fadeOut = true } = {}) {
  const state = {
    life: 5,
    fade: 0.1,
    h: 0,
    pulses: [],
    pulseTimer: 0,
  };

  const mouse = { x: 0, y: 0 };
  function onMouseClick(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
    if (
      mouse.x > 0 &&
      mouse.x < host.canvas.width &&
      mouse.y > host.canvas.height - state.h &&
      mouse.y < host.canvas.height
    ) {
      unregister();
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
    if (fadeOut && state.life < 0.2) {
      state.fade = 1;
    }

    //process
    state.h += 150 * dt;
    if (state.h > host.canvas.height) {
      state.h = host.canvas.height;
    }

    state.pulseTimer -= dt;
    const spawnInterval = Math.max(0.3, 1 - (5 - state.life) * 0.15);
    if (state.pulseTimer <= 0) {
      state.pulseTimer = spawnInterval;
      state.pulses.push({
        r: 0,
        growth: 1000 + (5 - state.life) * 500,
        alpha: 1,
      });
    }

    state.pulses.forEach((p) => {
      p.r += p.growth * dt;
      p.alpha -= dt * 0.6;
    });

    state.pulses = state.pulses.filter((p) => p.alpha > 0);
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
    ctx.rect(0, host.canvas.height - state.h, w, state.h);
    ctx.fill();

    if (state.fade != 1) {
      ctx.beginPath();
      ctx.rect(0, host.canvas.height - state.h, w, state.h);
      ctx.clip();

      const centerX = w / 2;
      const bottomY = h * 1.5;
      state.pulses.forEach((p) => {
        ctx.globalAlpha = p.alpha * state.fade;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(centerX, bottomY, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
