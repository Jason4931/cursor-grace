import { stem } from "../main.js";
export function setup(host, { fadeOut = true } = {}) {
  const state = {
    life: 3,
    fade: 1,
    trail: [],
    trailDelay: 0.1,
    mouse: false,
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
    if (stem.stop) return;
    if (state.mouse) state.life -= dt;
    if (mouse.x != 100000 && mouse.y != 100000) {
      state.mouse = true;
    }
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    }
    if (fadeOut && state.life < 0.25) {
      state.fade = Math.max(0, state.life * 4);
    }

    //process
    const now = performance.now() / 1000;

    state.trail.push({
      x: mouse.x,
      y: mouse.y,
      t: now,
    });

    while (state.trail.length && now - state.trail[0].t > 1) {
      state.trail.shift();
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = state.fade;
    const t = 3 - state.life;

    ctx.translate(mouse.x, mouse.y);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    const open = Math.min(1, Math.max(0, (t - 1) / 0.25));

    const width = 50 * open;
    const height = 50;

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0, -height);

    ctx.quadraticCurveTo(-width, 0, 0, height);
    ctx.quadraticCurveTo(width, 0, 0, -height);

    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#00b16c";
    ctx.lineWidth = 2;

    function eyeEdge(y, side) {
      const t = y / height;
      const x = width * (1 - t * t);
      return side === "left" ? -x : x;
    }
    for (let i = 0; i < 3; i++) {
      const y = -28 + i * 10;

      const edge = eyeEdge(y, "left");

      ctx.beginPath();
      ctx.moveTo(edge - 20 * open, y);
      ctx.lineTo(edge + 25 * Math.max(0.2, open), y);
      ctx.stroke();
    }
    for (let i = 0; i < 3; i++) {
      const y = 8 + i * 10;

      const edge = eyeEdge(y, "right");

      ctx.beginPath();
      ctx.moveTo(edge - 25 * Math.max(0.2, open), y);
      ctx.lineTo(edge + 20 * open, y);
      ctx.stroke();
    }

    if (t >= 1.25) {
      // diamond eye
      ctx.fillStyle = "white";

      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(13, 0);
      ctx.lineTo(0, 13);
      ctx.lineTo(-13, 0);
      ctx.closePath();
      ctx.fill();

      // pupil
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;

      function spike(rot) {
        ctx.save();
        ctx.rotate(rot);

        ctx.beginPath();

        ctx.moveTo(0, -13);

        ctx.quadraticCurveTo(-9, -18, -8, -13);

        ctx.moveTo(0, -13);

        ctx.quadraticCurveTo(9, -18, 8, -13);

        ctx.stroke();
        ctx.restore();
      }

      spike(0);
      spike(Math.PI / 2);
      spike(Math.PI);
      spike(Math.PI * 1.5);
    }

    if (t >= 1.25) {
      const now = performance.now() / 1000;
      const targetTime = now - state.trailDelay;

      let past = null;

      for (let i = state.trail.length - 1; i >= 0; i--) {
        if (state.trail[i].t <= targetTime) {
          past = state.trail[i];
          break;
        }
      }

      if (past) {
        ctx.fillStyle = "#00b16c";

        ctx.beginPath();
        ctx.arc(past.x - mouse.x, past.y - mouse.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
