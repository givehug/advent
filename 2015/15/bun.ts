// exactly 100 spoons

type Ingredient = {
  name: string;
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
  spoons: number;
};

const sumProperties = (ingredients: Ingredient[], property: string) => {
  return Math.max(
    ingredients.reduce((acc, i) => acc + i[property] * i.spoons, 0),
    0
  );
};

const calcTotalScore = (ingredients: Ingredient[]) => {
  const capacity = sumProperties(ingredients, "capacity");
  const durability = sumProperties(ingredients, "durability");
  const flavor = sumProperties(ingredients, "flavor");
  const texture = sumProperties(ingredients, "texture");

  return capacity * durability * flavor * texture;
};

const ingredients = [];

async function main() {
  const butterScotch = {
    name: "Butterscotch",
    capacity: -1,
    durability: -2,
    flavor: 6,
    texture: 3,
    calories: 8,
    spoons: 44,
  };

  const cinnamon = {
    name: "Cinnamon",
    capacity: 2,
    durability: 3,
    flavor: -2,
    texture: -1,
    calories: 3,
    spoons: 56,
  };

  console.log(calcTotalScore([butterScotch, cinnamon]));
}

main();
