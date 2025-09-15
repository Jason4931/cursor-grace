export function setup(host, { fadeOut = true } = {}) {
  const state = {
    size: 70,
    x: 0,
    y: 0,
    life: 10,
    fade: 1,
    touched: false,
    speed: 200,
    rotation: 0,
    rotationTimer: 0,
    rotationDelay: 0.1,
    pulseY: 0,
    pulseSpeed: 200,
  };

  const edges = ["top", "bottom", "left", "right"];
  const edge = edges[Math.floor(Math.random() * edges.length)];
  switch (edge) {
    case "top":
      state.x = Math.random() * host.canvas.width;
      state.y = -state.size / 1.333 + 10;
      state.rotation = Math.PI * 0.5;
      break;
    case "bottom":
      state.x = Math.random() * host.canvas.width;
      state.y = host.canvas.height + 5;
      state.rotation = Math.PI * 0.5;
      break;
    case "left":
      state.x = -state.size + 10;
      state.y = Math.random() * host.canvas.height;
      break;
    case "right":
      state.x = host.canvas.width - 10;
      state.y = Math.random() * host.canvas.height;
      break;
  }

  const mouse = { x: 100000, y: 100000 };
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
    const dist = Math.hypot(x - state.x, y - state.y);
    if (dist < 300) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }

    //process
    const boxCenterX = state.x + state.size / 2;
    const boxCenterY = state.y + state.size / 4;
    const cursorDist = Math.hypot(mouse.x - boxCenterX, mouse.y - boxCenterY);
    const triggerDist = 300;

    if (cursorDist <= triggerDist) state.touched = true;

    if (state.touched) {
      const dx = mouse.x - boxCenterX;
      const dy = mouse.y - boxCenterY;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        state.x += (dx / dist) * state.speed * dt;
        state.y += (dy / dist) * state.speed * dt;
      }

      if (Math.random() < 0.5) {
        state.rotation = Math.atan2(dy, dx);
      } else {
        state.rotationTimer -= dt;
        if (state.rotationTimer <= 0) {
          state.rotation = Math.random() * Math.PI * 2;
          state.rotationTimer = state.rotationDelay;
        }
      }

      state.pulseY += state.pulseSpeed * dt;
      if (state.pulseY > state.size / 4) state.pulseY = -state.size / 4;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = state.fade;
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    const cx = state.x + state.size / 2;
    const cy = state.y + state.size / 4;
    ctx.translate(cx, cy);
    ctx.rotate(state.rotation);

    ctx.fillStyle = "black";
    ctx.fillRect(-state.size / 2, -state.size / 4, state.size, state.size / 2);

    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      -state.size / 2,
      -state.size / 4,
      state.size,
      state.size / 2
    );

    if (state.touched) {
      const pulseHeight = state.size / 6;
      ctx.fillStyle = "gray";
      ctx.fillRect(
        -state.size / 2,
        state.pulseY - pulseHeight / 2,
        state.size,
        pulseHeight
      );
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
