export function setup(host, { fadeOut = true } = {}) {
  const state = {
    inset: 0,
    growth: 50,
    life: 10,
    fade: 0.5,
  };

  const mouse = { x: 0, y: 0 };
  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;

    const centerX = host.canvas.width / 2;
    const centerY = host.canvas.height / 2;
    const dist = Math.hypot(mouse.x - centerX, mouse.y - centerY);
    const maxDist = Math.min(host.canvas.width, host.canvas.height) / 2;
    if (dist < maxDist) {
      state.inset -= 1;
      if (state.inset > maxDist) state.inset = maxDist;
    }
  }
  host.canvas.addEventListener("mousemove", onMouseMove);

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    }
    if (fadeOut && state.life < 1) {
      state.fade = Math.max(0, state.life / 1);
    }

    //process
    state.inset += state.growth * dt;
    const maxInset = Math.min(host.canvas.width, host.canvas.height) / 2;
    if (state.inset > maxInset) {
      state.inset = maxInset;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = state.fade;
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.fillStyle = "#ea0075";
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.rect(
      state.inset,
      state.inset,
      w - state.inset * 2,
      h - state.inset * 2
    );
    ctx.fill("evenodd");

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
