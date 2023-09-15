type Position = { x: number; y: number };

type PositionCode = `x:${number},y:${number}`;

const encodePosition = ({ x, y }: Position): PositionCode => `x:${x},y:${y}`;

/**
 * How many houses receive at least one present?
 */
const calculateHouses = (moves: string) => {
  const visitedHouses = new Set<PositionCode>();

  const santa = { x: 0, y: 0 };
  const robot = { x: 0, y: 0 };

  let mover = santa;

  visitedHouses.add(encodePosition(mover));

  for (const move of moves) {
    switch (move) {
      case ">":
        mover.x++;
        break;
      case "<":
        mover.x--;
        break;
      case "^":
        mover.y++;
        break;
      case "v":
        mover.y--;
        break;
      default:
        break;
    }
    visitedHouses.add(encodePosition(mover));
    mover = mover === santa ? robot : santa;
  }

  return visitedHouses.size;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();

  console.log(calculateHouses(input));
}

main();
