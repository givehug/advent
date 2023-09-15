const calculateFloors = (input) => {
  let floor = 0;
  let basementEnteredAt = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === "(") {
      floor++;
    } else if (char === ")") {
      floor--;
    }
    if (floor === -1 && basementEnteredAt === null) {
      basementEnteredAt = i + 1;
    }
  }

  return { floor, basementEnteredAt };
};

async function main() {
  const file = Bun.file("input.txt");
  const textInput = await file.text();

  console.log(calculateFloors(textInput));
}

main();
