import { Spell, getAllSpells, getSpell } from "../22/spells";

type Wizard = {
  mana: number;
  hp: number;
  armor: number;
  spells: Spell[];
};

type Boss = {
  hp: number;
  damage: number;
};

const launchDuel = (
  w: Wizard,
  b: Boss
): { winner: Wizard | Boss; manaSpent: number } => {
  let attacker: Wizard | Boss = w;
  let ongoingSpellEffects: Spell[] = [];
  let manaSpent = 0;

  while (w.hp > 0 && b.hp > 0) {
    ongoingSpellEffects.forEach((s) => {
      w.hp += s.heal;
      w.armor += s.increaseArmor;
      w.mana += s.increaseMana;
      b.hp -= s.damage;
      s.effectDurationTurns--;
      if (s.effectDurationTurns <= 0) {
        ongoingSpellEffects = ongoingSpellEffects.filter(
          (os) => os.name !== s.name
        );
      }
    });

    if (attacker === b) {
      const damage = Math.max(1, b.damage - w.armor);
      w.hp -= damage;
    } else {
      const spell = w.spells.shift();

      if (!spell || w.mana < spell.cost) {
        return { winner: b, manaSpent };
      }

      manaSpent += spell.cost;
      w.mana -= spell.cost;
      b.hp -= spell.damage;
      w.hp += spell.heal;
      w.armor += spell.increaseArmor;
      w.mana += spell.increaseMana;

      if (spell.effectDurationTurns > 0) {
        ongoingSpellEffects.push({
          ...spell,
          effectDurationTurns: spell.effectDurationTurns - 1,
        });
      }
    }

    attacker = attacker === w ? b : w;
  }

  const winner = w.hp > b.hp ? w : b;

  return { winner, manaSpent };
};

const findBestPlay = () => {
  let bestPlayManaLeft = 0;
  const allSpells = getAllSpells();
  const limit = 10000000;
  let count = 0;
  const queue: Spell[][] = [];
  let leastManaSpent = Infinity;
  let winningSpellHAsh = "";
  let _winner: any = null;

  allSpells.forEach((s) => queue.push([s]));

  const boss = (): Boss => ({
    hp: 55,
    damage: 8,
  });

  const wizard = (): Wizard => ({
    mana: 500,
    hp: 50,
    armor: 0,
    spells: [],
  });

  while (queue.length && count < limit) {
    const spells = queue.shift()!;
    const spellHash = spells.map((s) => s.name).join("-");
    count++;

    const w = wizard();
    w.spells = [...spells];
    const b = boss();

    const { winner, manaSpent } = launchDuel(w, b);
    if (winner === w) {
      bestPlayManaLeft = Math.max(bestPlayManaLeft, w.mana);
      if (manaSpent < leastManaSpent) {
        winningSpellHAsh = spellHash;
        leastManaSpent = manaSpent;
        _winner = w;
      }
    }

    for (let i = 0; i < allSpells.length; i++) {
      const spell = allSpells[i];
      queue.push([...spells, spell]);
    }
  }

  return { leastManaSpent, winningSpellHAsh, _winner };
};

async function mainManual() {
  // const w: Wizard = {
  //   mana: 250,
  //   hp: 10,
  //   armor: 0,
  //   spells: [
  //     getSpell("Recharge"),
  //     getSpell("Shield"),
  //     getSpell("Drain"),
  //     getSpell("Poison"),
  //     getSpell("Magic Missile"),
  //   ],
  // };

  // const b: Boss = {
  //   hp: 14,
  //   damage: 8,
  // };

  const w: Wizard = {
    mana: 500,
    hp: 50,
    armor: 0,
    spells: [
      getSpell("Poison"),
      getSpell("Magic Missile"),
      getSpell("Magic Missile"),
      getSpell("Poison"),
      getSpell("Magic Missile"),
      getSpell("Magic Missile"),
      getSpell("Magic Missile"),
    ],
  };

  const b: Boss = {
    hp: 55,
    damage: 8,
  };

  // "Poison-Magic Missile-Magic Missile-Poison-Magic Missile-Magic Missile-Magic Missile"

  console.log("START MANUAL");

  const winner = launchDuel(w, b);

  console.log("DONE MANUAL", winner);
}

async function mainAuto() {
  console.log("START AUTO");

  const bestPlay = findBestPlay();

  console.log("DONE AUTO", bestPlay);
}

function main() {
  if (Bun.argv[2] === "manual") {
    return mainManual();
  }
  if (Bun.argv[2] === "auto") {
    return mainAuto();
  }
}

main();
