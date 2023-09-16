const lookAndSay = (input: string) => {
  let seq = input[0];
  let out = "";

  for (let i = 1; i < input.length; i++) {
    const char = input[i];

    if (seq[0] === char) {
      seq += char;
    } else {
      out += `${seq.length}${seq[0]}`;
      seq = char;
    }
  }
  out += `${seq.length}${seq[0]}`;

  return out;
};

async function main() {
  const res = Array.from({ length: 50 }).reduce<string>(
    (final) => lookAndSay(final),
    "1113122113"
  );

  console.log(res.length);
}

main();
