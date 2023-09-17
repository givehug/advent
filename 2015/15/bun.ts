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

const findPossibleCombinations = (buckets: number[], amount: number) => {
  const combinations: number[][] = [];

  if (buckets.length === 1) {
    combinations.push([amount]);
    return combinations;
  }

  const otherBuckets = buckets.slice(1);
  for (let i = 0; i <= amount; i++) {
    const otherCombinations = findPossibleCombinations(
      otherBuckets,
      amount - i
    );
    otherCombinations.forEach((c) => combinations.push([i, ...c]));
  }

  return combinations;
};

const findBestScore = (ingredients: Ingredient[], totalSpoons: number) => {
  const spoonDistribution = findPossibleCombinations(
    Array.from({ length: ingredients.length }, () => 0),
    totalSpoons
  );

  const ingredientCombos = spoonDistribution.map((d) => {
    return ingredients.map((i, j) => ({ ...i, spoons: d[j] }));
  });

  let bestTotalScore = 0;

  ingredientCombos.forEach((combo) => {
    const totalScore = calcTotalScore(combo);
    if (totalScore > bestTotalScore) {
      bestTotalScore = totalScore;
    }
  });

  return bestTotalScore;
};

async function main() {
  const butterScotch = {
    name: "Butterscotch",
    capacity: -1,
    durability: -2,
    flavor: 6,
    texture: 3,
    calories: 8,
    spoons: 0,
  };

  const cinnamon = {
    name: "Cinnamon",
    capacity: 2,
    durability: 3,
    flavor: -2,
    texture: -1,
    calories: 3,
    spoons: 0,
  };

  const ingredients = [butterScotch, cinnamon];
  const totalSpoons = 100;

  const bestScore = findBestScore(ingredients, totalSpoons);

  console.log(bestScore);
}

main();
