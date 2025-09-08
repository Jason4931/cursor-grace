const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const registry = {
  updaters: new Set(),
  drawers: new Set(),
};

const hostAPI = {
  register({ update, draw }) {
    if (update) registry.updaters.add(update);
    if (draw) registry.drawers.add(draw);
    return () => {
      if (update) registry.updaters.delete(update);
      if (draw) registry.drawers.delete(draw);
    };
  },
  clearAll() {
    registry.updaters.clear();
    registry.drawers.clear();
  },
  canvas,
  ctx,
};

let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  for (const upd of registry.updaters) {
    try {
      upd(dt, now);
    } catch (e) {
      console.error("update err", e);
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const draw of registry.drawers) {
    try {
      draw(ctx);
    } catch (e) {
      console.error("draw err", e);
    }
  }

  checkPixelUnderCursor();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

let death = false;
let goatman = false;
async function RUN() {
  hostAPI.clearAll();
  function runCarnation() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        const modCarnation = await import("./entity/carnation.js");
        modCarnation.setup(hostAPI);
        setTimeout(() => {
          runCarnation();
        }, 10000);
      }
    }, delay);
  }

  runCarnation();
}
RUN();

let mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
const targetColors = ["#ea0075"];
function onColorTouched(hexColor) {
  if (death) return;
  death = true;
  setTimeout(() => {
    setTimeout(() => {
      document.getElementById("death").style.display = "flex";
      document.getElementById("white").style.display = "none";
    }, 150);
    document.getElementById("white").style.display = "flex";
  }, 200);
}
function rgbaToHex(r, g, b, a = 255) {
  return (
    "#" +
    [r, g, b, a]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toLowerCase()
  );
}
function checkPixelUnderCursor() {
  if (death) return;
  const pixel = ctx.getImageData(mouse.x, mouse.y, 1, 1).data;
  const hex = rgbaToHex(pixel[0], pixel[1], pixel[2], pixel[3]);
  console.log(hex);
  if (targetColors.includes(hex.slice(0, 7)) && pixel[3] >= 229) {
    onColorTouched(hex);
  }
}
