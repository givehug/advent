type Point = { col: number; row: number };
type Grid = number[][];

const buildNewGrid = (): Grid =>
  Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => 0));

const litLights = (lines: string[]) => {
  const lights = buildNewGrid();

  lines.forEach((line, l) => {
    line.split("").forEach((char, c) => {
      lights[l][c] = char === "#" ? 1 : 0;
    });
  });

  lights[0][0] = 1;
  lights[99][0] = 1;
  lights[0][99] = 1;
  lights[99][99] = 1;

  return lights;
};

const getNeighbors = (grid: Grid, dot: Point): number[] => {
  const tl = grid[dot.row - 1]?.[dot.col - 1] ?? 0;
  const tc = grid[dot.row - 1]?.[dot.col] ?? 0;
  const tr = grid[dot.row - 1]?.[dot.col + 1] ?? 0;
  const cr = grid[dot.row]?.[dot.col + 1] ?? 0;
  const br = grid[dot.row + 1]?.[dot.col + 1] ?? 0;
  const bc = grid[dot.row + 1]?.[dot.col] ?? 0;
  const bl = grid[dot.row + 1]?.[dot.col - 1] ?? 0;
  const cl = grid[dot.row]?.[dot.col - 1] ?? 0;

  const neighbors = [tl, tc, tr, cr, br, bc, bl, cl];

  return neighbors;
};

const animateLights = (lights: Grid): Grid => {
  const newLights = buildNewGrid();

  lights.forEach((r, row) => {
    r.forEach((light, col) => {
      const neighbors = getNeighbors(lights, { row, col });
      const neighborsOn = neighbors.reduce((sum, x) => sum + x, 0);
      if (
        (row === 0 && col === 0) ||
        (row === 99 && col === 0) ||
        (row === 0 && col === 99) ||
        (row === 99 && col === 99)
      ) {
        // Corner lights
        newLights[row][col] = 1;
      } else if (light === 1) {
        // A light which is on stays on when 2 or 3 neighbors are on, and turns off otherwise.
        newLights[row][col] = neighborsOn === 2 || neighborsOn === 3 ? 1 : 0;
      } else {
        // A light which is off turns on if exactly 3 neighbors are on, and stays off otherwise.
        newLights[row][col] = neighborsOn === 3 ? 1 : 0;
      }
    });
  });

  return newLights;
};

const calcTurnedOnLights = (lights: Grid) => {
  return lights.flat().reduce((a, b) => a + b, 0);
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const lights = litLights(lines);

  const animated = Array.from({ length: 100 }).reduce(animateLights, lights);

  const turnedOn = calcTurnedOnLights(animated);

  console.log(turnedOn);
}

main();
