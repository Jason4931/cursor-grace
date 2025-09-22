export function setup(host, { fadeOut = true } = {}) {
  const state = {
    radius: host.canvas.width * 0.6,
    targetRadius: 25,
    minRadius: 25,
    life: 10,
    fade: 0.3,
    die: false,
  };

  const mouse = { x: 0, y: 0 };
  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  }
  host.canvas.addEventListener("mousemove", onMouseMove);
  function onMouseClick(e) {
    if (state.life < 2) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    if (
      Math.hypot(
        mouse.x - host.canvas.width / 2,
        mouse.y - host.canvas.height / 2
      ) >
      state.minRadius * 1.5
    ) {
      state.life -= dt;
      state.targetRadius = state.minRadius;
    } else {
      state.targetRadius = state.radius;
      state.life += 0.25 * dt;
      state.radius += (10 * dt) / (1 - 0.1 * (10 - state.life) * dt);
    }
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
    if (fadeOut && state.life < 0.2) {
      state.fade = 1;
      state.radius = 0;
      state.die = true;
    }

    //process
    const diff = state.targetRadius - state.radius;
    const ease = 0.1 * (10 - state.life);
    state.radius += diff * ease * dt;
    if (Math.abs(diff) < 0.1) state.radius = state.targetRadius;
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;
    ctx.strokeStyle = `rgb(255,${state.life * 25.5},${state.life * 25.5})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, state.radius, 0, Math.PI * 2);
    ctx.stroke();

    const grain = 200 * (10 - state.life);
    const thickness = 50;
    for (let i = 0; i < grain; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = state.radius - (Math.sqrt(Math.random()) - 1) * thickness;
      const x = w / 2 + Math.cos(angle) * r;
      const y = h / 2 + Math.sin(angle) * r;

      const greenBlue = Math.random() * state.life * 25.5;
      ctx.fillStyle = `rgb(255,${greenBlue},${greenBlue})`;
      ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
    }

    if (state.die) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.fill();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
