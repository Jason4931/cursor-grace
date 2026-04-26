export function setup(host, { fadeOut = true } = {}) {
  const state = {
    time: Math.floor(Math.random() * 10) + 20,
    acc: 0,
    failed: false,
    failTimer: 0,
  };

  const mouse = { x: 0, y: 0 };

  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  }

  function onMouseClick(e) {
    if (mouse.y > host.canvas.height * 0.25) return;
    if (!state.failed && state.time <= 5) {
      state.time = Math.floor(Math.random() * 10) + 20;
      state.acc = 0;
    }
  }

  host.canvas.addEventListener("mousemove", onMouseMove);
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    if (!state.failed) {
      state.acc += dt;

      if (state.acc >= 1) {
        state.acc -= 1;
        state.time--;

        if (state.time <= 0) {
          state.failed = true;
          state.failTimer = 0;
        }
      }
    } else {
      state.failTimer += dt;

      if (state.failTimer >= 2) {
        // full screen instantly after drop
        state.failTimer = 2;
      }
    }
  }

  function draw(ctx) {
    const w = host.canvas.width;
    const h = host.canvas.height;

    ctx.save();

    // timer text
    ctx.fillStyle = "#fcff09";
    ctx.font = `${24 * (state.time > 10 ? 1 : 1 + (10 - state.time) / 10)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const display = state.failed ? "XX" : String(state.time).padStart(2, "0");

    ctx.fillText(display, w / 2, 10 * (1 + state.failTimer * 9));

    // fail animation
    if (state.failed) {
      ctx.fillStyle = "#fbff08";

      const progress = state.failTimer / 2; // 0 → 1
      const barHeight = h * progress * 0.25;

      // falling bar from top
      ctx.fillRect(0, 0, w, barHeight);

      // after 2s → full screen
      if (state.failTimer >= 2) {
        ctx.fillRect(0, 0, w, h);
      }
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
