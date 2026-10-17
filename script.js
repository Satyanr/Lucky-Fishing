"use strict";

/* =========================================
   LUCKY FISHING v0.8.1
   PHASE 8 - POLISH & RELEASE PREPARATION
========================================= */

const SAVE_KEY = "lucky-fishing-save-v1";

/* =========================================
   PHASE 8 — SETTINGS CONFIG
========================================= */

const BACKUP_FORMAT = "lucky-fishing-backup";
const GAME_SAVE_VERSION = 8;

function defaultSettings() {
  return {
    sound: true,
    volume: 0.35,
    reduceMotion: false,
    lowEffects: false
  };
}

function normalizeSettings(raw) {
  const defaults = defaultSettings();

  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw)
  ) {
    return defaults;
  }

  return {
    sound:
      typeof raw.sound === "boolean"
        ? raw.sound
        : defaults.sound,

    volume:
      Number.isFinite(raw.volume)
        ? Math.max(0, Math.min(1, raw.volume))
        : defaults.volume,

    reduceMotion: raw.reduceMotion === true,
    lowEffects: raw.lowEffects === true
  };
}

const systemMotionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function shouldReduceMotion() {
  return (
    save.settings.reduceMotion ||
    systemMotionPreference.matches
  );
}
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

/* =========================================
   PHASE 4 — NEW FISH SPECIES
========================================= */

FISH.push(
  {
    id: "trout",
    name: "Rainbow Trout",
    icon: "🐟",
    rarity: "Uncommon",
    min: 0.3,
    max: 5,
    length: [20, 80],
    strength: 0.43,
    price: 70,
    spawn: 20,
    zones: ["shore", "mid"]
  },
  {
    id: "arowana",
    name: "Golden Arowana",
    icon: "🐉",
    rarity: "Rare",
    min: 1,
    max: 13,
    length: [35, 120],
    strength: 0.85,
    price: 300,
    spawn: 3,
    zones: ["mid", "deep"]
  },
  {
    id: "snapper",
    name: "Red Snapper",
    icon: "🐠",
    rarity: "Common",
    min: 0.6,
    max: 9,
    length: [20, 90],
    strength: 0.48,
    price: 95,
    spawn: 26,
    zones: ["shore", "mid"]
  },
  {
    id: "grouper",
    name: "Giant Grouper",
    icon: "🐟",
    rarity: "Uncommon",
    min: 2,
    max: 24,
    length: [35, 145],
    strength: 0.85,
    price: 180,
    spawn: 16,
    zones: ["mid", "deep"]
  },
  {
    id: "mackerel",
    name: "King Mackerel",
    icon: "🐟",
    rarity: "Common",
    min: 0.4,
    max: 6,
    length: [25, 95],
    strength: 0.58,
    price: 90,
    spawn: 30,
    zones: ["shore", "mid"]
  },
  {
    id: "parrotfish",
    name: "Rainbow Parrotfish",
    icon: "🐠",
    rarity: "Uncommon",
    min: 0.5,
    max: 8,
    length: [20, 85],
    strength: 0.65,
    price: 145,
    spawn: 17,
    zones: ["shore", "mid"]
  },
  {
    id: "tuna",
    name: "Bluefin Tuna",
    icon: "🐟",
    rarity: "Rare",
    min: 12,
    max: 130,
    length: [80, 230],
    strength: 1.02,
    price: 950,
    spawn: 3.8,
    zones: ["mid", "deep"]
  },
  {
    id: "marlin",
    name: "Blue Marlin",
    icon: "🐬",
    rarity: "Epic",
    min: 28,
    max: 240,
    length: [140, 330],
    strength: 1.18,
    price: 2400,
    spawn: 0.6,
    zones: ["deep"]
  },
  {
    id: "angler",
    name: "Abyss Anglerfish",
    icon: "🐡",
    rarity: "Rare",
    min: 1,
    max: 15,
    length: [25, 100],
    strength: 0.9,
    price: 650,
    spawn: 4,
    zones: ["shore", "mid", "deep"]
  },
  {
    id: "phantom",
    name: "Phantom Shark",
    icon: "🦈",
    rarity: "Legendary",
    min: 40,
    max: 300,
    length: [180, 500],
    strength: 1.3,
    price: 5200,
    spawn: 0.13,
    zones: ["deep"]
  },
  {
    id: "leviathan",
    name: "Abyss Leviathan",
    icon: "🐉",
    rarity: "Secret",
    min: 100,
    max: 800,
    length: [300, 900],
    strength: 1.5,
    price: 20000,
    spawn: 0.009,
    zones: ["deep"]
  }
);

/* =========================================
   PHASE 6 — SECRET FISH
========================================= */

FISH.push(
  {
    id: "eclipse",
    name: "Eclipse Koi",
    icon: "🌘",
    rarity: "Legendary",
    min: 4,
    max: 22,
    length: [45, 140],
    strength: 1.08,
    price: 2800,
    spawn: 0.22,
    zones: ["mid", "deep"]
  },
  {
    id: "nocturne",
    name: "Nocturne Serpent",
    icon: "🐉",
    rarity: "Mythic",
    min: 12,
    max: 90,
    length: [110, 340],
    strength: 1.28,
    price: 6500,
    spawn: 0.055,
    zones: ["deep"]
  }
);

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
   PHASE 4 — WORLD LOCATION DATABASE
========================================= */

const LOCATIONS = {
  village: {
    id: "village",
    order: 1,
    name: "Village Pond",
    icon: "🏡",
    type: "🌿 Danau pemula",
    tag: "STARTER AREA",
    description:
      "Danau kecil yang tenang. Tempat terbaik untuk belajar memancing.",
    cost: 0,
    catches: 0,
    rod: 1,
    previous: null,
    fish: [
      "nila", "mas", "lele", "gurame",
      "patin", "golden"
    ]
  },

  forest: {
    id: "forest",
    order: 2,
    name: "Forest River",
    icon: "🌲",
    type: "🌲 Sungai hutan",
    tag: "WOODLAND",
    description:
      "Sungai yang mengalir melewati hutan. " +
      "Rainbow Trout dan Golden Arowana menunggu di sini.",
    cost: 200,
    catches: 8,
    rod: 1,
    previous: "village",
    fish: [
      "nila", "mas", "lele", "gurame",
      "patin", "trout", "arowana", "golden"
    ]
  },

  crystal: {
    id: "crystal",
    order: 3,
    name: "Crystal Lake",
    icon: "💎",
    type: "💎 Danau kristal",
    tag: "MYSTICAL LAKE",
    description:
      "Danau biru berkilau yang menyimpan ikan-ikan mistis.",
    cost: 750,
    catches: 20,
    rod: 2,
    previous: "forest",
    fish: [
      "mas", "patin", "golden", "crystal",
      "moon", "ancient", "astral"
    ]
  },

  tropical: {
    id: "tropical",
    order: 4,
    name: "Tropical Beach",
    icon: "🏝️",
    type: "🏝️ Pantai tropis",
    tag: "TROPICAL COAST",
    description:
      "Perairan hangat dengan ikan karang dan ikan laut.",
    cost: 1600,
    catches: 35,
    rod: 3,
    previous: "crystal",
    fish: [
      "snapper", "grouper", "mackerel",
      "parrotfish", "tuna"
    ]
  },

  ocean: {
    id: "ocean",
    order: 5,
    name: "Open Ocean",
    icon: "🌊",
    type: "🌊 Laut lepas",
    tag: "OPEN WATERS",
    description:
      "Perairan luas yang menyimpan Tuna, Marlin, " +
      "dan predator laut langka.",
    cost: 3400,
    catches: 50,
    rod: 3,
    previous: "tropical",
    fish: [
      "snapper", "grouper", "mackerel",
      "parrotfish", "tuna", "marlin", "phantom"
    ]
  },

  deep: {
    id: "deep",
    order: 6,
    name: "Deep Sea",
    icon: "🌑",
    type: "🌑 Laut dalam",
    tag: "ABYSSAL WATERS",
    description:
      "Perairan misterius. Spesies Mythic dan Secret " +
      "dapat ditemukan di kedalaman.",
    cost: 7500,
    catches: 80,
    rod: 4,
    previous: "ocean",
    fish: [
      "angler", "tuna", "marlin", "phantom",
      "astral", "whisper", "leviathan"
    ]
  }
};

/* =========================================
   PHASE 6 — SECRET LOCATION
========================================= */

LOCATIONS.moonlight = {
  id: "moonlight",
  order: 7,
  name: "Moonlight Lagoon",
  icon: "🌙",
  type: "🌙 Hidden Lagoon",
  tag: "SECRET AREA",

  description:
    "Laguna tersembunyi yang ditemukan melalui " +
    "lima potongan Ancient Map. Menyimpan ikan " +
    "Legendary dan Mythic yang sulit ditemukan.",

  cost: 0,
  catches: 0,
  rod: 3,
  previous: null,

  fish: [
    "mas",
    "golden",
    "crystal",
    "moon",
    "eclipse",
    "nocturne",
    "astral",
    "whisper"
  ]
};

const LOCATION_IDS = Object.keys(LOCATIONS);

/* =========================================
   PHASE 6 — AQUARIUM CONFIG
========================================= */

const AQUARIUM_CAPACITY = {
  1: 6,
  2: 10,
  3: 14,
  4: 18
};

const AQUARIUM_COSTS = {
  1: 350,
  2: 950,
  3: 2300
};

const MAX_TREASURE_STORAGE = 30;
const MAP_REQUIRED = 5;

/* =========================================
   TREASURE DATABASE
   weight = relative roll weight
========================================= */

const TREASURE_ITEMS = {
  boot: {
    id: "boot",
    icon: "👢",
    name: "Old Boot",
    rarity: "Junk",
    price: 2,
    weight: 22
  },

  driftwood: {
    id: "driftwood",
    icon: "🪵",
    name: "Driftwood",
    rarity: "Junk",
    price: 4,
    weight: 19
  },

  coins: {
    id: "coins",
    icon: "💰",
    name: "Coin Pouch",
    rarity: "Uncommon",
    price: 85,
    weight: 20
  },

  pearl: {
    id: "pearl",
    icon: "🦪",
    name: "Shimmering Pearl",
    rarity: "Rare",
    price: 280,
    weight: 10
  },

  ring: {
    id: "ring",
    icon: "💍",
    name: "Ancient Ring",
    rarity: "Epic",
    price: 850,
    weight: 5
  },

  fragment: {
    id: "fragment",
    icon: "🗺️",
    name: "Ancient Map Fragment",
    rarity: "Special",
    price: 0,
    weight: 24
  }
};

/* =========================================
   PHASE 7 — BOSS DATABASE
========================================= */

const BOSS_FISH = {
  ancient: {
    id: "ancient",
    title: "The Ancient Guardian",
    attack: "POWERFUL SURGE",
    location: "crystal",
    rod: 2,
    firstReward: 500,
    interval: 2.8,
    power: 0.85
  },

  phantom: {
    id: "phantom",
    title: "The Ocean Hunter",
    attack: "PHANTOM DASH",
    location: "ocean",
    rod: 3,
    firstReward: 1500,
    interval: 2.4,
    power: 1.15
  },

  nocturne: {
    id: "nocturne",
    title: "The Moon Devourer",
    attack: "LUNAR STRIKE",
    location: "moonlight",
    rod: 3,
    firstReward: 3000,
    interval: 2.2,
    power: 1.3
  },

  leviathan: {
    id: "leviathan",
    title: "Ruler of the Abyss",
    attack: "ABYSSAL WRATH",
    location: "deep",
    rod: 4,
    firstReward: 8000,
    interval: 1.9,
    power: 1.55
  }
};

const BOSS_IDS = Object.keys(BOSS_FISH);

const BOSS_PHASES = [
  "Approach",
  "Resistance",
  "Frenzy",
  "Enraged"
];

function getBossStage(stamina) {
  if (stamina > 75) return 1;
  if (stamina > 45) return 2;
  if (stamina > 15) return 3;
  return 4;
}

/* =========================================
   PHASE 5 — LIVING WORLD CONFIG
========================================= */

// 1 game day = 12 real minutes.
// 1 real second = 2 in-game minutes.
const GAME_MINUTES_PER_SECOND = 2;

const WEATHER_DURATION = 90; // real seconds
const EVENT_DURATION = 60;   // real seconds

const WEATHER_TYPES = {
  clear: {
    icon: "☀️",
    name: "Clear",
    weight: 31
  },
  cloudy: {
    icon: "☁️",
    name: "Cloudy",
    weight: 26
  },
  rain: {
    icon: "🌧️",
    name: "Rain",
    weight: 22
  },
  storm: {
    icon: "⛈️",
    name: "Storm",
    weight: 9
  },
  fog: {
    icon: "🌫️",
    name: "Fog",
    weight: 12
  }
};

const WORLD_EVENTS = {
  school: {
    icon: "🐟",
    name: "School of Fish",
    description: "Rare+ spawn weight ×3"
  },
  rainbow: {
    icon: "🌈",
    name: "Rainbow",
    description: "Shiny chance ×5"
  },
  frenzy: {
    icon: "⚡",
    name: "Feeding Frenzy",
    description: "Faster bites and fewer empty casts"
  }
};

/*
  Environmental modifiers are multiplicative.
  Fish not listed here retain a multiplier of 1.
*/

const FISH_ENVIRONMENT = {
  lele: {
    weather: { rain: 2.5, storm: 1.5 },
    time: { night: 2 }
  },
  patin: {
    weather: { rain: 1.8 },
    time: { night: 1.5 }
  },
  golden: {
    time: { sunset: 2.2 },
    weather: { clear: 1.4 }
  },
  trout: {
    weather: { cloudy: 1.8, rain: 1.5 },
    time: { morning: 1.5 }
  },
  arowana: {
    time: { morning: 1.8, sunset: 2 },
    weather: { fog: 1.5 }
  },
  crystal: {
    weather: { fog: 2 },
    time: { night: 1.5 }
  },
  moon: {
    time: { night: 3 },
    weather: { fog: 1.8 }
  },
  ancient: {
    weather: { storm: 2 },
    time: { night: 2 }
  },
  snapper: {
    time: { morning: 1.7 }
  },
  parrotfish: {
    weather: { clear: 1.8 },
    time: { day: 1.6 }
  },
  tuna: {
    weather: { clear: 1.8, storm: 1.3 },
    time: { morning: 1.8 }
  },
  marlin: {
    weather: { storm: 2.2 },
    time: { sunset: 1.7 }
  },
  phantom: {
    weather: { storm: 3 },
    time: { night: 2 }
  },
  astral: {
    time: { night: 3 },
    weather: { fog: 2 }
  },
  whisper: {
    time: { night: 4 },
    weather: { fog: 3 }
  },
  leviathan: {
    time: { night: 4 },
    weather: { storm: 4 }
  }
};

/* Moonlight Lagoon fishing behavior */

FISH_ENVIRONMENT.eclipse = {
  time: {
    sunset: 2,
    night: 2.5
  },
  weather: {
    clear: 1.3,
    fog: 1.8
  }
};

FISH_ENVIRONMENT.nocturne = {
  time: {
    night: 3
  },
  weather: {
    fog: 3
  }
};

/* Glow Worm affinity for new species */

BAITS.glow.affinity.eclipse = 2;
BAITS.glow.affinity.nocturne = 2.2;

/* =========================================
   WORLD SAVE DEFAULTS
========================================= */

function freshWorld() {
  return {
    day: 1,
    minute: 360, // 06:00
    weather: "clear",

    weatherRemaining: WEATHER_DURATION,

    event: null,
    eventRemaining: 0,

    eventCooldown: rand(120, 240)
  };
}

function getDaypart(minute) {
  const hour = Math.floor(minute / 60) % 24;

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "sunset";

  return "night";
}

const DAYPART_LABELS = {
  morning: "🌅 Morning",
  day: "☀️ Day",
  sunset: "🌇 Sunset",
  night: "🌙 Night"
};

function getWorldConditions() {
  return {
    weather: save.world.weather,
    time: getDaypart(save.world.minute),
    event: save.world.event
  };
}

function formatWorldTime(minute) {
  const total = Math.floor(minute);
  const hour = Math.floor(total / 60) % 24;
  const min = total % 60;

  return (
    String(hour).padStart(2, "0") + ":" +
    String(min).padStart(2, "0")
  );
}

/* =========================================
   SAVE SYSTEM
========================================= */

function freshSave() {
  return {
    version: GAME_SAVE_VERSION,
    settings: defaultSettings(),
    world: freshWorld(),

    bossRecords: {},
    achievements: [],

    aquariumLevel: 1,
    aquarium: [],

    treasureInventory: [],
    mapFragments: 0,
    location: "village",

    unlockedLocations: ["village"],
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
      giantCatches: 0,
      treasuresFound: 0,
      mapFragmentsFound: 0,
      bossVictories: 0,
      bossEscapes: 0
    }
  };
}

function readSave(rawOverride = undefined) {
  try {
    const raw = rawOverride === undefined
      ? JSON.parse(localStorage.getItem(SAVE_KEY))
      : rawOverride;

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
        bossBonus:
          Number.isFinite(item.bossBonus)
            ? Math.max(0, Math.floor(item.bossBonus))
            : 0,
        weather: Object.hasOwn(
          WEATHER_TYPES,
          item.weather
        )
          ? item.weather
          : null,

        timePeriod: [
          "morning",
          "day",
          "sunset",
          "night"
        ].includes(item.timePeriod)
          ? item.timePeriod
          : null,

        gameDay:
          Number.isInteger(item.gameDay) && item.gameDay >= 1
            ? item.gameDay
            : null,

        gameMinute:
          Number.isFinite(item.gameMinute) &&
          item.gameMinute >= 0 &&
          item.gameMinute < 1440
            ? item.gameMinute
            : null,
        locationId:
          typeof item.locationId === "string" &&
          Object.hasOwn(LOCATIONS, item.locationId)
            ? item.locationId
            : null,
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
      pending?.kind === "caught"
        ? normalizeCatch(pending)

        : (
            pending?.kind === "treasure" &&
            Object.hasOwn(TREASURE_ITEMS, pending.treasureId) &&
            pending.treasureId !== "fragment" &&
            Number.isFinite(pending.price) &&
            pending.price >= 0
          )
          ? {
              kind: "treasure",
              treasureId: pending.treasureId,
              price: Math.floor(pending.price)
            }

          : pending?.kind === "fragment"
            ? {
                kind: "fragment",
                treasureId: "fragment"
              }

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

    /* Migration v0.3 -> v0.4 */

    const unlockedSet = new Set(["village"]);

    if (Array.isArray(raw.unlockedLocations)) {
      for (const id of raw.unlockedLocations) {
        if (typeof id === "string" &&
            Object.hasOwn(LOCATIONS, id)) {
          unlockedSet.add(id);
        }
      }
    }

    const unlockedLocations = [...unlockedSet];

    const location =
      typeof raw.location === "string" &&
      unlockedSet.has(raw.location) &&
      Object.hasOwn(LOCATIONS, raw.location)
        ? raw.location
        : "village";

    /* =========================================
       MIGRATION v0.4 -> v0.5
    ========================================= */

    const defaultWorld = freshWorld();

    const oldWorld =
      raw.world &&
      typeof raw.world === "object" &&
      !Array.isArray(raw.world)
        ? raw.world
        : {};

    const validNumber = (value, fallback, min, max) =>
      Number.isFinite(value)
        ? clamp(value, min, max)
        : fallback;

    const world = {
      day: Math.floor(
        validNumber(oldWorld.day, 1, 1, 999999)
      ),

      minute: validNumber(
        oldWorld.minute,
        360,
        0,
        1439.999
      ),

      weather: Object.hasOwn(
        WEATHER_TYPES,
        oldWorld.weather
      )
        ? oldWorld.weather
        : "clear",

      weatherRemaining: validNumber(
        oldWorld.weatherRemaining,
        WEATHER_DURATION,
        0,
        WEATHER_DURATION
      ),

      event:
        Object.hasOwn(WORLD_EVENTS, oldWorld.event) &&
        oldWorld.eventRemaining > 0
          ? oldWorld.event
          : null,

      eventRemaining: validNumber(
        oldWorld.eventRemaining,
        0,
        0,
        EVENT_DURATION
      ),

      eventCooldown: validNumber(
        oldWorld.eventCooldown,
        defaultWorld.eventCooldown,
        0,
        240
      )
    };

    if (!world.event) {
      world.eventRemaining = 0;
    }

    /* =========================================
       MIGRATION v0.5 -> v0.6
    ========================================= */

    const aquariumLevel =
      Number.isInteger(raw.aquariumLevel)
        ? clamp(raw.aquariumLevel, 1, 4)
        : 1;

    const aquarium = Array.isArray(raw.aquarium)
      ? raw.aquarium
          .map(item => {
            const fish = normalizeCatch(item);

            if (!fish) return null;

            return {
              ...fish,
              aquariumId:
                typeof item.aquariumId === "string" &&
                item.aquariumId.length > 0
                  ? item.aquariumId
                  : createAquariumId(),

              favorite: item.favorite === true
            };
          })
          .filter(Boolean)
      : [];

    const treasureInventory =
      Array.isArray(raw.treasureInventory)
        ? raw.treasureInventory
            .filter(item =>
              item &&
              Object.hasOwn(TREASURE_ITEMS, item.id) &&
              item.id !== "fragment" &&
              Number.isFinite(item.price) &&
              item.price >= 0
            )
            .map(item => ({
              id: item.id,
              price: Math.floor(item.price),
              locationId:
                Object.hasOwn(LOCATIONS, item.locationId)
                  ? item.locationId
                  : null
            }))
        : [];

    const mapFragments =
      Number.isFinite(raw.mapFragments)
        ? clamp(Math.floor(raw.mapFragments), 0, MAP_REQUIRED)
        : 0;

    /* =========================================
       MIGRATION v0.6 -> v0.7
    ========================================= */

    const bossRecords = {};

    for (const id of BOSS_IDS) {
      const old = raw.bossRecords?.[id];

      if (!old || typeof old !== "object") continue;

      bossRecords[id] = {
        wins: Number.isFinite(old.wins)
          ? Math.max(0, Math.floor(old.wins))
          : 0,

        largest: Number.isFinite(old.largest)
          ? Math.max(0, old.largest)
          : 0,

        firstDefeated:
          typeof old.firstDefeated === "string" &&
          Number.isFinite(Date.parse(old.firstDefeated))
            ? old.firstDefeated
            : null
      };
    }

    const achievements = Array.isArray(raw.achievements)
      ? [...new Set(
          raw.achievements.filter(id =>
            typeof id === "string" &&
            id.length > 0 &&
            id.length <= 64
          )
        )]
      : [];

    stats.bossVictories = Number.isFinite(
      raw.stats.bossVictories
    )
      ? Math.max(0, Math.floor(raw.stats.bossVictories))
      : 0;

    stats.bossEscapes = Number.isFinite(
      raw.stats.bossEscapes
    )
      ? Math.max(0, Math.floor(raw.stats.bossEscapes))
      : 0;

    return {
      ...defaults,
      ...raw,

      version: GAME_SAVE_VERSION,
      settings: normalizeSettings(raw.settings),
      world,
      bossRecords,
      achievements,

      aquariumLevel,
      aquarium,
      treasureInventory,
      mapFragments,

      // Pertahankan properti lain yang sudah ada:
      location,
      unlockedLocations,

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

let externalSaveConflict = false;
let lastKnownStoredSave = null;

try {
  lastKnownStoredSave = localStorage.getItem(SAVE_KEY);
} catch {
  // Storage failures are reported when a save is attempted.
}

function markSaveConflict() {
  if (externalSaveConflict) return;
  externalSaveConflict = true;
  clearTimeout(pendingTimer);
  pendingTimer = null;
  setReeling(false);
  document.querySelector(".app").inert = true;
  $("menuOverlay").inert = true;
  $("saveConflictOverlay").classList.remove("hidden");
  $("reloadSaveButton").focus();
}

function canWriteSave() {
  if (externalSaveConflict) return false;

  const stored = localStorage.getItem(SAVE_KEY);
  // Check before writing as well: a storage event can still be queued.
  if (stored !== lastKnownStoredSave && stored !== JSON.stringify(save)) {
    markSaveConflict();
    return false;
  }

  lastKnownStoredSave = stored;
  return true;
}

function writeSave() {
  if (externalSaveConflict) {
    return false;
  }

  try {
    if (!canWriteSave()) return false;
    syncAchievements();

    const serialized = JSON.stringify(save);
    localStorage.setItem(SAVE_KEY, serialized);
    lastKnownStoredSave = serialized;

    hasSavedGame = true;
    return true;
  } catch (error) {
    console.error("Save failed:", error);
    showToast("Save gagal. Periksa storage browser.");
    return false;
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
  boss: null,
  conditions: null,
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
   PHASE 8 — SAFE PAUSE STATE
========================================= */

let waitingRemainingMs = 0;
let waitingStartedAt = 0;
let fishingHiddenAt = null;

/* =========================================
   WAITING TIMER — PAUSABLE
========================================= */

function resolveWaitingBite() {
  if (externalSaveConflict || phase !== "waiting" || document.hidden || fishingHiddenAt !== null) return;

  const activeBait = BAITS[round.bait] || BAITS.worm;
  const baseEmptyChance = round.perfect ? 0.08 : 0.12;

  const frenzyBonus =
    round.conditions?.event === "frenzy" ? 0.05 : 0;

  const emptyChance = clamp(
    baseEmptyChance -
    activeBait.emptyBonus -
    frenzyBonus,
    0.02,
    0.4
  );

  if (Math.random() < emptyChance) {
    endRound("empty");
    return;
  }

  /* Treasure roll */

  if (Math.random() < getTreasureChance()) {
    endRound("treasure");
    return;
  }

  /* Fish spawn */

  round.fish = pickFish(
    round.zone,
    round.perfect
  );

  if (!round.fish) {
    endRound("empty");
    return;
  }

  /* Hook timing */

  const baseWindow =
    HOOK_WINDOWS[round.fish.rarity];

  const hookBonus =
    (save.hook - 1) * 190;

  round.deadline =
    performance.now() + baseWindow + hookBonus;

  phase = "biting";

  renderFishing();
  playSfx("bite");
}

function scheduleWaitingBite(delayMs) {
  clearTimeout(pendingTimer);
  if (externalSaveConflict) return;

  waitingRemainingMs = Math.max(1, delayMs);
  waitingStartedAt = performance.now();

  pendingTimer = setTimeout(() => {
    pendingTimer = null;

    if (document.hidden) {
      waitingRemainingMs = 1;
      return;
    }

    waitingRemainingMs = 0;
    resolveWaitingBite();
  }, waitingRemainingMs);
}

/* =========================================
   PHASE 8 — PAUSE / RESUME
========================================= */

function pauseFishingForVisibility() {
  if (fishingHiddenAt !== null) return;

  fishingHiddenAt = performance.now();

  if (phase === "waiting" && pendingTimer !== null) {
    clearTimeout(pendingTimer);
    pendingTimer = null;

    const elapsed =
      fishingHiddenAt - waitingStartedAt;

    waitingRemainingMs = Math.max(
      1,
      waitingRemainingMs - elapsed
    );
  }

  // Never keep the reel pressed while away.
  if (phase === "battle") {
    setReeling(false);
  }

  $("gamePauseNotice").classList.remove("hidden");
}

function resumeFishingAfterVisibility() {
  if (externalSaveConflict) return;
  if (fishingHiddenAt === null) return;

  const now = performance.now();
  const pauseDuration = now - fishingHiddenAt;

  fishingHiddenAt = null;

  if (phase === "waiting") {
    scheduleWaitingBite(waitingRemainingMs || 1);
  }

  else if (phase === "biting") {
    // Restore the original reaction time.
    round.deadline += pauseDuration;
  }

  else if (phase === "battle") {
    round.nextDash += pauseDuration;

    if (round.boss) {
      round.boss.nextAttack += pauseDuration;

      if (round.boss.warning) {
        round.boss.attackAt += pauseDuration;
      }

      if (round.boss.messageUntil) {
        round.boss.messageUntil += pauseDuration;
      }
    }
  }

  // Reset frame timestamps so no large delta is applied.
  lastFrame = now;
  worldLastTick = now;

  $("gamePauseNotice").classList.add("hidden");
}

/* =========================================
   RELEASE FIX — WINDOW FOCUS PAUSE
========================================= */

function syncFishingFocus() {
  const inactive =
    document.hidden || !document.hasFocus();

  if (inactive) {
    pauseFishingForVisibility();
  } else {
    resumeFishingAfterVisibility();
  }
}

/* =========================================
   PHASE 7 — BOSS BATTLE ENGINE
========================================= */

function startBossBattle(fish, now) {
  const config = BOSS_FISH[fish.id];

  if (!config) {
    round.boss = null;
    return;
  }

  round.boss = {
    id: fish.id,

    stamina: 100,
    stage: 1,

    warning: false,
    attackAt: 0,

    nextAttack: now + 2200,

    message: "🎣 Reel untuk menguras stamina boss.",
    messageUntil: 0,
    dodged: false
  };

  // Boss starts further away.
  round.startDistance = 95 + fish.strength * 16;
  round.distance = round.startDistance;

  round.tension = 8;

  showToast(
    `⚠️ BOSS ENCOUNTER: ${config.title}!`
  );
}

/* =========================================
   BOSS ATTACK LOGIC
========================================= */

function executeBossAttack(now) {
  const boss = round.boss;

  if (!boss) return;

  const config = BOSS_FISH[boss.id];

  const stagePower = [0, 0.8, 1, 1.25, 1.55][boss.stage];

  const attackPower = config.power * stagePower;

  boss.warning = false;

  if (round.reel) {
    // The player did not release the reel.
    round.tension += 20 * attackPower;
    round.distance += 9 * attackPower;

    boss.message =
      `💥 ${config.attack}! Serangan mengenai tali!`;

    boss.dodged = false;
  } else {
    // Releasing during a telegraphed attack
    // significantly reduces the impact.
    round.tension += 2 * attackPower;
    round.distance += 3 * attackPower;

    boss.message =
      `✅ Serangan ${config.attack} berhasil dihindari!`;

    boss.dodged = true;
  }

  boss.messageUntil = now + 1100;

  const interval =
    config.interval * (1 - (boss.stage - 1) * 0.1);

  boss.nextAttack = now + interval * 1000;
}

/* =========================================
   BOSS BATTLE UPDATE
========================================= */

function updateBossBattle(dt, now) {
  const boss = round.boss;

  if (!boss) return;

  const config = BOSS_FISH[boss.id];
  const fish = FISH_BY_ID[boss.id];

  if (!config || !fish) return;

  /* Stamina depletion */

  if (round.reel) {
    const staminaDamage =
      24 +
      save.reel * 2 -
      fish.strength * 5;

    boss.stamina = Math.max(
      0,
      boss.stamina - Math.max(10, staminaDamage) * dt
    );
  }

  /* Phase progression */

  const nextStage = getBossStage(boss.stamina);

  if (nextStage !== boss.stage) {
    boss.stage = nextStage;

    boss.message =
      `⚠️ PHASE ${boss.stage}: ` +
      BOSS_PHASES[boss.stage - 1];

    boss.messageUntil = now + 1100;

    showToast(boss.message);
  }

  /* Additional late-phase aggression */

  if (round.reel && boss.stage >= 3) {
    round.tension +=
      (boss.stage - 2) * config.power * 3 * dt;
  }

  /* Boss prepares a special attack */

  if (
    !boss.warning &&
    now >= boss.nextAttack
  ) {
    boss.warning = true;
    playSfx("bossWarning");

    const warningDuration =
      boss.stage >= 3 ? 750 : 1100;

    boss.attackAt = now + warningDuration;

    boss.message =
      `⚠️ ${config.attack} — LEPASKAN REEL!`;

    boss.dodged = false;
  }

  /* Execute attack after the warning */

  if (
    boss.warning &&
    now >= boss.attackAt
  ) {
    executeBossAttack(now);
  }

  /* Boss cannot be caught while stamina remains */

  if (boss.stamina > 0) {
    round.distance = Math.max(
      round.distance,
      8
    );
  }

  /* Battle UI */

  renderBossBattle(now);
}

/* =========================================
   BOSS BATTLE UI
========================================= */

function renderBossBattle(now = performance.now()) {
  const boss = round.boss;

  if (!boss) return;

  const config = BOSS_FISH[boss.id];
  if (!config) return;

  const fish = FISH_BY_ID[boss.id];

  $("bossName").textContent =
    `${fish.icon} ${config.title}`;

  $("bossPhaseLabel").textContent =
    `PHASE ${boss.stage} / 4`;

  $("bossPhaseName").textContent =
    BOSS_PHASES[boss.stage - 1];

  $("bossStaminaText").textContent =
    `${Math.ceil(boss.stamina)}%`;

  $("bossStaminaFill").style.width =
    `${clamp(boss.stamina, 0, 100)}%`;

  const status = $("bossAttackStatus");

  status.classList.toggle(
    "telegraph",
    boss.warning
  );

  status.classList.toggle(
    "dodged",
    boss.dodged && now < boss.messageUntil
  );

  if (boss.warning) {
    const remaining = Math.max(
      0,
      (boss.attackAt - now) / 1000
    );

    status.textContent =
      `${boss.message} (${remaining.toFixed(1)}s)`;
  } else if (now < boss.messageUntil) {
    status.textContent = boss.message;
  } else if (boss.stamina <= 0) {
    status.textContent =
      "✅ Boss exhausted! Tarik sampai jarak 0 m!";
  } else {
    status.textContent =
      "🎣 Tarik untuk mengurangi stamina. " +
      "Perhatikan peringatan serangan!";
  }
}

/* =========================================
   BOSS VICTORY RECORD
========================================= */

function recordBossVictory(catchData) {
  const config = BOSS_FISH[catchData.id];

  if (!config) return 0;

  const record = save.bossRecords[catchData.id] || {
    wins: 0,
    largest: 0,
    firstDefeated: null
  };

  const firstClear = record.wins === 0;

  record.wins++;
  record.largest = Math.max(
    record.largest,
    catchData.weight
  );

  if (firstClear) {
    record.firstDefeated =
      new Date().toISOString();
  }

  save.bossRecords[catchData.id] = record;
  save.stats.bossVictories++;

  // First-clear reward is paid only once.
  if (firstClear) {
    save.coins += config.firstReward;
    save.stats.earned += config.firstReward;

    showToast(
      `🏆 FIRST CLEAR! +${fmt(config.firstReward)} coins`
    );

    return config.firstReward;
  }

  showToast(`🏆 ${config.title} defeated!`);
  return 0;
}

/* =========================================
   BOSS JOURNAL UI
========================================= */

function renderBossJournal() {
  const list = $("bossJournalList");
  list.replaceChildren();

  const defeated = BOSS_IDS.filter(id =>
    (save.bossRecords[id]?.wins || 0) > 0
  ).length;

  $("bossJournalSummary").textContent =
    `${defeated} / ${BOSS_IDS.length} Boss Defeated`;

  $("bossJournalFill").style.width =
    `${defeated / BOSS_IDS.length * 100}%`;

  for (const id of BOSS_IDS) {
    const config = BOSS_FISH[id];
    const fish = FISH_BY_ID[id];
    const record = save.bossRecords[id];

    const wins = record?.wins || 0;
    const cleared = wins > 0;

    const row = document.createElement("div");

    row.className =
      `list-item boss-journal-item ` +
      (cleared ? "cleared" : "");

    const icon = document.createElement("span");
    icon.className = "list-item-icon";
    icon.textContent = cleared ? "🏆" : "🔒";

    const body = document.createElement("div");
    body.className = "list-item-body";

    const title = document.createElement("strong");
    title.textContent =
      `${fish.icon} ${config.title}`;

    const details = document.createElement("small");

    const locationName =
      LOCATIONS[config.location]?.name || "Unknown";

    if (cleared) {
      const firstDate = record.firstDefeated
        ? new Date(record.firstDefeated)
            .toLocaleDateString("id-ID")
        : "Tidak tercatat";

      details.textContent =
        `✅ DEFEATED ${wins}×\n` +
        `Best Weight: ${record.largest.toFixed(2)} kg\n` +
        `First Clear: ${firstDate}`;
    } else {
      details.textContent =
        `${locationName} • Rod Lv.${config.rod}+\n` +
        `Status: Not Defeated`;
    }

    const reward = document.createElement("p");
    reward.className = "boss-reward";

    reward.textContent = cleared
      ? "🏆 First Clear Reward: Claimed"
      : `🪙 First Clear Reward: ${
          fmt(config.firstReward)
        } coins`;

    body.append(title, details, reward);
    row.append(icon, body);

    list.append(row);
  }
}

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

  playSfx("coin");
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

  playSfx("coin");
  writeSave();
  renderAll();

  showToast(
    `${type.toUpperCase()} meningkat ke Lv.${save[type]}!`
  );
}

/* =========================================
   PHASE 6 — AQUARIUM ENGINE
========================================= */

let aquariumSprites = [];

function createAquariumId() {
  return (
    Date.now().toString(36) + "-" +
    Math.random().toString(36).slice(2, 10)
  );
}

function getAquariumCapacity() {
  return AQUARIUM_CAPACITY[save.aquariumLevel] || 6;
}

function isAquariumFull() {
  return save.aquarium.length >= getAquariumCapacity();
}

function createAquariumFish(fish) {
  return {
    ...fish,
    aquariumId: createAquariumId(),
    favorite: fish.favorite === true
  };
}

function moveFishToAquarium(index) {
  const fish = save.inventory[index];

  if (!fish) return;

  if (isAquariumFull()) {
    showToast("Aquarium penuh! Upgrade kapasitas.");
    return;
  }

  // Remove from inventory, then add to aquarium.
  save.inventory.splice(index, 1);
  save.aquarium.push(createAquariumFish(fish));

  writeSave();
  renderAll();

  showToast("🐠 Ikan dipindahkan ke Aquarium!");
}

function upgradeAquarium() {
  const cost = AQUARIUM_COSTS[save.aquariumLevel];

  if (!cost || save.coins < cost) {
    showToast("Coin tidak cukup atau aquarium sudah MAX.");
    return;
  }

  save.coins -= cost;
  save.aquariumLevel++;

  playSfx("coin");
  writeSave();
  renderAll();

  showToast(
    `Aquarium Lv.${save.aquariumLevel} unlocked!`
  );
}

/* =========================================
   AQUARIUM ACTIONS
========================================= */

function handleAquariumAction(index, action) {
  const item = save.aquarium[index];

  if (!item) return;

  if (action === "favorite") {
    item.favorite = !item.favorite;
  }

  else if (action === "remove") {
    if (save.inventory.length >= MAX_INVENTORY) {
      showToast("Inventory penuh!");
      return;
    }

    // Favorite only protects fish inside aquarium.
    save.inventory.push({
      ...item,
      favorite: false
    });

    save.aquarium.splice(index, 1);
  }

  else if (action === "sell") {
    if (item.favorite) {
      showToast("Lepas Favorite sebelum menjual ikan.");
      return;
    }

    save.coins += item.price;
    save.stats.earned += item.price;

    save.aquarium.splice(index, 1);

    showToast(`Ikan terjual: +${fmt(item.price)} coin`);
  }

  else {
    return;
  }

  writeSave();
  renderAll();
}

/* =========================================
   AQUARIUM RENDERING
========================================= */


const FISH_ART = {
 nila:["#73b9be","#d4ece0","round","bars"],mas:["#edaa55","#ffe2a4","round","scales"],
 lele:["#73849b","#b7c8cc","cat","spots"],gurame:["#9dbf9c","#e6ebbf","disc","bars"],
 patin:["#8aacc0","#eef0dc","cat","plain"],golden:["#f4c858","#fff0ae","round","scales"],
 crystal:["#89def0","#eefbff","round","crystal"],moon:["#e8dbd4","#ed9b91","round","patches"],
 ancient:["#bda06c","#e5dcac","round","scales"],astral:["#9b87d7","#dce2ff","eel","stars"],
 whisper:["#b6e7de","#effff3","eel","stars"],trout:["#85b9a8","#efb3bf","slim","spots"],
 arowana:["#d8bc73","#fff0b9","slim","scales"],snapper:["#e87972","#ffc4a0","round","scales"],
 grouper:["#9b9c7b","#ddd9a5","round","spots"],mackerel:["#65a4b8","#d1e2db","slim","bars"],
 parrotfish:["#65c6b8","#f2a1bb","disc","patches"],tuna:["#5d94c2","#e1e6dd","slim","plain"],
 marlin:["#548bc0","#d1edeb","bill","bars"],angler:["#8b709e","#c9a7b5","angler","spots"],
 phantom:["#8b9bbf","#e4e9ed","shark","plain"],leviathan:["#507f9b","#a6ecdf","eel","stars"],
 eclipse:["#847ca5","#f2b76e","round","patches"],nocturne:["#8581be","#d1b8eb","eel","stars"]
};
function createFishPortrait(fish, item = {}) {
 const [base, accent, shape, pattern] = FISH_ART[fish.id] || FISH_ART.nila;
 const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
 svg.setAttribute("viewBox", "0 0 140 80");
 svg.setAttribute("aria-hidden", "true");
 svg.classList.add("fish-portrait");
 svg.dataset.species = fish.id;
 svg.style.setProperty("--fish-base", item.shiny ? "#f0cc73" : base);
 svg.style.setProperty("--fish-accent", item.shiny ? "#fff1bb" : accent);
 const bodies = {
 round:"M34 40C45 12 91 12 113 33Q126 40 113 47C91 68 45 68 34 40Z",
 disc:"M38 40C46 4 94 4 113 32Q128 40 113 48C94 76 46 76 38 40Z",
 slim:"M30 40Q70 11 109 31L123 40 109 49Q70 69 30 40Z",
 cat:"M28 40Q67 20 108 29Q131 40 108 51Q67 60 28 40Z",
 eel:"M15 51Q42 20 67 36T117 32Q135 42 115 48Q91 64 65 47T15 51Z",
 shark:"M28 40 70 27 106 30 129 40 103 51 70 53Z",
 bill:"M30 40Q70 18 103 32L137 36 112 42Q73 64 30 40Z",
 angler:"M36 40Q45 9 91 19Q113 22 120 43L109 57Q58 69 36 40Z"
 };
 const markings = {
 plain:"",
 bars:'<path d="m52 28 6 22m8-25 6 29m8-28 5 23m9-20 3 15" stroke="#183a534d" stroke-width="4"/>',
 scales:'<path d="m49 33 6 6-6 6m14-16 6 9-6 10m14-20 6 10-6 10m14-16 5 6-5 7" fill="none" stroke="var(--fish-accent)" stroke-width="2" opacity=".55"/>',
 spots:'<g fill="#253d5d66"><circle cx="53" cy="35" r="3"/><circle cx="67" cy="44" r="3"/><circle cx="79" cy="32" r="2"/><circle cx="90" cy="45" r="3"/></g>',
 patches:'<path d="M49 27q18-6 18 10T51 51Zm27-3q16 0 17 12L83 48 74 39Z" fill="var(--fish-accent)"/>',
 crystal:'<path d="m47 38 17-15 18 14-17 18Zm36 0 13-11 12 12-14 13Z" fill="var(--fish-accent)" opacity=".5"/>',
 stars:'<path d="m54 35 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm28 9 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="var(--fish-accent)"/>'
 };
 svg.innerHTML = '<g class="portrait-tail"><path d="M40 40 12 19 17 40 12 61Z" fill="var(--fish-base)" stroke="var(--fish-accent)" stroke-width="1.5"/><path d="M17 28 36 40 17 52" fill="none" stroke="var(--fish-accent)" opacity=".55"/></g>' +
 '<path d="' + (shape === "shark" ? "M63 30 73 6 88 31" : "M49 29 65 12 85 28") + '" fill="var(--fish-base)" stroke="var(--fish-accent)" stroke-width="1.3"/>' +
 '<path d="' + bodies[shape] + '" fill="var(--fish-base)" stroke="#123b5355" stroke-width="1.5"/>' +
 '<path d="M44 44Q77 62 108 45Q78 71 44 44Z" fill="var(--fish-accent)" opacity=".6"/>' + markings[pattern] +
 '<path class="portrait-fin" d="M78 40 61 42 74 56 84 45" fill="var(--fish-accent)" opacity=".8"/>' +
 '<path d="M96 31q-7 10 0 19" fill="none" stroke="#173a5055" stroke-width="2"/>' +
 '<circle cx="107" cy="35" r="5" fill="#f4f5dd"/><circle cx="108" cy="35" r="2.8" fill="#122d43"/><circle cx="109" cy="34" r="1" fill="white"/>' +
 (shape === "cat" ? '<path d="M116 43q13 7 17-1m-18 3q9 16 16 12" fill="none" stroke="var(--fish-accent)" stroke-width="2"/>' : "") +
 (shape === "angler" ? '<path d="M85 22Q78-2 105 8" fill="none" stroke="var(--fish-base)" stroke-width="3"/><circle cx="107" cy="9" r="5" fill="#d9f9b1"/>' : "") +
 (item.shiny ? '<path d="m30 9 2 5 5 2-5 2-2 5-2-5-5-2 5-2m89 42 2 4 4 2-4 2-2 4-2-4-4-2 4-2" fill="#fff2ae"/>' : "");
 return svg;
}

function renderAquarium() {
  const layer = $("aquariumFishLayer");
  const list = $("aquariumFishList");

  const previousFishMotion = new Map(
    aquariumSprites.map(sprite => [
      sprite.id,
      {
        x: sprite.x,
        y: sprite.y,
        vx: sprite.vx,
        wave: sprite.wave
      }
    ])
  );

  layer.replaceChildren();
  list.replaceChildren();

  aquariumSprites = [];

  const capacity = getAquariumCapacity();

  const favorites = save.aquarium.filter(
    fish => fish.favorite
  ).length;

  $("aquariumCapacity").textContent =
    `${save.aquarium.length} / ${capacity} Fish`;

  $("aquariumFavoriteCount").textContent =
    `❤️ ${favorites} Favorite`;

  if (save.aquarium.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";

    empty.textContent =
      "Belum ada ikan. Simpan hasil tangkapan " +
      "dari Inventory atau Catch Result.";

    list.append(empty);
    return;
  }

  save.aquarium.forEach((item, index) => {
    const fish = FISH_BY_ID[item.id];

    if (!fish) return;

    /* Aquarium sprite */

    const sprite = document.createElement("span");

    sprite.className = [
      "aquarium-fish",
      item.shiny ? "shiny-fish" : "",
      item.favorite ? "favorite-fish" : ""
    ].filter(Boolean).join(" ");

    sprite.append(createFishPortrait(fish, item));
    sprite.style.width = (["eel", "shark", "bill"].includes(FISH_ART[fish.id]?.[2]) ? 92 : 76) + "px";
    sprite.title = fish.name;
    sprite.setAttribute("aria-hidden", "true");

    layer.append(sprite);

    const previous = previousFishMotion.get(
      item.aquariumId
    );

    aquariumSprites.push({
      id: item.aquariumId,
      node: sprite,

      x: previous?.x ?? rand(12, 88),
      y: previous?.y ?? rand(18, 76),

      vx: previous?.vx ?? (
        rand(5, 13) *
        (Math.random() < 0.5 ? -1 : 1)
      ),

      wave: previous?.wave ?? rand(0, Math.PI * 2)
    });

    /* Collection list item */

    const row = document.createElement("div");
    row.className =
      "list-item aquarium-fish-list-item";

    const icon = document.createElement("span");
    icon.className = "list-item-icon fish-thumbnail";
    icon.append(createFishPortrait(fish, item));

    const body = document.createElement("div");
    body.className = "list-item-body";

    const name = document.createElement("strong");
    name.textContent =
      `${fish.name}${item.favorite ? " ❤️" : ""}` +
      `${item.shiny ? " ✨" : ""}`;

    const details = document.createElement("small");
    details.textContent =
      `${item.weight.toFixed(2)} kg • ` +
      `${fish.rarity} • 🪙 ${fmt(item.price)}`;

    body.append(name, details);

    const actions = document.createElement("div");
    actions.className = "aquarium-fish-actions";

    const buttons = [
      {
        action: "favorite",
        label: item.favorite ? "❤️ Favorite" : "♡ Favorite"
      },
      {
        action: "remove",
        label: "↩ Inventory"
      },
      {
        action: "sell",
        label: `🪙 Jual ${fmt(item.price)}`
      }
    ];

    buttons.forEach(data => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = data.label;
      button.dataset.action = data.action;
      button.dataset.index = index;

      if (data.action === "favorite" && item.favorite) {
        button.classList.add("favorite-on");
      }

      if (data.action === "sell") {
        button.classList.add("sell-fish");
        button.disabled = item.favorite;
      }

      actions.append(button);
    });

    row.append(icon, body, actions);
    list.append(row);
  });
}

/* =========================================
   AQUARIUM ANIMATION
========================================= */

function animateAquarium(dt, now) {
  if (document.hidden) return;

  const panel = document.querySelector(
    '[data-panel="aquarium"]'
  );

  if (!panel || panel.classList.contains("hidden")) {
    return;
  }

  const reducedMotion = shouldReduceMotion();

  aquariumSprites.forEach(sprite => {
    if (!reducedMotion) {
      const speedMultiplier =
        save.settings.lowEffects ? 0.6 : 1;

      sprite.x += sprite.vx * dt * speedMultiplier;

      const edge = Math.min(35, Math.max(9,
        sprite.node.offsetWidth / Math.max(1, $("aquariumFishLayer").clientWidth) * 50 + 2));
      if (sprite.x > 100 - edge) {
        sprite.x = 100 - edge;
        sprite.vx = -Math.abs(sprite.vx);
      }

      if (sprite.x < edge) {
        sprite.x = edge;
        sprite.vx = Math.abs(sprite.vx);
      }
    }

    const bob = reducedMotion
      ? 0
      : Math.sin(now * 0.0016 + sprite.wave) * 2.5;

    sprite.node.style.left = `${sprite.x}%`;
    sprite.node.style.top = `${sprite.y + bob}%`;

    sprite.node.style.transform =
      `translate(-50%, -50%) scaleX(${
        sprite.vx >= 0 ? 1 : -1
      })`;
  });
}

/* =========================================
   PHASE 6 — TREASURE ENGINE
========================================= */

function getTreasureChance() {
  let chance = 0.14;

  if (round.zone === "deep") {
    chance += 0.04;
  }

  if (round.perfect) {
    chance += 0.02;
  }

  return chance;
}

function rollTreasure() {
  const pool = Object.values(TREASURE_ITEMS)
    .filter(item => {
      // Stop dropping fragments after map completion.
      if (
        item.id === "fragment" &&
        save.mapFragments >= MAP_REQUIRED
      ) {
        return false;
      }

      return true;
    });

  const total = pool.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  let roll = Math.random() * total;

  for (const item of pool) {
    roll -= item.weight;

    if (roll < 0) return item;
  }

  return pool[pool.length - 1];
}

function generateTreasureResult() {
  const item = rollTreasure();

  if (item.id === "fragment") {
    // Claim immediately, exactly once.
    save.mapFragments = Math.min(
      MAP_REQUIRED,
      save.mapFragments + 1
    );

    save.stats.mapFragmentsFound++;

    return {
      kind: "fragment",
      treasureId: "fragment"
    };
  }

  const price = Math.max(
    1,
    Math.round(item.price * rand(0.85, 1.15))
  );

  return {
    kind: "treasure",
    treasureId: item.id,
    price
  };
}

/* =========================================
   TREASURE RESULT ACTIONS
========================================= */

function handleTreasureResult(action) {
  if (
    phase !== "result" ||
    result?.kind !== "treasure"
  ) {
    return;
  }

  const item = TREASURE_ITEMS[result.treasureId];

  if (!item || item.id === "fragment") return;

  if (action === "store") {
    if (
      save.treasureInventory.length >=
      MAX_TREASURE_STORAGE
    ) {
      showToast("Treasure Inventory penuh!");
      return;
    }

    save.treasureInventory.push({
      id: item.id,
      price: result.price,
      locationId: save.location
    });

    showToast(`${item.name} disimpan!`);
  }

  else if (action === "sell") {
    save.coins += result.price;
    save.stats.earned += result.price;

    showToast(`+${fmt(result.price)} coins`);
  }

  else {
    return;
  }

  save.pendingCatch = null;

  writeSave();
  finishResult();
}

function acknowledgeFragment() {
  if (phase !== "result" || result?.kind !== "fragment") {
    return;
  }

  save.pendingCatch = null;

  writeSave();
  finishResult();
}

/* =========================================
   TREASURE INVENTORY UI
========================================= */

function renderTreasure() {
  const list = $("treasureInventoryList");

  list.replaceChildren();

  $("mapFragmentText").textContent =
    `${save.mapFragments} / ${MAP_REQUIRED}`;

  $("mapProgressFill").style.width =
    `${save.mapFragments / MAP_REQUIRED * 100}%`;

  const mapComplete =
    save.mapFragments >= MAP_REQUIRED;

  $("mapDescription").textContent = mapComplete
    ? "🗺️ Ancient Map lengkap! Buka menu Locations " +
      "untuk mengakses Moonlight Lagoon."
    : `Kumpulkan ${
        MAP_REQUIRED - save.mapFragments
      } fragment lagi untuk menemukan Moonlight Lagoon.`;

  $("treasureFoundText").textContent =
    fmt(save.stats.treasuresFound);

  $("treasureStoredText").textContent =
    `${save.treasureInventory.length} / ${MAX_TREASURE_STORAGE}`;

  if (!save.treasureInventory.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";

    empty.textContent =
      "Belum ada treasure tersimpan.";

    list.append(empty);
    return;
  }

  save.treasureInventory.forEach((owned, index) => {
    const item = TREASURE_ITEMS[owned.id];

    if (!item) return;

    const row = document.createElement("div");
    row.className = "list-item";

    const icon = document.createElement("span");
    icon.className = "list-item-icon";
    icon.textContent = item.icon;

    const body = document.createElement("div");
    body.className = "list-item-body";

    const title = document.createElement("strong");
    title.textContent = item.name;

    const description = document.createElement("small");
    description.textContent =
      `${item.rarity} • Value: 🪙 ${fmt(owned.price)}`;

    body.append(title, description);

    const button = document.createElement("button");
    button.type = "button";

    button.textContent =
      `Jual 🪙 ${fmt(owned.price)}`;

    button.addEventListener("click", () => {
      save.coins += owned.price;
      save.stats.earned += owned.price;

      save.treasureInventory.splice(index, 1);

      writeSave();
      renderAll();

      showToast(`${item.name} terjual!`);
    });

    row.append(icon, body, button);
    list.append(row);
  });
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
   PHASE 8 — SETTINGS UI
========================================= */

function applySettings() {
  const settings = save.settings;

  document.body.classList.toggle(
    "reduce-motion",
    shouldReduceMotion()
  );

  document.body.classList.toggle(
    "low-effects",
    settings.lowEffects
  );
}

function renderSettings() {
  const settings = save.settings;

  $("settingSound").checked = settings.sound;

  $("settingVolume").value = Math.round(
    settings.volume * 100
  );

  $("settingVolumeText").textContent =
    `${Math.round(settings.volume * 100)}%`;

  $("settingMotion").checked =
    settings.reduceMotion;

  $("settingEffects").checked =
    settings.lowEffects;

  $("testSoundButton").disabled =
    !settings.sound || settings.volume <= 0;

  applySettings();
}

function updateSetting(key, value) {
  if (!Object.hasOwn(defaultSettings(), key)) {
    return;
  }

  save.settings[key] = value;

  applySettings();
  writeSave();
  renderSettings();
}

/* =========================================
   PHASE 8 — SOUND ENGINE
========================================= */

let audioContext = null;

const SOUND_PATTERNS = {
  cast: [
    [520, 0.11, "sine"],
    [340, 0.16, "sine"]
  ],

  bite: [
    [840, 0.09, "square"],
    [1050, 0.10, "square"]
  ],

  hook: [
    [420, 0.11, "triangle"],
    [670, 0.14, "triangle"]
  ],

  catch: [
    [520, 0.12, "sine"],
    [660, 0.12, "sine"],
    [880, 0.19, "sine"]
  ],

  escape: [
    [390, 0.14, "triangle"],
    [230, 0.22, "triangle"]
  ],

  treasure: [
    [620, 0.12, "sine"],
    [860, 0.12, "sine"],
    [1160, 0.20, "sine"]
  ],

  coin: [
    [900, 0.08, "sine"],
    [1190, 0.13, "sine"]
  ],

  boss: [
    [180, 0.18, "sawtooth"],
    [145, 0.20, "sawtooth"],
    [110, 0.26, "sawtooth"]
  ],

  bossWarning: [
    [420, 0.13, "square"],
    [420, 0.13, "square"]
  ],

  bossWin: [
    [440, 0.14, "triangle"],
    [550, 0.14, "triangle"],
    [660, 0.14, "triangle"],
    [880, 0.30, "triangle"]
  ]
};

function playSfx(name) {
  const settings = save.settings;

  if (!settings.sound || settings.volume <= 0) {
    return;
  }

  const pattern = SOUND_PATTERNS[name];

  if (!pattern) return;

  const Context =
    window.AudioContext || window.webkitAudioContext;

  if (!Context) return;

  try {
    if (!audioContext) {
      audioContext = new Context();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    let start = audioContext.currentTime + 0.01;

    for (const [frequency, duration, type] of pattern) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      const peak = Math.max(
        0.0001,
        Math.min(0.12, settings.volume * 0.1)
      );

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(
        frequency,
        start
      );

      gain.gain.setValueAtTime(0.0001, start);

      gain.gain.exponentialRampToValueAtTime(
        peak,
        start + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);

      start += duration * 0.85;
    }
  } catch (error) {
    // Audio is optional and must never stop gameplay.
    console.warn("Sound unavailable:", error);
  }
}

/* =========================================
   PHASE 8 — SAVE EXPORT
========================================= */

function exportGameSave() {
  if (!hasSavedGame) {
    showToast("Belum ada save untuk diekspor.");
    return;
  }

  if (!writeSave()) return;

  const backup = {
    format: BACKUP_FORMAT,
    version: GAME_SAVE_VERSION,
    exportedAt: new Date().toISOString(),
    save: save
  };

  const json = JSON.stringify(
    backup,
    null,
    2
  );

  const blob = new Blob(
    [json],
    { type: "application/json;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);

  const link = document.createElement("a");

  link.href = url;
  link.download = `Lucky-Fishing-Save-${date}.json`;

  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  showToast("💾 Backup save siap disimpan!");
}

/* =========================================
   PHASE 8 — SAVE IMPORT
========================================= */

async function importGameSave(file) {
  if (!file || externalSaveConflict) return;

  // Protect against accidentally importing huge files.
  if (file.size > 2 * 1024 * 1024) {
    showToast("File backup terlalu besar (maks. 2 MB).");
    return;
  }

  try {
    const text = await file.text();
    const backup = JSON.parse(text);

    if (
      !backup ||
      backup.format !== BACKUP_FORMAT ||
      !backup.save ||
      typeof backup.save !== "object" ||
      Array.isArray(backup.save)
    ) {
      throw new Error("Format backup tidak dikenali.");
    }

    const sourceVersion = backup.save.version;

    if (backup.version !== sourceVersion) {
      throw new Error(
        "Versi metadata dan isi backup tidak cocok."
      );
    }

    if (
      !Number.isInteger(sourceVersion) ||
      sourceVersion < 2 ||
      sourceVersion > GAME_SAVE_VERSION
    ) {
      throw new Error("Versi save tidak didukung.");
    }

    // Reuse existing validation and migrations.
    const restored = readSave(backup.save);

    if (!restored) {
      throw new Error("Isi backup tidak valid.");
    }

    if (
      restored.inventory.length > MAX_INVENTORY ||
      restored.aquarium.length > AQUARIUM_CAPACITY[restored.aquariumLevel] ||
      restored.treasureInventory.length > MAX_TREASURE_STORAGE
    ) {
      throw new Error("Kapasitas koleksi dalam backup tidak valid.");
    }

    const confirmed = window.confirm(
      "Restore backup Lucky Fishing?\n\n" +
      "Seluruh progres saat ini akan diganti.\n" +
      "Pastikan kamu sudah membuat backup sebelumnya."
    );

    if (!confirmed) return;
    if (!canWriteSave()) return;

    // Save validated data BEFORE changing game state.
    // If storage fails, keep the current game untouched.
    const serialized = JSON.stringify(restored);
    localStorage.setItem(SAVE_KEY, serialized);
    lastKnownStoredSave = serialized;

    clearTimeout(pendingTimer);
    pendingTimer = null;
    waitingRemainingMs = 0;
    waitingStartedAt = 0;
    fishingHiddenAt = null;
    $("gamePauseNotice").classList.add("hidden");
    aquariumSprites = [];

    save = restored;
    hasSavedGame = true;

    result = save.pendingCatch || null;
    phase = result ? "result" : "idle";

    round.fish = null;
    round.boss = null;
    round.conditions = null;
    round.zone = "shore";
    round.power = 0;
    round.perfect = false;
    round.reel = false;

    worldLastTick = performance.now();
    lastFrame = performance.now();
    worldSaveAccumulator = 0;

    $("menuOverlay").classList.add("hidden");
    $("continueButton").disabled = false;

    // Persist any achievement migration results.
    writeSave();

    setTab("fishing");

    showToast("✅ Save berhasil dipulihkan!");
  } catch (error) {
    console.error("Import failed:", error);

    showToast(
      `Gagal restore: ${error.message}`
    );
  }
}

/* =========================================
   PHASE 5 — WORLD ENGINE
========================================= */

let worldLastTick = performance.now();
let worldSaveAccumulator = 0;

/* Weighted random weather */

function rollWeather() {
  const entries = Object.entries(WEATHER_TYPES);

  const total = entries.reduce(
    (sum, [, data]) => sum + data.weight,
    0
  );

  let roll = Math.random() * total;

  for (const [id, data] of entries) {
    roll -= data.weight;

    if (roll < 0) return id;
  }

  return "clear";
}

/* Weather transition */

function changeWeather() {
  const world = save.world;

  world.weather = rollWeather();
  world.weatherRemaining = WEATHER_DURATION;

  const weather = WEATHER_TYPES[world.weather];

  showToast(
    `${weather.icon} Weather changed: ${weather.name}`
  );
}

/* Random event activation */

function startWorldEvent() {
  const eventIds = Object.keys(WORLD_EVENTS);

  const id = eventIds[
    Math.floor(Math.random() * eventIds.length)
  ];

  save.world.event = id;
  save.world.eventRemaining = EVENT_DURATION;
  save.world.eventCooldown = 0;

  const event = WORLD_EVENTS[id];

  showToast(
    `${event.icon} EVENT: ${event.name}!`
  );
}

function endWorldEvent() {
  save.world.event = null;
  save.world.eventRemaining = 0;

  // Delay until another event.
  save.world.eventCooldown = rand(120, 240);

  showToast("World event ended.");
}

/* =========================================
   ADVANCE GAME TIME
========================================= */

function advanceWorld(dt) {
  const world = save.world;

  let changed = false;

  // Advance clock.
  world.minute += dt * GAME_MINUTES_PER_SECOND;

  while (world.minute >= 1440) {
    world.minute -= 1440;
    world.day++;
  }

  // Weather duration.
  world.weatherRemaining -= dt;

  if (world.weatherRemaining <= 0) {
    changeWeather();
    changed = true;
  }

  // Random events.
  if (world.event) {
    world.eventRemaining -= dt;

    if (world.eventRemaining <= 0) {
      endWorldEvent();
      changed = true;
    }
  } else {
    world.eventCooldown -= dt;

    if (world.eventCooldown <= 0) {
      startWorldEvent();
      changed = true;
    }
  }

  return changed;
}

/* =========================================
   WORLD UI
========================================= */

function renderSceneCaption() {
  const weatherNotes = {
    rain: "Rintik hujan membentuk riak di permukaan air.",
    storm: "Badai datang. Perhatikan tension saat ikan melawan.",
    fog: "Kabut menyelimuti perairan. Perhatikan pelampung.",
    cloudy: "Langit mendung, perairan terasa tenang."
  };
  const periodNotes = {
    morning: "Cahaya pagi menyapa perairan.",
    day: "Langit cerah. Saatnya melempar kail.",
    sunset: "Senja mewarnai air dengan cahaya hangat.",
    night: "Malam sunyi. Ada kehidupan di bawah permukaan."
  };
  const actions = {
    aiming: "Cari timing Perfect Cast!",
    waiting: "Tenang... perhatikan pelampung.",
    biting: "TARIK SEKARANG!",
    battle: "Jaga tension agar tali tidak putus!",
    result: "Satu sesi selesai."
  };
  $("sceneNote").textContent = actions[phase] ||
    weatherNotes[save.world.weather] || periodNotes[getDaypart(save.world.minute)];
}

function renderWorld() {
  renderSceneCaption();
  const world = save.world;
  const weather = WEATHER_TYPES[world.weather];
  const period = getDaypart(world.minute);

  const clock = formatWorldTime(world.minute);

  $("worldClock").textContent =
    `🕒 Day ${world.day} • ${clock}`;

  $("weatherStatus").textContent =
    `${weather.icon} ${weather.name}`;

  $("worldTimeLabel").textContent =
    DAYPART_LABELS[period];

  $("worldWeatherLabel").textContent =
    `${weather.icon} ${weather.name}`;

  const scene = $("lakeScene");

  // Preserve the existing area-* CSS class.
  scene.classList.remove(
    "time-morning",
    "time-day",
    "time-sunset",
    "time-night",
    "weather-clear",
    "weather-cloudy",
    "weather-rain",
    "weather-storm",
    "weather-fog"
  );

  scene.classList.add(
    `time-${period}`,
    `weather-${world.weather}`
  );

  // Dynamic event UI.
  const eventBox = $("worldEvent");

  if (world.event) {
    const event = WORLD_EVENTS[world.event];

    eventBox.classList.remove("hidden");

    $("worldEventIcon").textContent = event.icon;

    $("worldEventTitle").textContent = event.name;

    $("worldEventDescription").textContent =
      event.description;

    $("worldEventTimer").textContent =
      `${Math.ceil(world.eventRemaining)}s`;

    $("worldConditionLabel").textContent =
      `${event.icon} Event Active`;
  } else {
    eventBox.classList.add("hidden");

    $("worldConditionLabel").textContent =
      world.weather === "storm"
        ? "⛈️ Dangerous Waters"
        : world.weather === "rain"
          ? "🌧️ Rain Fishing"
          : period === "night"
            ? "🌙 Night Fishing"
            : "Normal Fishing";
  }
}

/* =========================================
   WORLD TIMER
========================================= */

function tickWorld() {
  const now = performance.now();

  // Clamp elapsed time to prevent a large jump.
  const dt = clamp(
    (now - worldLastTick) / 1000,
    0,
    2
  );

  worldLastTick = now;

  // Pause while page is hidden or main menu is open.
  if (
    externalSaveConflict ||
    document.hidden ||
    fishingHiddenAt !== null ||
    !$("menuOverlay").classList.contains("hidden")
  ) {
    return;
  }

  const changed = advanceWorld(dt);

  renderWorld();

  // Do not write localStorage every animation frame.
  worldSaveAccumulator += dt;

  if (changed || worldSaveAccumulator >= 10) {
    writeSave();
    worldSaveAccumulator = 0;
  }
}

/* =========================================
   PHASE 4 — LOCATION SYSTEM
========================================= */

function getCurrentLocation() {
  return LOCATIONS[save.location] || LOCATIONS.village;
}

function isLocationUnlocked(id) {
  return id === "village" ||
    save.unlockedLocations.includes(id);
}

function getLocationProgress(id) {
  const location = Object.hasOwn(LOCATIONS, id) ? LOCATIONS[id] : null;

  if (!location) {
    return { found: 0, total: 0, percent: 0 };
  }

  const total = location.fish.length;

  const found = location.fish.filter(
    fishId => Boolean(save.fishdex[fishId])
  ).length;

  return {
    found,
    total,
    percent: total ? Math.round(found / total * 100) : 0
  };
}

function getMissingRequirements(location) {
  const missing = [];

  /* Secret location map requirement */

  if (
    location.id === "moonlight" &&
    save.mapFragments < MAP_REQUIRED
  ) {
    missing.push(
      `Perlu ${MAP_REQUIRED} Ancient Map Fragments ` +
      `(${save.mapFragments}/${MAP_REQUIRED})`
    );
  }

  if (
    location.previous &&
    !isLocationUnlocked(location.previous)
  ) {
    missing.push(
      `Buka ${LOCATIONS[location.previous].name} dahulu`
    );
  }

  if (save.stats.catches < location.catches) {
    missing.push(
      `Perlu ${location.catches} total tangkapan`
    );
  }

  if (save.rod < location.rod) {
    missing.push(`Perlu Rod Lv.${location.rod}`);
  }

  if (save.coins < location.cost) {
    missing.push(`Perlu ${fmt(location.cost)} coins`);
  }

  return missing;
}

function travelToLocation(id) {
  if (!Object.hasOwn(LOCATIONS, id)) return;
  const location = LOCATIONS[id];

  if (!location) return;

  // Prevent changing the world during a fishing session.
  if (phase !== "idle") {
    showToast("Selesaikan hasil memancing sebelum berpindah.");
    return;
  }

  if (save.location === id) {
    showToast("Kamu sudah berada di lokasi ini.");
    return;
  }

  if (!isLocationUnlocked(id)) {
    const missing = getMissingRequirements(location);

    if (missing.length) {
      showToast(missing[0]);
      return;
    }

    // One-time unlock purchase.
    save.coins -= location.cost;
    save.unlockedLocations.push(id);

    showToast(`🗺️ ${location.name} berhasil dibuka!`);
  } else {
    showToast(`📍 Pergi ke ${location.name}`);
  }

  save.location = id;

  round.zone = "shore";
  round.fish = null;
  round.power = 0;
  round.perfect = false;

  writeSave();

  renderAll();
  setTab("fishing");
}

/* =========================================
   LOCATION UI
========================================= */

function renderLocationScene() {
  const location = getCurrentLocation();
  const progress = getLocationProgress(location.id);

  $("locationTitle").textContent = location.name;

  $("locationEyebrow").textContent =
    `LOCATION ${String(location.order).padStart(2, "0")} • ` +
    location.tag;

  $("locationType").textContent = location.type;

  $("lakeScene").className =
    `lake-scene area-${location.id}`;

  $("foundText").textContent =
    `${progress.found}/${progress.total}`;

  const zoneNames = ["shore", "mid", "deep"];

  document.querySelectorAll(".meter-labels span")
    .forEach((element, index) => {
      element.textContent = displayZone(zoneNames[index]);
    });
}

function renderTravelMap() {
  const positions = [[19,68],[26,47],[43,30],[60,52],[76,70],[86,39],[73,17]];
  $("mapNodes").replaceChildren();
  Object.values(LOCATIONS).forEach((location, index) => {
    const pin = document.createElement("button");
    const owned = isLocationUnlocked(location.id);
    const current = save.location === location.id;
    pin.type = "button";
    pin.className = "map-pin" + (current ? " current" : "") + (!owned ? " locked" : "");
    pin.style.left = positions[index][0] + "%";
    pin.style.top = positions[index][1] + "%";
    pin.setAttribute("aria-label", location.name + (current ? ", lokasi sekarang" : owned ? ", kunjungi" : ", lihat syarat buka"));
    if (current) pin.setAttribute("aria-current", "location");
    const marker = document.createElement("span");
    marker.textContent = owned ? location.icon : "\u{1F512}";
    const label = document.createElement("small");
    label.textContent = location.name;
    pin.append(marker, label);
    pin.addEventListener("click", () => {
      const card = document.querySelector('[data-location-card="' + location.id + '"]');
      card?.scrollIntoView({behavior: shouldReduceMotion() ? "instant" : "smooth", block: "nearest"});
      card?.focus({preventScroll: true});
      if (owned && !current) travelToLocation(location.id);
      else if (!owned) showToast(getMissingRequirements(location)[0] || "Area siap dibuka melalui tombol di bawah.");
    });
    $("mapNodes").append(pin);
  });
}

function renderLocations() {
  renderTravelMap();
  const list = $("locationList");
  list.replaceChildren();

  const unlocked = LOCATION_IDS.filter(
    isLocationUnlocked
  ).length;

  const discovered = FISH.filter(
    fish => Boolean(save.fishdex[fish.id])
  ).length;

  $("areaProgress").textContent =
    `${unlocked} / ${LOCATION_IDS.length}`;

  $("areaFishProgress").textContent =
    `${discovered} / ${FISH.length}`;

  for (const location of Object.values(LOCATIONS)) {
    const active = save.location === location.id;
    const owned = isLocationUnlocked(location.id);
    const progress = getLocationProgress(location.id);
    const missing = owned
      ? []
      : getMissingRequirements(location);

    const card = document.createElement("article");

    card.dataset.locationCard = location.id;
    card.tabIndex = -1;
    card.className = [
      "location-option",
      active ? "is-current" : "",
      !owned ? "is-locked" : ""
    ].filter(Boolean).join(" ");

    const header = document.createElement("div");
    header.className = "location-option-header";

    const icon = document.createElement("div");
    icon.className = "location-option-icon";
    icon.textContent = owned ? location.icon : "🔒";

    const titleBox = document.createElement("div");
    titleBox.className = "location-option-title";

    const name = document.createElement("strong");
    name.textContent = location.name;

    const subtitle = document.createElement("small");
    subtitle.textContent =
      `${location.tag} • ${progress.found}/${progress.total} species`;

    titleBox.append(name, subtitle);
    header.append(icon, titleBox);

    const description = document.createElement("p");
    description.className = "location-option-description";
    description.textContent = location.description;

    const meta = document.createElement("div");
    meta.className = "location-option-meta";

    const details = [
      `🎣 Rod Lv.${location.rod}`,
      `🐟 ${location.catches} catches`,
      location.cost
        ? `🪙 ${fmt(location.cost)} unlock`
        : "Free"
    ];

    for (const detail of details) {
      const chip = document.createElement("span");
      chip.className = "location-chip";
      chip.textContent = detail;
      meta.append(chip);
    }

    const progressTrack = document.createElement("div");
    progressTrack.className = "location-option-progress";

    const progressFill = document.createElement("div");
    progressFill.style.width = `${progress.percent}%`;

    progressTrack.append(progressFill);

    card.append(header, description, meta, progressTrack);

    if (!owned && missing.length) {
      const requirement = document.createElement("p");
      requirement.className = "location-requirements";
      requirement.textContent =
        `🔒 ${missing.join(" • ")}`;

      card.append(requirement);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "location-action";
    button.dataset.locationId = location.id;

    if (active) {
      button.textContent = "✓ Current Location";
    } else if (owned) {
      button.textContent = "➜ Travel";
    } else {
      button.textContent =
        `🔓 Unlock & Travel • 🪙 ${fmt(location.cost)}`;
    }

    button.disabled =
      active || phase !== "idle" ||
      (!owned && missing.length > 0);

    card.append(button);
    list.append(card);
  }
}

/* =========================================
   FISH SPAWN & RNG
========================================= */

function secretUnlocked() {
  return save.rod >= 4 && save.stats.catches >= 30;
}

function availableFish(zone) {
  const location = getCurrentLocation();

  const conditions =
    round.conditions || getWorldConditions();

  return location.fish
    .map(id => FISH_BY_ID[id])
    .filter(fish => {
      if (!fish) return false;

      if (!fish.zones.includes(zone)) {
        return false;
      }

      /* Boss equipment requirement */

      const bossConfig = BOSS_FISH[fish.id];

      if (
        bossConfig &&
        save.rod < bossConfig.rod
      ) {
        return false;
      }

      if (
        fish.rarity === "Secret" &&
        !secretUnlocked()
      ) {
        return false;
      }

      // Phantom Shark: storm or nighttime.
      if (
        fish.id === "phantom" &&
        conditions.weather !== "storm" &&
        conditions.time !== "night"
      ) {
        return false;
      }

      // Whisper of the Pond: foggy night.
      if (
        fish.id === "whisper" &&
        (
          conditions.weather !== "fog" ||
          conditions.time !== "night"
        )
      ) {
        return false;
      }

      // Abyss Leviathan: stormy night.
      if (
        fish.id === "leviathan" &&
        (
          conditions.weather !== "storm" ||
          conditions.time !== "night"
        )
      ) {
        return false;
      }

      /* Moonlight-exclusive fish conditions */

      if (
        fish.id === "eclipse" &&
        !["sunset", "night"].includes(conditions.time)
      ) {
        return false;
      }

      if (
        fish.id === "nocturne" &&
        (
          conditions.time !== "night" ||
          conditions.weather !== "fog"
        )
      ) {
        return false;
      }

      return true;
    });
}

function getSpawnWeight(fish, perfect) {
  let weight = fish.spawn;

  const conditions =
    round.conditions || getWorldConditions();

  /* PERFECT CAST */

  if (perfect) {
    weight *= RARITY_LUCK[fish.rarity] ?? 1;
  }

  /* BAIT AFFINITY */

  const bait = BAITS[round.bait] || BAITS.worm;

  weight *= bait.affinity[fish.id] ?? 1;

  /* WEATHER & TIME */

  const environment = FISH_ENVIRONMENT[fish.id];

  if (environment) {
    weight *=
      environment.weather?.[conditions.weather] ?? 1;

    weight *=
      environment.time?.[conditions.time] ?? 1;
  }

  /* SCHOOL OF FISH EVENT */

  if (conditions.event === "school") {
    const rareRarities = [
      "Rare",
      "Epic",
      "Legendary",
      "Mythic",
      "Secret"
    ];

    if (rareRarities.includes(fish.rarity)) {
      weight *= 3;
    }
  }

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

  const shinyMultiplier =
    round.conditions?.event === "rainbow" ? 5 : 1;

  const shiny =
    Math.random() < shinyMultiplier / SHINY_RATE;

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
    locationId: save.location,
    weather: round.conditions?.weather ?? null,
    timePeriod: round.conditions?.time ?? null,
    gameDay: round.conditions?.day ?? null,
    gameMinute: round.conditions?.minute ?? null,
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
  developerForceShiny = false;
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
  round.conditions = null;
  round.boss = null;

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

  /* Snapshot world conditions at cast time */

  round.conditions = {
    ...getWorldConditions(),
    day: save.world.day,
    minute: save.world.minute
  };

  phase = "waiting";
  playSfx("cast");

  writeSave();
  renderAll();

  if (round.perfect) {
    showToast("✨ PERFECT CAST! Bonus peluang rarity aktif.");
  }

  const activeBait = BAITS[round.bait];

  const waitDuration =
    rand(1600, 3900) *
    activeBait.waitMultiplier *
    (round.conditions?.event === "frenzy" ? 0.6 : 1);

  scheduleWaitingBite(waitDuration);
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
  const now = performance.now();

  round.startDistance = 70 + strength * 20;
  round.distance = round.startDistance;
  round.tension = 11;
  round.reel = false;

  round.nextDash = now + rand(1300, 2600);

  // Activate Boss Battle for special species.
  if (BOSS_FISH[round.fish.id]) {
    startBossBattle(round.fish, now);
  } else {
    round.boss = null;
  }

  playSfx(round.boss ? "boss" : "hook");
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
    if (developerSession && developerForceShiny && !result.shiny) {
      result.shiny = true;
      result.price = Math.max(1, Math.round(result.price * 1.5));
    }
    developerForceShiny = false;

    registerCatch(result);

    /* PHASE 7 — Boss Victory */

    if (BOSS_FISH[result.id]) {
      result.bossBonus = recordBossVictory(result);
    }

    save.pendingCatch = result;

    if (!BOSS_FISH[result.id] && result.shiny) {
      showToast("✨ SHINY FISH DITEMUKAN!");
    } else if (!BOSS_FISH[result.id] &&
           result.size === "Giant") {
      showToast("🏆 GIANT FISH!");
    }
  }

  else if (kind === "treasure") {
    result = generateTreasureResult();

    save.stats.treasuresFound++;

    // Persist fragment claim or unclaimed treasure.
    save.pendingCatch = result;

    if (result.kind === "fragment") {
      if (save.mapFragments >= MAP_REQUIRED) {
        showToast("🗺️ Ancient Map lengkap!");
      } else {
        showToast("🗺️ Map Fragment ditemukan!");
      }
    } else {
      showToast("💎 Treasure ditemukan!");
    }
  }

  else {
    // Always initialize the result for this round.
    result = { kind };

    if (kind === "escape") {
      save.stats.escapes++;

      if (round.boss) {
        save.stats.bossEscapes++;

        result = {
          kind: "boss_escape",
          bossId: round.boss.id
        };
      }
    }

    save.pendingCatch = null;
  }

  /* Phase 8 — Result SFX */

  if (kind === "caught") {
    playSfx(
      round.boss ? "bossWin" : "catch"
    );
  } else if (kind === "treasure") {
    playSfx("treasure");
  } else if (kind === "escape") {
    playSfx("escape");
  }

  writeSave();
  renderAll();
}

function finishResult() {
  result = null;
  round.fish = null;
  round.boss = null;
  round.conditions = null;
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
      showToast("Inventory penuh!");
      return;
    }

    save.inventory.push({ ...result });
    showToast("Ikan disimpan ke Inventory!");
  }

  else if (action === "aquarium") {
    if (isAquariumFull()) {
      showToast("Aquarium penuh!");
      return;
    }

    save.aquarium.push(
      createAquariumFish(result)
    );

    showToast("🐠 Ikan dipindahkan ke Aquarium!");
  }

  else if (action === "sell") {
    save.coins += result.price;
    save.stats.earned += result.price;

    showToast(
      `Terjual! +${fmt(result.price)} coin`
    );
  }

  else {
    return;
  }

  save.pendingCatch = null;

  writeSave();
  finishResult();
}

/* =========================================
   FISHING INTERFACE
========================================= */

function displayZone(zone) {
  if (["tropical", "ocean", "deep"].includes(save.location)) {
    const seaZones = {
      shore: "NEAR",
      mid: "MID",
      deep: "FAR"
    };

    return seaZones[zone];
  }

  return ZONES[zone];
}

function renderFishing() {
  $("lakeScene").dataset.phase = phase;
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
      `Kail berada di zona ${displayZone(round.zone)}.`
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

  const bossActive =
    phase === "battle" && Boolean(round.boss);

  $("bossWidget").classList.toggle(
    "hidden",
    !bossActive
  );

  $("lakeScene").classList.toggle(
    "boss-active",
    bossActive
  );

  if (bossActive) {
    renderBossBattle();
  }

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

  $("zoneText").textContent = `📍 ${displayZone(round.zone)}`;

  renderSceneCaption();

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

  $("resultIcon").classList.remove("shiny-glow", "illustrated-result");

  /* =========================================
     PHASE 6 — TREASURE RESULT UI
  ========================================= */

  if (
    result.kind === "treasure" ||
    result.kind === "fragment"
  ) {
    const item = TREASURE_ITEMS[result.treasureId];

    if (!item) return;

    $("resultIcon").textContent = item.icon;

    $("resultRarity").className = "rarity";

    $("resultRarity").textContent =
      item.rarity.toUpperCase();

    $("resultTitle").textContent = item.name;

    if (result.kind === "fragment") {
      $("resultDescription").textContent =
        `Ancient Map ${save.mapFragments}/${MAP_REQUIRED}. ` +
        (save.mapFragments >= MAP_REQUIRED
          ? "Moonlight Lagoon dapat dibuka!"
          : "Kumpulkan semua potongan peta.");

      addResultButton(
        "🗺️ Lanjut",
        acknowledgeFragment
      );
    } else {
      $("resultDescription").textContent =
        `Kamu menemukan ${item.name}! ` +
        `Nilai jual: 🪙 ${fmt(result.price)}`;

      addResultButton(
        "🪙 Jual",
        () => handleTreasureResult("sell")
      );

      addResultButton(
        "🎒 Simpan",
        () => handleTreasureResult("store")
      );
    }

    return;
  }

  /* Boss escaped result */

  if (result.kind === "boss_escape") {
    const config = BOSS_FISH[result.bossId];

    $("resultIcon").textContent = "💥";
    $("resultRarity").className = "rarity legendary";
    $("resultRarity").textContent = "BOSS ESCAPED";

    $("resultTitle").textContent =
      config?.title || "Unknown Boss";

    $("resultDescription").textContent =
      "Boss berhasil melarikan diri. " +
      "Upgrade perlengkapan dan coba kembali!";

    addResultButton("↻ Lanjut", finishResult);
    return;
  }

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

  $("resultIcon").replaceChildren(createFishPortrait(fish, result));
  $("resultIcon").classList.add("illustrated-result");

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

  if (BOSS_FISH[result.id]) {
    stats.push([
      "Boss",
      "🏆 DEFEATED"
    ]);

    if (result.bossBonus > 0) {
      stats.push([
        "First Clear Bonus",
        `🪙 +${fmt(result.bossBonus)}`
      ]);
    }
  }

  if (result.weather) {
    const weather = WEATHER_TYPES[result.weather];

    stats.push([
      "Cuaca",
      `${weather.icon} ${weather.name}`
    ]);
  }

  if (result.timePeriod) {
    stats.push([
      "Waktu",
      DAYPART_LABELS[result.timePeriod]
    ]);
  }

  if (
    Number.isInteger(result.gameDay) &&
    Number.isFinite(result.gameMinute)
  ) {
    stats.push([
      "Caught At",
      `Day ${result.gameDay} • ${
        formatWorldTime(result.gameMinute)
      }`
    ]);
  }

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
  addResultButton(
    "🐠 Aquarium",
    () => handleResult("aquarium")
  );
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

  /* PHASE 6 — Aquarium upgrade */

  const aquariumCost =
    AQUARIUM_COSTS[save.aquariumLevel];

  const currentCapacity = getAquariumCapacity();

  $("aquariumUpgradeTitle").textContent =
    save.aquariumLevel >= 4
      ? "Aquarium MAX LEVEL"
      : `Aquarium Lv.${save.aquariumLevel} → ` +
        `Lv.${save.aquariumLevel + 1}`;

  $("aquariumUpgradeDescription").textContent =
    `${currentCapacity} fish capacity` +
    (aquariumCost ? " • +4 slots" : " • Maximum");

  $("aquariumUpgradeButton").textContent =
    aquariumCost
      ? `🪙 ${fmt(aquariumCost)}`
      : "MAX LEVEL";

  $("aquariumUpgradeButton").disabled =
    !aquariumCost || save.coins < aquariumCost;
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
  const areaFilter = $("dexAreaFilter").value;

  const areaFish =
    areaFilter === "all"
      ? null
      : LOCATIONS[areaFilter]?.fish ?? [];

  const visibleFish = FISH.filter(fish => {
    const rarityMatches =
      filter === "All" || fish.rarity === filter;

    const locationMatches =
      areaFish === null || areaFish.includes(fish.id);

    return rarityMatches && locationMatches;
  });

  visibleFish.forEach(fish => {
    const entry = save.fishdex[fish.id];
    const unlocked = Boolean(entry);

    const row = document.createElement("div");

    row.className =
      `list-item fishdex-entry ` +
      `rarity-${fish.rarity.toLowerCase()} ` +
      `${unlocked ? "" : "unknown"} ` +
      `${entry?.shiny ? "is-shiny" : ""}`;

    const artwork = document.createElement("div");
    artwork.className = "dex-artwork";
    artwork.append(createFishPortrait(unlocked ? fish : FISH_BY_ID.nila,
      {shiny: Boolean(entry?.shiny)}));
    const number = document.createElement("span");
    number.className = "dex-number";
    number.textContent = "#" + String(FISH.indexOf(fish) + 1).padStart(3, "0");
    artwork.append(number);
    if (!unlocked) {
      const mystery = document.createElement("span");
      mystery.className = "dex-mystery";
      mystery.textContent = "?";
      artwork.append(mystery);
    }

    const body = document.createElement("div");
    body.className = "list-item-body dex-card-body";
    const rarity = document.createElement("span");
    rarity.className = "dex-rarity";
    rarity.textContent = fish.rarity + (entry?.shiny ? " / SHINY" : "");
    const name = document.createElement("strong");
    name.textContent = unlocked ? fish.name :
      fish.rarity === "Secret" ? "Secret Fish" : "Belum ditemukan";
    body.append(rarity, name);

    if (unlocked) {
      const stats = document.createElement("div");
      stats.className = "dex-records";
      const records = [
        ["Tertangkap", fmt(entry.caught || 0) + " kali"],
        ["Terberat", Number(entry.largest || 0).toFixed(2) + " kg"],
        ["Terkecil", entry.smallest ? Number(entry.smallest).toFixed(2) + " kg" : "\u2014"],
        ["Terpanjang", entry.longest ? entry.longest + " cm" : "\u2014"],
        ["Shiny", fmt(entry.shiny || 0)],
        ["Harga terbaik", fmt(entry.bestPrice || 0) + " coins"]
      ];
      for (const [label, value] of records) {
        const stat = document.createElement("div");
        const caption = document.createElement("span");
        const record = document.createElement("b");
        caption.textContent = label;
        record.textContent = value;
        stat.append(caption, record);
        stats.append(stat);
      }
      const date = document.createElement("small");
      date.className = "dex-first-catch";
      const timestamp = entry.firstCaught ? new Date(entry.firstCaught) : null;
      date.textContent = "Penemuan pertama: " +
        (timestamp && Number.isFinite(timestamp.getTime())
          ? timestamp.toLocaleDateString("id-ID")
          : "Tidak tercatat (save lama)");
      body.append(stats, date);
    } else {
      const hint = document.createElement("small");
      hint.className = "dex-discovery-hint";
      hint.textContent = fish.rarity === "Secret"
        ? "Ada sesuatu yang tersembunyi di kedalaman..."
        : "Jelajahi perairan dan temukan spesies ini.";
      body.append(hint);
    }
    row.append(artwork, body);

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
      `list-item inventory-fish-row ${item.shiny ? "is-shiny fishdex-entry" : ""}`;

    const icon = document.createElement("span");
    icon.className = "list-item-icon fish-thumbnail";
    icon.append(createFishPortrait(fish, item));

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

    const aquariumButton = document.createElement("button");

    aquariumButton.type = "button";
    aquariumButton.textContent = "🐠 Aquarium";
    aquariumButton.disabled = isAquariumFull();

    aquariumButton.addEventListener("click", () => {
      moveFishToAquarium(index);
    });

    row.append(
      icon,
      body,
      aquariumButton,
      button
    );

    list.append(row);
  });
}

/* =========================================
   ACHIEVEMENTS
========================================= */

/* =========================================
   PHASE 7 — PERMANENT ACHIEVEMENTS
========================================= */

function getAchievementDefinitions() {
  const bossClears = BOSS_IDS.filter(id =>
    (save.bossRecords[id]?.wins || 0) > 0
  ).length;

  return [
    {
      id: "first-catch",
      icon: "🎣",
      name: "First Catch",
      description: "Tangkap ikan pertama",
      reward: 40,
      done: save.stats.catches >= 1
    },
    {
      id: "fish-hunter",
      icon: "🐟",
      name: "Fish Hunter",
      description: "Tangkap 100 ikan",
      reward: 350,
      done: save.stats.catches >= 100
    },
    {
      id: "shiny-hunter",
      icon: "✨",
      name: "Shiny Hunter",
      description: "Temukan ikan Shiny pertama",
      reward: 500,
      done: save.stats.shinyCatches >= 1
    },
    {
      id: "giant-catch",
      icon: "🏆",
      name: "Giant Catch",
      description: "Tangkap ikan kategori Giant",
      reward: 150,
      done: save.stats.giantCatches >= 1
    },
    {
      id: "moonlight",
      icon: "🌙",
      name: "Moonlight",
      description: "Temukan Moon Koi",
      reward: 200,
      done: Boolean(save.fishdex.moon)
    },
    {
      id: "living-legend",
      icon: "🐉",
      name: "Living Legend",
      description: "Temukan Ancient Carp",
      reward: 300,
      done: Boolean(save.fishdex.ancient)
    },
    {
      id: "mythic-hunter",
      icon: "🌌",
      name: "Mythic Hunter",
      description: "Temukan Astral Eel",
      reward: 500,
      done: Boolean(save.fishdex.astral)
    },
    {
      id: "world-explorer",
      icon: "🧭",
      name: "World Explorer",
      description: "Buka semua lokasi",
      reward: 1000,
      done: LOCATION_IDS.every(isLocationUnlocked)
    },
    {
      id: "ocean-explorer",
      icon: "🌊",
      name: "Ocean Explorer",
      description: "Buka Open Ocean",
      reward: 250,
      done: isLocationUnlocked("ocean")
    },
    {
      id: "aquarium-keeper",
      icon: "🐠",
      name: "Aquarium Keeper",
      description: "Simpan ikan di Aquarium",
      reward: 100,
      done: save.aquarium.length >= 1
    },
    {
      id: "fish-lover",
      icon: "❤️",
      name: "Fish Lover",
      description: "Miliki 3 ikan favorit",
      reward: 200,
      done: save.aquarium.filter(
        item => item.favorite
      ).length >= 3
    },
    {
      id: "treasure-hunter",
      icon: "💎",
      name: "Treasure Hunter",
      description: "Temukan 10 treasure",
      reward: 250,
      done: save.stats.treasuresFound >= 10
    },
    {
      id: "cartographer",
      icon: "🗺️",
      name: "Ancient Cartographer",
      description: "Lengkapi Ancient Map",
      reward: 300,
      done: save.mapFragments >= MAP_REQUIRED
    },
    {
      id: "secret-explorer",
      icon: "🌙",
      name: "Secret Explorer",
      description: "Buka Moonlight Lagoon",
      reward: 400,
      done: isLocationUnlocked("moonlight")
    },
    {
      id: "boss-slayer",
      icon: "⚔️",
      name: "Boss Slayer",
      description: "Kalahkan boss pertama",
      reward: 600,
      done: bossClears >= 1
    },
    {
      id: "abyss-tamer",
      icon: "🐉",
      name: "Abyss Tamer",
      description: "Kalahkan Abyss Leviathan",
      reward: 2000,
      done: (save.bossRecords.leviathan?.wins || 0) > 0
    },
    {
      id: "four-kings",
      icon: "👑",
      name: "Four Kings",
      description: "Kalahkan semua 4 boss",
      reward: 5000,
      done: bossClears === BOSS_IDS.length
    },
    {
      id: "boss-veteran",
      icon: "🔥",
      name: "Boss Veteran",
      description: "Menangkan 10 pertarungan boss",
      reward: 1500,
      done: save.stats.bossVictories >= 10
    },
    {
      id: "professor-fish",
      icon: "📖",
      name: "Professor Fish",
      description: "Lengkapi Fishdex",
      reward: 3000,
      done: FISH.every(
        fish => Boolean(save.fishdex[fish.id])
      )
    }
  ];
}

/* =========================================
   ACHIEVEMENT UNLOCK
========================================= */

function syncAchievements() {
  let newAchievements = 0;

  for (const achievement of getAchievementDefinitions()) {
    if (
      !achievement.done ||
      save.achievements.includes(achievement.id)
    ) {
      continue;
    }

    save.achievements.push(achievement.id);

    save.coins += achievement.reward;
    save.stats.earned += achievement.reward;

    newAchievements++;
  }

  return newAchievements;
}

function renderAchievements() {
  const stats = [
    [fmt(save.stats.casts), "Casting"],
    [fmt(save.stats.catches), "Ikan tertangkap"],
    [fmt(save.stats.earned), "Total coin didapat"],

    [
      `${Number(save.stats.bestWeight).toFixed(2)} kg`,
      "Rekor berat"
    ],

    [
      `${save.stats.bestLength} cm`,
      "Rekor panjang"
    ],

    [
      fmt(save.stats.shinyCatches),
      "Shiny ditemukan"
    ],

    [
      fmt(save.stats.bossVictories),
      "Boss victories"
    ],

    [
      fmt(save.stats.bossEscapes),
      "Boss escapes"
    ]
  ];

  $("statsGrid").innerHTML = stats.map(
    ([value, label]) => `
      <div class="stat-box">
        <b>${value}</b>
        <span>${label}</span>
      </div>
    `
  ).join("");

  const list = $("achievementsList");
  list.replaceChildren();

  for (const achievement of getAchievementDefinitions()) {
    const unlocked =
      save.achievements.includes(achievement.id);

    const row = document.createElement("div");

    row.className =
      `list-item ${
        unlocked ? "achievement-done" : "unknown"
      }`;

    const icon = document.createElement("span");
    icon.className = "list-item-icon";
    icon.textContent = achievement.icon;

    const body = document.createElement("div");
    body.className = "list-item-body";

    const title = document.createElement("strong");

    title.textContent =
      achievement.name +
      (unlocked ? " ✓" : " 🔒");

    const description = document.createElement("small");

    description.textContent =
      achievement.description;

    const reward = document.createElement("small");

    reward.textContent = unlocked
      ? `🏆 Reward claimed: ${fmt(achievement.reward)} coins`
      : `🪙 Reward: ${fmt(achievement.reward)} coins`;

    body.append(title, description, reward);
    row.append(icon, body);

    list.append(row);
  }
}

/* =========================================
   RENDER ALL
========================================= */

function renderAll() {
  const activeBait =
    BAITS[save.selectedBait] || BAITS.worm;

  $("coinsText").textContent = fmt(save.coins);

  $("baitIcon").textContent = activeBait.icon;

  $("baitText").textContent =
    fmt(getBaitCount(activeBait.id));

  $("rodText").textContent =
    `Lv.${save.rod}`;

  $("keptText").textContent =
    fmt(save.inventory.length);

  /* Existing world systems */

  renderLocationScene();
  renderWorld();
  renderLocations();

  /* Existing gameplay systems */

  renderFishing();
  renderShop();
  renderEquipment();

  /* Collection */

  renderFishdex();
  renderInventory();

  /* Phase 6 */

  renderAquarium();
  renderTreasure();

  /* Progress */

  renderBossJournal();
  renderAchievements();
  renderSettings();
}

/* =========================================
   GAME LOOP
========================================= */

/* =========================================
   RELEASE FIX — FRAME STALL RECOVERY
========================================= */

function recoverFromFrameStall(elapsed) {
  if (elapsed <= 250) return;

  // Only compensate during active gameplay.
  if (phase === "biting") {
    round.deadline += elapsed;
  }

  if (phase === "battle") {
    round.nextDash += elapsed;

    if (round.boss) {
      round.boss.nextAttack += elapsed;

      if (round.boss.warning) {
        round.boss.attackAt += elapsed;
      }

      if (round.boss.messageUntil) {
        round.boss.messageUntil += elapsed;
      }
    }
  }
}

function frame(now) {
  const elapsed = Math.max(
    0,
    now - (lastFrame || now)
  );

  const dt = Math.min(elapsed / 1000, 0.05);

  const paused =
    externalSaveConflict ||
    document.hidden ||
    fishingHiddenAt !== null ||
    !$("menuOverlay").classList.contains("hidden");

  // Recover suspended timers only if no explicit
  // visibility/focus pause already handled them.
  if (!paused) {
    recoverFromFrameStall(elapsed);
  }

  lastFrame = now;

  $("lakeScene").classList.toggle("scene-paused", paused);

  if (paused) {
    requestAnimationFrame(frame);
    return;
  }

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

    if (round.boss) {
      // Boss has its own special attack patterns.
      updateBossBattle(dt, now);
    } else if (now >= round.nextDash) {
      // Standard fish behavior stays unchanged.
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

  animateAquarium(dt, now);
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
   PHASE 4 — LOCATION EVENTS
========================================= */

// Location card buttons.
$("locationList").addEventListener("click", event => {
  const button = event.target.closest(
    "button[data-location-id]"
  );

  if (!button) return;

  travelToLocation(button.dataset.locationId);
});

// Fishdex location filter.
$("dexAreaFilter").addEventListener(
  "change",
  renderFishdex
);


// Developer controls are session-only; save schema remains unchanged.
const DEV_SESSION_KEY = "lucky-fishing-developer-session";
let developerSession = null;
let developerForceShiny = false;
try {
  const stored = JSON.parse(sessionStorage.getItem(DEV_SESSION_KEY));
  if (stored && readSave(stored.checkpoint)) developerSession = stored;
} catch { /* Developer tools stay off if session storage is unavailable. */ }

function renderDeveloperTools() {
  const active = Boolean(developerSession);
  $("developerEnabled").checked = active;
  $("developerTools").classList.toggle("hidden", !active);
  $("developerBadge").classList.toggle("hidden", !active);
}

function resetDeveloperRound() {
  clearTimeout(pendingTimer);
  pendingTimer = null;
  waitingRemainingMs = 0;
  waitingStartedAt = 0;
  developerForceShiny = false;
  setReeling(false);
  result = null;
  save.pendingCatch = null;
  phase = "idle";
  round.fish = null;
  round.boss = null;
  round.conditions = null;
  round.perfect = false;
  round.zone = "shore";
}

function developerAction(action) {
  if (!developerSession || externalSaveConflict || !canWriteSave()) return;
  if (["resources", "gear", "locations", "samples", "world", "encounter"].includes(action) && phase !== "idle") {
    showToast("Batalkan round atau selesaikan hasil memancing dahulu.");
    return;
  }
  if (action === "resources") {
    save.coins += 100000;
    save.bait += 100;
    Object.keys(save.baitStock).forEach(id => save.baitStock[id] += 100);
  } else if (action === "gear") {
    save.rod = save.reel = save.hook = save.aquariumLevel = 4;
  } else if (action === "locations") {
    save.unlockedLocations = [...LOCATION_IDS];
    save.mapFragments = MAP_REQUIRED;
  } else if (action === "samples") {
    const free = MAX_INVENTORY - save.inventory.length;
    const missing = FISH.filter(fish => !save.inventory.some(item => item.id === fish.id));
    missing.slice(0, free).forEach(fish => {
      const catchData = generateCatch(fish);
      save.inventory.push(catchData);
      registerCatch(catchData);
    });
    if (missing.length > free) showToast("Inventory penuh; sebagian sampel belum ditambahkan.");
  } else if (action === "world") {
    const time = $("developerTime").value;
    if (!/^\d{2}:\d{2}$/.test(time)) return showToast("Pilih waktu yang valid.");
    const [hours, minutes] = time.split(":").map(Number);
    save.world.minute = hours * 60 + minutes;
    save.world.weather = $("developerWeather").value;
    save.world.weatherRemaining = WEATHER_DURATION;
    save.world.event = $("developerEvent").value || null;
    save.world.eventRemaining = save.world.event ? 120 : 0;
    worldLastTick = performance.now();
  } else if (action === "encounter") {
    const fish = FISH_BY_ID[$("developerFish").value];
    if (!fish) return;
    round.fish = fish;
    round.bait = save.selectedBait;
    round.zone = "deep";
    round.perfect = true;
    round.conditions = {...getWorldConditions(), day: save.world.day, minute: save.world.minute};
    round.deadline = performance.now() + 10000;
    developerForceShiny = $("developerShiny").checked;
    phase = "biting";
    hookFish();
    setTab("fishing");
  } else if (action === "caught") {
    if (phase !== "battle" || !round.fish) return showToast("Mulai battle dahulu.");
    if (round.boss) round.boss.stamina = 0;
    endRound("caught");
    setTab("fishing");
  } else if (action === "cancel") {
    if (save.pendingCatch) return showToast("Simpan atau jual hasil tangkapan dahulu.");
    resetDeveloperRound();
  } else if (action === "restore") {
    const restored = readSave(developerSession.checkpoint);
    if (!restored) return showToast("Checkpoint tidak valid.");
    resetDeveloperRound();
    save = restored;
    worldLastTick = performance.now();
    worldSaveAccumulator = 0;
    try { sessionStorage.removeItem(DEV_SESSION_KEY); } catch {}
    developerSession = null;
    applySettings();
  } else return;
  writeSave();
  renderAll();
  renderDeveloperTools();
  $("developerStatus").textContent = "Aksi terakhir: " + action + ". Progres tersimpan.";
}

$("developerEnabled").addEventListener("change", () => {
  if (externalSaveConflict || !canWriteSave()) return renderDeveloperTools();
  if ($("developerEnabled").checked) {
    if (phase !== "idle" || save.pendingCatch) {
      showToast("Selesaikan round sebelum mengaktifkan Developer Mode.");
      return renderDeveloperTools();
    }
    const session = {checkpoint: JSON.parse(JSON.stringify(save))};
    try {
      sessionStorage.setItem(DEV_SESSION_KEY, JSON.stringify(session));
      developerSession = session;
    } catch {
      showToast("Checkpoint gagal dibuat; Developer Mode belum aktif.");
    }
  } else {
    developerForceShiny = false;
    try { sessionStorage.removeItem(DEV_SESSION_KEY); } catch {}
    developerSession = null;
    $("developerStatus").textContent = "";
    showToast("Developer Mode mati. Hasil tes tetap tersimpan.");
  }
  renderDeveloperTools();
});

$("developerTools").addEventListener("click", event => {
  const button = event.target.closest("button[data-dev-action]");
  if (button) developerAction(button.dataset.devAction);
});
$("developerBadge").addEventListener("click", () => {
  setTab("settings");
  $("developerTitle").scrollIntoView({block: "center", behavior: shouldReduceMotion() ? "instant" : "smooth"});
});
for (const [id, entries] of [
  ["developerWeather", Object.entries(WEATHER_TYPES).map(([key, value]) => [key, value.name])],
  ["developerEvent", [["", "Tidak ada"], ...Object.entries(WORLD_EVENTS).map(([key, value]) => [key, value.name])]],
  ["developerFish", FISH.map(fish => [fish.id, fish.name + (BOSS_FISH[fish.id] ? " (BOSS)" : "")])]
]) {
  entries.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    $(id).append(option);
  });
}
renderDeveloperTools();

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
   PHASE 6 — AQUARIUM EVENTS
========================================= */

$("aquariumUpgradeButton").addEventListener(
  "click",
  upgradeAquarium
);

$("aquariumFishList").addEventListener(
  "click",
  event => {
    const button = event.target.closest(
      "button[data-action][data-index]"
    );

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (!Number.isInteger(index) || index < 0) {
      return;
    }

    handleAquariumAction(index, action);
  }
);

/* =========================================
   PHASE 8 — SETTINGS EVENTS
========================================= */

$("settingSound").addEventListener("change", event => {
  updateSetting("sound", event.target.checked);
});

$("settingVolume").addEventListener("input", event => {
  const volume = clamp(
    Number(event.target.value) / 100,
    0,
    1
  );

  updateSetting("volume", volume);
});

$("settingMotion").addEventListener("change", event => {
  updateSetting("reduceMotion", event.target.checked);
});

$("settingEffects").addEventListener("change", event => {
  updateSetting("lowEffects", event.target.checked);
});

$("testSoundButton").addEventListener("click", () => {
  playSfx("catch");
});

/* Backup */

$("exportSaveButton").addEventListener(
  "click",
  exportGameSave
);

$("importSaveButton").addEventListener("click", () => {
  $("importSaveFile").click();
});

$("importSaveFile").addEventListener(
  "change",
  async event => {
    const file = event.target.files?.[0];

    if (file) {
      await importGameSave(file);
    }

    // Allow selecting the same backup again.
    event.target.value = "";
  }
);

/* System accessibility preferences */

systemMotionPreference.addEventListener?.(
  "change",
  applySettings
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
  worldLastTick = performance.now();
  $("menuOverlay").classList.remove("hidden");
});

$("continueButton").addEventListener("click", () => {
  worldLastTick = performance.now();
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

  const previousSettings = {
    ...save.settings
  };

  save = freshSave();
  save.settings = previousSettings;
  hasSavedGame = true;

  result = null;
  phase = "idle";

  round.zone = "shore";
  round.bait = "worm";
  round.fish = null;
  round.boss = null;
  round.perfect = false;

  round.conditions = null;

  pendingTimer = null;
  waitingRemainingMs = 0;
  waitingStartedAt = 0;
  fishingHiddenAt = null;
  $("gamePauseNotice").classList.add("hidden");
  aquariumSprites = [];

  worldLastTick = performance.now();
  worldSaveAccumulator = 0;

  writeSave();

  $("menuOverlay").classList.add("hidden");
  setTab("fishing");
});

/* =========================================
   INITIALIZATION
========================================= */

$("continueButton").disabled = !hasSavedGame;

/* Populate location options in Fishdex */

const dexAreaFilter = $("dexAreaFilter");

for (const location of Object.values(LOCATIONS)) {
  const option = document.createElement("option");

  option.value = location.id;
  option.textContent = location.name;

  dexAreaFilter.append(option);
}

/* One-time migration of already earned milestones */

if (hasSavedGame) {
  const backfilled = syncAchievements();

  if (backfilled > 0) {
    writeSave();
  }
}

renderAll();
requestAnimationFrame(frame);


/* Start the Living World simulation */
setInterval(tickWorld, 1000);

/* Pause when tab or window loses focus */

window.addEventListener("blur", syncFishingFocus);
window.addEventListener("focus", syncFishingFocus);

document.addEventListener("visibilitychange", () => {
  syncFishingFocus();

  worldLastTick = performance.now();

  if (document.hidden && hasSavedGame) {
    writeSave();
  }
});

window.addEventListener("pagehide", () => {
  if (hasSavedGame) writeSave();
});


/* =========================================
   RELEASE FIX — MULTI-TAB DETECTION
========================================= */

window.addEventListener("storage", event => {
  if (event.storageArea && event.storageArea !== localStorage) return;
  if (event.key !== SAVE_KEY && event.key !== null) return;

  const stored = localStorage.getItem(SAVE_KEY);
  if (stored === lastKnownStoredSave) return;
  if (stored === JSON.stringify(save)) {
    lastKnownStoredSave = stored;
    return;
  }

  markSaveConflict();
});

$("reloadSaveButton").addEventListener("click", () => {
  window.location.reload();
});
