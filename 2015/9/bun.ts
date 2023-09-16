type City = string;

type Path = [from: City, to: City, distance: number];

type Route = Path[];

const parseLine = (line: string): Path => {
  const [from, _, to, __, distance] = line.split(" ");
  return [from, to, Number(distance)];
};

// BF
const findAllRoutes = (lines: string[]) => {
  const initialPaths = lines.map(parseLine);
  const reversedPaths: Path[] = initialPaths.map((p) => [p[1], p[0], p[2]]);
  const paths = [...initialPaths, ...reversedPaths];

  const cities = new Set(paths.map((p) => p[0]));

  const allRoutes: Route[] = [];

  const walk = (route: Route) => {
    const last = route[route.length - 1];

    if (route.length === cities.size - 1) {
      allRoutes.push(route);
    }

    const nextPaths = paths.filter((p) => p[0] === last[1]);

    nextPaths.forEach((p) => {
      if (route.some((r) => r[0] === p[1])) {
        return;
      }
      walk([...route, p]);
    });
  };

  paths.forEach((p) => walk([p]));

  return allRoutes;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");

  const allRoutes = findAllRoutes(lines);

  const allDistances = allRoutes.map((route) =>
    route.reduce((acc, path) => acc + path[2], 0)
  );

  const shortest = Math.min(...allDistances);
  const longest = Math.max(...allDistances);

  console.log(shortest, longest);
}

main();
