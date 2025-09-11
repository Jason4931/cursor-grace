export function setup(host, { fadeOut = true } = {}) {
  const state = {
    inset: 0,
    growth: 50,
    life: 10,
    fade: 0.3,
  };

  const mouse = { x: 0, y: 0 };
  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;

    if (Math.random() < 0.9) {
      state.inset -= 1;
    }
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
    }

    //process
    state.inset += state.growth * dt;
    const maxInset = Math.min(host.canvas.width, host.canvas.height) / 2;
    if (state.inset > maxInset) {
      state.inset = maxInset;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;
    ctx.fillStyle = "#cf0693";
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.rect(
      state.inset,
      state.inset,
      w - state.inset * 2,
      h - state.inset * 2
    );
    ctx.fill("evenodd");

    ctx.globalAlpha = Math.min(
      1,
      (state.inset / (Math.min(host.canvas.width, host.canvas.height) / 2)) *
        state.fade *
        2
    );
    const limbCount = 30;
    const segmentLength = 8;
    const maxSegments = 15;
    const time = performance.now() * 0.003;

    for (let i = 0; i < limbCount; i++) {
      let x = Math.random() < 0.5 ? 0 : host.canvas.width;
      let y = Math.random() * host.canvas.height;
      if (Math.random() < 0.5) {
        x = Math.random() * host.canvas.width;
        y = Math.random() < 0.5 ? 0 : host.canvas.height;
      }

      let angle = Math.random() * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let j = 0; j < maxSegments; j++) {
        angle += (Math.random() - 0.5) * 0.5;
        x += Math.cos(angle) * segmentLength;
        y += Math.sin(angle) * segmentLength;

        if (
          x > state.inset &&
          x < host.canvas.width - state.inset &&
          y > state.inset &&
          y < host.canvas.height - state.inset
        ) {
          break;
        }

        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "#cf0693";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
