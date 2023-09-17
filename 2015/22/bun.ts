import { Spell, getSpell } from "../22/spells";

type Wizard = {
  mana: number;
  hp: number;
  armor: number;
  spells: Spell[];
};

type Boss = {
  hp: number;
  damage: number;
  // armor: number;
};

const launchDuel = (w: Wizard, b: Boss) => {
  let attacker: Wizard | Boss = w;
  let ongoingSpellEffects: Spell[] = [];

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
      // const damage = b.damage - w.armor;
      // w.hp -= damage > 0 ? damage : 1;
    } else {
      const spell = w.spells.shift();

      if (!spell) {
        return b;
      }

      w.mana -= spell.cost;
      b.hp -= spell.damage;
      w.hp += spell.heal;
      w.armor += spell.increaseArmor;
      w.mana += spell.increaseMana;

      if (spell.effectDurationTurns > 0) {
        spell.effectDurationTurns--;
        ongoingSpellEffects.push(spell);
      }
    }

    attacker = attacker === w ? b : w;
  }

  const winner = w.hp > b.hp ? w : b;

  return winner;
};

// const findBestPlay = () => {
//   const bestPLay: any = {
//     goldSpend: Infinity,
//     equipment: null,
//     winner: "",
//   };
//   const worstPlay: any = {
//     goldSpend: 0,
//     equipment: null,
//     winner: "",
//   };

//   for (let w = 0; w < shop.weapon.length; w++) {
//     const weapon = shop.weapon[w];

//     for (let a = -1; a < shop.armor.length; a++) {
//       const armor = shop.armor[a];

//       for (let r1 = -1; r1 < shop.ring.length; r1++) {
//         const ring1 = shop.ring[r1];

//         for (let r2 = -1; r2 < shop.ring.length; r2++) {
//           const ring2 = shop.ring[r2];

//           const pc = playerController({
//             name: "player",
//             hp: 100,
//             damage: 0,
//             armor: 0,
//             goldSpend: 0,
//           });

//           const ec = playerController({
//             name: "boss",
//             hp: 104,
//             damage: 8,
//             armor: 1,
//             goldSpend: 0,
//           });

//           pc.equip(weapon);
//           pc.equip(armor);
//           pc.equip(ring1);
//           if (r1 !== r2) {
//             pc.equip(ring2);
//           }

//           const winner = launchDuel(pc, ec);

//           if (winner === pc) {
//             if (pc.player.goldSpend < bestPLay.goldSpend) {
//               bestPLay.goldSpend = pc.player.goldSpend;
//               bestPLay.equipment = pc.equipment;
//               bestPLay.winner = winner.player.name;
//             }
//           } else if (winner === ec) {
//             if (pc.player.goldSpend > worstPlay.goldSpend) {
//               worstPlay.goldSpend = pc.player.goldSpend;
//               worstPlay.equipment = pc.equipment;
//               worstPlay.winner = winner.player.name;
//             }
//           }
//         }
//       }
//     }
//   }

//   return { bestPLay, worstPlay };
// };

async function main() {
  // const bestPlay = findBestPlay();

  // console.log(bestPlay);

  const w: Wizard = {
    mana: 250,
    hp: 10,
    armor: 0,
    spells: [
      getSpell("Recharge"),
      getSpell("Shield"),
      getSpell("Drain"),
      getSpell("Poison"),
      getSpell("Magic Missile"),
    ],
  };

  const b: Boss = {
    hp: 14,
    damage: 8,
  };

  const winner = launchDuel(w, b);

  console.log(winner);
}

main();
