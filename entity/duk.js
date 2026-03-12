export function setup(host, { fadeOut = true } = {}) {
  const state = {
    fade: 1,

    x: -100,
    y: -100,

    vx: 0,
    vy: 0,

    speed: 120,
    knockX: 0,
    knockY: 0,
    cooldown: 0,

    rot: 0,
    size: 22,

    cam: 120,

    face: 0,
    trail: [],
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
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;

    const dx = mouse.x - state.x;
    const dy = mouse.y - state.y;
    const dist = Math.hypot(dx, dy);

    if (dist < state.size * 5 && state.cooldown == 0) {
      const nx = dx / dist;
      const ny = dy / dist;

      state.knockX = -ny * 1000 * (Math.random() < 0.5 ? -1 : 1);
      state.knockY = nx * 1000 * (Math.random() < 0.5 ? -1 : 1);
      state.cooldown = 0.5;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    //process
    const dx = mouse.x - state.x;
    const dy = mouse.y - state.y;
    const dist = Math.hypot(dx, dy) || 1;

    const nx = dx / dist;
    const ny = dy / dist;

    state.face = Math.atan2(dy, dx) + Math.PI * 0.5;

    state.vx = nx * state.speed;
    state.vy = ny * state.speed;

    state.x += (state.vx + state.knockX) * dt;
    state.y += (state.vy + state.knockY) * dt;

    state.knockX *= Math.pow(0.2, dt);
    state.knockY *= Math.pow(0.2, dt);

    state.rot += dt * 6;
    state.cooldown -= dt;
    if (state.cooldown < 0) state.cooldown = 0;

    if (Math.random() < 0.5)
      state.trail.push({
        x: state.x,
        y: state.y,
        face: state.face,
        rot: state.rot,
        life: 0.5,
      });

    for (let t of state.trail) t.life -= dt;
    state.trail = state.trail.filter((t) => t.life > 0);
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;

    const s = state.size;

    for (let t of state.trail) {
      ctx.save();
      ctx.globalAlpha = t.life * 0.4;

      ctx.translate(t.x, t.y);
      ctx.rotate(t.face);

      const sx = Math.cos(t.rot);
      ctx.scale(sx, 1);

      ctx.fillStyle = "#80ff00";

      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.45, -s * 0, s * 0.9, s * 0.7);
      ctx.quadraticCurveTo(0, s * 1.1, -s * 0.9, s * 0.7);
      ctx.quadraticCurveTo(-s * 0.45, -s * 0, 0, -s);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    ctx.translate(state.x, state.y);
    ctx.rotate(state.face);

    const sx = Math.cos(state.rot);
    ctx.scale(sx, 1);

    ctx.fillStyle = "#fdff00";

    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.45, -s * 0, s * 0.9, s * 0.7);
    ctx.quadraticCurveTo(0, s * 1.1, -s * 0.9, s * 0.7);
    ctx.quadraticCurveTo(-s * 0.45, -s * 0, 0, -s);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
