type Point = [number, number];

type Grid = string[][];

type Maze = {
  grid: Grid;
  start: Point;
  loop: Point[];
  loopSet?: Set<string>;
  notPartOfLoop?: Point[];
  notEnclosedSet?: Set<string>;
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

const tryGoLeft = (grid: Grid, [row, col]: Point): Point | null => {
  const left = grid[row][col - 1];
  if (left === "F" || left === "-" || left === "L") {
    return [row, col - 1];
  }
  return null;
};

const tryGoUp = (grid: Grid, [row, col]: Point): Point | null => {
  const up = grid[row - 1][col];
  if (up === "7" || up === "|" || up === "F") {
    return [row - 1, col];
  }
  return null;
};

const tryGoRight = (grid: Grid, [row, col]: Point): Point | null => {
  const right = grid[row][col + 1];
  if (right === "J" || right === "-" || right === "7") {
    return [row, col + 1];
  }
  return null;
};

const tryGoDown = (grid: Grid, [row, col]: Point): Point | null => {
  const down = grid[row + 1][col];
  if (down === "J" || down === "|" || down === "L") {
    return [row + 1, col];
  }
  return null;
};

const tryMoveSomeWhere = (grid: Grid, point: Point): Point | null => {
  return (
    tryGoLeft(grid, point) ??
    tryGoUp(grid, point) ??
    tryGoRight(grid, point) ??
    tryGoDown(grid, point)
  );
};

const findLoop = (maze: Maze) => {
  let prev = maze.start;
  let current = tryMoveSomeWhere(maze.grid, prev)!;

  maze.loop = [prev, current];
  maze.loopSet = new Set();
  maze.loopSet.add(prev.join(","));
  maze.loopSet.add(current.join(","));

  while (true) {
    const next = move(maze, current, prev);
    if (isSamePoint(next, maze.start)) {
      break;
    }
    maze.loop.push(next);
    maze.loopSet.add(next.join(","));
    prev = current;
    current = next;
  }
};

const findNotInLoop = (maze: Maze) => {
  maze.notPartOfLoop = [];
  for (let row = 0; row < maze.grid.length; row++) {
    const line = maze.grid[row];
    for (let col = 0; col < line.length; col++) {
      const point: Point = [row, col];
      if (maze.loopSet!.has(point.join(","))) {
        continue;
      }
      maze.notPartOfLoop.push(point);
    }
  }
};

const findNotEnclosed = (maze: Maze) => {
  maze.notEnclosedSet = new Set<string>();
  maze.notPartOfLoop!.forEach((point) => {
    const seen = new Set<string>();
    if (canGetOut(maze, point, seen)) {
      maze.notEnclosedSet!.add(point.join(","));
    }
  });
};

const canGetOut = (maze: Maze, point: Point, seen: Set<string>): boolean => {
  if (maze.notEnclosedSet!.has(point.join(","))) {
    return true;
  }
  if (isNextToWall(maze, point)) {
    maze.notEnclosedSet!.add(point.join(","));
    return true;
  }
  const [row, col] = point;
  const topLeft: Point = [row - 1, col - 1];
  const top: Point = [row - 1, col];
  const topRight: Point = [row - 1, col + 1];
  const left: Point = [row, col - 1];
  const right: Point = [row, col + 1];
  const bottomLeft: Point = [row + 1, col - 1];
  const bottom: Point = [row + 1, col];
  const bottomRight: Point = [row + 1, col + 1];
  const adjacent = [
    topLeft,
    top,
    topRight,
    left,
    right,
    bottomLeft,
    bottom,
    bottomRight,
  ];
  seen.add(point.join(","));
  for (const adjacentPoint of adjacent) {
    if (maze.grid[row]?.[col] === undefined) {
      continue;
    }
    if (maze.loopSet!.has(adjacentPoint.join(","))) {
      continue;
    }
    if (seen.has(adjacentPoint.join(","))) {
      continue;
    }
    return canGetOut(maze, adjacentPoint, seen);
  }
  return false;
};

const isNextToWall = (maze: Maze, point: Point): boolean => {
  const [row, col] = point;
  return (
    row === 0 ||
    col === 0 ||
    row === maze.grid.length - 1 ||
    col === maze.grid[0].length - 1
  );
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

  findLoop(maze);
  findNotInLoop(maze);
  findNotEnclosed(maze);

  const furthestPointSteps = maze.loop.length / 2; // P1

  maze.notPartOfLoop!.forEach((point) => {
    if (maze.notEnclosedSet!.has(point.join(","))) {
      maze.grid[point[0]][point[1]] = "o";
    } else {
      // TODO: find where you can sneak in between the pipes!
      maze.grid[point[0]][point[1]] = ".";
    }
  });

  console.log(furthestPointSteps);

  Bun.write("output.txt", maze.grid.map((l) => l.join("")).join("\n"));
};

main();
