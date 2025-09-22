export function setup(host, { fadeOut = true } = {}) {
  const lifeTime = Math.floor(Math.random() * 10) + 7;
  const state = {
    angle: Math.PI / 2,
    life: lifeTime,
    fade: 0,
    fade2: 0.3,
    currentNumber: 0,
    turn: false,
    noClick: false,
    timeCounter: 0,
    y: 0,
    flashing: true,
  };

  function onMouseClick(e) {
    if (state.noClick) {
      state.fade2 = 1;
    }
  }
  host.canvas.addEventListener("click", onMouseClick);

  function update(dt) {
    state.life -= dt;
    if (state.life <= 0) {
      unregister();
      host.canvas.removeEventListener("click", onMouseClick);
      return;
    }
    if (fadeOut && state.life < 2) {
      state.noClick = true;
      state.turn = false;
      state.fade = Math.max(0, state.life - 1.5);
    } else if (state.life < lifeTime - 2.1) {
    } else if (state.life < lifeTime - 2) {
      state.currentNumber = 0;
      state.turn = true;
      state.flashing = false;
    } else {
      state.currentNumber = lifeTime - 4;
      state.fade += 0.01;
      if (state.fade > 0.3) {
        state.fade = 0.3;
      }
    }

    //process

    if (state.life < lifeTime - 2) {
      state.timeCounter += dt;
    }
    if (state.timeCounter >= 1.01) {
      state.currentNumber++;
      state.timeCounter -= 1.01;
    }
    if (state.timeCounter < 0.1) {
      const progress = state.timeCounter / 0.1;
      state.angle = Math.PI / 2 + progress * Math.PI * 2;
    } else {
      state.angle = Math.PI / 2;
    }
  }

  function draw(ctx) {
    if (state.life <= 0) return;
    ctx.save();
    const w = host.canvas.width;
    const h = host.canvas.height;

    //setup
    const centerRadius = 30;
    ctx.globalAlpha = state.noClick ? state.fade : 0.5 * state.fade;
    ctx.fillStyle = "#0000fd";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, h / 2 - 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = state.fade;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, centerRadius, 0, Math.PI * 2);
    ctx.fill();

    const headLength = 60;
    const radius = h / 2 - 15;
    const shaftLength = radius - headLength + 8;

    let shaftStartX;
    let shaftStartY;
    let shaftEndX;
    let shaftEndY;
    let arrowX;
    let arrowY;

    if (state.turn) {
      const blurSteps = 10;

      for (let i = 1; i <= blurSteps; i++) {
        if (state.angle == Math.PI / 2) break;

        const trailAngle = state.angle - i * 0.1;

        const shaftStartX = w / 2 + Math.cos(trailAngle) * (centerRadius - 0.5);
        const shaftStartY = h / 2 - Math.sin(trailAngle) * (centerRadius - 0.5);

        const shaftEndX = w / 2 + Math.cos(trailAngle) * shaftLength;
        const shaftEndY = h / 2 - Math.sin(trailAngle) * shaftLength;

        const arrowX = w / 2 + Math.cos(trailAngle) * radius;
        const arrowY = h / 2 - Math.sin(trailAngle) * radius;

        ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - i / blurSteps)})`;
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(shaftStartX, shaftStartY);
        ctx.lineTo(shaftEndX, shaftEndY);
        ctx.stroke();

        const angle = Math.atan2(h / 2 - arrowY, arrowX - w / 2);
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - headLength * Math.cos(angle - Math.PI / 6),
          arrowY + headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX - headLength * Math.cos(angle + Math.PI / 6),
          arrowY + headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - i / blurSteps)})`;
        ctx.fill();
      }

      shaftStartX = w / 2 + Math.cos(state.angle) * (centerRadius - 0.5);
      shaftStartY = h / 2 - Math.sin(state.angle) * (centerRadius - 0.5);

      shaftEndX = w / 2 + Math.cos(state.angle) * shaftLength;
      shaftEndY = h / 2 - Math.sin(state.angle) * shaftLength;

      arrowX = w / 2 + Math.cos(state.angle) * radius;
      arrowY = h / 2 - Math.sin(state.angle) * radius;
    } else {
      shaftStartX = w / 2 + Math.cos(Math.PI / 2) * (centerRadius - 0.5);
      shaftStartY = h / 2 - Math.sin(Math.PI / 2) * (centerRadius - 0.5);

      shaftEndX = w / 2 + Math.cos(Math.PI / 2) * shaftLength;
      shaftEndY = h / 2 - Math.sin(Math.PI / 2) * shaftLength;

      arrowX = w / 2 + Math.cos(Math.PI / 2) * radius;
      arrowY = h / 2 - Math.sin(Math.PI / 2) * radius;
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(shaftStartX, shaftStartY);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.stroke();

    const angle = Math.atan2(h / 2 - arrowY, arrowX - w / 2);
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - headLength * Math.cos(angle - Math.PI / 6),
      arrowY + headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      arrowX - headLength * Math.cos(angle + Math.PI / 6),
      arrowY + headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.strokeStyle = "#0000fd";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, h / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = state.flashing
      ? Math.min(1, Math.random() * 0.5 + state.fade)
      : state.fade;
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#0000fd";
    ctx.lineWidth = 4;
    ctx.strokeText(state.currentNumber.toString(), w / 2, h / 2 + 5);
    ctx.fillText(state.currentNumber.toString(), w / 2, h / 2 + 5);

    if (state.life < 1.9) {
      state.y += 100;
      ctx.globalAlpha = state.fade2;
      ctx.fillStyle = "#0000fd";
      ctx.fillRect(0, 0, w, state.y);
    }

    ctx.restore();
  }

  const unregister = host.register({ update, draw });
  return unregister;
}
