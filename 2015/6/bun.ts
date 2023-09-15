type Point = [number, number];
type Grid = number[][];

const parseCmd = (cmdStr: string) => {
  const [x1, y1, x2, y2] = cmdStr
    .split("through")
    .join(",")
    .split(",")
    .map((s) => s.replace(/[^0-9]/g, ""))
    .map(Number);

  const cmd = cmdStr.startsWith("turn on")
    ? ("on" as const)
    : cmdStr.startsWith("turn off")
    ? ("off" as const)
    : ("toggle" as const);

  return { cmd, x1, y1, x2, y2 };
};

const traverseRect = (
  tl: Point,
  br: Point,
  lights: Grid,
  processor: (l: number) => number
) => {
  const [x1, y1] = tl;
  const [x2, y2] = br;

  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      lights[x][y] = processor(lights[x][y]);
    }
  }
};

const litLights = (input: string) => {
  const commands = input.split("\n");

  const lights: Grid = Array.from({ length: 1000 }, () =>
    Array.from({ length: 1000 }, () => 0)
  );

  commands.forEach((cmdStr) => {
    const { cmd, x1, y1, x2, y2 } = parseCmd(cmdStr);

    traverseRect([x1, y1], [x2, y2], lights, (l) => {
      switch (cmd) {
        case "on":
          return l + 1;
        case "off":
          return Math.max(0, l - 1);
        case "toggle":
          return l + 2;
      }
    });
  });

  return lights.flat().reduce((a, b) => a + b, 0);
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();

  console.log(litLights(input));
}

main();
