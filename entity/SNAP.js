export function setup(host, { fadeOut = true } = {}) {
  const state = {
    life: 11,
    fade: 0.5,
    x: Math.random() * host.canvas.width,
    y: Math.random() * host.canvas.height,
    r: 25,
    failProgress: 0, // 0 → growing
  };

  const mouse = { x: 0, y: 0 };

  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  }

  function onMouseClick(e) {
    const dx = mouse.x - state.x;
    const dy = mouse.y - state.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= state.r) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
  }

  host.canvas.addEventListener("click", onMouseClick);
  host.canvas.addEventListener("mousemove", onMouseMove);

  function update(dt) {
    state.life -= dt;

    if (state.life <= 1) {
      state.failProgress += dt * 800;
      return;
    }

    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }

    if (fadeOut && state.life < 1) {
      state.fade = 1;
    }
  }

  function draw(ctx) {
    const w = host.canvas.width;
    const h = host.canvas.height;

    ctx.save();
    ctx.globalAlpha = state.fade;

    ctx.fillStyle = "#ff69b4";
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const px = state.x + Math.cos(angle) * state.r * 0.6;
      const py = state.y + Math.sin(angle) * state.r * 0.6;

      ctx.beginPath();
      ctx.arc(px, py, state.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ff1493";
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.r * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    if (state.life <= 1) {
      ctx.save();
      ctx.fillStyle = "#cf0693";
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.failProgress, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
