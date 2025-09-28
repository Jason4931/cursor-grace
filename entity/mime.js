export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 0,
    y: 0,
    radius: 50,
    life: 20,
    fade: 1,
    mouse: false,
    length: 0,
    targetLength: 0,
    dir: "long",
    die: false,
    ease: 3,
  };

  const mouse = { x: host.canvas.width / 2, y: 100000 };
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
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (Math.hypot(mouse.x - state.x, mouse.y - state.y) < state.radius + 1) {
      const angle = Math.atan2(y - state.y, x - state.x);
      const teleportDistance = 1000;
      state.x -= Math.cos(angle) * teleportDistance;
      state.y -= Math.sin(angle) * teleportDistance;
      state.ease = 0;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    //process
    if (mouse.x != host.canvas.width / 2 && mouse.y != 100000) {
      state.mouse = true;
    }

    state.ease += 0.01;
    if (state.ease > 3) state.ease = 3;
    let ease = state.ease;

    const dx = mouse.x - state.x;
    const dy = mouse.y - state.y;
    const dist = Math.hypot(dx, dy);

    if (dist > state.radius) {
      const targetX = mouse.x - (dx / dist) * state.radius;
      const targetY = mouse.y - (dy / dist) * state.radius;

      state.x += (targetX - state.x) * ease * dt;
      state.y += (targetY - state.y) * ease * dt;
    }

    if (!state.die) {
      if (state.dir == "long") {
        state.targetLength = 9;
        if (state.length > 8.5) {
          state.dir = "short";
        }
      } else {
        state.targetLength = 1;
        if (state.length < 1.5) {
          state.dir = "long";
        }
      }
    } else {
      state.targetLength = 11;
    }

    const diff = state.targetLength - state.length;
    state.length += diff * ease * dt;
    if (Math.abs(diff) < 0.01) state.length = state.targetLength;

    if (Math.hypot(mouse.x - state.x, mouse.y - state.y) < 20) {
      state.die = true;
    } else {
      state.die = false;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = state.fade;
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    if (state.mouse) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.save();
      ctx.translate(state.x, state.y);

      const size = 15;
      const hookLength = state.length;

      const lines = [
        { x1: -size, y1: -size, x2: size, y2: size },
        { x1: -size, y1: size, x2: size, y2: -size },
      ];

      for (const line of lines) {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.lineWidth = state.die ? 10 : 2;
        ctx.stroke();

        const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);

        const px = Math.cos(angle + Math.PI / 2);
        const py = Math.sin(angle + Math.PI / 2);

        ctx.beginPath();
        ctx.moveTo(line.x2, line.y2);
        ctx.quadraticCurveTo(
          line.x2,
          line.y2,
          line.x2 + px * hookLength - Math.cos(angle) * hookLength,
          line.y2 + py * hookLength - Math.sin(angle) * hookLength
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(line.x2, line.y2);
        ctx.quadraticCurveTo(
          line.x2,
          line.y2,
          line.x2 - px * hookLength - Math.cos(angle) * hookLength,
          line.y2 - py * hookLength - Math.sin(angle) * hookLength
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.quadraticCurveTo(
          line.x1,
          line.y1,
          line.x1 + px * hookLength + Math.cos(angle) * hookLength,
          line.y1 + py * hookLength + Math.sin(angle) * hookLength
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.quadraticCurveTo(
          line.x1,
          line.y1,
          line.x1 - px * hookLength + Math.cos(angle) * hookLength,
          line.y1 - py * hookLength + Math.sin(angle) * hookLength
        );
        ctx.stroke();

        ctx.fillStyle = `#fff`;
        ctx.fillRect(px - 1.5 + 0.75 * (10 - state.length), py - 2, 3, 3);
        ctx.fillRect(px - 1.5 - 0.75 * (10 - state.length), py - 2, 3, 3);
        ctx.fillRect(px - 1.5, py - 2 + 0.75 * (10 - state.length), 3, 3);
        ctx.fillRect(px - 1.5, py - 2 - 0.75 * (10 - state.length), 3, 3);
      }

      ctx.restore();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
