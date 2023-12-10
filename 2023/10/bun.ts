type Row = number;
type Col = number;
type Point = [Row, Col];

type Grid = string[][];

type Maze = {
  grid: Grid;
  start: Point;
  loop: Point[];
};

const findInGrid = (grid: Grid, target: string): Point => {
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      if (char === target) {
        return [row, col];
      }
    }
  }
  throw new Error(`Could not find ${target} in maze`);
};

const goLeftFromStart = (grid: Grid, [row, col]: Point): Point | null => {
  const left = grid[row][col - 1];
  if (left === "F" || left === "-" || left === "L") {
    return [row, col - 1];
  }
  return null;
};

const goUpFromStart = (grid: Grid, [row, col]: Point): Point | null => {
  const up = grid[row - 1][col];
  if (up === "7" || up === "|" || up === "F") {
    return [row - 1, col];
  }
  return null;
};

const goRightFromStart = (grid: Grid, [row, col]: Point): Point | null => {
  const right = grid[row][col + 1];
  if (right === "J" || right === "-" || right === "7") {
    return [row, col + 1];
  }
  return null;
};

const goDownFromStart = (grid: Grid, [row, col]: Point): Point | null => {
  const down = grid[row + 1][col];
  if (down === "J" || down === "|" || down === "L") {
    return [row + 1, col];
  }
  return null;
};

const moveFromStart = (maze: Maze): Point | null => {
  const { grid, start } = maze;
  return (
    goLeftFromStart(grid, start) ??
    goUpFromStart(grid, start) ??
    goRightFromStart(grid, start) ??
    goDownFromStart(grid, start)
  );
};

const findLoop = (maze: Maze): Point[] => {
  const loop: Point[] = [maze.start, moveFromStart(maze)!];

  let current = loop[1];
  let prev = loop[0];
  while (true) {
    const next = move(maze, current, prev);
    if (isSamePoint(next, maze.start)) {
      break;
    }
    loop.push(next);
    prev = current;
    current = next;
  }

  return loop;
};

const parseMaze = (lines: string[]): Maze => {
  const grid = lines.map((l) => l.split(""));
  const start = findInGrid(grid, "S");
  return { grid, start, loop: [] };
};

const isSamePoint = (a: Point, b: Point): boolean => {
  return a[0] === b[0] && a[1] === b[1];
};

const move = (maze: Maze, point: Point, prevPoint: Point): Point => {
  const [row, col] = point;
  const [prevRow, prevCol] = prevPoint;
  const char = maze.grid[row][col];
  switch (char) {
    case "S":
      throw maze.start;
    case "F":
      return prevRow === row ? [row + 1, col] : [row, col + 1];
    case "|":
      return prevRow === row - 1 ? [row + 1, col] : [row - 1, col];
    case "L":
      return prevRow === row - 1 ? [row, col + 1] : [row - 1, col];
    case "-":
      return prevCol === col - 1 ? [row, col + 1] : [row, col - 1];
    case "J":
      return prevRow === row ? [row - 1, col] : [row, col - 1];
    case "7":
      return prevRow === row ? [row + 1, col] : [row, col - 1];
    default:
      throw new Error(`Invalid char ${char} at ${row},${col}`);
  }
};

const main = async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n").filter(Boolean);
  const maze = parseMaze(lines);

  const loop = findLoop(maze);

  console.log(loop.length / 2);
  // console.log(loop);
};

main();
