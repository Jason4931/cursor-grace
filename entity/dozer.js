export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 0,
    y: 0,
    radius: 100,
    outerRadius: 100,
    minRadius: 15,
    life: 5,
    fade: 0.3,
    stop: false,
  };

  const mouse = { x: 100000, y: 100000 };
  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
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
      state.fade = 1;
      state.stop = true;
    }

    //process
    if (!state.stop) {
      state.x = mouse.x;
      state.y = mouse.y;
    }

    const diff = state.minRadius - state.radius;
    const ease = 1;
    state.radius += diff * ease * dt;
    if (Math.abs(diff) < 0.1) state.radius = state.minRadius;
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = state.fade;
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.fillStyle = "#f4ea37";
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.outerRadius, 0, Math.PI * 2);
    ctx.arc(state.x, state.y, Math.max(0, state.radius), 0, Math.PI * 2, true);
    ctx.fill("evenodd");

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
