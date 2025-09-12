export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 0,
    y: 0,
    radius: 50,
    life: 20,
    fade: 0,
    mouse: false,
    flashed: false,
  };

  const mouseHistory = [];
  const mouse = { x: 100000, y: 100000 };
  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    mouse.x = x;
    mouse.y = y;
    mouseHistory.push({ x, y, time: performance.now() });
  }
  host.canvas.addEventListener("mousemove", onMouseMove);
  function onMouseClick(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const dist = Math.hypot(x - state.x, y - state.y);
    if (dist < state.radius && !state.flashed) {
      state.flashed = true;
      setTimeout(() => {
        state.flashed = false;
      }, 2000);
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    if (state.mouse) state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
    if (fadeOut && state.life < 1) {
      state.fade = Math.max(0, state.life / 1);
    } else if (state.life < 18) {
      state.fade = 1;
    } else if (state.life < 19) {
      state.fade = 0.3;
    }

    //process
    if (mouse.x != 100000 && mouse.y != 100000) {
      state.mouse = true;
    }

    const now = performance.now();
    const delay = 1000;

    let delayedPoint = null;
    for (let i = 0; i < mouseHistory.length; i++) {
      if (now - mouseHistory[i].time >= delay) {
        delayedPoint = mouseHistory[i];
      } else {
        break;
      }
    }

    if (delayedPoint && Math.random() < 0.2) {
      state.x = delayedPoint.x;
      state.y = delayedPoint.y;
      const index = mouseHistory.indexOf(delayedPoint);
      mouseHistory.splice(0, index);
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
      ctx.fillStyle = !state.flashed
        ? Math.random() < 0.6
          ? "#fff"
          : "#000"
        : Math.random() < 0.5
        ? "#80008080"
        : "#000";
      ctx.beginPath();

      let x = state.x - 2;
      let y = state.y - 4;
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0, y + 18);
      ctx.lineTo(x + 5, y + 14);
      ctx.lineTo(x + 9, y + 21);
      ctx.lineTo(x + 10, y + 20);
      ctx.lineTo(x + 7, y + 13);
      ctx.lineTo(x + 13, y + 13);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
