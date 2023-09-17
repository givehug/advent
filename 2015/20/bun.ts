const calcHouses = (len: number) => {
  const houses = Array.from({ length: len }, (_, i) => i + 1);

  houses.forEach((houseNo, i) => {
    let housePresents = 0;
    let elfNo = houseNo;

    while (elfNo > 0) {
      if (houseNo % elfNo === 0) {
        housePresents += elfNo * 10;
      }
      elfNo--;
    }

    houses[i] = housePresents;
  });

  return houses;
};

const doesElfDeliver = (elfNo: number, houseNo: number) => {
  return elfNo * 50 >= houseNo;
};

const findLowestHouseNo = (presents: number) => {
  let houseNo = 0;
  let housePresents = 0;

  while (housePresents < presents) {
    housePresents = 0;
    houseNo++;

    let elfNo = 1;

    while (elfNo <= houseNo) {
      if (houseNo % elfNo === 0 && doesElfDeliver(elfNo, houseNo)) {
        housePresents += elfNo * 11;
      }
      elfNo++;
    }
  }

  return houseNo;
};

// bun run bun.ts  137.69s
async function main() {
  // 29000000 -> 665280
  // 290000 -> 7920
  const out = findLowestHouseNo(29000000);

  console.log(out);
}

main();
