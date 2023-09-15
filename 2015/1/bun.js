const calculateFloors = (input) => {
  let floor = 0;

  for (const char of input) {
    if (char === "(") {
      floor++;
    } else if (char === ")") {
      floor--;
    }
  }

  return floor;
};

async function main() {
  const file = Bun.file("input.txt");
  const textInput = await file.text();

  console.log(calculateFloors(textInput));
}

main();
