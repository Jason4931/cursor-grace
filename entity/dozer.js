export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 0,
    y: 0,
    radius: 80,
    outerRadius: 80,
    minRadius: 10,
    life: 4,
    fade: 0.3,
    stop: false,
    mouse: false,
    polygonRotation: Math.random() * Math.PI * 2,
    polygonRotation2: Math.random() * Math.PI * 2,
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
    } else if (state.life < 1.1) {
      state.fade = 0.3;
    } else if (state.life < 1.2) {
      state.fade = 0.5;
    } else if (state.life < 1.3) {
      state.fade = 0.3;
    } else if (state.life < 1.4) {
      state.fade = 0.5;
    }

    //process
    if (mouse.x != 100000 && mouse.y != 100000) {
      state.mouse = true;
    }

    if (state.mouse) {
      if (!state.stop) {
        state.x = mouse.x;
        state.y = mouse.y;
      }

      const diff = state.minRadius - state.radius;
      const ease = 1.5;
      state.radius += diff * ease * dt;
      if (Math.abs(diff) < 0.1) state.radius = state.minRadius;
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
      ctx.fillStyle = "#f4ea37";
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.outerRadius, 0, Math.PI * 2);
      ctx.arc(
        state.x,
        state.y,
        Math.max(0, state.radius),
        0,
        Math.PI * 2,
        true
      );
      ctx.fill("evenodd");
      if (Math.random() < 0.2) {
        state.polygonRotation = Math.random() * Math.PI * 2;
      }
      const radius1 = state.outerRadius + 10;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const angle = (i / 10) * Math.PI * 2 + state.polygonRotation;
        const px = state.x + radius1 * Math.cos(angle);
        const py = state.y + radius1 * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      if (Math.random() < 0.2) {
        state.polygonRotation2 = Math.random() * Math.PI * 2;
      }
      const radius2 = state.outerRadius + 20;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const angle = (i / 10) * Math.PI * 2 + state.polygonRotation2;
        const px = state.x + radius2 * Math.cos(angle);
        const py = state.y + radius2 * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
