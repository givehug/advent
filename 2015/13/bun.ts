type Person = string;
type Neighbor = string;
type Happiness = number;

type Link = [person: Person, neighbor: Neighbor, happiness: Happiness];

type HappinessMap = Record<Person, Record<Neighbor, Happiness>>;

type TableSitting = Person[];

const parseLine = (line: string): Link => {
  const words = line.replace(/\.$/, "").split(" ");
  const person = words[0];
  const neighbor = words[words.length - 1];
  const sign = words[2] === "gain" ? 1 : -1;
  const happiness = sign * Number(words[3]);

  return [person, neighbor, happiness];
};

const buildHappinessMap = (links: Link[]): [HappinessMap, TableSitting] => {
  const map: HappinessMap = {};

  links.forEach(([person, neighbor, happiness]) => {
    if (!map[person]) {
      map[person] = {};
    }
    map[person][neighbor] = happiness;
  });

  const people = Object.keys(map);

  return [map, people];
};

const calcTableHappiness = (table: TableSitting, map: HappinessMap) => {
  let happiness = 0;

  table.forEach((person, i) => {
    const left = table[i - 1] ?? table[table.length - 1];
    const right = table[i + 1] ?? table[0];

    happiness += map[person][left];
    happiness += map[person][right];
  });

  return happiness;
};

const findAllPossibleSittingCombinations = (
  table: TableSitting
): TableSitting[] => {
  const combinations: TableSitting[] = [];

  const permute = (arr: TableSitting, m: TableSitting = []) => {
    if (arr.length === 0) {
      combinations.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(table);

  return combinations;
};

const findBestSitting = (links: Link[]) => {
  const [map, people] = buildHappinessMap(links);
  const tables = findAllPossibleSittingCombinations(people);

  let bestHappiness = -Infinity;
  let bestTable = people;

  tables.forEach((table) => {
    const happiness = calcTableHappiness(table, map);

    if (happiness > bestHappiness) {
      bestHappiness = happiness;
      bestTable = table;
    }
  });

  return [bestTable, bestHappiness];
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const links = lines.map(parseLine);

  const bestSitting = findBestSitting(links);

  console.log(bestSitting);
}

main();
