type SchemaLine = string[];

type EngineSchema = SchemaLine[];

const isNumberChar = (char?: string): boolean => {
  return (
    !!char && ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char)
  );
};

const parseLine = (line: string): SchemaLine => {
  const chars = line.split("");
  return chars;
};

const hasAdjacentSymbol = (
  schema: EngineSchema,
  row: number,
  col: number
): boolean => {
  const adjacentSymbols = [
    schema[row - 1]?.[col - 1],
    schema[row - 1]?.[col],
    schema[row - 1]?.[col + 1],
    schema[row]?.[col - 1],
    schema[row]?.[col + 1],
    schema[row + 1]?.[col - 1],
    schema[row + 1]?.[col],
    schema[row + 1]?.[col + 1],
  ].filter((s) => s !== undefined);

  return adjacentSymbols.some(
    (adjacentSymbol) => adjacentSymbol !== "." && !isNumberChar(adjacentSymbol)
  );
};

const getFullNumberAttCoords = (
  schema: EngineSchema,
  row: number,
  col: number
): string => {
  let left = col - 1;
  let right = col + 1;
  let num = schema[row][col];

  if (!isNumberChar(num)) {
    return "";
  }

  while (true) {
    const leftNum = schema[row][left];
    const rightNum = schema[row][right];
    let shouldBreak = true;

    if (isNumberChar(leftNum)) {
      left--;
      num = leftNum + num;
      shouldBreak = false;
    }

    if (isNumberChar(rightNum)) {
      right++;
      num = num + rightNum;
      shouldBreak = false;
    }

    if (shouldBreak) {
      break;
    }
  }

  return num;
};

const getAdjacentNumbers = (
  schema: EngineSchema,
  row: number,
  col: number
): string[] => {
  const adjacentNumbers: string[] = [];

  // left
  const left = schema[row][col - 1];
  if (isNumberChar(left)) {
    adjacentNumbers.push(getFullNumberAttCoords(schema, row, col - 1));
  }

  // right
  const right = schema[row][col + 1];
  if (isNumberChar(right)) {
    adjacentNumbers.push(getFullNumberAttCoords(schema, row, col + 1));
  }

  // up
  const up = schema[row - 1]?.[col];
  if (isNumberChar(up)) {
    adjacentNumbers.push(getFullNumberAttCoords(schema, row - 1, col));
  } else {
    // up left
    const upLeft = schema[row - 1]?.[col - 1];
    if (isNumberChar(upLeft)) {
      adjacentNumbers.push(getFullNumberAttCoords(schema, row - 1, col - 1));
    }

    // up right
    const upRight = schema[row - 1]?.[col + 1];
    if (isNumberChar(upRight)) {
      adjacentNumbers.push(getFullNumberAttCoords(schema, row - 1, col + 1));
    }
  }

  // down
  const down = schema[row + 1]?.[col];
  if (isNumberChar(down)) {
    adjacentNumbers.push(getFullNumberAttCoords(schema, row + 1, col));
  } else {
    // down left
    const downLeft = schema[row + 1]?.[col - 1];
    if (isNumberChar(downLeft)) {
      adjacentNumbers.push(getFullNumberAttCoords(schema, row + 1, col - 1));
    }

    // down right
    const downRight = schema[row + 1]?.[col + 1];
    if (isNumberChar(downRight)) {
      adjacentNumbers.push(getFullNumberAttCoords(schema, row + 1, col + 1));
    }
  }

  return adjacentNumbers;
};

const processEngineParts = (schema: EngineSchema): number => {
  let sumOfPowers = 0;

  for (let row = 0; row < schema.length; row++) {
    let isPartNumber = false;
    let currentNumber = "";

    for (let col = 0; col < schema[row].length; col++) {
      const char = schema[row][col];
      const isNum = isNumberChar(char);
      const isLastInRow = col === schema[row].length - 1;

      if (isNum) {
        currentNumber = currentNumber + char;
        isPartNumber = isPartNumber || hasAdjacentSymbol(schema, row, col);
      }

      if (!isNum || isLastInRow) {
        if (currentNumber.length > 0) {
          if (isPartNumber) {
            sumOfPowers += +currentNumber;
          }
          currentNumber = "";
        }
        isPartNumber = false;
      }
    }
  }

  return sumOfPowers;
};

const processGears = (schema: EngineSchema): number => {
  let sumOfPowers = 0;

  for (let row = 0; row < schema.length; row++) {
    for (let col = 0; col < schema[row].length; col++) {
      const char = schema[row][col];
      if (char === "*") {
        const adjacentNumbers = getAdjacentNumbers(schema, row, col);

        if (adjacentNumbers.length === 2) {
          sumOfPowers += +adjacentNumbers[0] * +adjacentNumbers[1];
        }
      }
    }
  }

  return sumOfPowers;
};

const main = async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const matrix = lines.map(parseLine);
  // const sumOfPowers = processEngineParts(matrix);
  const sumOfGears = processGears(matrix);

  console.log("HERE:", sumOfGears);
};

main();
