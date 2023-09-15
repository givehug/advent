/**
 * How many total square feet of wrapping paper should they order?
 */
const calculateOrder = (input) => {
  const lines = input.split("\n");
  let totalPaper = 0;
  let totalRibbon = 0;

  for (const line of lines) {
    const [l, w, h] = line.split("x").map(Number);

    const smallestArea = Math.min(l * w, l * h, h * w);
    const totalArea = 2 * l * w + 2 * w * h + 2 * h * l;
    const smallestPerimeter = Math.min((l + w) * 2, (l + h) * 2, (h + w) * 2);
    const volume = l * w * h;

    const extraPaper = smallestArea;
    totalPaper += totalArea + extraPaper;

    const bowRibbon = volume;
    totalRibbon += smallestPerimeter + bowRibbon;
  }

  return { totalPaper, totalRibbon };
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();

  console.log(calculateOrder(input));
}

main();
