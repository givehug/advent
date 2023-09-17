import { shop, type Equipment } from "./shop";

type Player = {
  name: string;
  armor: number;
  damage: number;
  hp: number;
  goldSpend: number;
};

type PlayerController = {
  player: Player;
  equip: (e?: Equipment) => void;
  attack: (enemy: Player) => void;
  reset: () => void;
};

const playerController = (initialStats: Player): PlayerController => {
  let weapon: Equipment | undefined;
  let armor: Equipment[] = [];
  let rings: Equipment[] = [];
  const player: Player = { ...initialStats };

  const attack = (enemy: Player) => {
    const damage = player.damage - enemy.armor;
    enemy.hp -= damage > 0 ? damage : 1;
  };

  const equip = (e?: Equipment) => {
    if (!e) {
      return;
    }
    switch (e.type) {
      case "weapon":
        {
          if (!weapon) {
            weapon = e;
            player.damage += e.damage;
            player.armor += e.armor;
            player.goldSpend += e.cost;
          }
        }
        break;
      case "armor":
        {
          armor.push(e);
          player.damage += e.damage;
          player.armor += e.armor;
          player.goldSpend += e.cost;
        }
        break;
      case "ring":
        {
          rings.push(e);
          player.damage += e.damage;
          player.armor += e.armor;
          player.goldSpend += e.cost;
        }
        break;
    }
  };

  const reset = () => {
    weapon = undefined;
    armor = [];
    rings = [];
    player.goldSpend = 0;
    player.hp = initialStats.hp;
    player.damage = initialStats.damage;
    player.armor = initialStats.armor;
  };

  return {
    player,
    attack,
    equip,
    reset,
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

const launchGame = (pc: PlayerController, ec: PlayerController) => {
  let winner = ec;
  let weapon = 0;
  let armor = 0;
  let ring1 = 0;
  let ring2 = 0;

  while (winner === ec) {
    // TODO: buy all possible combinations (1 weapon, 0-1 armor, 0-2 rings)
    pc.equip(shop.weapon[weapon++]);
    pc.equip(shop.armor[armor++]);
    pc.equip(shop.ring[ring1++]);
    pc.equip(shop.ring[ring2++]);

    winner = launchDuel(pc, ec);

    if (winner === ec) {
      pc.reset();
      ec.reset();
    }
  }

  return winner;
};

async function main() {
  const p1 = playerController({
    name: "player",
    hp: 100,
    damage: 0,
    armor: 0,
    goldSpend: 0,
  });

  const p2 = playerController({
    name: "boss",
    hp: 104,
    damage: 8,
    armor: 1,
    goldSpend: 0,
  });

  const winner = launchGame(p1, p2);

  console.log("\n");
  console.log(`--- ${winner.player.name} wins! ---`);
  console.log(`gold spent: ${winner.player.goldSpend}`);
  console.log(`${p1.player.name} hp: ${p1.player.hp}`);
  console.log(`${p2.player.name} hp: ${p2.player.hp}`);
  console.log("\n");
}

main();
