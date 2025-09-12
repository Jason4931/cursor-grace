export function setup(host, { fadeOut = true } = {}) {
  const state = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    radius: 0,
    maxRadius: 100,
    life: 10,
    fade: 0.3,
    mouse: false,
    oneTimeRed: 0,
    red: false,
    eyeState1: 0,
    eyeState2: 0,
    eyeState3: 0,
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
    if (state.mouse) state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("mousemove", onMouseMove);
      return;
    }
    if (fadeOut && state.life < 0.2) {
      state.fade = 1;
      if (state.eyeState3 == 1) {
        state.eyeState3 = 2;
        setTimeout(() => {
          state.eyeState3 = 0;
        }, 200);
      }
    } else if (state.life < 0.7) {
      if (!state.red && state.oneTimeRed == 2) {
        state.red = true;
        state.eyeState3 = 1;
        setTimeout(() => {
          state.red = false;
          state.oneTimeRed++;
        }, 100);
      }
    } else if (state.life < 3.2) {
      state.fade = Math.max(0.3, state.life - 2.2);
      if (state.eyeState2 == 1) {
        state.eyeState2 = 2;
        setTimeout(() => {
          state.eyeState2 = 0;
        }, 200);
      }
    } else if (state.life < 3.7) {
      if (!state.red && state.oneTimeRed == 1) {
        state.red = true;
        state.eyeState2 = 1;
        setTimeout(() => {
          state.red = false;
          state.oneTimeRed++;
        }, 100);
      }
    } else if (state.life < 6.2) {
      state.fade = Math.max(0.3, state.life - 5.2);
      if (state.eyeState1 == 1) {
        state.eyeState1 = 2;
        setTimeout(() => {
          state.eyeState1 = 0;
        }, 200);
      }
    } else if (state.life < 6.7) {
      if (!state.red && state.oneTimeRed == 0) {
        state.red = true;
        state.eyeState1 = 1;
        setTimeout(() => {
          state.red = false;
          state.oneTimeRed++;
        }, 100);
      }
    }

    //process
    if (mouse.x != 100000 && mouse.y != 100000) {
      if (!state.mouse) {
        state.x = mouse.x;
        state.y = mouse.y;
      }
      state.mouse = true;
    }

    if (state.mouse) {
      let ease = 2;
      if (
        Math.hypot(mouse.x - state.x, mouse.y - state.y) >
        state.maxRadius * 2
      ) {
        ease = 100;
      } else if (
        Math.hypot(mouse.x - state.x, mouse.y - state.y) > state.maxRadius
      ) {
        ease = 10;
      } else {
        ease = 2;
      }

      const diffX = state.targetX - state.x;
      state.x += diffX * ease * dt;
      if (Math.abs(diffX) < 0.1) state.x = state.targetX;
      const diffY = state.targetY - state.y;
      state.y += diffY * ease * dt;
      if (Math.abs(diffY) < 0.1) state.y = state.targetY;

      state.targetX = mouse.x;
      state.targetY = mouse.y;

      const diff = state.maxRadius - state.radius;
      state.radius += diff * ease * dt;
      if (Math.abs(diff) < 0.1) state.radius = state.maxRadius;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    if (state.mouse) {
      ctx.globalAlpha = 0.5 * state.fade;
      ctx.fillStyle = state.red ? "#ff0000" : "#808080";
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = state.fade;
      ctx.fillStyle = state.red ? "#ff0000" : "#808080";
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.radius, 0, Math.PI * 2);
      ctx.arc(state.x, state.y, state.radius * 0.5, 0, Math.PI * 2, true);
      ctx.fill("evenodd");

      function bulgeLine(angle, bulges) {
        const x1 = state.x + Math.cos(angle) * innerR;
        const y1 = state.y + Math.sin(angle) * innerR;
        const x2 = state.x + Math.cos(angle) * r;
        const y2 = state.y + Math.sin(angle) * r;
        const perpAngle = angle + Math.PI / 2;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const bulge = r * bulges;
        const cx1 = midX + Math.cos(perpAngle) * bulge;
        const cy1 = midY + Math.sin(perpAngle) * bulge;
        const cx2 = midX - Math.cos(perpAngle) * bulge;
        const cy2 = midY - Math.sin(perpAngle) * bulge;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx1, cy1, x2, y2);
        ctx.quadraticCurveTo(cx2, cy2, x1, y1);
        ctx.closePath();
        ctx.fillStyle = state.red ? "#ff0000" : "#000";
        ctx.fill();
      }
      ctx.globalAlpha = Math.min(1, 10 * state.fade);
      ctx.strokeStyle = state.red ? "#ff0000" : "#000";
      ctx.lineWidth = 2;
      const r = state.radius;
      const innerR = r * 0.5;
      if (state.eyeState1 == 0) {
        ctx.beginPath();
        const x1 = state.x - innerR * 0.7 + (Math.random() * 2 - 1) * 1.5;
        const y1 = state.y - innerR * 0.7 + (Math.random() * 2 - 1) * 1.5;
        const x2 = state.x - r * 0.7 + (Math.random() * 2 - 1) * 1.5;
        const y2 = state.y - r * 0.7 + (Math.random() * 2 - 1) * 1.5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (state.eyeState1 == 1) {
        let angle = (-3 * Math.PI) / 4 + (Math.random() * 0.1 - 0.05);
        bulgeLine(angle, 0.15);
      } else if (state.eyeState1 == 2) {
        let angle = (-3 * Math.PI) / 4 + (Math.random() * 0.1 - 0.05);
        bulgeLine(angle, 0.3);
        const mx = state.x + Math.cos(angle) * ((innerR + r) / 2);
        const my = state.y + Math.sin(angle) * ((innerR + r) / 2);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (state.eyeState2 == 0) {
        ctx.beginPath();
        const x1 = state.x + innerR * 0.7 + (Math.random() * 2 - 1) * 1.5;
        const y1 = state.y - innerR * 0.7 + (Math.random() * 2 - 1) * 1.5;
        const x2 = state.x + r * 0.7 + (Math.random() * 2 - 1) * 1.5;
        const y2 = state.y - r * 0.7 + (Math.random() * 2 - 1) * 1.5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (state.eyeState2 == 1) {
        let angle = -Math.PI / 4 + (Math.random() * 0.1 - 0.05);
        bulgeLine(angle, 0.15);
      } else if (state.eyeState2 == 2) {
        let angle = -Math.PI / 4 + (Math.random() * 0.1 - 0.05);
        bulgeLine(angle, 0.3);
        const mx = state.x + Math.cos(angle) * ((innerR + r) / 2);
        const my = state.y + Math.sin(angle) * ((innerR + r) / 2);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (state.eyeState3 == 0) {
        ctx.beginPath();
        const x1 = state.x + (Math.random() * 2 - 1) * 1.5;
        const y1 = state.y + innerR + (Math.random() * 2 - 1) * 1.5;
        const x2 = state.x + (Math.random() * 2 - 1) * 1.5;
        const y2 = state.y + r + (Math.random() * 2 - 1) * 1.5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (state.eyeState3 == 1) {
        let angle = Math.PI / 2 + (Math.random() * 0.1 - 0.05);
        bulgeLine(angle, 0.15);
      } else if (state.eyeState3 == 2) {
        let angle = Math.PI / 2 + (Math.random() * 0.1 - 0.05);
        bulgeLine(angle, 0.3);
        const mx = state.x + Math.cos(angle) * ((innerR + r) / 2);
        const my = state.y + Math.sin(angle) * ((innerR + r) / 2);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      const numSpikes = 15;
      const spikeLengthBase = r * 0.1;
      const spikeLengthMax = r * 0.6;
      const spikeWidth = r * 0.1;

      ctx.globalAlpha = Math.min(1, 1.333 * state.fade);

      for (let i = 0; i < numSpikes; i++) {
        const angle = Math.PI - (i / (numSpikes - 1)) * Math.PI;
        const xBase = state.x + Math.cos(angle) * r;
        const yBase = state.y + Math.sin(angle) * r;

        const t = Math.abs(i - (numSpikes - 1) / 2) / ((numSpikes - 1) / 2);
        const spikeLength =
          spikeLengthMax - (spikeLengthMax - spikeLengthBase) * t;

        const perpAngle = angle - Math.PI / 2;

        const xLeft = xBase + Math.cos(perpAngle) * spikeWidth;
        const yLeft = yBase + Math.sin(perpAngle) * spikeWidth;
        const xRight = xBase - Math.cos(perpAngle) * spikeWidth;
        const yRight = yBase - Math.sin(perpAngle) * spikeWidth;

        const xTip = xBase;
        const yTip = yBase + spikeLength;

        const grad = ctx.createLinearGradient(xBase, yBase, xBase, yTip);
        grad.addColorStop(0, state.red ? "#ff0000" : "#808080");
        grad.addColorStop(1, "#000000");
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(xLeft, yLeft - 0.2);
        ctx.lineTo(xTip, yTip);
        ctx.lineTo(xRight, yRight - 0.2);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
