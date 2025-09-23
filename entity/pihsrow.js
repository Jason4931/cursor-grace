export function setup(host, time) {
  const state = {
    life: time,
    fade: 1,
  };

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
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
    if (state.life < 9) {
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.fill();

      const img1 = new Image();
      img1.src = "pihsrow1.png";
      const img2 = new Image();
      img2.src = "pihsrow2.png";
      if (state.life < 5 && state.life >= 1 && Math.random() < 0.99) {
        const x = w / 2 - img1.width / 2;
        const y = h / 2 - img1.height / 2;
        ctx.drawImage(img1, x, y);
      } else if (state.life < 1 && Math.random() < 0.99) {
        const x = w / 2 - img2.width / 2;
        const y = h / 2 - img2.height / 2;
        ctx.drawImage(img2, x, y);
      }
    } else {
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const redness =
          Math.random() < 0.5 ? 255 : Math.floor(Math.random() * 256);
        if (redness == 179) break;
        ctx.fillStyle = `rgb(${redness},0,0)`;
        ctx.fillRect(x, y, 3, 3);
      }
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
