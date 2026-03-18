export function setup(host, { fadeOut = true } = {}) {
  const state = {
    opacity: 1,

    x: -100,
    y: -100,

    size: 40,

    state: "idle",
    timer: 0,

    dirX: 0,
    dirY: 0,

    speed: 0,
    passedCursor: false,
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
    if (mouse.x === 100000 || mouse.y === 100000) return;

    state.timer += dt;

    if (state.state === "idle") {
      if (state.timer >= 3) {
        state.timer = 0;
        state.state = "indicator";

        const dx = mouse.x - state.x;
        const dy = mouse.y - state.y;
        const d = Math.hypot(dx, dy) || 1;

        state.dirX = dx / d;
        state.dirY = dy / d;
      }
    } else if (state.state === "indicator") {
      if (state.timer >= 1) {
        state.timer = 0;
        state.state = "charging";

        state.speed = 810;
        state.passedCursor = false;
      }
    } else if (state.state === "charging") {
      const prevDX = mouse.x - state.x;
      const prevDY = mouse.y - state.y;
      const prevDist = Math.hypot(prevDX, prevDY);

      state.x += state.dirX * state.speed * dt;
      state.y += state.dirY * state.speed * dt;

      const newDX = mouse.x - state.x;
      const newDY = mouse.y - state.y;
      const newDist = Math.hypot(newDX, newDY);

      if (!state.passedCursor && newDist > prevDist) {
        state.passedCursor = true;
      }

      if (state.passedCursor) {
        state.speed *= 0.95;
      }

      if (state.speed < 5) {
        state.state = "idle";
        state.timer = 0;
      }
    }
  }

  function draw(ctx) {
    if (!Number.isFinite(mouse.x) || !Number.isFinite(mouse.y)) return;

    ctx.save();
    ctx.globalAlpha = state.opacity;

    if (state.state === "indicator" || state.state === "charging") {
      ctx.globalAlpha =
        state.state === "indicator"
          ? state.opacity
          : Math.max(0, Math.min(1, state.speed / 810));
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;

      const backLength = 2000;
      const forwardLength = 2000;

      const totalLength = backLength + forwardLength;
      const baseX = state.x - state.dirX * backLength;
      const baseY = state.y - state.dirY * backLength;

      const segLength = 13;

      let dist = 0;

      while (dist < totalLength) {
        const thickness = 1 + Math.random() * 5;

        ctx.lineWidth = thickness;

        const x1 = baseX + state.dirX * dist;
        const y1 = baseY + state.dirY * dist;

        const x2 = baseX + state.dirX * (dist + segLength);
        const y2 = baseY + state.dirY * (dist + segLength);

        ctx.beginPath();
        ctx.moveTo(Math.round(x1), Math.round(y1));
        ctx.lineTo(Math.round(x2), Math.round(y2));
        ctx.stroke();

        dist += segLength;
      }
    }
    ctx.restore();

    ctx.save();
    ctx.translate(state.x, state.y);
    if (state.state === "charging" && state.speed > 800) {
      const r = state.size / 2;

      ctx.fillStyle = "#fbff08";
      ctx.strokeStyle = "#fbff08";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-r * 0.95, -r * 0.1);
      ctx.lineTo(-r * 0.2, -r * 0.2);
      ctx.lineTo(-r * 0.2, -r * 0.95);
      ctx.lineTo(-r * 0.9, -r * 0.6);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.95, -r * 0.1);
      ctx.lineTo(r * 0.2, -r * 0.2);
      ctx.lineTo(r * 0.2, -r * 0.95);
      ctx.lineTo(r * 0.9, -r * 0.6);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-r * 0.9, r * 0.5);
      ctx.quadraticCurveTo(0, -r * 0.1, r * 0.9, r * 0.5);
      ctx.quadraticCurveTo(0, r * 1.5, -r * 0.9, r * 0.5);
      ctx.fill();
    } else {
      ctx.strokeStyle = "#fbff08";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(0, 0, state.size / 2, 0, Math.PI * 2);
      ctx.stroke();

      const r = state.size / 2;

      ctx.beginPath();
      ctx.moveTo(-r * 0.95, -r * 0.1);
      ctx.lineTo(-r * 0.2, -r * 0.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(r * 0.95, -r * 0.1);
      ctx.lineTo(r * 0.2, -r * 0.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-r * 0.9, r * 0.5);
      ctx.quadraticCurveTo(0, -r * 0.1, r * 0.9, r * 0.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
