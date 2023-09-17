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
  equipment: {
    weapon: Equipment | undefined;
    armor: Equipment[];
    rings: Equipment[];
  };
  equip: (e?: Equipment) => void;
  attack: (enemy: Player) => void;
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

  return {
    player,
    get equipment() {
      return { weapon, armor, rings };
    },
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

const findBestPlay = () => {
  const bestPLay: any = {
    goldSpend: Infinity,
    equipment: null,
    winner: "",
  };
  const worstPlay: any = {
    goldSpend: 0,
    equipment: null,
    winner: "",
  };

  for (let w = 0; w < shop.weapon.length; w++) {
    const weapon = shop.weapon[w];

    for (let a = -1; a < shop.armor.length; a++) {
      const armor = shop.armor[a];

      for (let r1 = -1; r1 < shop.ring.length; r1++) {
        const ring1 = shop.ring[r1];

        for (let r2 = -1; r2 < shop.ring.length; r2++) {
          const ring2 = shop.ring[r2];

          const pc = playerController({
            name: "player",
            hp: 100,
            damage: 0,
            armor: 0,
            goldSpend: 0,
          });

          const ec = playerController({
            name: "boss",
            hp: 104,
            damage: 8,
            armor: 1,
            goldSpend: 0,
          });

          pc.equip(weapon);
          pc.equip(armor);
          pc.equip(ring1);
          if (r1 !== r2) {
            pc.equip(ring2);
          }

          const winner = launchDuel(pc, ec);

          if (winner === pc) {
            if (pc.player.goldSpend < bestPLay.goldSpend) {
              bestPLay.goldSpend = pc.player.goldSpend;
              bestPLay.equipment = pc.equipment;
              bestPLay.winner = winner.player.name;
            }
          } else if (winner === ec) {
            if (pc.player.goldSpend > worstPlay.goldSpend) {
              worstPlay.goldSpend = pc.player.goldSpend;
              worstPlay.equipment = pc.equipment;
              worstPlay.winner = winner.player.name;
            }
          }
        }
      }
    }
  }

  return { bestPLay, worstPlay };
};

async function main() {
  const bestPlay = findBestPlay();

  console.log(bestPlay);
}

main();
