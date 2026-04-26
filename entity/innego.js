export function setup(host, { fadeOut = true } = {}) {
  const state = {
    count: 0,
    decayTimer: 0,
    danger: false,

    circle: spawnCircle(host),

    shapeTimer: 0,
    shape: null,
    anchorShape: null,
  };

  const mouse = { x: 0, y: 0 };

  function spawnCircle(host) {
    const w = host.canvas.width;
    const h = host.canvas.height;

    const edge = Math.floor(Math.random() * 4);
    let x = 0,
      y = 0;

    if (edge === 0) {
      x = Math.random() * w;
      y = 0;
    }
    if (edge === 1) {
      x = Math.random() * w;
      y = h;
    }
    if (edge === 2) {
      x = 0;
      y = Math.random() * h;
    }
    if (edge === 3) {
      x = w;
      y = Math.random() * h;
    }

    return {
      x,
      y,
      r: 18,
      vx: 0,
      vy: 0,
    };
  }

  function genShape(r) {
    const pts = [];
    const minDist = ((Math.PI * 2) / 5) * 0.75;

    let safety = 0;

    while (pts.length < 5 && safety++ < 200) {
      const a = Math.random() * Math.PI * 2;

      let ok = true;

      for (const p of pts) {
        let diff = Math.abs(a - p.a);
        diff = Math.min(diff, Math.PI * 2 - diff);

        if (diff < minDist) {
          ok = false;
          break;
        }
      }

      if (!ok) continue;

      pts.push({
        a,
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
      });
    }

    while (pts.length < 5) {
      const a = Math.random() * Math.PI * 2;
      pts.push({
        a,
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
      });
    }

    pts.sort((a, b) => a.a - b.a);

    return pts.map((p) => ({ x: p.x, y: p.y }));
  }

  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  }

  host.canvas.addEventListener("mousemove", onMouseMove);

  function update(dt) {
    const c = state.circle;

    const dx = mouse.x - c.x;
    const dy = mouse.y - c.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const nx = dx / dist;
    const ny = dy / dist;

    if (!state.danger) {
      const speed = 40;
      c.x += nx * speed * dt;
      c.y += ny * speed * dt;
    } else {
      state.chaseSpeed = (state.chaseSpeed || 60) + 120 * dt;
      c.x += nx * state.chaseSpeed * dt;
      c.y += ny * state.chaseSpeed * dt;
    }

    if (dist <= c.r + 4 && !state.danger) {
      state.count++;

      if (state.count === 5) state.danger = true;

      state.circle = spawnCircle(host);
    }

    if (!state.danger) {
      state.decayTimer += dt;
      if (state.decayTimer >= 60) {
        state.decayTimer -= 60;
        state.count = Math.max(0, state.count - 1);
      }
    }

    state.shapeTimer += dt * (state.danger ? 10 : 1);

    if (!state.anchorShape) {
      state.anchorShape = genShape(state.circle.r);
    }

    if (state.shapeTimer >= 1) {
      state.shapeTimer -= 1;
      state.shape = genShape(state.circle.r);

      state.shape[4] = state.anchorShape[4];
    }
  }

  function draw(ctx) {
    const c = state.circle;

    ctx.save();

    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();

    if (state.shape) {
      ctx.fillStyle = state.danger
        ? "#ffffff"
        : Math.random() < 0.5
          ? "#eeeeee"
          : "#888888";

      const pts = state.shape;

      ctx.beginPath();
      ctx.moveTo(state.circle.x + pts[0].x, state.circle.y + pts[0].y);

      for (let i = 1; i < 5; i++) {
        ctx.lineTo(state.circle.x + pts[i].x, state.circle.y + pts[i].y);
      }

      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = "#eeeeee";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(state.count, host.canvas.width - 10, 10);

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
