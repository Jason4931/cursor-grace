import { duplicateFool } from "../main.js";
export function setup(host, { fadeOut = true } = {}) {
  const state = {
    life: 1,
    fade: 1,

    x: -100,
    y: -100,
    r: 18,

    timer: 5,
    knock: 0,
    looking: false,

    agro: false,
    agroBurst: 0,
    agroDelay: 1,

    speed: 0,

    redAlpha: 0,
    dropletTimer: 0,
    droplets: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ],

    knockDelay: 1,
    angle: -Math.PI / 2 + (-1 + Math.random() * 2) * Math.PI,
    orbitR: 80,
    angleVel: 0,

    clickCooldown: 0,
    clickCounter: 0,
    dissapear: false,

    mouse: false,
    cursorInside: false,
  };

  const mouse = { x: 0, y: 0 };
  let prevMouseX = 0;
  let prevMouseY = 0;
  function onMouseMove(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;

    prevMouseX = mouse.x;
    prevMouseY = mouse.y;

    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  }
  host.canvas.addEventListener("mousemove", onMouseMove);
  function onMouseClick(e) {
    const rect = host.canvas.getBoundingClientRect();
    const scaleX = host.canvas.width / rect.width;
    const scaleY = host.canvas.height / rect.height;

    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;

    if (state.agro || state.dissapear) return;

    const mvx = mouse.x - prevMouseX;
    const mvy = mouse.y - prevMouseY;
    const md = Math.hypot(mvx, mvy) || 1;

    const dx = state.x - mouse.x;
    const dy = state.y - mouse.y;
    const dist = Math.hypot(dx, dy);

    const ndx = dx / dist;
    const ndy = dy / dist;

    const mvnx = mvx / md;
    const mvny = mvy / md;

    const dot = mvnx * ndx + mvny * ndy;

    if (dot > 0) {
      state.clickCooldown = 1;
      if (state.clickCooldown > 0) {
        state.clickCounter++;
        if (state.clickCounter >= 10) {
          state.dissapear = true;
        }
      }
      state.timer = 5;

      const cross = mvnx * ndy - mvny * ndx;

      if (cross > 0) state.angleVel = 6;
      else state.angleVel = -6;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    if (mouse.x != 0 && mouse.y != 0) {
      state.mouse = true;
    }
    if (!state.mouse) return;
    if (state.dissapear) state.life -= dt;
    if (state.life <= 0) {
      duplicateFool();
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }

    //process
    state.dropletTimer += dt;
    if (state.dropletTimer > 0.2) {
      state.dropletTimer -= 0.2;

      for (const d of state.droplets) {
        const a = Math.random() * Math.PI * 2;
        const r = 8 + Math.random() * 6;

        d.x = Math.cos(a) * r;
        d.y = Math.sin(a) * r;
      }
    }
    if (state.clickCooldown > 0) {
      state.clickCooldown -= dt;
    } else {
      state.clickCounter = 0;
    }
    if (state.dissapear) return;
    if (!state.agro) {
      state.knockDelay -= dt;

      if (state.knockDelay <= 0) {
        state.knockDelay = 1;

        const mvx = mouse.x - prevMouseX;
        const mvy = mouse.y - prevMouseY;
        const md = Math.hypot(mvx, mvy) || 1;

        const dx = state.x - mouse.x;
        const dy = state.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        const ndx = dx / dist;
        const ndy = dy / dist;

        const mvnx = mvx / md;
        const mvny = mvy / md;
        const cross = mvnx * ndy - mvny * ndx;

        if (cross > 0) state.angleVel = -3;
        else state.angleVel = 3;
      }

      state.angle += state.angleVel * dt;
      state.angleVel *= 0.9;

      state.x = mouse.x + Math.cos(state.angle) * state.orbitR;
      state.y = mouse.y + Math.sin(state.angle) * state.orbitR;

      const mvx = mouse.x - prevMouseX;
      const mvy = mouse.y - prevMouseY;
      const md = Math.hypot(mvx, mvy) || 1;

      const dx = state.x - mouse.x;
      const dy = state.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      const ndx = dx / dist;
      const ndy = dy / dist;

      const mvnx = mvx / md;
      const mvny = mvy / md;

      const dot = mvnx * ndx + mvny * ndy;

      if (dot > 0) {
        state.looking = true;
        state.timer -= dt;
      } else {
        state.looking = false;
      }

      if (state.timer <= 0) {
        state.agro = true;
        state.agroBurst = 1;
      }

      if (state.timer < 2.5) {
        state.redAlpha = (2.5 - state.timer) / 2.5;
      } else {
        state.redAlpha = 0;
      }

      const radius = 80;

      if (state.knock !== 0) {
        state.knock *= Math.pow(0.02, dt);
      }

      const offset = state.knock * radius;

      state.x += (mouse.x + offset - state.x) * dt * 10;
      state.y += (mouse.y - 80 - state.y) * dt * 10;
    } else {
      if (state.agroDelay > 0) {
        state.agroDelay -= dt;
      } else {
        const dx = mouse.x - state.x;
        const dy = mouse.y - state.y;
        const dist = Math.hypot(dx, dy) || 1;
        state.cursorInside = dist < state.r;

        const nx = dx / dist;
        const ny = dy / dist;

        state.speed += dt * 40;

        state.x += nx * state.speed * dt;
        state.y += ny * state.speed * dt;
      }

      if (state.agroBurst > 0) {
        state.agroBurst -= dt;
      }
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();

    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    ctx.globalAlpha = (state.looking || state.agro) && state.life == 1
      ? state.fade
      : state.fade * 0.5

    ctx.translate(
      state.x + (Math.random() * 2 - 1) * state.redAlpha * (state.agro ? 2 : 1),
      state.y +
      13 +
      (Math.random() * 2 - 1) * state.redAlpha * (state.agro ? 2 : 1) -
      Math.pow(1 - state.life, 2) * 720,
    );

    const r = state.r;

    ctx.save();

    if (!state.agro) {
      const t = state.dropletTimer / 0.1;

      ctx.fillStyle = "white";
      ctx.globalAlpha = state.fade;

      const drops = [
        { start: 0.833, i: 0 },
        { start: 1.667, i: 1 },
        { start: 2.5, i: 2 }
      ];

      for (const d of drops) {
        if (state.timer <= d.start) {
          const base = state.droplets[d.i];

          const x = base.x;
          const y = base.y + t * 6;

          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    if (state.agro) {
      ctx.fillStyle = "red";
      ctx.globalAlpha = state.redAlpha * state.fade;

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
      ctx.fill();

      const spikes = 26;
      const base = state.r * 0.25;
      const max = state.r * 2;

      ctx.fillStyle = "red";
      ctx.beginPath();

      for (let i = 0; i < spikes; i++) {
        const a = Math.random() * Math.PI * 2;
        const spread = 0.15 + Math.random() * 0.15;

        const rOuter = max * (0.6 + Math.random() * 0.8);

        const a1 = a - spread;
        const a2 = a + spread;

        const x1 = Math.cos(a1) * base;
        const y1 = Math.sin(a1) * base;

        const x2 = Math.cos(a) * rOuter;
        const y2 = Math.sin(a) * rOuter;

        const x3 = Math.cos(a2) * base;
        const y3 = Math.sin(a2) * base;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
      }

      ctx.fill();
    }
    ctx.restore();

    if (state.agro && state.cursorInside) {
      ctx.fillStyle = "white";

      ctx.beginPath();
      ctx.arc(0, 0, state.r * 0.75, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawEye(x, y, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot + Math.PI / 2);

      ctx.fillStyle = "white";

      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.quadraticCurveTo(0, -4.5, 8, 0);
      ctx.quadraticCurveTo(0, 4.5, -8, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1.5;

      ctx.beginPath();

      ctx.moveTo(0, -2.5);
      ctx.lineTo(0, 2.5);

      ctx.stroke();

      ctx.restore();
    }

    drawEye(-9, -8, -0.6, "left");
    drawEye(9, -8, 0.6, "right");
    drawEye(0, 8, 0, "mid");

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
