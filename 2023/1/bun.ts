const wordToNum = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const numWords = Object.keys(wordToNum);
const numStrings = Object.values(wordToNum);

type WordPosition = { word: string; position: number };

const allIndexes = (str: string, word: string): WordPosition[] => {
  const reg = new RegExp(word, "gi");
  return [...str.matchAll(reg)]
    .map((a) => ({
      word,
      position: a.index ?? -1,
    }))
    .filter((a) => a.position > -1);
};

const extractNumsFromString = (str: string) => {
  const words = [...numWords, ...numStrings];
  const positions: WordPosition[] = [];

  words.forEach((word) => {
    const indexes = allIndexes(str, word);
    positions.push(...indexes);
  });

  positions.sort((a, b) => a.position - b.position);

  return positions.map((p) => p.word);
};

const parseLine = (line: string): number => {
  const numWords = extractNumsFromString(line);

  const firstNum = numWords.at(0) ?? "0";
  const lastNum = numWords.at(-1) ?? "0";

  const first = wordToNum[firstNum] ?? firstNum;
  const last = wordToNum[lastNum] ?? lastNum;

  const num = Number(first + last);

  return num;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const nums = lines.map(parseLine);
  const totalSum = nums.reduce((acc, num) => acc + num, 0);

  console.log("HERE:", totalSum);
}

main();
