const crypto = require("crypto");

const getPassword = (input, difficulty) => {
  let count = 0;
  let hash = "";
  let saneLimit = 1000000000;
  const difficultyString = "0".repeat(difficulty);
  const foundHashes = [];

  while (count < saneLimit && foundHashes.length < 8) {
    hash = crypto.createHash("md5").update(`${input}${count}`).digest("hex");

    if (hash.startsWith(difficultyString)) {
      foundHashes.push({ count, hash, found: true, input });
    }

    count++;
  }

  return foundHashes.map((x) => x.hash[5]).join("");
};

async function main() {
  console.log(getPassword("uqwqemis", 5));
}

main();
