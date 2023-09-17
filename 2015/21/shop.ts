export type EquipmentType = "weapon" | "armor" | "ring";

export type Equipment = {
  name: string;
  cost: number;
  damage: number;
  armor: number;
  type: EquipmentType;
};

export const shop: Record<EquipmentType, Equipment[]> = {
  weapon: [
    {
      name: "Dagger",
      cost: 8,
      damage: 4,
      armor: 0,
      type: "weapon",
    },
    {
      name: "Shortsword",
      cost: 10,
      damage: 5,
      armor: 0,
      type: "weapon",
    },
    {
      name: "Warhammer",
      cost: 25,
      damage: 6,
      armor: 0,
      type: "weapon",
    },
    {
      name: "Longsword",
      cost: 40,
      damage: 7,
      armor: 0,
      type: "weapon",
    },
    {
      name: "Greataxe",
      cost: 74,
      damage: 8,
      armor: 0,
      type: "weapon",
    },
  ],
  armor: [
    {
      name: "Leather",
      cost: 13,
      damage: 0,
      armor: 1,
      type: "armor",
    },
    {
      name: "Chainmail",
      cost: 31,
      damage: 0,
      armor: 2,
      type: "armor",
    },
    {
      name: "Splintmail",
      cost: 53,
      damage: 0,
      armor: 3,
      type: "armor",
    },
    {
      name: "Bandedmail",
      cost: 75,
      damage: 0,
      armor: 4,
      type: "armor",
    },
    {
      name: "Platemail",
      cost: 102,
      damage: 0,
      armor: 5,
      type: "armor",
    },
  ],
  ring: [
    {
      name: "Damage +1",
      cost: 25,
      damage: 1,
      armor: 0,
      type: "ring",
    },
    {
      name: "Damage +2",
      cost: 50,
      damage: 2,
      armor: 0,
      type: "ring",
    },
    {
      name: "Damage +3",
      cost: 100,
      damage: 3,
      armor: 0,
      type: "ring",
    },
    {
      name: "Defense +1",
      cost: 20,
      damage: 0,
      armor: 1,
      type: "ring",
    },
    {
      name: "Defense +2",
      cost: 40,
      damage: 0,
      armor: 2,
      type: "ring",
    },
    {
      name: "Defense +3",
      cost: 80,
      damage: 0,
      armor: 3,
      type: "ring",
    },
  ],
};
