export function setup(host, { fadeOut = true } = {}) {
  const state = {
    life: 13,
    fade: 0.5,

    scale: 1,
    phase: "idle",
    timer: 0,
    idleDuration: 5 + Math.random() * 5,
    off: false,
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
  function onMouseClick(e) {
    if (state.phase === "opening") {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }

    //process
    state.timer += dt;

    if (state.phase === "idle") {
      if (state.timer >= state.idleDuration) {
        state.phase = "preOpen";
        state.timer = 0;
      }
    } else if (state.phase === "preOpen") {
      if (state.timer >= 1) {
        state.phase = "opening";
        state.timer = 0;
      }
    } else if (state.phase === "opening") {
      const t = Math.min(1, state.timer / 2);
      state.scale = Math.pow(t, 10) * 10 + 1;
      state.fade = Math.max(0.5, Math.min(1, t));
      if (state.timer >= 1.9) {
        state.off = true;
      }
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;
    const cx = w / 2;
    const cy =
      h /
      (state.phase === "idle"
        ? 2.25
        : state.phase === "preOpen"
          ? Math.max(2, 2.25 - state.timer / 2)
          : 2);
    const r = Math.min(w, h) * 0.1;

    ctx.translate(cx - 1 + 2 * Math.random(), cy - 1 + 2 * Math.random());
    ctx.scale(state.scale, state.scale);
    ctx.lineWidth = 3;
    ctx.strokeStyle = state.off ? "white" : "#eee";
    ctx.fillStyle = "black";
    ctx.lineCap = "round";

    if (state.phase === "idle") {
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
      const lashes = 14;

      for (let i = 0; i < lashes; i++) {
        const a = Math.PI * 0.1 + (i / (lashes - 1)) * Math.PI * 0.8;

        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;

        const nx = Math.cos(a);
        const ny = Math.sin(a);

        const lift = 0.6;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + nx * r * 0.15, y + (ny - lift) * r * 0.15);
        ctx.stroke();
      }
    } else if (state.phase === "preOpen") {
      const t = Math.min(1, state.timer / 0.5);

      const start = Math.PI * 0.1;
      const end = Math.PI * 0.9;

      const flip = t;

      ctx.beginPath();
      for (let a = start; a <= end; a += 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const y = baseY * (1 - flip) + -baseY * flip;

        if (a === start) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let a = start; a <= end; a += 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const y = baseY * (1 - 0.15 * t);

        if (a === start) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const teeth = 14;

      for (let i = 0; i < teeth; i++) {
        const a = start + (i / (teeth - 1)) * (end - start);

        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const yTop = baseY * (1 - flip) + -baseY * flip;
        const yBot = baseY * (1 - 0.15 * t);

        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBot);
        ctx.stroke();
      }

      ctx.beginPath();
      for (let a = start; a <= end; a += 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const yTop = baseY * (1 - flip) + -baseY * flip;
        const yBot = baseY * (1 - 0.15 * t);

        const yMid = (yTop + yBot) / 2;

        if (a === start) ctx.moveTo(x, yMid);
        else ctx.lineTo(x, yMid);
      }
      ctx.stroke();
    } else if (state.phase === "opening") {
      const t = Math.min(1, state.timer / 0.5);

      const start = Math.PI * 0.1;
      const end = Math.PI * 0.9;

      const flip = 1;

      const getYTop = (baseY) => baseY * (1 - flip) + -baseY * flip;
      const getYBot = (baseY) => baseY * (1 - 0.15);
      const getYMid = (baseY) => (getYTop(baseY) + getYBot(baseY)) / 2;

      const spread = r * 0.4 * t;

      ctx.beginPath();
      for (let a = start; a <= end; a += 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;
        const y = getYTop(baseY);

        if (a === start) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let a = start; a <= end; a += 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;
        const y = getYBot(baseY);

        if (a === start) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const teeth = 14;

      for (let i = 0; i < teeth; i++) {
        const a = start + (i / (teeth - 1)) * (end - start);

        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const yTop = getYTop(baseY);
        const yBot = getYBot(baseY);

        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBot);
        ctx.stroke();
      }

      ctx.beginPath();
      for (let a = start; a <= end; a += 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const yMid = getYMid(baseY);

        if (a === start) ctx.moveTo(x, yMid);
        else ctx.lineTo(x, yMid);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let a = start; a <= end; a += 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const yMid = getYMid(baseY) - 10;

        const y = yMid - spread * Math.sin(a) ** 2;

        if (a === start) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      for (let a = end; a >= start; a -= 0.05) {
        const x = Math.cos(a) * r;
        const baseY = Math.sin(a) * r;

        const yMid = getYMid(baseY) + 10;

        const y = yMid + spread * Math.sin(a) ** 2;

        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = state.off ? "#fbff08" : "yellow";
      ctx.fill();

      // const size = r * 0.1;
      // const offset = r * 0.4;

      // ctx.strokeStyle = "black";
      // ctx.lineWidth = 2;

      // ctx.beginPath();
      // ctx.moveTo(-size * 0.5 - offset, -size * 0.5);
      // ctx.lineTo(size * 0.5 - offset, -size * 0.5);
      // ctx.moveTo(-offset, -size);
      // ctx.lineTo(-offset, size);
      // ctx.moveTo(-size * 0.5 + offset, -size * 0.5);
      // ctx.lineTo(size * 0.5 + offset, -size * 0.5);
      // ctx.moveTo(offset, -size);
      // ctx.lineTo(offset, size);
      // ctx.stroke();

      // ctx.strokeStyle = state.off ? "white" : "#eee";
      // ctx.lineWidth = 1;

      // ctx.beginPath();
      // ctx.moveTo(-size * 0.5 - offset, -size * 0.5);
      // ctx.lineTo(size * 0.5 - offset, -size * 0.5);
      // ctx.moveTo(-offset, -size);
      // ctx.lineTo(-offset, size);
      // ctx.moveTo(-size * 0.5 + offset, -size * 0.5);
      // ctx.lineTo(size * 0.5 + offset, -size * 0.5);
      // ctx.moveTo(offset, -size);
      // ctx.lineTo(offset, size);
      // ctx.stroke();
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
