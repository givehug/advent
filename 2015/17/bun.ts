const fillInContainers = (
  containers: number[],
  vol: number,
  combos: number[][],
  currCombo: number[]
) => {
  for (let i = 0; i < containers.length; i++) {
    const c = containers[i];
    if (c > vol) {
      continue;
    }
    if (c === vol) {
      combos.push([...currCombo, c]);
      continue;
    }
    fillInContainers(containers.slice(i + 1), vol - c, combos, [
      ...currCombo,
      c,
    ]);
  }
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const containers = lines.map(Number).sort((a, b) => b - a);

  const combos: number[][] = [];
  fillInContainers(containers, 150, combos, []);

  combos.sort((a, b) => a.length - b.length);

  const minLen = combos[0].length;
  const minLenContainers = combos.filter((cb) => cb.length === minLen);

  console.log(minLenContainers.length);
}

main();
