const decodeString = (s: string) => {
  if (typeof s !== "string") throw new Error("Invalid string" + s);
  const codChars = s.split("");
  const memChars: string[] = [];

  let i = 1;
  while (i < codChars.length - 1) {
    const char = codChars[i];
    if (char === "\\") {
      if (codChars[i + 1] === '"') {
        memChars.push('"');
        i += 2;
        continue;
      }
      if (codChars[i + 1] === "\\") {
        memChars.push("\\");
        i += 2;
        continue;
      }
      if (codChars[i + 1] === "x") {
        const decimalValue = parseInt(codChars[i + 2] + codChars[i + 3], 16);
        memChars.push(String.fromCharCode(decimalValue));
        i += 4;
        continue;
      }
    } else {
      memChars.push(char);
      i++;
      continue;
    }
  }

  const joined = codChars.join("");
  const encodedChars = [`"`];
  for (const char of joined) {
    if (char === `"`) {
      encodedChars.push(`\\`);
      encodedChars.push(`\"`);
      continue;
    }
    if (char === `\\`) {
      encodedChars.push(`\\`);
      encodedChars.push(`\\`);
      continue;
    }
    encodedChars.push(char);
  }
  encodedChars.push(`"`);

  const out = {
    codChars,
    memChars,
    encodedChars,
  };

  return out;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");

  const total = lines.reduce(
    (acc, line) => {
      const decoded = decodeString(line);
      return {
        codChars: acc.codChars + decoded.codChars.length,
        memChars: acc.memChars + decoded.memChars.length,
        encodedChars: acc.encodedChars + decoded.encodedChars.length,
      };
    },
    { codChars: 0, memChars: 0, encodedChars: 0 }
  );

  console.log(total.encodedChars - total.codChars);
}

main();
