const logger = (() => {
  let count = 1;

  const log = (...args: any[]) => {
    console.log(count++, ...args);
  };

  return {
    log,
  };
})();

const calcProduct = (arr: number[]) => {
  return arr.reduce((a, b) => a * b);
};

const calcSum = (arr: number[]) => {
  if (!arr.length) {
    return 0;
  }
  return arr.reduce((a, b) => a + b);
};

const calcCompartmentLoad = (weights: number[], compartments: number) => {
  return calcSum(weights) / compartments;
};

const findLoadCombos = (weights: number[], pLoad: number) => {
  const combos = new Map<string, number>();
  // const limit = 20;
  let shortestCombo = Infinity;
  let lastAddedAt = Date.now();
  let abortedAfter5Seconds = false;

  const findCombos = (_weights: number[], combo: number[] = []) => {
    if (combo.length > shortestCombo) {
      return;
    }

    if (Date.now() - lastAddedAt > 5000) {
      abortedAfter5Seconds = true;
      return;
    }

    const load = calcSum(combo);

    if (load > pLoad) {
      return;
    }

    if (load === pLoad) {
      combo.sort((a, b) => b - a);
      const comboHash = combo.join("-");
      const eq = calcProduct(combo); // TODO: track lowest QE / combo length
      if (!combos.has(comboHash)) {
        shortestCombo = Math.min(shortestCombo, combo.length);
        combos.set(comboHash, eq);
        lastAddedAt = Date.now();
      }
      return;
    }

    for (let i = 0; i < _weights.length; i++) {
      const newCombo = [...combo, _weights[i]];
      const newWeights = _weights.filter((_, j) => j !== i);
      findCombos(newWeights, newCombo);
    }
  };

  findCombos(weights);
  if (abortedAfter5Seconds) {
    logger.log("Couldn't find more combos for 5 seconds, aborting...");
  }
  logger.log("Found load combos:", combos.size);

  return combos;
};

const distributeLoad = (weights: number[], compartments: number) => {
  const pLoad = calcCompartmentLoad(weights, compartments);
  logger.log("Compartment load:", pLoad);

  const combos = findLoadCombos(weights, pLoad);
  return combos;
};

// Dummy BF
async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");

  const weights = lines.map(Number).sort((a, b) => b - a);
  logger.log("Weights:", weights);

  const combosMap = distributeLoad(weights, 4);

  const res = Array.from(combosMap).sort((a, b) => a[1] - b[1]);

  console.log(res.slice(0, 5));
}

main();
