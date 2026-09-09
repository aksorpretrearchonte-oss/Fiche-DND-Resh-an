const STORAGE_KEY = "reshan-dnd-sheet-v1";

const abilities = {
  STR: { name: "Force", score: 8 },
  DEX: { name: "Dextérité", score: 15 },
  CON: { name: "Constitution", score: 14 },
  INT: { name: "Intelligence", score: 8 },
  WIS: { name: "Sagesse", score: 12 },
  CHA: { name: "Charisme", score: 17 }
};

const saves = [
  ["STR","Force",false], ["DEX","Dextérité",false], ["CON","Constitution",true],
  ["INT","Intelligence",false], ["WIS","Sagesse",true], ["CHA","Charisme",true]
];

const skills = [
  ["Acrobatics","Acrobaties","DEX",false],
  ["Animal Handling","Dressage","WIS",false],
  ["Arcana","Arcanes","INT",true],
  ["Athletics","Athlétisme","STR",false],
  ["Deception","Tromperie","CHA",true],
  ["History","Histoire","INT",true],
  ["Insight","Intuition","WIS",true],
  ["Intimidation","Intimidation","CHA",true],
  ["Investigation","Investigation","INT",false],
  ["Medicine","Médecine","WIS",false],
  ["Nature","Nature","INT",false],
  ["Perception","Perception","WIS",false],
  ["Performance","Représentation","CHA",true],
  ["Persuasion","Persuasion","CHA",true],
  ["Religion","Religion","INT",false],
  ["Sleight of Hand","Escamotage","DEX",false],
  ["Stealth","Discrétion","DEX",false],
  ["Survival","Survie","WIS",false]
];

const state = {
  hp: 20,
  hpMax: 20,
  ac: 10,
  acAuto: false,
  mageArmor: false,
  shieldBonus: 0,
  initiative: 7,
  initiativeAuto: true,
  hitDice: 3,
  hitDiceMax: 3,
  slots: { 1: [false,false,false,false], 2: [false,false] },
  sorcery: [false,false,false],
  innate: 2,
  phase: 2,
  ethereal: 1,
  relentless: 1
};

const spells = {
  cantrips: [
    {
      name:"Frostbite",
      meta:"1 action · 60 feet · V, S · Instantaneous",
      text:`You cause numbing frost to form on one creature that you can see within range. The target must make a Constitution saving throw. On a failed save, the target takes 1d6 cold damage, and it has disadvantage on the next weapon attack roll it makes before the end of its next turn.<br><br><b>At Higher Levels.</b> The spell’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`
    },
    {
      name:"Mage Hand",
      meta:"1 action · 9 m · V, S · 1 minute",
      text:`Une main spectrale apparaît à un point précis choisi à portée. La main expire à la fin de la durée du sort ou si elle est révoquée au prix d'une action. La main disparaît si elle se retrouve à plus de 9 mètres du lanceur de sorts ou si ce sort est jeté une nouvelle fois.<br><br>Le lanceur de sorts peut utiliser son action pour contrôler la main. La main peut manipuler un objet, ouvrir une porte ou un contenant non verrouillé, ranger ou récupérer un objet d'un contenant ouvert, ou bien verser le contenu d'une fiole. La main peut être déplacée jusqu'à 9 mètres à chaque fois que vous l'utilisez.<br><br>La main ne peut attaquer, activer des objets magiques ou transporter plus de 5 kg.`
    },
    {
      name:"Mind Sliver",
      meta:"1 action · 60 feet · V · 1 round",
      text:`You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.<br><br>This spell's damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).`
    },
    {
      name:"Minor Illusion",
      meta:"1 action · 9 m · S, M (un peu de laine de mouton) · 1 minute",
      text:`Le lanceur de sorts crée un son ou l'image d'un objet à portée pendant une minute. Cette illusion se termine également si elle est révoquée au prix d'une action ou si ce sort est lancé une nouvelle fois.<br><br>Si l'illusion est un son, le volume peut aller d'un simple chuchotement à un cri. Il peut s'agir de votre voix, de la voix de quelqu'un d'autre, du rugissement d'un lion, d'un roulement de tambours, ou tout autre son que vous choisissez. Le son peut autant ne pas diminuer en intensité pendant la durée du sort qu'être discret et produit à différents instants dans cet intervalle de temps.<br><br>Si l'illusion est une image ou un objet (comme une chaise, des traces de pas boueuses ou un petit coffre) elle ne peut pas être plus large qu'un cube de 1,50 mètre d'arête. Cette image ne peut produire de son, lumière, odeur ou tout autre effet sensoriel. Une interaction physique avec l'image révèle l'illusion, car elle peut être traversée par n'importe quoi.<br><br>Si une créature utilise une action pour examiner le son ou l'image, elle peut comprendre qu'il s'agit d'une illusion grâce à un jet d'Intelligence (Investigation) contre le DD de sauvegarde de votre sort. Si une créature discerne l'illusion pour ce qu'elle est, l'illusion s'évanouit pour la créature.`
    },
    {
      name:"Chill Touch",
      meta:"Action · Touch · V, S · Instantaneous",
      text:`Channeling the chill of the grave, make a melee spell attack against a target within reach. On a hit, the target takes 1d10 Necrotic damage, and it can't regain Hit Points until the end of your next turn.<br><br><b>Cantrip Upgrade.</b> The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).`
    }
  ],
  level1: [
    {
      name:"Absorb Elements",
      meta:"1 reaction · Self · S · 1 round",
      text:`The spell captures some of the incoming energy, lessening its effect on you and storing it for your next melee attack. You have resistance to the triggering damage type until the start of your next turn. Also, the first time you hit with a melee attack on your next turn, the target takes an extra 1d6 damage of the triggering type, and the spell ends.<br><br><b>At Higher Levels.</b> When you cast this spell using a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each slot level above 1st.`
    },
    {
      name:"Mage Armor",
      meta:"1 action · Touch · V, S, M (a piece of cured leather) · 8 hours",
      text:`You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.`
    },
    {
      name:"Magic Missile",
      meta:"1 action · 36 m · V, S · Instantaneous",
      text:`Vous créez trois fléchettes de force magique d'un bleu lumineux. Chaque fléchette atteint une créature de votre choix que vous pouvez voir et dans la limite de portée du sort. Chaque projectile inflige 1d4 + 1 dégâts de force à sa cible. Les fléchettes frappent simultanément, et peuvent frapper une ou plusieurs créatures.<br><br><b>Aux niveaux supérieurs.</b> Lorsque vous lancez ce sort en utilisant un emplacement de sort de niveau 2 ou supérieur, il crée une fléchette additionnelle pour chaque niveau d'emplacement au-delà du niveau 1.`
    },
    {
      name:"Bane",
      meta:"Action · 30 feet · V, S, M (a drop of blood) · Concentration, up to 1 minute",
      text:`Up to three creatures of your choice that you can see within range must each make a Charisma saving throw. Whenever a target that fails this save makes an attack roll or a saving throw before the spell ends, the target must subtract 1d4 from the attack roll or save.<br><br><b>Using a Higher-Level Spell Slot.</b> You can target one additional creature for each spell slot level above 1.`
    },
    {
      name:"Unseen Servant",
      meta:"1 action · 18 m · V, S, M (un morceau de ficelle et un bout de bois) · 1 hour",
      text:`Ce sort crée une force invisible, sans volonté propre, informe mais de taille M, qui exécute les ordres simples que vous lui transmettez, jusqu'à la fin du sort. Le serviteur prend vie dans un espace inoccupé sur le sol et à portée. Il possède les caractéristiques suivantes : CA 10 ; 1 point de vie ; Force 2 ; ne peut pas attaquer. Le sort se termine si le serviteur tombe à 0 point de vie.<br><br>Une fois par tour, par une action bonus, vous pouvez mentalement ordonner au serviteur de se déplacer de 4,50 mètres et d'interagir avec un objet. Le serviteur peut exécuter des tâches simples comme un serviteur humain le ferait, comme rapporter quelque chose, nettoyer, raccommoder, plier des vêtements, entretenir un feu, servir à manger, et verser du vin. Une fois votre ordre donné, le serviteur cherche à l'exécuter du mieux qu'il peut jusqu'à ce que la tâche soit accomplie, puis il attend votre ordre suivant.<br><br>Si vous demandez à votre serviteur d'effectuer une tâche qui devrait l'envoyer à plus de 18 mètres de vous, le sort prend fin.`
    },
    {
      name:"Silvery Barbs",
      meta:"1 réaction · 18 m · V · Instantaneous",
      text:`Vous distrayez magiquement la créature qui a déclenché le sort et transformez son incertitude en encouragement pour une seconde créature. La créature qui a déclenché le sort doit relancer son d20 et prendre le jet le plus faible.<br><br>Vous choisissez ensuite une autre créature que vous pouvez voir à portée (vous pouvez vous choisir). La créature choisie obtient un avantage sur le prochain jet d'attaque, de caractéristique ou de sauvegarde qu'elle fera dans la minute. Les effets de ce sort ne peuvent se cumuler.`
    }
  ],
  level2: [
    {
      name:"Maximilian’s Earthen Grasp",
      meta:"1 action · 30 feet · V, S, M (a miniature hand sculpted from clay) · Concentration, up to 1 minute",
      text:`You choose a 5-foot-square unoccupied space on the ground that you can see within range. A Medium hand made from compacted soil rises there and reaches for one creature you can see within 5 feet of it. The target must make a Strength saving throw. On a failed save, the target takes 2d6 bludgeoning damage and is restrained for the spell's duration.<br><br>As an action, you can cause the hand to crush the restrained target, which must make a Strength saving throw. The target takes 2d6 bludgeoning damage on a failed save, or half as much damage on a successful one.<br><br>To break out, the restrained target can use its action to make a Strength check against your spell save DC. On a success, the target escapes and is no longer restrained by the hand.<br><br>As an action, you can cause the hand to reach for a different creature or to move to a different unoccupied space within range. The hand releases a restrained target if you do either.`
    },
    {
      name:"Misty Step",
      meta:"1 bonus action · Self · V · Instantaneous",
      text:`Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.`
    },
    {
      name:"Invisibility",
      meta:"1 action · contact · V, S, M (un cil enfoncé dans de la gomme arabique) · concentration, jusqu'à 1 heure",
      text:`Une créature que vous touchez devient invisible jusqu'à la fin du sort. Tout ce que la cible porte est invisible tant que la cible le porte. Le sort se termine si la cible attaque ou lance un sort.<br><br><b>Aux niveaux supérieurs.</b> Lorsque vous lancez ce sort en utilisant un emplacement de sort de niveau 3 ou supérieur, vous pouvez cibler une créature supplémentaire pour chaque niveau d'emplacement au-delà du niveau 2.`
    },
    {
      name:"See Invisibility",
      meta:"Action · Self · V, S, M (a pinch of talc) · 1 hour",
      text:`For the duration, you see creatures and objects that have the Invisible condition as if they were visible, and you can see into the Ethereal Plane. Creatures and objects there appear ghostly.`
    }
  ]
};

const specterText = `
  <p><i>Medium undead, chaotic evil</i></p>
  <hr>
  <p><b>Armor Class</b> 12<br>
  <b>Hit Points</b> 22 (5d8)<br>
  <b>Speed</b> 0 ft., fly 50 ft. (hover)</p>
  <hr>
  <p><b>STR</b> 1 (-5) &nbsp; <b>DEX</b> 14 (+2) &nbsp; <b>CON</b> 11 (+0)<br>
  <b>INT</b> 10 (+0) &nbsp; <b>WIS</b> 10 (+0) &nbsp; <b>CHA</b> 11 (+0)</p>
  <hr>
  <p><b>Damage Resistances</b> acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks<br>
  <b>Damage Immunities</b> necrotic, poison<br>
  <b>Condition Immunities</b> charmed, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained, unconscious<br>
  <b>Senses</b> darkvision 60 ft., passive Perception 10<br>
  <b>Languages</b> understands the languages it knew in life but can't speak<br>
  <b>Challenge</b> 1 (200 XP)</p>
  <hr>
  <p><i><b>Incorporeal Movement.</b></i> The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.</p>
  <p><i><b>Sunlight Sensitivity.</b></i> While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.</p>
  <h3>Actions</h3>
  <p><i><b>Life Drain.</b></i> Melee Spell Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) necrotic damage. The target must succeed on a DC 10 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. The reduction lasts until the creature finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.</p>
`;

function mod(score) { return Math.floor((score - 10) / 2); }
function signed(n) { return n >= 0 ? `+${n}` : `${n}`; }

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try { Object.assign(state, JSON.parse(raw)); } catch (_) {}
}

function renderAbilities() {
  const grid = document.getElementById("abilityGrid");
  grid.innerHTML = "";
  Object.entries(abilities).forEach(([key, a]) => {
    const el = document.createElement("div");
    el.className = "ability";
    el.innerHTML = `
      <div class="ability-name">${a.name}</div>
      <div class="ability-score" id="score-${key}">${a.score}</div>
      <div class="ability-mod" id="mod-${key}">${signed(mod(a.score))}</div>
      <button data-ability="${key}" data-delta="-1">−</button>
      <button data-ability="${key}" data-delta="1">+</button>
    `;
    grid.appendChild(el);
  });
}

function renderModifiers() {
  const saveGrid = document.getElementById("saveGrid");
  saveGrid.innerHTML = "";
  saves.forEach(([key,name,prof]) => {
    const val = mod(abilities[key].score) + (prof ? 2 : 0);
    const row = document.createElement("div");
    row.className = "mod-row";
    row.innerHTML = `<span class="name ${prof ? "proficient" : ""}">${name}${prof ? " ★" : ""}</span>
      <span class="mod-value">${signed(val)}</span>
      <span></span>`;
    saveGrid.appendChild(row);
  });

  const skillGrid = document.getElementById("skillGrid");
  skillGrid.innerHTML = "";
  skills.forEach(([_,name,key,prof]) => {
    const val = mod(abilities[key].score) + (prof ? 2 : 0);
    const row = document.createElement("div");
    row.className = "mod-row";
    row.innerHTML = `<span class="name ${prof ? "proficient" : ""}">${name}${prof ? " ★" : ""}</span>
      <span class="mod-value">${signed(val)}</span>
      <span></span>`;
    skillGrid.appendChild(row);
  });
}

function renderDerived() {
  const cha = mod(abilities.CHA.score);
  const dex = mod(abilities.DEX.score);
  const dc = 8 + 2 + cha;
  const attack = 2 + cha;

  document.getElementById("spellDcValue").textContent = dc;
  document.getElementById("spellAttackValue").textContent = signed(attack);
  document.getElementById("spellDcSmall").textContent = dc;
  document.getElementById("spellAttackSmall").textContent = signed(attack);

  if (state.acAuto) {
    state.ac = 13 + dex + Number(state.shieldBonus || 0);
    document.getElementById("acModeLabel").textContent = state.mageArmor
      ? "Automatique · Mage Armor"
      : "Automatique · base";
  } else {
    document.getElementById("acModeLabel").textContent = "Mode manuel";
  }
  document.getElementById("acValue").textContent = state.ac;

  document.getElementById("initiativeValue").textContent = signed(state.initiative);
  document.getElementById("hpValue").textContent = state.hp;
  document.getElementById("hpMaxValue").textContent = state.hpMax;
  document.getElementById("hpBar").style.width = `${Math.max(0, Math.min(100, state.hp / state.hpMax * 100))}%`;
  document.getElementById("hitDiceValue").textContent = `${state.hitDice} / ${state.hitDiceMax}`;

  document.getElementById("innateUses").textContent = `${state.innate} / 2`;
  document.getElementById("phaseUses").textContent = `${state.phase} / 2`;
  document.getElementById("etherealStatus").textContent = `${state.ethereal} / 1`;
  document.getElementById("relentlessStatus").textContent = `${state.relentless} / 1`;
}

function renderSlots() {
  [1,2].forEach(level => {
    const container = document.getElementById(`slots${level}`);
    container.innerHTML = "";
    state.slots[level].forEach((used, i) => {
      const b = document.createElement("button");
      b.className = `slot ${used ? "used" : ""}`;
      b.title = used ? "Emplacement dépensé — cliquer pour restaurer" : "Emplacement disponible — cliquer pour dépenser";
      b.dataset.slot = `${level}:${i}`;
      container.appendChild(b);
    });
  });

  const sp = document.getElementById("sorceryPoints");
  sp.innerHTML = "";
  state.sorcery.forEach((used, i) => {
    const b = document.createElement("button");
    b.className = `slot ${used ? "used" : ""}`;
    b.title = used ? "Point dépensé — cliquer pour restaurer" : "Point disponible — cliquer pour dépenser";
    b.dataset.sp = i;
    sp.appendChild(b);
  });
}

function renderSpells() {
  const groups = [
    ["cantripList", spells.cantrips],
    ["level1List", spells.level1],
    ["level2List", spells.level2]
  ];
  groups.forEach(([id,list]) => {
    const el = document.getElementById(id);
    el.innerHTML = list.map((s,i) => `
      <div class="spell">
        <span class="spell-name">${s.name}</span>
        <button class="spell-btn" data-spell="${id}:${i}">Détails</button>
      </div>
    `).join("");
  });
}

function log(message) {
  const el = document.getElementById("log");
  const line = document.createElement("div");
  line.textContent = `${new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})} — ${message}`;
  el.prepend(line);
}

function renderAll() {
  renderAbilities();
  renderModifiers();
  renderDerived();
  renderSlots();
  renderSpells();
}

function spend(resource) {
  if (state[resource] > 0) {
    state[resource]--;
    log(`Utilisation dépensée : ${resource}.`);
    save(); renderDerived();
  }
}

function shortRest() {
  // Normal short-rest behavior that is unambiguous here:
  // Hit Dice are NOT automatically restored; current HP is not automatically full.
  // Power Nap is optional, so it is separate.
  log("Short Rest : repos court effectué. Les capacités qui se rechargent spécifiquement sur un repos court sont prêtes.");
  save();
}

function powerNap() {
  state.hitDice = Math.min(state.hitDiceMax, state.hitDice + 1);
  log("Power Nap : 1 dé de vie récupéré. Réduction de l’Exhaustion à appliquer manuellement.");
  save(); renderDerived();
}

function longRest() {
  state.hp = state.hpMax;
  state.hitDice = state.hitDiceMax;
  state.slots[1] = state.slots[1].map(() => false);
  state.slots[2] = state.slots[2].map(() => false);
  state.sorcery = state.sorcery.map(() => false);
  state.innate = 2;
  state.phase = 2;
  state.ethereal = 1;
  state.relentless = 1;
  log("Long Rest : PV, dés de vie, emplacements, points de sorcellerie et utilisations Long Rest restaurés.");
  save(); renderAll();
}

function resetSheet() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

document.addEventListener("click", e => {
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action) {
    switch(action) {
      case "hp-minus": state.hp = Math.max(0, state.hp - 1); break;
      case "hp-plus": state.hp = Math.min(state.hpMax, state.hp + 1); break;
      case "ac-minus": if (!state.acAuto) state.ac--; break;
      case "ac-plus": if (!state.acAuto) state.ac++; break;
      case "ac-auto":
        state.acAuto = true; state.mageArmor = false; break;
      case "mage-armor":
        state.acAuto = true; state.mageArmor = true; break;
      case "init-minus": state.initiative--; state.initiativeAuto = false; break;
      case "init-plus": state.initiative++; state.initiativeAuto = false; break;
      case "init-auto":
        state.initiative = mod(abilities.DEX.score) + mod(abilities.CHA.score) + 2;
        state.initiativeAuto = true; break;
      case "hd-minus": state.hitDice = Math.max(0, state.hitDice - 1); break;
      case "hd-plus": state.hitDice = Math.min(state.hitDiceMax, state.hitDice + 1); break;
      case "short-rest": shortRest(); return;
      case "long-rest": longRest(); return;
      case "power-nap": powerNap(); return;
      case "show-specter": showModal(`<h2>Specter — Phantom Companion</h2><div class="spell-meta">Stat block visible sur l’image fournie</div><div class="description">${specterText}</div>`); return;
      case "reset-sheet": resetSheet(); return;
      case "close-modal": document.getElementById("modal").classList.add("hidden"); return;
    }
    save(); renderAll();
    return;
  }

  const abilityButton = e.target.closest("[data-ability]");
  if (abilityButton) {
    const key = abilityButton.dataset.ability;
    const delta = Number(abilityButton.dataset.delta);
    abilities[key].score = Math.max(1, Math.min(30, abilities[key].score + delta));
    if (key === "DEX" || key === "CHA") {
      state.initiative = mod(abilities.DEX.score) + mod(abilities.CHA.score) + 2;
      if (state.acAuto) renderDerived();
    }
    save(); renderAll();
    return;
  }

  const slotButton = e.target.closest("[data-slot]");
  if (slotButton) {
    const [level,index] = slotButton.dataset.slot.split(":");
    state.slots[level][Number(index)] = !state.slots[level][Number(index)];
    save(); renderSlots(); return;
  }

  const spButton = e.target.closest("[data-sp]");
  if (spButton) {
    const i = Number(spButton.dataset.sp);
    state.sorcery[i] = !state.sorcery[i];
    save(); renderSlots(); return;
  }

  const useButton = e.target.closest("[data-resource]");
  if (useButton) {
    spend(useButton.dataset.resource);
  }

  const spellButton = e.target.closest("[data-spell]");
  if (spellButton) {
    const [group,index] = spellButton.dataset.spell.split(":");
    const map = { cantripList:"cantrips", level1List:"level1", level2List:"level2" };
    const spell = spells[map[group]][Number(index)];
    showModal(`<h2>${spell.name}</h2><div class="spell-meta">${spell.meta}</div><div class="description"><p>${spell.text}</p></div>`);
  }
});

document.getElementById("shieldBonus").addEventListener("input", e => {
  state.shieldBonus = Math.max(0, Number(e.target.value) || 0);
  save(); renderDerived();
});

function showModal(html) {
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modal").classList.remove("hidden");
}

load();
document.getElementById("shieldBonus").value = state.shieldBonus;
renderAll();
