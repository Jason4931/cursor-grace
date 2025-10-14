export function setup(host, { fadeOut = true } = {}) {
  const state = {
    clicks: 0,
    life: 20,
    fade: 0,
  };

  function onMouseClick(e) {
    state.clicks++;
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.style.backgroundColor = "#111";
      host.canvas.style.animation = "bg 60s infinite";
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
    if (fadeOut && state.life < 1) {
      if (state.clicks >= 20) {
        state.fade = 0;
      } else {
        state.fade = Math.max(0, state.life / 1);
      }
    }

    //process
    if (state.clicks < 20) {
      let color = ["#3c3d03", "#3d2e02", "#3f1f01", "#3f0f01", "#400000"];
      host.canvas.style.backgroundColor = color[Math.floor(Math.random() * 5)];
      host.canvas.style.animation = "none";
    } else {
      unregister();
      host.canvas.style.backgroundColor = "#111";
      host.canvas.style.animation = "bg 60s infinite";
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = state.fade;
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.fillStyle = "#fbff08";
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fill();

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
