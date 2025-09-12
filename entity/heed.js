export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 100 + Math.random() * (host.canvas.width - 200),
    y: 100 + Math.random() * (host.canvas.height - 200),
    radius1: 0,
    maxRadius1: 250,
    radius2: 0,
    maxRadius2: 50,
    ogMaxRadius2: 50,
    delay: true,
    die: 50,
    life: 10,
    fade: 1,
    radiusBlack: 0,
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

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    }
    if (fadeOut && state.life < 1) {
      state.fade = Math.max(0, state.life / 1);
      state.maxRadius1 = 0;
      state.maxRadius2 = 0;
    }

    //process
    const speed =
      state.radius2 < 100 ? (state.radius2 / 4) ** 2 : (state.radius2 / 6) ** 2;
    state.radiusBlack -= speed * dt;
    if (state.radiusBlack < 0) {
      state.radiusBlack = state.radius2 + 20;
    }

    const diff1 = state.maxRadius1 - state.radius1;
    const ease1 = 3;
    state.radius1 += diff1 * ease1 * dt;
    if (Math.abs(diff1) < 0.1) state.radius1 = state.maxRadius1;
    if (!state.delay) {
      const diff = state.maxRadius2 - state.radius2;
      const ease = 5;
      state.radius2 += diff * ease * dt;

      if (Math.abs(diff) < 0.1) state.radius2 = state.maxRadius2;
    }

    if (!state.delay) {
      if (Math.hypot(mouse.x - state.x, mouse.y - state.y) <= state.radius1) {
        state.maxRadius2 -= 200 * dt;
        if (state.maxRadius2 < state.ogMaxRadius2)
          state.maxRadius2 = state.ogMaxRadius2;
      } else {
        if (state.maxRadius2 > state.maxRadius1) {
          state.maxRadius2 += state.die * dt;
          state.die += 50;
        } else {
          state.maxRadius2 += 50 * dt;
        }
      }
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = 0.3 * state.fade;
    ctx.fillStyle = "#fe0102";
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius1, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = state.fade;
    ctx.fillStyle = "#fe0102";
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius2, 0, Math.PI * 2);
    ctx.fill();

    if (!state.delay) {
      const tipWidth = state.radius2 / 2;
      const tipHeight = state.radius2 / 1.5;
      const offset = state.radius2 / 4;
      ctx.beginPath();
      ctx.moveTo(state.x, state.y - state.radius2 - tipWidth + offset);
      ctx.lineTo(state.x - tipHeight, state.y - state.radius2 + offset);
      ctx.lineTo(state.x + tipHeight, state.y - state.radius2 + offset);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(state.x, state.y + state.radius2 + tipWidth - offset);
      ctx.lineTo(state.x - tipHeight, state.y + state.radius2 - offset);
      ctx.lineTo(state.x + tipHeight, state.y + state.radius2 - offset);
      ctx.closePath();
      ctx.fill();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius2, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.min(state.radiusBlack, 20);
    ctx.beginPath();
    ctx.arc(
      state.x,
      state.y,
      Math.max(0, state.radiusBlack - Math.min(state.radiusBlack, 20) / 2),
      0,
      Math.PI * 2
    );
    ctx.stroke();

    setTimeout(() => {
      state.delay = false;
    }, 1000);

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
