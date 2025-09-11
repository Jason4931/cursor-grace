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

let op = 0;
let runned = [];
function entitySpawnInfo(entity, color, entity2 = "", color2 = "") {
  document.getElementById("info").innerHTML = `${entity} appears.`;
  document.getElementById("info").style.color = `${color}`;
  if (entity2 && color2) {
    document.getElementById("info2").innerHTML = `${entity2} appears.`;
    document.getElementById("info2").style.color = `${color2}`;
    runned = [...runned, entity, entity2];
  } else {
    document.getElementById("info2").innerHTML = "";
    runned = [...runned, entity];
  }
  op = 1;
}
setInterval(() => {
  document.getElementById("info").style.opacity = `${op}`;
  document.getElementById("info2").style.opacity = `${op}`;
  op -= 0.01;
  if (op < 0) {
    op = 0;
  }
}, 100);

let death = false;
let goatman = false;
let eyes = false;
async function RUN() {
  hostAPI.clearAll();
  function runCarnation() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        const modCarnation = await import(
          `./entity/carnation.js?cacheBust=${Date.now()}`
        );
        modCarnation.setup(hostAPI);
        setTimeout(() => {
          runCarnation();
        }, 10000);
      }
    }, delay);
  }
  function runGoatman() {
    let delay = Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        if (Math.random() < 0.2) {
          goatman = true;
          const modGoatman = await import(
            `./entity/goatman.js?cacheBust=${Date.now()}`
          );
          modGoatman.setup(hostAPI);
          setTimeout(() => {
            goatman = false;
            runGoatman();
          }, 20000);
        } else {
          runGoatman();
        }
      }
    }, delay);
  }
  function runSlight() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        if (!eyes || Math.random() < 0.2) {
          eyes = true;
          const modSlight = await import(
            `./entity/slight.js?cacheBust=${Date.now()}`
          );
          modSlight.setup(hostAPI);
          setTimeout(() => {
            eyes = false;
            runSlight();
          }, 10000);
        } else {
          runSlight();
        }
      }
    }, delay);
  }
  function runSlugfish() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        const modSlugfish = await import(
          `./entity/slugfish.js?cacheBust=${Date.now()}`
        );
        modSlugfish.setup(hostAPI);
        setTimeout(() => {
          runSlugfish();
        }, 5000);
      }
    }, delay);
  }
  function runElkman() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        const modElkman = await import(
          `./entity/elkman.js?cacheBust=${Date.now()}`
        );
        modElkman.setup(hostAPI);
        setTimeout(() => {
          runElkman();
        }, 10000);
      }
    }, delay);
  }
  function runHeed() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        if (!eyes || Math.random() < 0.2) {
          eyes = true;
          const modHeed = await import(
            `./entity/heed.js?cacheBust=${Date.now()}`
          );
          modHeed.setup(hostAPI);
          setTimeout(() => {
            eyes = false;
            runHeed();
          }, 10000);
        } else {
          runHeed();
        }
      }
    }, delay);
  }
  function runDozer() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        const modDozer = await import(
          `./entity/dozer.js?cacheBust=${Date.now()}`
        );
        modDozer.setup(hostAPI);
        setTimeout(() => {
          runDozer();
        }, 5000);
      }
    }, delay);
  }
  function runSorrow() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(async () => {
      if (!death) {
        const modSorrow = await import(
          `./entity/sorrow.js?cacheBust=${Date.now()}`
        );
        modSorrow.setup(hostAPI);
        setTimeout(() => {
          runSorrow();
        }, 5000);
      }
    }, delay);
  }

  /*
  TODO:
  Bug dozer mousemove
  Elkman design change
  Carnation longer death(?)
  LITANY
  */

  // const modDoppel = await import("./entity/doppel.js");
  // modDoppel.setup(hostAPI);
  runCarnation();
  entitySpawnInfo("Carnation", "#cf0693");
  let goatmanTimeout = setTimeout(() => {
    if (death) return;
    runGoatman();
    entitySpawnInfo("Goatman", "#fbff08");
  }, 60000);
  let slightTimeout = setTimeout(() => {
    if (death) return;
    runSlight();
    entitySpawnInfo("Slight", "#1304d1");
  }, 120000);
  let slugfishElkmanTimeout = setTimeout(() => {
    if (death) return;
    runSlugfish();
    runElkman();
    entitySpawnInfo("Slugfish", "#808080", "Elkman", "#ffffff");
  }, 180000);
  let heedTimeout = setTimeout(() => {
    if (death) return;
    runHeed();
    entitySpawnInfo("Heed", "#fe0102");
  }, 240000);
  let dozerSorrowTimeout = setTimeout(() => {
    if (death) return;
    runDozer();
    runSorrow();
    entitySpawnInfo("Dozer", "#f4ea37", "Sorrow", "#b30000");
  }, 300000);

  let upPressCount = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      upPressCount++;
      if (upPressCount >= 10) {
        upPressCount = 0;
        if (!runned.includes("Goatman")) {
          clearTimeout(goatmanTimeout);
          runGoatman();
          entitySpawnInfo("Goatman", "#fbff08");
        }
        if (!runned.includes("Slight")) {
          clearTimeout(slightTimeout);
          runSlight();
          entitySpawnInfo("Slight", "#1304d1");
        }
        if (!runned.includes("Slugfish")) {
          clearTimeout(slugfishElkmanTimeout);
          runSlugfish();
          runElkman();
          entitySpawnInfo("Slugfish", "#808080", "Elkman", "#ffffff");
        }
        if (!runned.includes("Heed")) {
          clearTimeout(heedTimeout);
          runHeed();
          entitySpawnInfo("Heed", "#fe0102");
        }
        if (!runned.includes("Dozer")) {
          clearTimeout(dozerSorrowTimeout);
          runDozer();
          runSorrow();
          entitySpawnInfo("Dozer", "#f4ea37", "Sorrow", "#b30000");
        }
        entitySpawnInfo("Everyone", "#fff");
      }
    }
  });
}
RUN();

let mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  mouse.x = (e.clientX - rect.left) * scaleX;
  mouse.y = (e.clientY - rect.top) * scaleY;
});
const targetColors = [
  "#cf0693",
  "#fbff08",
  "#1304d1",
  "#808080",
  "#ffffff",
  "#fe0102",
  "#f4ea37",
  "#b30000",
];
function onColorTouched(hexColor) {
  if (death) return;
  death = true;
  setTimeout(() => {
    setTimeout(() => {
      document.getElementById("death").style.display = "flex";
      document.getElementById("white").style.display = "none";
    }, 100);
    document.getElementById("white").style.display = "flex";
  }, 150);
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
  // console.log(hex);
  if (targetColors.includes(hex.slice(0, 7)) && pixel[3] >= 229) {
    onColorTouched(hex);
  }
}

let seconds = 0;
function updateTimer() {
  if (death) return;
  seconds++;
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${mins}:${secs}`;
}
setInterval(updateTimer, 1000);
