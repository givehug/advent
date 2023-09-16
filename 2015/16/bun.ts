type Aunt = {
  name: string;
  traits: Record<string, number>;
};

type AuntTraits = Record<string, number>;

const perfectAuntMatch = {
  children: (x: number) => x === 3,
  cats: (x: number) => x > 7,
  samoyeds: (x: number) => x === 2,
  pomeranians: (x: number) => x < 3,
  akitas: (x: number) => x === 0,
  vizslas: (x: number) => x === 0,
  goldfish: (x: number) => x < 5,
  trees: (x: number) => x > 3,
  cars: (x: number) => x === 2,
  perfumes: (x: number) => x === 1,
};

const parseLine = (line: string): Aunt => {
  try {
    line = line.replace(/Sue (\d+): /, "$1 * ");
    const [name, rest] = line.split(" * ");
    const pairs = rest.split(", ");
    const traits: AuntTraits = {};

    pairs.forEach((p) => {
      const [key, val] = p.split(": ");
      traits[key] = Number(val);
    });

    return {
      name,
      traits,
    };
  } catch (error) {
    console.log("failed", line);
    throw error;
  }
};

const matchTraits = (aunt: Aunt): boolean => {
  for (const key of Object.keys(perfectAuntMatch)) {
    if (key in aunt.traits) {
      const matcher = perfectAuntMatch[key];
      const match = matcher(aunt.traits[key]);
      if (!match) {
        return false;
      }
    }
  }
  return true;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const aunts = lines.map(parseLine);
  const suspects = aunts.filter(matchTraits);

  console.log(suspects);
}

main();
