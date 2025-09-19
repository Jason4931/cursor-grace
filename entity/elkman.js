export function setup(host, { fadeOut = true } = {}) {
  const rand = Math.random() < 0.5;
  const state = {
    size: 75,
    side: rand ? "left" : "right",
    x: rand ? -75 : host.canvas.width,
    y: host.canvas.height / 2 - 75 / 2,
    life: 5,
    fade: 1,
    targetX: rand ? -75 / 2 : host.canvas.width - 75 / 2,
    touched: false,
    grain: 1500,
    showWhite: false,
    rotation: 0,
    rotationTimer: 0,
    rotationDelay: 0.1,
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
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    }
    if (fadeOut && state.life < 1) {
      state.fade = Math.max(0, state.life / 1);
      state.showWhite = true;
    }

    //process
    if (state.touched) {
      state.rotationTimer -= dt;
      if (state.rotationTimer <= 0) {
        state.rotation = Math.random() * Math.PI * 2;
        state.rotationTimer = state.rotationDelay;
      }
    }

    const diff = state.targetX - state.x;
    const ease = 1;
    state.x += diff * ease * dt;
    if (Math.abs(diff) < 0.1) state.x = state.targetX;

    const triggerDist = 500;
    const releaseDist = host.canvas.width * 0.6;
    const squareCenterX = state.x + state.size / 2;
    const squareCenterY = state.y + state.size / 2;
    const cursorDist = Math.hypot(
      mouse.x - squareCenterX,
      mouse.y - squareCenterY
    );
    if (!state.touched && cursorDist <= triggerDist) {
      state.touched = true;
      state.life -= dt;
      state.grain += 100;
    } else if (state.touched && cursorDist > releaseDist) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    } else if (state.touched) {
      state.touched = true;
      state.life -= dt;
      state.grain += 100;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = state.fade;
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    if (state.showWhite) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "white";
      const overlayW = w * 0.6;
      const startX = state.side === "left" ? 0 : w * 0.4;
      ctx.fillRect(startX, 0, overlayW, h);
      ctx.restore();
    }

    if (state.touched) {
      const halfW = w * 0.6;
      const startX = state.side === "left" ? 0 : w * 0.4;
      const noiseW = halfW;
      for (let i = 0; i < state.grain; i++) {
        const x = startX + Math.random() * noiseW;
        const y = Math.random() * h;
        const brightness = Math.random() * 255;
        ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const bodyW = state.size * 0.5;
    const bodyH = state.size * 2;

    const cx = rand ? state.x + bodyW * 1.5 : state.x + bodyW / 2;
    const cy = state.y + bodyH / 4;
    ctx.translate(cx, cy);
    let min = Math.random() < 0.5 ? -1 : 1;
    ctx.rotate((state.rotation / 10) * min);
    if (!state.showWhite) {
      ctx.strokeStyle = Math.random() < 0.1 ? "white" : "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH);
    }

    for (let i = 0; i < 500; i++) {
      const x = -bodyW / 2 + Math.random() * bodyW;
      const y = -bodyH / 2 + Math.random() * bodyH;
      ctx.fillStyle = Math.random() < 0.99 ? "white" : "black";
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
