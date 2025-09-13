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
  if (entity == "HARD MODE ENABLED") {
    document.getElementById("info").innerHTML = `${entity}.`;
  } else {
    document.getElementById("info").innerHTML = `${entity} appears.`;
  }
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

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

let death = false;
let goatman = false;
let eyes = false;
let absoluteNoDelay = false;
let combos = 0;
async function RUN() {
  hostAPI.clearAll();
  function runCarnation() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modCarnation = await import(
              `./entity/carnation.js?cacheBust=${Date.now()}`
            );
            modCarnation.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runCarnation();
            }, 10000);
          } else {
            runCarnation();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runGoatman() {
    let delay = Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (Math.random() < 0.2 && combos <= 5) {
            goatman = true;
            const modGoatman = await import(
              `./entity/goatman.js?cacheBust=${Date.now()}`
            );
            modGoatman.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              goatman = false;
              runGoatman();
            }, 20000);
          } else {
            runGoatman();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runSlight() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if ((!eyes || Math.random() < 0.2) && combos <= 5) {
            eyes = true;
            const modSlight = await import(
              `./entity/slight.js?cacheBust=${Date.now()}`
            );
            modSlight.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              eyes = false;
              runSlight();
            }, 10000);
          } else {
            runSlight();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runSlugfish() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modSlugfish = await import(
              `./entity/slugfish.js?cacheBust=${Date.now()}`
            );
            modSlugfish.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runSlugfish();
            }, 5000);
          } else {
            runSlugfish();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runElkman() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modElkman = await import(
              `./entity/elkman.js?cacheBust=${Date.now()}`
            );
            modElkman.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runElkman();
            }, 10000);
          } else {
            runElkman();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runHeed() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if ((!eyes || Math.random() < 0.2) && combos <= 5) {
            eyes = true;
            const modHeed = await import(
              `./entity/heed.js?cacheBust=${Date.now()}`
            );
            modHeed.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              eyes = false;
              runHeed();
            }, 10000);
          } else {
            runHeed();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runDozer() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modDozer = await import(
              `./entity/dozer.js?cacheBust=${Date.now()}`
            );
            modDozer.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runDozer();
            }, 4000);
          } else {
            runDozer();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runSorrow() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modSorrow = await import(
              `./entity/sorrow.js?cacheBust=${Date.now()}`
            );
            modSorrow.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runSorrow();
            }, 5000);
          } else {
            runSorrow();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runLitany() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modLitany = await import(
              `./entity/litany.js?cacheBust=${Date.now()}`
            );
            modLitany.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runLitany();
            }, 10000);
          } else {
            runLitany();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runDoppel() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modDoppel = await import(
              `./entity/doppel.js?cacheBust=${Date.now()}`
            );
            modDoppel.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runDoppel();
            }, 20000);
          } else {
            runDoppel();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }
  function runKookoo() {
    let delay = goatman
      ? Math.floor(Math.random() * 5000) + 5000
      : Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5) {
            const modKookoo = await import(
              `./entity/kookoo.js?cacheBust=${Date.now()}`
            );
            modKookoo.setup(hostAPI);
            combos++;
            setTimeout(() => {
              combos--;
              runKookoo();
            }, 16000);
          } else {
            runKookoo();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay
    );
  }

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

  let arrayTime = [
    420000, 480000, 540000,
    // 600000,
    // 660000,
    // 720000,
    // 780000,
    // 840000,
  ];
  shuffle(arrayTime);
  let litanyTimeout = setTimeout(() => {
    if (death) return;
    runLitany();
    entitySpawnInfo("Litany", "#808080");
  }, arrayTime.pop());
  let doppelTimeout = setTimeout(() => {
    if (death) return;
    runDoppel();
    entitySpawnInfo("Doppel", "#ffffff");
  }, arrayTime.pop());
  let kookooTimeout = setTimeout(() => {
    if (death) return;
    runKookoo();
    entitySpawnInfo("Kookoo", "#0000fd");
  }, arrayTime.pop());

  let basic = true;
  let absoluteSpeed = false;
  let limit = false;
  let upPressCount = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === "/") {
      upPressCount++;
      if (upPressCount >= 5 && !limit) {
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
        if (!basic) {
          if (!runned.includes("Litany")) {
            clearTimeout(litanyTimeout);
            runLitany();
            entitySpawnInfo("Litany", "#808080");
          }
          if (!runned.includes("Doppel")) {
            clearTimeout(doppelTimeout);
            runDoppel();
            entitySpawnInfo("Doppel", "#ffffff");
          }
          if (!runned.includes("Kookoo")) {
            clearTimeout(kookooTimeout);
            runKookoo();
            entitySpawnInfo("Kookoo", "#0000fd");
          }
          if (absoluteSpeed) {
            limit = true;
          }
        }
        basic
          ? entitySpawnInfo("Every Normal Entity", "#fff")
          : !absoluteSpeed
          ? entitySpawnInfo("Every Modifier Entity", "#fff")
          : ((absoluteNoDelay = true),
            entitySpawnInfo("HARD MODE ENABLED", "#f00"));
        if (!basic) absoluteSpeed = true;
        basic = false;
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
  "#0000fd",
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
