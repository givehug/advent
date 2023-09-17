const calcQuantumEntanglement = (arr: number[]) => {
  return arr.reduce((a, b) => a * b);
};

const calcLoad = (arr: number[]) => {
  return arr.reduce((a, b) => a + b);
};

const isLoadEqual = (...compartments: number[][]) => {
  return compartments.every(
    (cpt) => calcLoad(cpt) === calcLoad(compartments[0])
  );
};

const distributeLoad = (weights: number[]) => {
  const p1: number[] = [];
  const p2: number[] = [];
  const p3: number[] = [];
  const history: any = [];

  // demo 1
  // p1.push(11, 9);
  // p2.push(10, 8, 2);
  // p3.push(7, 5, 4, 3, 1);

  // demo 2
  // p1.push(10, 9, 1);
  // p2.push(11, 7, 2);
  // p3.push(8, 5, 4, 3);

  // while (true) {
  if (isLoadEqual(p1, p2, p3)) {
    history.push({ p1, p2, p3, qe: calcQuantumEntanglement(p1) });
  }
  // }

  return history;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const weights = lines.map(Number);

  const res = distributeLoad(weights);

  console.log(res);
}

main();
