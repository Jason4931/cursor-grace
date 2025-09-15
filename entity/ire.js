export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    radius: 100,
    curve: 0,
    targetCurve: 0,
    ease: 3,
    lineWidth: 2,
    life: 5,
    fade: 0.3,
    mouse: false,
    die: false,
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
    if (state.mouse) state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    }
    if (fadeOut && state.life < 0.2) {
      state.targetCurve = 0;
      state.ease = 15;
      state.lineWidth = 4;
      if (Math.hypot(mouse.x - state.x, mouse.y - state.y) < state.radius / 2) {
        state.die = true;
      }
    } else if (state.life < 0.5) {
      state.fade = 1;
      state.targetCurve = 0.75;
      state.lineWidth = 3.333;
    } else if (state.life < 2) {
      state.targetCurve = 0.5;
      state.lineWidth = 2.667;
    } else {
      state.targetCurve = 0.25;
    }

    //process
    if (mouse.x != 100000 && mouse.y != 100000) {
      if (!state.mouse) {
        state.x = mouse.x;
        state.y = mouse.y;
      }
      state.mouse = true;
    }

    if (state.mouse) {
      let ease = 1;

      const diffX = state.targetX - state.x;
      state.x += diffX * ease * dt;
      if (Math.abs(diffX) < 0.1) state.x = state.targetX;
      const diffY = state.targetY - state.y;
      state.y += diffY * ease * dt;
      if (Math.abs(diffY) < 0.1) state.y = state.targetY;

      state.targetX = mouse.x;
      state.targetY = mouse.y;

      const diff = state.targetCurve - state.curve;
      state.curve += diff * state.ease * dt;
      if (Math.abs(diff) < 0.01) state.curve = state.targetCurve;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    if (state.mouse) {
      function bulgeLine(angle, bulges) {
        const half = state.radius / 2;
        const x1 = state.x + Math.cos(angle) * -half;
        const y1 = state.y + Math.sin(angle) * -half;
        const x2 = state.x + Math.cos(angle) * half;
        const y2 = state.y + Math.sin(angle) * half;
        const perpAngle = angle + Math.PI / 2;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const bulge = r * bulges;
        const cx1 = midX + Math.cos(perpAngle) * bulge;
        const cy1 = midY + Math.sin(perpAngle) * bulge;
        const cx2 = midX - Math.cos(perpAngle) * bulge;
        const cy2 = midY - Math.sin(perpAngle) * bulge;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx1, cy1, x2, y2);
        ctx.quadraticCurveTo(cx2, cy2, x1, y1);
        ctx.closePath();
        ctx.fillStyle = state.die ? "#fff" : "#000";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = state.lineWidth;
        ctx.stroke();

        const grain = 1500 * (10 - state.life);
        for (let i = 0; i < grain; i++) {
          const gx = state.x + (Math.random() - 0.5) * state.radius * 2;
          const gy = state.y + (Math.random() - 0.5) * state.radius * 2;
          if (ctx.isPointInStroke(gx, gy)) {
            const brightness = Math.random() * state.life * 25.5;
            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
            ctx.fillRect(gx, gy, 1 + Math.random(), 1 + Math.random());
          }
        }
      }
      ctx.globalAlpha = state.fade;
      const r = state.radius;

      bulgeLine(Math.PI, state.curve);
      if (state.life < 0.5 && state.life > 0.15) {
        const mx = state.x;
        const my = state.y;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mx - 3, my - 14);
        ctx.lineTo(mx - 4, my - 2);
        ctx.moveTo(mx + 3, my - 7);
        ctx.lineTo(mx + 4, my + 1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx - 10, my - 1);
        ctx.lineTo(mx, my + 12);
        ctx.lineTo(mx + 10, my - 1);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
