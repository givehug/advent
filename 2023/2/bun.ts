type Color = "red" | "green" | "blue";

type ColorCombo = Record<Color, number>;

type Game = {
  gameId: number;
  colorCombos: ColorCombo[];
};

const isGameValid = (colorLimits: ColorCombo) => (game: Game) => {
  for (const combo of game.colorCombos) {
    for (const color in combo) {
      if (combo[color] > colorLimits[color]) {
        return false;
      }
    }
  }
  return true;
};

const findMinColorCombo = (game: Game): ColorCombo => {
  const result: ColorCombo = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const combo of game.colorCombos) {
    for (const color in combo) {
      result[color] = Math.max(result[color], combo[color]);
    }
  }

  return result;
};

const calcColorPower = (combo: ColorCombo): number => {
  return Object.values(combo).reduce((sum, count) => sum * count, 1);
};

const parseLine = (line: string): Game => {
  const gameId = parseInt(line.split(" ")[1]);
  const colorSets = line.split(":")[1].trim();

  const colorCombos: ColorCombo[] = [];

  colorSets.split(";").forEach((set) => {
    const colorCombo = set.split(",").reduce((combo, pair) => {
      const [count, color] = pair.trim().split(" ");
      combo[color] = count;
      return combo;
    }, {} as ColorCombo);
    colorCombos.push(colorCombo);
  });

  return {
    gameId,
    colorCombos,
  };
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");

  const games = lines.map(parseLine);

  const validGames = games.filter(
    isGameValid({
      red: 12,
      green: 13,
      blue: 14,
    })
  );

  const sumOfValidGameIds = validGames.reduce(
    (sum, game) => sum + game.gameId,
    0
  );

  const minColorCombos = games.map((g) => {
    const minColors = findMinColorCombo(g);
    const power = calcColorPower(minColors);

    return {
      gameId: g.gameId,
      minColors,
      power,
    };
  });

  const sumOfPowers = minColorCombos.reduce(
    (sum, combo) => combo.power + sum,
    0
  );

  console.log("HERE:", sumOfPowers);
}

main();
