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
  if (extraLife) {
    if (!extraLifeBroken) {
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = "#0f0";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = Math.random() * 0.15 + 0.225;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, Math.random() * 5 + 7.5, 0, 2 * Math.PI);
      ctx.strokeStyle = "#f00";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

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

export function duplicateCraven() {
  setTimeout(() => {
    spawnEntity({ src: "./entity/craven.js" });
    spawnEntity({ src: "./entity/craven.js" });
  }, 10000);
}

export let carnation = { stop: false };
export let tar = { inside: false };

let death = false;
let goatman = false;
let joey = false;
let eyes = false;
let absoluteNoDelay = false;
let godmode = false;
let extraLife = false;
let extraLifeBroken = false;
let combos = 0;
const ENTITY_LIST = [
  {
    type: "main",
    name: "Carnation",
    color: "#cf0693",
    src: "./entity/carnation.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
  },
  {
    type: "main",
    name: "Goatman",
    color: "#fbff08",
    src: "./entity/goatman.js",
    duration: 20000,
    delayNormal: [10000, 20000],
    chance: 0.2,
    condition: () => !joey || Math.random() < 0.2,
    onSpawn: () => {
      joey = true;
      goatman = true;
    },
    onEnd: () => {
      joey = false;
      goatman = false;
    },
  },
  {
    type: "main",
    name: "Slight",
    color: "#1304d1",
    src: "./entity/slight.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    condition: () => !eyes || Math.random() < 0.2,
    onSpawn: () => {
      eyes = true;
    },
    onEnd: () => {
      eyes = false;
    },
  },
  {
    type: "main",
    name: "Slugfish",
    color: "#808080",
    src: "./entity/slugfish.js",
    duration: 5000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
  },
  {
    type: "main",
    name: "Elkman",
    color: "#ffffff",
    src: "./entity/elkman.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
  },
  {
    type: "main",
    name: "Heed",
    color: "#fe0102",
    src: "./entity/heed.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    condition: () => !eyes || Math.random() < 0.2,
    onSpawn: () => {
      eyes = true;
    },
    onEnd: () => {
      eyes = false;
    },
  },
  {
    type: "main",
    name: "Dozer",
    color: "#f4ea37",
    src: "./entity/dozer.js",
    duration: 4000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
  },
  {
    type: "main",
    name: "Sorrow",
    color: "#b30000",
    src: "./entity/sorrow.js",
    duration: 5000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
  },

  {
    type: "modifier",
    name: "Litany",
    color: "#808080",
    src: "./entity/litany.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
  },
  {
    type: "modifier",
    name: "Doppel",
    color: "#ffffff",
    src: "./entity/doppel.js",
    duration: 20000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
  },
  {
    type: "modifier",
    name: "Doombringer",
    color: "#808080",
    src: "./entity/doombringer.js",
    duration: 5000,
    delayNormal: [5000, 15000],
    delayGoatman: [2500, 7500],
    chance: 0.9,
    condition: () => !joey || Math.random() < 0.2,
    onSpawn: () => {
      joey = true;
    },
    onEnd: () => {
      joey = false;
    },
  },
  {
    type: "modifier",
    name: "Kookoo",
    color: "#0000fd",
    src: "./entity/kookoo.js",
    duration: 16000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
  },
  {
    type: "modifier",
    name: "Tar",
    color: "#808080",
    src: "./entity/tar.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
  },
  {
    type: "modifier",
    name: "Rue",
    color: "#ffffff",
    src: "./entity/rue.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
  },
  {
    type: "modifier",
    name: "Drain",
    color: "#808080",
    src: "./entity/drain.js",
    duration: 10000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
  },
  {
    type: "modifier",
    name: "Mime",
    color: "#ffffff",
    src: "./entity/mime.js",
    duration: 20000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
    loop: false,
  },
  {
    type: "modifier",
    name: "Ire",
    color: "#ffffff",
    src: "./entity/ire.js",
    duration: 5000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
  },
  {
    type: "modifier",
    name: "Duk",
    color: "#fdff00",
    src: "./entity/duk.js",
    duration: 20000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
    loop: false,
  },
  {
    type: "modifier",
    name: "Craven",
    color: "#808080",
    src: "./entity/craven.js",
    duration: 20000,
    delayNormal: [10000, 20000],
    delayGoatman: [5000, 10000],
    chance: 0.9,
    loop: false,
  },
];
async function spawnEntity(entity) {
  const mod = await import(`${entity.src}?cacheBust=${Date.now()}`);
  mod.setup(hostAPI);
}
async function RUN() {
  hostAPI.clearAll();

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function runEntity(entity) {
    const delayRange =
      tar.inside || goatman
        ? entity.delayGoatman || entity.delayNormal
        : entity.delayNormal;

    const delay = absoluteNoDelay
      ? Math.floor(Math.random() * 5000)
      : rand(delayRange[0], delayRange[1]);

    setTimeout(async () => {
      if (!death) {
        const chanceOK =
          entity.chance === undefined || Math.random() < entity.chance;

        const conditionOK = !entity.condition || entity.condition();

        if (combos <= 5 && chanceOK && conditionOK) {
          entity.onSpawn?.();

          await spawnEntity(entity);

          combos++;

          setTimeout(() => {
            combos--;

            entity.onEnd?.();

            if (entity.loop !== false) {
              runEntity(entity);
            }
          }, entity.duration);
        } else {
          runEntity(entity);
        }
      }
    }, delay);
  }

  /* ---------------------------
     PIHSROW (unchanged)
  --------------------------- */

  function runPihsrow() {
    let delay = Math.floor(Math.random() * 10000) + 10000;
    setTimeout(
      async () => {
        if (!death) {
          if (combos <= 5 && Math.random() < 0.01) {
            const modPihsrow = await import(
              `./entity/pihsrow.js?cacheBust=${Date.now()}`
            );
            combos += 5;
            let i = 10;
            modPihsrow.setup(hostAPI, 10);
            let interval = setInterval(() => {
              i -= 0.11;
              if (i <= 0) clearInterval(interval);
              modPihsrow.setup(hostAPI, i);
            }, 100);

            setTimeout(() => {
              combos -= 5;
              clearInterval(interval);
              runPihsrow();
            }, 10000);
          } else {
            runPihsrow();
          }
        }
      },
      absoluteNoDelay ? Math.floor(Math.random() * 5000) : delay,
    );
  }

  runPihsrow();

  /* ---------------------------
     ENTITY LOOKUP
  --------------------------- */

  const ENTITY_MAP = Object.fromEntries(
    ENTITY_LIST.map((e) => [e.name.toLowerCase(), e]),
  );

  /* ---------------------------
     AUTOMATED ENTITY TIMERS
  --------------------------- */

  const START_TIMES = {
    carnation: 0,
    goatman: 60000,
    slight: 120000,
    slugfish: 180000,
    elkman: 180000,
    heed: 240000,
    dozer: 300000,
    sorrow: 300000,
  };

  const FIXED_ENTITIES = [
    "carnation",
    "goatman",
    "slight",
    "slugfish",
    "elkman",
    "heed",
    "dozer",
    "sorrow",
  ];
  const AFTER_SORROW = ENTITY_LIST.filter(
    (e) => !FIXED_ENTITIES.includes(e.name.toLowerCase()),
  );
  const RANDOM_POOL = [];
  let minute = 6;
  for (let i = 0; i < AFTER_SORROW.length; i++) {
    RANDOM_POOL.push(minute * 60000);
    minute++;
  }

  shuffle(RANDOM_POOL);

  for (const entity of ENTITY_LIST) {
    let delay;

    const name = entity.name.toLowerCase();

    if (START_TIMES[name] !== undefined) {
      delay = START_TIMES[name];
    } else {
      delay = RANDOM_POOL.pop();
    }

    setTimeout(() => {
      if (death || runned.includes(entity.name)) return;

      runned.push(entity.name);
      runEntity(entity);

      entitySpawnInfo(entity.name, entity.color);
    }, delay);
  }

  /* ---------------------------
     EXTRA LIFE (unchanged)
  --------------------------- */

  setInterval(() => {
    extraLife = true;
  }, 300000);

  /* ---------------------------
     KEYBINDS
  --------------------------- */

  let basic = true;
  let absoluteSpeed = false;
  let upPressCount = 0;
  let inputOpen = false;

  document.addEventListener("keydown", async (e) => {
    if (e.key === "/") {
      upPressCount++;

      if (upPressCount >= 5) {
        upPressCount = 0;

        const targetType = basic ? "main" : "modifier";

        for (const entity of ENTITY_LIST) {
          if (
            (entity.type || "modifier") === targetType &&
            !runned.includes(entity.name)
          ) {
            runEntity(entity);

            entitySpawnInfo(entity.name, entity.color);
          }
        }

        basic
          ? entitySpawnInfo("Every Main Entity", "#fff")
          : !absoluteSpeed
            ? entitySpawnInfo("Every Modifier Entity", "#fff")
            : ((absoluteNoDelay = true),
              entitySpawnInfo("HARD MODE ENABLED", "#f00"));

        if (!basic) absoluteSpeed = true;

        basic = false;
      }
    }

    if (e.key === "Enter") {
      if (!inputOpen) {
        inputOpen = true;

        document.getElementById("input").style.display = "block";
        document.getElementById("input").focus();
      } else {
        inputOpen = false;

        document.getElementById("input").style.display = "none";

        let value = document.getElementById("input").value.toLowerCase();

        document.getElementById("input").value = "";

        /* ---------------------------
           .entity commands
        --------------------------- */

        if (value.startsWith(".")) {
          const name = value.slice(1);

          const entity = ENTITY_MAP[name];

          if (entity) {
            setTimeout(async () => {
              await spawnEntity(entity);
            }, 500);

            return;
          }
        }

        /* ---------------------------
           s.entity commands
        --------------------------- */

        if (value.startsWith("s.")) {
          const name = value.slice(2);

          const entity = ENTITY_MAP[name];

          if (entity && !runned.includes(entity.name)) {
            runEntity(entity);

            entitySpawnInfo(entity.name, entity.color);

            return;
          }
        }

        /* ---------------------------
           PIHSROW
        --------------------------- */

        if (value === ".pihsrow") {
          setTimeout(async () => {
            const mod = await import(
              `./entity/pihsrow.js?cacheBust=${Date.now()}`
            );

            let i = 10;

            mod.setup(hostAPI, 10);

            let interval = setInterval(() => {
              i -= 0.11;

              if (i <= 0) clearInterval(interval);

              mod.setup(hostAPI, i);
            }, 100);
          }, 500);
        }

        /* ---------------------------
           GODMODE (unchanged)
        --------------------------- */

        if (value === ".god") {
          godmode = true;
        }

        if (value === ".ungod") {
          godmode = false;
        }
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
  "#fdff00",
];
function onColorTouched() {
  if (death) return;
  if (!extraLife && !godmode) {
    death = true;
    setTimeout(() => {
      setTimeout(() => {
        document.getElementById("death").style.display = "flex";
        document.getElementById("white").style.display = "none";
      }, 100);
      document.getElementById("white").style.display = "flex";
    }, 150);
  }
  extraLifeBroken = true;
  setTimeout(() => {
    extraLife = false;
    extraLifeBroken = false;
  }, 1000);
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
