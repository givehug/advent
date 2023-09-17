import type { Equipment } from "./shop.ts";

type Player = {
  name: string;
  armor: number;
  damage: number;
  hp: number;
};

type PlayerController = {
  player: Player;
  goldSpend: number;
  equip: (e: Equipment) => void;
  attack: (enemy: Player) => void;
};

const playerController = (initialStats: Player): PlayerController => {
  let weapon: Equipment;
  let armor: Equipment[] = [];
  let rings: Equipment[] = [];
  let goldSpend = 0;
  const player = { ...initialStats };

  const attack = (enemy: Player) => {
    const damage = player.damage - enemy.armor;
    enemy.hp -= damage > 0 ? damage : 1;
  };

  const equip = (e: Equipment) => {
    switch (e.type) {
      case "weapon":
        {
          if (!weapon) {
            weapon = e;
            player.damage += e.damage;
            player.armor += e.armor;
            goldSpend += e.cost;
          }
        }
        break;
      case "armor":
        {
          armor.push(e);
          player.damage += e.damage;
          player.armor += e.armor;
          goldSpend += e.cost;
        }
        break;
      case "ring":
        {
          rings.push(e);
          player.damage += e.damage;
          player.armor += e.armor;
          goldSpend += e.cost;
        }
        break;
    }
  };

  return {
    player,
    goldSpend,
    attack,
    equip,
  };
};

const launchDuel = (pc: PlayerController, ec: PlayerController) => {
  let attacker = pc;

  while (pc.player.hp > 0 && ec.player.hp > 0) {
    const defender = attacker === pc ? ec : pc;
    attacker.attack(defender.player);
    attacker = attacker === pc ? ec : pc;
  }

  const winner = pc.player.hp > ec.player.hp ? pc : ec;

  return winner;
};

async function main() {
  const p1 = playerController({
    name: "player",
    hp: 8,
    damage: 5,
    armor: 5,
  });

  const p2 = playerController({
    name: "boss",
    hp: 12,
    damage: 7,
    armor: 2,
  });

  const winner = launchDuel(p1, p2);

  console.log("\n");
  console.log(`--- ${winner.player.name} wins! ---`);
  console.log(`${p1.player.name} hp: ${p1.player.hp}`);
  console.log(`${p2.player.name} hp: ${p2.player.hp}`);
  console.log("\n");
}

main();
