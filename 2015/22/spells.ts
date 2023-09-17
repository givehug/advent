export type Spell = {
  name: SpellName;
  cost: number;
  damage: number;
  heal: number;
  increaseArmor: number;
  increaseMana: number;
  effectDurationTurns: number;
};

type SpellName = "Magic Missile" | "Drain" | "Shield" | "Poison" | "Recharge";

const spells: Record<SpellName, Spell> = {
  "Magic Missile": {
    name: "Magic Missile",
    cost: 53,
    damage: 4,
    heal: 0,
    increaseArmor: 0,
    increaseMana: 0,
    effectDurationTurns: 0,
  },
  Drain: {
    name: "Drain",
    cost: 73,
    damage: 2,
    heal: 2,
    increaseArmor: 0,
    increaseMana: 0,
    effectDurationTurns: 0,
  },
  Shield: {
    name: "Shield",
    cost: 113,
    damage: 0,
    heal: 0,
    increaseArmor: 7,
    increaseMana: 0,
    effectDurationTurns: 6,
  },
  Poison: {
    name: "Poison",
    cost: 173,
    damage: 3,
    heal: 0,
    increaseArmor: 0,
    increaseMana: 0,
    effectDurationTurns: 6,
  },
  Recharge: {
    name: "Recharge",
    cost: 229,
    damage: 0,
    heal: 0,
    increaseArmor: 0,
    increaseMana: 101,
    effectDurationTurns: 5,
  },
};

export const getSpell = (spellName: SpellName): Spell => {
  return { ...spells[spellName] };
};
