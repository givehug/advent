async function main() {
  const file = Bun.file("input.json");
  const input = await file.text();
  let out = 0;

  const omitRed = JSON.parse(input, (_: any, val: any) => {
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      if (Object.values(val).includes("red")) {
        return null;
      }
    }
    return val;
  });

  JSON.stringify(omitRed, (_: any, val: any) => {
    if (typeof val === "number") {
      out += val;
    }
    return val;
  });

  console.log(out);
}

main();
