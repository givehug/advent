const isNiceStringPart1 = (str) => {
  let vowels = 0;
  let hasConsequentLetter = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (nextChar && ["ab", "cd", "pq", "xy"].includes(char + nextChar)) {
      return false;
    }
    if ("aeiou".includes(char)) {
      vowels++;
    }
    if (char === nextChar) {
      hasConsequentLetter = true;
    }
  }

  return vowels >= 3 && hasConsequentLetter;
};

const isNiceStringPart2 = (str) => {
  let hasRepeatAfterNext = false;
  let hasRepeatingPair = false;

  const pairs = {};
  let pair = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];
    const charAfterNext = str[i + 2];
    const nextPair = `${char}${nextChar ?? ""}`;

    if (!hasRepeatAfterNext && char === charAfterNext) {
      hasRepeatAfterNext = true;
    }
    if (!hasRepeatingPair && pair !== nextPair) {
      pair = nextPair;
      pairs[pair] = (pairs[pair] ?? 0) + 1;
      if (pairs[pair] >= 2) {
        hasRepeatingPair = true;
      }
    }
    if (hasRepeatAfterNext && hasRepeatingPair) {
      return true;
    }
  }

  return false;
};

const calculateNiceStrings = (input) => {
  const lines = input.split("\n");
  let count = 0;

  for (const line of lines) {
    if (isNiceStringPart2(line)) {
      count++;
    }
  }

  return count;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();

  console.log(calculateNiceStrings(input));
}

main();
