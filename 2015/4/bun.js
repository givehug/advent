const crypto = require("crypto");

const mineAdventCoin = (secretKey, difficulty) => {
  let count = 0;
  let hash = "";
  let saneLimit = 1000000000;
  const difficultyString = "0".repeat(difficulty);

  while (count < saneLimit) {
    hash = crypto
      .createHash("md5")
      .update(`${secretKey}${count}`)
      .digest("hex");

    if (hash.startsWith(difficultyString)) {
      return { count, hash, found: true, secretKey };
    }

    count++;
  }

  return { count, hash, found: false, secretKey };
};

async function main() {
  console.log(mineAdventCoin(Bun.argv[2], Bun.argv[3]));
}

main();

// Bun:
// diff: 5 -> 0.16s
// diff: 6 -> 4.46s
// diff: 7 -> 25.38s

// Node:
// diff: 5 -> 0.33s
// diff: 6 -> 10.49s
// diff: 7 -> 57.32s
