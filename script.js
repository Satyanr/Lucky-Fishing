"use strict";

/* =========================================
   LUCKY FISHING v0.3.0
   PHASE 3 - EQUIPMENT & ECONOMY
========================================= */

const SAVE_KEY = "lucky-fishing-save-v1";
const SHINY_RATE = 500;
const MAX_INVENTORY = 40;

const $ = id => document.getElementById(id);
const rand = (min, max) => min + Math.random() * (max - min);
const fmt = n => Math.floor(n).toLocaleString("id-ID");
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/* =========================================
   FISH DATABASE
   spawn = RNG weight, not percentage
========================================= */

const FISH = [
  {
    id: "nila",
    name: "Ikan Nila",
    icon: "🐟",
    rarity: "Common",
    min: 0.3,
    max: 2.3,
    length: [15, 45],
    strength: 0.18,
    price: 15,
    spawn: 36,
    zones: ["shore", "mid"]
  },
  {
    id: "mas",
    name: "Ikan Mas",
    icon: "🐠",
    rarity: "Common",
    min: 0.5,
    max: 3.7,
    length: [20, 65],
    strength: 0.27,
    price: 20,
    spawn: 31,
    zones: ["shore", "mid"]
  },
  {
    id: "lele",
    name: "Lele",
    icon: "🐟",
    rarity: "Common",
    min: 0.7,
    max: 5,
    length: [25, 85],
    strength: 0.34,
    price: 24,
    spawn: 26,
    zones: ["shore", "mid", "deep"]
  },
  {
    id: "gurame",
    name: "Gurame",
    icon: "🐡",
    rarity: "Uncommon",
    min: 0.8,
    max: 6.5,
    length: [25, 75],
    strength: 0.48,
    price: 45,
    spawn: 15,
    zones: ["mid", "deep"]
  },
  {
    id: "patin",
    name: "Patin Besar",
    icon: "🐟",
    rarity: "Uncommon",
    min: 2,
    max: 11,
    length: [40, 120],
    strength: 0.59,
    price: 65,
    spawn: 12,
    zones: ["mid", "deep"]
  },
  {
    id: "golden",
    name: "Golden Carp",
    icon: "✨",
    rarity: "Rare",
    min: 1,
    max: 8.5,
    length: [30, 90],
    strength: 0.75,
    price: 190,
    spawn: 4.5,
    zones: ["mid", "deep"]
  },
  {
    id: "crystal",
    name: "Crystal Bass",
    icon: "💎",
    rarity: "Rare",
    min: 1.5,
    max: 12,
    length: [35, 100],
    strength: 0.82,
    price: 250,
    spawn: 2.5,
    zones: ["deep"]
  },
  {
    id: "moon",
    name: "Moon Koi",
    icon: "🌙",
    rarity: "Epic",
    min: 3,
    max: 14,
    length: [50, 120],
    strength: 0.93,
    price: 520,
    spawn: 1.3,
    zones: ["deep"]
  },
  {
    id: "ancient",
    name: "Ancient Carp",
    icon: "🐉",
    rarity: "Legendary",
    min: 15,
    max: 65,
    length: [80, 210],
    strength: 1.05,
    price: 1500,
    spawn: 0.18,
    zones: ["deep"]
  },
  {
    id: "astral",
    name: "Astral Eel",
    icon: "🌌",
    rarity: "Mythic",
    min: 5,
    max: 35,
    length: [100, 260],
    strength: 1.15,
    price: 3800,
    spawn: 0.045,
    zones: ["deep"]
  },
  {
    id: "whisper",
    name: "Whisper of the Pond",
    icon: "👁️",
    rarity: "Secret",
    min: 1,
    max: 80,
    length: [40, 300],
    strength: 1.22,
    price: 9500,
    spawn: 0.012,
    zones: ["deep"]
  }
];

const FISH_BY_ID = Object.fromEntries(
  FISH.map(fish => [fish.id, fish])
);

const RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "Secret"
];

const SIZE_MULTIPLIERS = {
  Normal: 1,
  Large: 1.3,
  Huge: 1.7,
  Giant: 2.5
};

const RARITY_LUCK = {
  Common: 0.8,
  Uncommon: 1.2,
  Rare: 1.5,
  Epic: 1.7,
  Legendary: 2,
  Mythic: 2,
  Secret: 2
};

const HOOK_WINDOWS = {
  Common: 1600,
  Uncommon: 1300,
  Rare: 1050,
  Epic: 900,
  Legendary: 800,
  Mythic: 680,
  Secret: 620
};

const ROD_COSTS = {
  1: 120,
  2: 320,
  3: 700
};

const ROD_REACH = {
  1: 62,
  2: 83,
  3: 94,
  4: 100
};

const ZONES = {
  shore: "SHORE",
  mid: "MID",
  deep: "DEEP"
};

/* =========================================
   PHASE 3 — EQUIPMENT DATABASE
========================================= */

const BAITS = {
  worm: {
    id: "worm",
    name: "Worm",
    icon: "🪱",
    description: "Umpan dasar. Cocok untuk Nila dan Lele.",
    price: 25,
    bundle: 5,
    emptyBonus: 0,
    waitMultiplier: 1,
    affinity: {
      nila: 1.5,
      lele: 1.4
    }
  },

  bread: {
    id: "bread",
    name: "Bread",
    icon: "🍞",
    description: "Menarik Ikan Mas dan Gurame.",
    price: 45,
    bundle: 5,
    emptyBonus: 0.015,
    waitMultiplier: 1,
    affinity: {
      mas: 1.8,
      gurame: 1.6
    }
  },

  shrimp: {
    id: "shrimp",
    name: "Shrimp",
    icon: "🦐",
    description: "Menarik Patin, Crystal Bass, dan Moon Koi.",
    price: 85,
    bundle: 5,
    emptyBonus: 0.025,
    waitMultiplier: 0.9,
    affinity: {
      patin: 2,
      crystal: 1.8,
      moon: 1.4
    }
  },

  glow: {
    id: "glow",
    name: "Glow Worm",
    icon: "✨",
    description: "Umpan premium untuk mencari ikan langka.",
    price: 140,
    bundle: 2,
    emptyBonus: 0.04,
    waitMultiplier: 0.85,
    affinity: {
      golden: 2.1,
      moon: 1.7,
      ancient: 1.7,
      astral: 1.5,
      whisper: 1.3
    }
  }
};

const REEL_COSTS = {
  1: 160,
  2: 440,
  3: 900
};

const HOOK_COSTS = {
  1: 110,
  2: 300,
  3: 650
};

/* =========================================
   SAVE SYSTEM
========================================= */

function freshSave() {
  return {
    version: 3,
    coins: 100,

    // Worm stock (compatible with v0.2)
    bait: 8,

    // Permanent equipment levels
    rod: 1,
    reel: 1,
    hook: 1,

    // Consumable bait inventory
    selectedBait: "worm",
    baitStock: {
      bread: 0,
      shrimp: 0,
      glow: 0
    },

    fishdex: {},
    inventory: [],
    pendingCatch: null,

    stats: {
      casts: 0,
      catches: 0,
      escapes: 0,
      earned: 0,
      bestWeight: 0,
      bestLength: 0,
      shinyCatches: 0,
      giantCatches: 0
    }
  };
}

function readSave() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY));

    if (
      !raw ||
      !Number.isFinite(raw.coins) ||
      !Number.isFinite(raw.bait) ||
      !Number.isInteger(raw.rod) ||
      raw.rod < 1 ||
      raw.rod > 4 ||
      !raw.stats || typeof raw.stats !== "object" ||
      !raw.fishdex || typeof raw.fishdex !== "object" ||
      Array.isArray(raw.fishdex) ||
      !Array.isArray(raw.inventory)
    ) {
      return null;
    }

    const defaults = freshSave();

    /* Migration v0.2 -> v0.3 */

    const baitStock = {
      bread: 0,
      shrimp: 0,
      glow: 0
    };

    for (const id of Object.keys(baitStock)) {
      const count = raw.baitStock?.[id];

      baitStock[id] = Number.isFinite(count)
        ? Math.max(0, Math.floor(count))
        : 0;
    }

    const reel = Number.isInteger(raw.reel)
      ? clamp(raw.reel, 1, 4)
      : 1;

    const hook = Number.isInteger(raw.hook)
      ? clamp(raw.hook, 1, 4)
      : 1;

    const selectedBait = Object.hasOwn(
      BAITS,
      raw.selectedBait
    )
      ? raw.selectedBait
      : "worm";

    const nonnegative = value =>
      Number.isFinite(value) ? Math.max(0, value) : 0;

    const normalizeCatch = item => {
      if (
        !item || !Object.hasOwn(FISH_BY_ID, item.id) ||
        !Number.isFinite(item.weight) || item.weight <= 0 ||
        !Number.isFinite(item.price) || item.price < 0
      ) return null;

      return {
        kind: "caught",
        id: item.id,
        weight: item.weight,
        price: Math.floor(item.price),
        length: Number.isFinite(item.length) && item.length > 0
          ? item.length : null,
        size: Object.hasOwn(SIZE_MULTIPLIERS, item.size)
          ? item.size : "Normal",
        shiny: item.shiny === true,
        caughtAt: typeof item.caughtAt === "string" &&
          Number.isFinite(Date.parse(item.caughtAt)) ? item.caughtAt : null
      };
    };

    const inventory = raw.inventory
      .map(normalizeCatch)
      .filter(Boolean);

    const pending = raw.pendingCatch;

    const pendingCatch =
      pending && pending.kind === "caught"
        ? normalizeCatch(pending)
        : null;

    const stats = Object.fromEntries(
      Object.keys(defaults.stats).map(key => [key, nonnegative(raw.stats[key])])
    );
    const fishdex = {};
    FISH.forEach(fish => {
      const old = raw.fishdex[fish.id];
      if (!old || typeof old !== "object") return;
      const entry = {};
      ["caught", "largest", "smallest", "longest", "shortest", "shiny", "bestPrice"]
        .forEach(key => { entry[key] = nonnegative(old[key]); });
      entry.firstCaught = typeof old.firstCaught === "string" &&
        Number.isFinite(Date.parse(old.firstCaught)) ? old.firstCaught : null;
      fishdex[fish.id] = entry;
    });

    return {
      ...defaults,
      ...raw,

      version: 3,

      coins: Math.max(0, Math.floor(raw.coins)),
      bait: Math.max(0, Math.floor(raw.bait)),

      reel,
      hook,
      selectedBait,
      baitStock,

      stats,
      fishdex,
      inventory,
      pendingCatch
    };
  } catch {
    return null;
  }
}

function writeSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    hasSavedGame = true;
  } catch {
    showToast("Save gagal. Periksa penyimpanan browser.");
  }
}

const loadedSave = readSave();

let save = loadedSave || freshSave();
let hasSavedGame = Boolean(loadedSave);

let phase = save.pendingCatch ? "result" : "idle";
let result = save.pendingCatch || null;

let pendingTimer = null;
let toastTimer = null;
let lastFrame = 0;

const round = {
  bait: "worm",
  power: 0,
  zone: "shore",
  perfect: false,
  fish: null,
  deadline: 0,
  distance: 0,
  startDistance: 0,
  tension: 0,
  reel: false,
  nextDash: 0
};

/* =========================================
   BAIT INVENTORY & ECONOMY
========================================= */

function getBaitCount(id) {
  if (id === "worm") {
    return save.bait;
  }

  return save.baitStock[id] ?? 0;
}

function changeBaitCount(id, amount) {
  if (!Object.hasOwn(BAITS, id) || !Number.isInteger(amount)) {
    return false;
  }

  const current = getBaitCount(id);
  const next = current + amount;

  if (next < 0) return false;

  if (id === "worm") {
    save.bait = next;
  } else {
    save.baitStock[id] = next;
  }

  return true;
}

function buyBait(id) {
  if (!Object.hasOwn(BAITS, id)) return;
  const bait = BAITS[id];

  if (!bait || save.coins < bait.price) {
    showToast("Coin tidak mencukupi!");
    return;
  }

  save.coins -= bait.price;
  changeBaitCount(id, bait.bundle);

  writeSave();
  renderAll();

  showToast(
    `Berhasil membeli ${bait.bundle} ${bait.name}!`
  );
}

function upgradeGear(type, costs) {
  if (!["reel", "hook"].includes(type)) return;

  const level = save[type];
  const cost = costs[level];

  if (!cost || save.coins < cost) {
    showToast("Upgrade tidak tersedia atau coin kurang.");
    return;
  }

  save.coins -= cost;
  save[type]++;

  writeSave();
  renderAll();

  showToast(
    `${type.toUpperCase()} meningkat ke Lv.${save[type]}!`
  );
}

/* =========================================
   GENERAL UI
========================================= */

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function setTab(tab) {
  if (["aiming", "waiting", "biting", "battle"].includes(phase)) {
    showToast("Selesaikan sesi memancing terlebih dahulu.");
    return;
  }

  document.querySelectorAll(".tab").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.tab === tab
    );
  });

  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.toggle(
      "hidden",
      panel.dataset.panel !== tab
    );
  });

  renderAll();
}

/* =========================================
   FISH SPAWN & RNG
========================================= */

function secretUnlocked() {
  return save.rod >= 4 && save.stats.catches >= 30;
}

function availableFish(zone) {
  return FISH.filter(fish => {
    if (!fish.zones.includes(zone)) return false;

    if (fish.rarity === "Secret" && !secretUnlocked()) {
      return false;
    }

    return true;
  });
}

function getSpawnWeight(fish, perfect) {
  let weight = fish.spawn;

  // Perfect Cast bonus.
  if (perfect) {
    weight *= RARITY_LUCK[fish.rarity];
  }

  // Use bait locked in for this cast.
  const bait = BAITS[round.bait] || BAITS.worm;

  const affinity = bait.affinity[fish.id] ?? 1;

  weight *= affinity;

  return Math.max(0, weight);
}

function pickFish(zone, perfect = false) {
  const pool = availableFish(zone);

  const totalWeight = pool.reduce(
    (sum, fish) => sum + getSpawnWeight(fish, perfect),
    0
  );

  let roll = Math.random() * totalWeight;

  for (const fish of pool) {
    roll -= getSpawnWeight(fish, perfect);

    if (roll < 0) return fish;
  }

  return pool[pool.length - 1];
}

function generateCatch(fish) {
  // Smaller weights are somewhat more common.
  const weightRoll = Math.random() ** 1.5;

  const weight = Number(
    (fish.min + (fish.max - fish.min) * weightRoll).toFixed(2)
  );

  // Length is correlated with weight.
  const lengthRatio = clamp(
    Math.sqrt(weightRoll) * 0.85 + Math.random() * 0.15,
    0,
    1
  );

  const length = Math.round(
    fish.length[0] +
    (fish.length[1] - fish.length[0]) * lengthRatio
  );

  let size = "Normal";

  if (weightRoll >= 0.97) {
    size = "Giant";
  } else if (weightRoll >= 0.83) {
    size = "Huge";
  } else if (weightRoll >= 0.60) {
    size = "Large";
  }

  const shiny = Math.random() < 1 / SHINY_RATE;

  const averageWeight = (fish.min + fish.max) / 2;

  const weightBonus = 0.6 + (weight / averageWeight) * 0.4;

  const price = Math.max(
    1,
    Math.round(
      fish.price *
      weightBonus *
      SIZE_MULTIPLIERS[size] *
      (shiny ? 1.5 : 1)
    )
  );

  return {
    kind: "caught",
    id: fish.id,
    weight,
    length,
    size,
    shiny,
    price,
    caughtAt: new Date().toISOString()
  };
}

/* =========================================
   FISHDEX RECORD SYSTEM
========================================= */

function registerCatch(catchData) {
  const id = catchData.id;
  const existing = save.fishdex[id];

  const entry = existing || {
    caught: 0,
    largest: 0,
    smallest: 0,
    longest: 0,
    shortest: 0,
    shiny: 0,
    bestPrice: 0,
    firstCaught: catchData.caughtAt
  };

  const previousCaught = entry.caught || 0;

  entry.caught = previousCaught + 1;

  entry.largest = Math.max(
    entry.largest || 0,
    catchData.weight
  );

  if (!entry.smallest || catchData.weight < entry.smallest) {
    entry.smallest = catchData.weight;
  }

  entry.longest = Math.max(
    entry.longest || 0,
    catchData.length
  );

  if (!entry.shortest || catchData.length < entry.shortest) {
    entry.shortest = catchData.length;
  }

  entry.bestPrice = Math.max(
    entry.bestPrice || 0,
    catchData.price
  );

  if (catchData.shiny) {
    entry.shiny = (entry.shiny || 0) + 1;
    save.stats.shinyCatches++;
  }

  if (catchData.size === "Giant") {
    save.stats.giantCatches++;
  }

  save.fishdex[id] = entry;

  save.stats.catches++;

  save.stats.bestWeight = Math.max(
    save.stats.bestWeight,
    catchData.weight
  );

  save.stats.bestLength = Math.max(
    save.stats.bestLength,
    catchData.length
  );
}

/* =========================================
   CASTING SYSTEM
========================================= */

function perfectPower() {
  return Math.round(ROD_REACH[save.rod] * 0.82);
}

function startAiming() {
  const bait = BAITS[save.selectedBait];

  if (!bait || getBaitCount(save.selectedBait) < 1) {
    showToast(
      "Umpan pilihan habis! Pilih bait lain atau beli di Shop."
    );
    return;
  }

  round.power = 0;
  round.perfect = false;
  round.fish = null;

  phase = "aiming";
  renderFishing();
}

function castLine() {
  if (phase !== "aiming") return;

  round.bait = save.selectedBait;

  if (getBaitCount(round.bait) < 1) {
    showToast("Umpan pilihan habis!");
    phase = "idle";
    renderFishing();
    return;
  }

  changeBaitCount(round.bait, -1);
  save.stats.casts++;

  const power = round.power;

  round.perfect =
    Math.abs(power - perfectPower()) <= 6;

  if (power < 35) {
    round.zone = "shore";
  } else if (power < 70) {
    round.zone = "mid";
  } else {
    round.zone = "deep";
  }

  phase = "waiting";

  writeSave();
  renderAll();

  if (round.perfect) {
    showToast("✨ PERFECT CAST! Bonus peluang rarity aktif.");
  }

  clearTimeout(pendingTimer);

  pendingTimer = setTimeout(() => {
    if (phase !== "waiting") return;

    const activeBait = BAITS[round.bait];

    const baseEmptyChance = round.perfect ? 0.08 : 0.12;

    const emptyChance = clamp(
      baseEmptyChance - activeBait.emptyBonus,
      0.02,
      0.4
    );

    if (Math.random() < emptyChance) {
      endRound("empty");
      return;
    }

    round.fish = pickFish(round.zone, round.perfect);

    const baseWindow = HOOK_WINDOWS[round.fish.rarity];

    const hookBonus = (save.hook - 1) * 190;

    round.deadline =
      performance.now() + baseWindow + hookBonus;

    phase = "biting";

    renderFishing();
  }, rand(1600, 3900) * BAITS[round.bait].waitMultiplier);
}

/* =========================================
   HOOK & FISHING BATTLE
========================================= */

function hookFish() {
  if (phase !== "biting") return;

  if (performance.now() > round.deadline) {
    endRound("escape");
    return;
  }

  phase = "battle";

  const strength = round.fish.strength;

  round.startDistance = 70 + strength * 20;
  round.distance = round.startDistance;
  round.tension = 11;
  round.reel = false;

  round.nextDash = performance.now() + rand(1300, 2600);

  renderFishing();
}

function setReeling(pressed) {
  round.reel = phase === "battle" && pressed;

  $("reelButton").classList.toggle(
    "pressed",
    round.reel
  );

  $("reelButton").textContent = round.reel
    ? "🎣 MENARIK..."
    : "🎣 TAHAN UNTUK MENARIK";
}

function endRound(kind) {
  if (phase === "result") return;

  clearTimeout(pendingTimer);
  setReeling(false);

  phase = "result";

  if (kind === "caught") {
    result = generateCatch(round.fish);

    registerCatch(result);

    // Preserve the unclaimed catch on page reload.
    save.pendingCatch = result;

    if (result.shiny) {
      showToast("✨ SHINY FISH DITEMUKAN!");
    } else if (result.size === "Giant") {
      showToast("🏆 GIANT FISH!");
    }
  } else {
    if (kind === "escape") {
      save.stats.escapes++;
    }

    result = { kind };
    save.pendingCatch = null;
  }

  writeSave();
  renderAll();
}

function finishResult() {
  result = null;
  round.fish = null;
  phase = "idle";

  renderAll();
}

function handleResult(action) {
  if (
    phase !== "result" ||
    !result ||
    result.kind !== "caught"
  ) {
    return;
  }

  if (action === "keep") {
    if (save.inventory.length >= MAX_INVENTORY) {
      showToast(`Inventory penuh (${MAX_INVENTORY} ikan).`);
      return;
    }

    save.inventory.push({ ...result });

    showToast("Ikan disimpan ke Inventory!");
  } else if (action === "sell") {
    save.coins += result.price;
    save.stats.earned += result.price;

    showToast(`Terjual! +${fmt(result.price)} coin`);
  } else {
    return;
  }

  save.pendingCatch = null;

  writeSave();
  finishResult();
}

/* =========================================
   FISHING INTERFACE
========================================= */

function renderFishing() {
  const titles = {
    idle: [
      "Siap memancing?",
      "Mulai casting dan pilih kekuatan lemparan."
    ],
    aiming: [
      "Tentukan jarak!",
      "Lempar ketika marker berada di zona emas."
    ],
    waiting: [
      "Menunggu gigitan...",
      `Kail berada di zona ${ZONES[round.zone]}.`
    ],
    biting: [
      "⚡ IKAN MENGGIGIT!",
      "Cepat kait ikan sebelum kabur!"
    ],
    battle: [
      "Ikan melawan!",
      "Tarik dan lepaskan reel untuk mengontrol tension."
    ],
    result: [
      "Hasil memancing",
      "Lihat hasil dan tentukan tindakan berikutnya."
    ]
  };

  $("phaseTitle").textContent = titles[phase][0];
  $("phaseHint").textContent = titles[phase][1];

  $("castWidget").classList.toggle(
    "hidden",
    phase !== "aiming"
  );

  $("battleWidget").classList.toggle(
    "hidden",
    phase !== "battle"
  );

  $("resultWidget").classList.toggle(
    "hidden",
    phase !== "result"
  );

  $("bobber").classList.toggle(
    "hidden",
    !["waiting", "biting", "battle"].includes(phase)
  );

  $("biteAlert").classList.toggle(
    "hidden",
    phase !== "biting"
  );

  const showFish =
    ["biting", "battle"].includes(phase) &&
    Boolean(round.fish);

  $("fishShadow").classList.toggle(
    "hidden",
    !showFish
  );

  $("fishShadow").classList.toggle(
    "strong-fish",
    showFish && round.fish.strength >= 0.9
  );

  $("zoneText").textContent = `📍 ${ZONES[round.zone]}`;

  const notes = {
    idle: "Hari yang indah untuk memancing.",
    aiming: "Cari timing Perfect Cast!",
    waiting: "Tenang... perhatikan pelampung.",
    biting: "TARIK SEKARANG!",
    battle: "Jaga tension agar tali tidak putus!",
    result: "Satu sesi selesai."
  };

  $("sceneNote").textContent = notes[phase];

  $("actionButton").classList.toggle(
    "hidden",
    ["battle", "result"].includes(phase)
  );

  $("actionButton").disabled = phase === "waiting";

  const labels = {
    idle: "🎯 Mulai Casting",
    aiming: "🎣 LEMPAR SEKARANG!",
    waiting: "⌛ Menunggu...",
    biting: "⚡ KAIT SEKARANG!"
  };

  $("actionButton").textContent = labels[phase] || "";

  const sweet = perfectPower();

  $("castGood").style.left = `${sweet - 6}%`;
  $("castGood").style.width = "12%";

  $("castHint").textContent =
    `Perfect Cast: power ${sweet - 6}%–${sweet + 6}%. ` +
    "Bonus peluang rarity dan gigitan.";

  /* Active bait information */

  const fishingActive =
    ["waiting", "biting", "battle"].includes(phase);

  const baitId = fishingActive
    ? round.bait
    : save.selectedBait;

  const bait = BAITS[baitId];

  $("activeBaitHint").textContent =
    `${bait.icon} ${bait.name} • ` +
    `${fmt(getBaitCount(baitId))} tersisa`;

  if (phase === "result" && result) {
    renderResult();
  }
}

/* =========================================
   CATCH RESULT
========================================= */

function addResultButton(label, handler) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", handler);

  $("resultActions").append(button);
}

function renderResult() {
  $("resultActions").replaceChildren();
  $("catchMeta").replaceChildren();

  $("resultIcon").classList.remove("shiny-glow");

  if (result.kind !== "caught") {
    $("resultIcon").textContent =
      result.kind === "empty" ? "🌊" : "💨";

    $("resultRarity").className = "rarity";
    $("resultRarity").textContent = "BELUM BERUNTUNG";

    $("resultTitle").textContent =
      result.kind === "empty"
        ? "Tidak ada gigitan"
        : "Ikan melarikan diri!";

    $("resultDescription").textContent =
      "Coba casting kembali untuk kesempatan berikutnya.";

    addResultButton("↻ Lanjut", finishResult);
    return;
  }

  const fish = FISH_BY_ID[result.id];

  if (!fish) return;

  $("resultIcon").textContent = fish.icon;

  $("resultIcon").classList.toggle(
    "shiny-glow",
    Boolean(result.shiny)
  );

  $("resultRarity").className =
    `rarity ${fish.rarity.toLowerCase()}`;

  $("resultRarity").textContent =
    `${result.shiny ? "✨ SHINY " : ""}${fish.rarity.toUpperCase()}`;

  $("resultTitle").textContent = fish.name;

  const record = save.fishdex[result.id];

  const isRecord =
    record &&
    result.weight >= (record.largest || 0);

  $("resultDescription").textContent =
    `${result.size || "Normal"} • ` +
    `${result.shiny ? "✨ Shiny • " : ""}` +
    `${isRecord ? "🏆 Rekor berat saat ini!" : "Tangkapan berhasil!"}`;

  const stats = [
    ["Berat", `${result.weight.toFixed(2)} kg`],
    [
      "Panjang",
      Number.isFinite(result.length)
        ? `${result.length} cm`
        : "—"
    ],
    ["Ukuran", result.size || "Normal"],
    ["Harga jual", `🪙 ${fmt(result.price)}`]
  ];

  stats.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "catch-stat";

    const name = document.createElement("span");
    name.textContent = label;

    const amount = document.createElement("strong");
    amount.textContent = value;

    item.append(name, amount);
    $("catchMeta").append(item);
  });

  addResultButton("🪙 Jual", () => handleResult("sell"));
  addResultButton("🎒 Simpan", () => handleResult("keep"));
}

/* =========================================
   SHOP
========================================= */

function renderShop() {
  /* ROD UPGRADE */

  const rodCost = ROD_COSTS[save.rod];

  $("upgradeTitle").textContent =
    save.rod >= 4
      ? "Master Rod (MAX)"
      : `Upgrade Rod Lv.${save.rod} → Lv.${save.rod + 1}`;

  $("upgradeDescription").textContent =
    save.rod === 1
      ? "Membuka zona Deep."
      : "Meningkatkan jangkauan dan kontrol tension.";

  $("upgradeButton").textContent =
    rodCost ? `🪙 ${fmt(rodCost)}` : "MAX LEVEL";

  $("upgradeButton").disabled =
    !rodCost || save.coins < rodCost;

  /* WORM BAIT */

  $("buyBaitButton").textContent =
    `🪙 ${fmt(BAITS.worm.price)}`;

  $("buyBaitButton").disabled =
    save.coins < BAITS.worm.price;

  /* OTHER BAITS */

  const baitList = $("baitShopList");
  baitList.replaceChildren();

  Object.values(BAITS).forEach(bait => {
    if (bait.id === "worm") return;

    const row = document.createElement("div");
    row.className = "store-item";

    const icon = document.createElement("div");
    icon.className = "store-icon";
    icon.textContent = bait.icon;

    const details = document.createElement("div");
    details.className = "store-details";

    const title = document.createElement("h3");
    title.textContent = `${bait.name} × ${bait.bundle}`;

    const description = document.createElement("p");
    description.textContent = bait.description;

    details.append(title, description);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "buy-button";
    button.dataset.buyBait = bait.id;
    button.textContent = `🪙 ${fmt(bait.price)}`;
    button.disabled = save.coins < bait.price;

    row.append(icon, details, button);
    baitList.append(row);
  });

  /* REEL & HOOK UPGRADES */

  const upgrades = [
    {
      type: "reel",
      titleId: "reelUpgradeTitle",
      buttonId: "reelUpgradeButton",
      costs: REEL_COSTS,
      label: "Reel"
    },
    {
      type: "hook",
      titleId: "hookUpgradeTitle",
      buttonId: "hookUpgradeButton",
      costs: HOOK_COSTS,
      label: "Hook"
    }
  ];

  upgrades.forEach(item => {
    const level = save[item.type];
    const cost = item.costs[level];

    $(item.titleId).textContent =
      level >= 4
        ? `${item.label} Lv.4 (MAX)`
        : `Upgrade ${item.label} Lv.${level} → Lv.${level + 1}`;

    $(item.buttonId).textContent =
      cost ? `🪙 ${fmt(cost)}` : "MAX LEVEL";

    $(item.buttonId).disabled =
      !cost || save.coins < cost;
  });
}

/* =========================================
   EQUIPMENT LOADOUT UI
========================================= */

function renderEquipment() {
  const summary = $("equipmentSummary");
  const baitList = $("baitEquipmentList");

  summary.replaceChildren();
  baitList.replaceChildren();

  /* EQUIPPED PERMANENT GEAR */

  const equippedGear = [
    {
      icon: "🎣",
      name: "Rod",
      level: save.rod,
      info: "Casting & control"
    },
    {
      icon: "⚙️",
      name: "Reel",
      level: save.reel,
      info: "Speed & tension"
    },
    {
      icon: "🪝",
      name: "Hook",
      level: save.hook,
      info: "Reaction time"
    }
  ];

  equippedGear.forEach(gear => {
    const card = document.createElement("div");
    card.className = "gear-card";

    const icon = document.createElement("div");
    icon.className = "gear-icon";
    icon.textContent = gear.icon;

    const title = document.createElement("strong");
    title.textContent = `${gear.name} Lv.${gear.level}`;

    const description = document.createElement("span");
    description.textContent = gear.info;

    card.append(icon, title, description);
    summary.append(card);
  });

  /* SELECTABLE BAITS */

  Object.values(BAITS).forEach(bait => {
    const count = getBaitCount(bait.id);
    const selected = save.selectedBait === bait.id;

    const card = document.createElement("div");

    card.className =
      `bait-card ${selected ? "selected" : ""}`;

    const icon = document.createElement("div");
    icon.className = "bait-icon";
    icon.textContent = bait.icon;

    const info = document.createElement("div");
    info.className = "bait-info";

    const title = document.createElement("strong");
    title.textContent = bait.name;

    const description = document.createElement("small");
    description.textContent = bait.description;

    const stock = document.createElement("small");
    stock.textContent = `Stock: ${fmt(count)} bait`;

    info.append(title, description, stock);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "bait-select-button";
    button.dataset.equipBait = bait.id;

    button.textContent = selected
      ? "✓ Equipped"
      : count > 0
        ? "Equip"
        : "Empty";

    button.disabled = selected || count < 1;

    card.append(icon, info, button);
    baitList.append(card);
  });
}

/* =========================================
   FISHDEX
========================================= */

function renderFishdex() {
  const list = $("fishdexList");

  list.replaceChildren();

  const discovered = FISH.filter(
    fish => Boolean(save.fishdex[fish.id])
  ).length;

  const percent = Math.round(
    (discovered / FISH.length) * 100
  );

  $("fishdexSummary").textContent =
    `${discovered}/${FISH.length} spesies ditemukan ` +
    `(${percent}%).`;

  $("dexProgressFill").style.width = `${percent}%`;

  $("shinySummary").textContent =
    `✨ ${fmt(save.stats.shinyCatches)} shiny`;

  const filter = $("rarityFilter").value;

  const visibleFish = FISH.filter(
    fish => filter === "All" || fish.rarity === filter
  );

  visibleFish.forEach(fish => {
    const entry = save.fishdex[fish.id];
    const unlocked = Boolean(entry);

    const row = document.createElement("div");

    row.className =
      `list-item fishdex-entry ` +
      `rarity-${fish.rarity.toLowerCase()} ` +
      `${unlocked ? "" : "unknown"} ` +
      `${entry?.shiny ? "is-shiny" : ""}`;

    const icon = document.createElement("span");
    icon.className = "list-item-icon";
    icon.textContent = unlocked ? fish.icon : "❔";

    const body = document.createElement("div");
    body.className = "list-item-body";

    const name = document.createElement("strong");
    const description = document.createElement("small");

    if (unlocked) {
      name.textContent =
        `${fish.name} ${entry.shiny ? "✨" : ""}`;

      const weight = Number(entry.largest || 0).toFixed(2);

      const smallest = entry.smallest
        ? `${Number(entry.smallest).toFixed(2)} kg`
        : "—";

      const longest = entry.longest
        ? `${entry.longest} cm`
        : "—";

      const firstDate = entry.firstCaught
        ? new Date(entry.firstCaught).toLocaleDateString("id-ID")
        : "Tidak tercatat (save lama)";

      description.textContent =
        `${fish.rarity} • ${entry.caught}× tertangkap\n` +
        `Terberat: ${weight} kg • Terkecil: ${smallest}\n` +
        `Terpanjang: ${longest} • Shiny: ${entry.shiny || 0}\n` +
        `Harga terbaik: 🪙 ${fmt(entry.bestPrice || 0)}\n` +
        `Pertama tertangkap: ${firstDate}`;

      description.style.whiteSpace = "pre-line";
    } else {
      name.textContent =
        fish.rarity === "Secret"
          ? "??? Secret Fish"
          : "??? Belum ditemukan";

      description.textContent =
        fish.rarity === "Secret"
          ? "Ada sesuatu yang tersembunyi di kedalaman..."
          : "Temukan dengan memancing di zona yang tepat.";
    }

    body.append(name, description);
    row.append(icon, body);

    list.append(row);
  });

  if (!visibleFish.length) {
    list.innerHTML =
      '<div class="empty-state">Tidak ada ikan.</div>';
  }
}

/* =========================================
   INVENTORY
========================================= */

function renderInventory() {
  const list = $("inventoryList");
  list.replaceChildren();

  if (!save.inventory.length) {
    list.innerHTML =
      '<div class="empty-state">' +
      '🎒 Belum ada ikan tersimpan.' +
      '</div>';
    return;
  }

  save.inventory.forEach((item, index) => {
    const fish = FISH_BY_ID[item.id];
    if (!fish) return;

    const row = document.createElement("div");
    row.className =
      `list-item ${item.shiny ? "is-shiny fishdex-entry" : ""}`;

    const icon = document.createElement("span");
    icon.className = "list-item-icon";
    icon.textContent = fish.icon;

    if (item.shiny) {
      icon.classList.add("shiny-glow");
    }

    const body = document.createElement("div");
    body.className = "list-item-body";

    const name = document.createElement("strong");

    name.textContent =
      `${fish.name}${item.shiny ? " ✨" : ""}`;

    const details = document.createElement("small");

    details.textContent =
      `${Number(item.weight).toFixed(2)} kg • ` +
      `${item.length ?? "—"} cm • ` +
      `${item.size || "Normal"} • ${fish.rarity}`;

    body.append(name, details);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `Jual 🪙 ${fmt(item.price)}`;

    button.addEventListener("click", () => {
      save.coins += item.price;
      save.stats.earned += item.price;

      save.inventory.splice(index, 1);

      writeSave();
      renderAll();

      showToast("Ikan berhasil dijual!");
    });

    row.append(icon, body, button);
    list.append(row);
  });
}

/* =========================================
   ACHIEVEMENTS
========================================= */

function renderAchievements() {
  const stats = [
    [fmt(save.stats.casts), "Casting"],
    [fmt(save.stats.catches), "Ikan tertangkap"],
    [fmt(save.stats.earned), "Total coin didapat"],
    [
      `${Number(save.stats.bestWeight).toFixed(2)} kg`,
      "Rekor berat"
    ],
    [`${save.stats.bestLength} cm`, "Rekor panjang"],
    [fmt(save.stats.shinyCatches), "Shiny ditemukan"]
  ];

  $("statsGrid").innerHTML = stats.map(([value, label]) => `
    <div class="stat-box">
      <b>${value}</b>
      <span>${label}</span>
    </div>
  `).join("");

  const achievements = [
    [
      "🎣", "First Catch", "Tangkap ikan pertama",
      save.stats.catches >= 1
    ],
    [
      "🐟", "Fish Hunter", "Tangkap 100 ikan",
      save.stats.catches >= 100
    ],
    [
      "✨", "Shiny Hunter", "Temukan shiny pertama",
      save.stats.shinyCatches >= 1
    ],
    [
      "🏆", "Giant Catch", "Tangkap ikan kategori Giant",
      save.stats.giantCatches >= 1
    ],
    [
      "🌙", "Moonlight", "Temukan Moon Koi",
      Boolean(save.fishdex.moon)
    ],
    [
      "🐉", "Living Legend", "Temukan Ancient Carp",
      Boolean(save.fishdex.ancient)
    ],
    [
      "🌌", "Mythic Hunter", "Temukan Astral Eel",
      Boolean(save.fishdex.astral)
    ],
    [
      "📖", "Professor Fish", "Lengkapi Fishdex",
      FISH.every(fish => Boolean(save.fishdex[fish.id]))
    ]
  ];

  $("achievementsList").innerHTML = achievements.map(
    ([icon, name, description, completed]) => `
      <div class="list-item ${
        completed ? "achievement-done" : "unknown"
      }">
        <span class="list-item-icon">${icon}</span>
        <div class="list-item-body">
          <strong>
            ${name} ${completed ? "✓" : "🔒"}
          </strong>
          <small>${description}</small>
        </div>
      </div>
    `
  ).join("");
}

/* =========================================
   RENDER ALL
========================================= */

function renderAll() {
  $("coinsText").textContent = fmt(save.coins);

  const activeBait = BAITS[save.selectedBait];

  $("baitIcon").textContent = activeBait.icon;
  $("baitText").textContent =
    fmt(getBaitCount(save.selectedBait));

  $("rodText").textContent = `Lv.${save.rod}`;

  const found = FISH.filter(
    fish => Boolean(save.fishdex[fish.id])
  ).length;

  $("foundText").textContent =
    `${found}/${FISH.length}`;

  $("keptText").textContent =
    fmt(save.inventory.length);

  renderFishing();
  renderShop();
  renderEquipment();
  renderFishdex();
  renderInventory();
  renderAchievements();
}

/* =========================================
   GAME LOOP
========================================= */

function frame(now) {
  const dt = Math.min(
    (now - (lastFrame || now)) / 1000,
    0.05
  );

  lastFrame = now;

  if (phase === "aiming") {
    const reach = ROD_REACH[save.rod];

    round.power = Math.round(
      reach * (0.5 + Math.sin(now * 0.003) * 0.5)
    );

    $("powerText").textContent = `${round.power}%`;

    $("castMarker").style.left = `${round.power}%`;
  }

  else if (phase === "biting") {
    const remaining = round.deadline - now;

    $("phaseHint").textContent =
      `Waktu mengait: ${
        (Math.max(0, remaining) / 1000).toFixed(1)
      } detik`;

    if (remaining <= 0) {
      endRound("escape");
    }
  }

  else if (phase === "battle") {
    const strength = round.fish.strength;

    if (round.reel) {
      // Rod gives general pull power.
      // Reel improves retrieval speed.
      const pullSpeed =
        32 +
        save.rod * 4 +
        (save.reel - 1) * 7 -
        strength * 7;

      round.distance -= pullSpeed * dt;

      // Better reels reduce tension buildup.
      const tensionIncrease =
        21 +
        strength * 18 -
        save.rod * 2.6 -
        (save.reel - 1) * 3.5;

      round.tension += Math.max(2, tensionIncrease) * dt;
    } else {
      // Fish slowly moves away when not reeling.
      round.distance += (
        2 + strength * 7
      ) * dt;

      // Recovery improves with equipment.
      const tensionRecovery =
        31 +
        save.rod * 4 +
        (save.reel - 1) * 2;

      round.tension -= tensionRecovery * dt;
    }

    if (now >= round.nextDash) {
      round.distance += 3 + strength * 6;

      round.tension += round.reel
        ? 5 + strength * 5
        : 0;

      round.nextDash = now + rand(1500, 2900);
    }

    round.tension = Math.max(0, round.tension);

    const distanceProgress = clamp(
      (1 - round.distance / round.startDistance) * 100,
      0,
      100
    );

    $("distanceText").textContent =
      `${Math.ceil(Math.max(0, round.distance))} m`;

    $("tensionText").textContent =
      `${Math.round(Math.min(100, round.tension))}%`;

    $("distanceFill").style.width =
      `${distanceProgress}%`;

    $("tensionFill").style.width =
      `${clamp(round.tension, 0, 100)}%`;

    // Visual movement follows fish struggle.
    $("fishShadow").style.left =
      `${60 + Math.sin(now * 0.002) * 13}%`;

    if (round.distance <= 0) {
      endRound("caught");
    } else if (
      round.tension >= 100 ||
      round.distance >= 140
    ) {
      endRound("escape");
    }
  }

  requestAnimationFrame(frame);
}

/* =========================================
   INPUT EVENTS
========================================= */

$("actionButton").addEventListener("click", () => {
  if (phase === "idle") {
    startAiming();
  } else if (phase === "aiming") {
    castLine();
  } else if (phase === "biting") {
    hookFish();
  }
});

$("reelButton").addEventListener("pointerdown", event => {
  if (phase !== "battle") return;

  event.preventDefault();

  $("reelButton").setPointerCapture(event.pointerId);
  setReeling(true);
});

[
  "pointerup",
  "pointercancel",
  "lostpointercapture"
].forEach(name => {
  $("reelButton").addEventListener(
    name,
    () => setReeling(false)
  );
});

document.addEventListener("keydown", event => {
  if (event.code !== "Space" || phase !== "battle") return;

  event.preventDefault();
  setReeling(true);
});

document.addEventListener("keyup", event => {
  if (event.code === "Space") {
    setReeling(false);
  }
});

window.addEventListener("blur", () => {
  setReeling(false);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    setReeling(false);
  }
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    setTab(button.dataset.tab);
  });
});

$("rarityFilter").addEventListener(
  "change",
  renderFishdex
);

/* =========================================
   SHOP EVENTS
========================================= */

$("buyBaitButton").addEventListener("click", () => {
  buyBait("worm");
});

$("upgradeButton").addEventListener("click", () => {
  const cost = ROD_COSTS[save.rod];

  if (!cost || save.coins < cost) return;

  save.coins -= cost;
  save.rod++;

  writeSave();
  renderAll();

  showToast(`Rod naik ke Lv.${save.rod}!`);
});

/* =========================================
   PHASE 3 — SHOP & EQUIPMENT EVENTS
========================================= */

// Buy Bread, Shrimp, or Glow Worm.
$("baitShopList").addEventListener("click", event => {
  const button = event.target.closest(
    "button[data-buy-bait]"
  );

  if (!button) return;

  const id = button.dataset.buyBait;

  if (!Object.hasOwn(BAITS, id)) return;

  buyBait(id);
});

// Upgrade Reel.
$("reelUpgradeButton").addEventListener(
  "click",
  () => {
    upgradeGear("reel", REEL_COSTS);
  }
);

// Upgrade Hook.
$("hookUpgradeButton").addEventListener(
  "click",
  () => {
    upgradeGear("hook", HOOK_COSTS);
  }
);

// Change equipped bait.
$("baitEquipmentList").addEventListener(
  "click",
  event => {
    const button = event.target.closest(
      "button[data-equip-bait]"
    );

    if (!button) return;

    const id = button.dataset.equipBait;

    if (!Object.hasOwn(BAITS, id)) return;

    if (!["idle", "result"].includes(phase)) {
      showToast("Tidak bisa ganti umpan saat memancing.");
      return;
    }

    if (getBaitCount(id) < 1) {
      showToast("Bait habis! Beli di Shop.");
      return;
    }

    save.selectedBait = id;

    writeSave();
    renderAll();

    showToast(`${BAITS[id].name} berhasil dipasang!`);
  }
);

/* =========================================
   MAIN MENU
========================================= */

$("menuButton").addEventListener("click", () => {
  if (["aiming", "waiting", "biting", "battle"].includes(phase)) {
    showToast("Selesaikan sesi sebelum membuka menu.");
    return;
  }

  $("continueButton").disabled = false;
  $("menuOverlay").classList.remove("hidden");
});

$("continueButton").addEventListener("click", () => {
  $("menuOverlay").classList.add("hidden");
  setTab("fishing");
});

$("newGameButton").addEventListener("click", () => {
  if (
    hasSavedGame &&
    !window.confirm(
      "Mulai New Game? Semua progres lama akan ditimpa."
    )
  ) {
    return;
  }

  clearTimeout(pendingTimer);

  save = freshSave();
  hasSavedGame = true;

  result = null;
  phase = "idle";

  round.zone = "shore";
  round.bait = "worm";
  round.fish = null;
  round.perfect = false;

  writeSave();

  $("menuOverlay").classList.add("hidden");
  setTab("fishing");
});

/* =========================================
   INITIALIZATION
========================================= */

$("continueButton").disabled = !hasSavedGame;

renderAll();
requestAnimationFrame(frame);
