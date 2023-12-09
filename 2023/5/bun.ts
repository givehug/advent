type ConversionScheme = [
  desRangeStart: number,
  srcRangeStart: number,
  rangeLen: number
];

type ConversionMap = Record<number, number>;

type Almanac = {
  "seed-to-soil map:": ConversionScheme[];
  "soil-to-fertilizer map:": ConversionScheme[];
  "fertilizer-to-water map:": ConversionScheme[];
  "water-to-light map:": ConversionScheme[];
  "light-to-temperature map:": ConversionScheme[];
  "temperature-to-humidity map:": ConversionScheme[];
  "humidity-to-location map:": ConversionScheme[];
};

const parseScheme = (line: string): ConversionScheme => {
  return line.split(" ").map(Number) as ConversionScheme;
};

const processScheme = (scheme: ConversionScheme, input: number): number => {
  const [desStart, srcStart, len] = scheme;
  if (input < srcStart) {
    return input;
  }
  if (input >= srcStart + len) {
    return input;
  }
  return desStart + (input - srcStart);
};

const processSchemes = (scheme: ConversionScheme[], input: number): number => {
  for (const s of scheme) {
    const result = processScheme(s, input);
    if (result !== input) {
      return result;
    }
  }
  return input;
};

const parseSeedsPart1 = (line: string): number[] => {
  return line.split(" ").slice(1).map(Number);
};

const processSeedsPart2 = (
  start: number,
  range: number,
  almanac: Almanac
): number => {
  let minLoc = Infinity;
  for (let seed = start; seed < start + range; seed++) {
    const loc = finLocation(almanac, seed);
    minLoc = Math.min(minLoc, loc);
  }
  return minLoc;
};

const parseAlmanac = (lines: string[]): Almanac => {
  const almanac: Almanac = {
    "seed-to-soil map:": [],
    "soil-to-fertilizer map:": [],
    "fertilizer-to-water map:": [],
    "water-to-light map:": [],
    "light-to-temperature map:": [],
    "temperature-to-humidity map:": [],
    "humidity-to-location map:": [],
  };

  let currentScheme = "seed-to-soil map:" as keyof Almanac;

  for (const line of lines.slice(2)) {
    if (line.endsWith("map:")) {
      currentScheme = line as keyof Almanac;
      continue;
    }
    almanac[currentScheme].push(parseScheme(line));
  }

  return almanac;
};

const finLocation = (almanac: Almanac, seed: number): number => {
  const soil = processSchemes(almanac["seed-to-soil map:"], seed);
  const fertilizer = processSchemes(almanac["soil-to-fertilizer map:"], soil);
  const water = processSchemes(almanac["fertilizer-to-water map:"], fertilizer);
  const light = processSchemes(almanac["water-to-light map:"], water);
  const temperature = processSchemes(
    almanac["light-to-temperature map:"],
    light
  );
  const humidity = processSchemes(
    almanac["temperature-to-humidity map:"],
    temperature
  );
  const location = processSchemes(
    almanac["humidity-to-location map:"],
    humidity
  );
  return location;
};

const main = async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n").filter(Boolean);
  const almanac = parseAlmanac(lines);
  const [_, __, start, range] = Bun.argv.map(Number);

  // P1
  // const seeds = parseSeedsPart1(lines[0]);
  // const locations = seeds.map((seed) => finLocation(almanac, seed));
  // const minLoc = Math.min(...locations);

  // P2 Done by distributed brute force for each pair of start and range
  // const minLoc = processSeedsPart2(start, range, almanac);
};

main();
