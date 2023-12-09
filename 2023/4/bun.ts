type Card = {
  winningNumbers: number[];
  playerNumbers: number[];
  myWinningNumbers: number[];
};

const parseLine = (line: string): Card => {
  const [left, right] = line.split(":")[1].split("|");
  const winningNumbers = left
    .split(" ")
    .filter(Boolean)
    .map((n) => parseInt(n.trim(), 10));
  const playerNumbers = right
    .split(" ")
    .filter(Boolean)
    .map((n) => parseInt(n.trim(), 10));

  const myWinningNumbers = playerNumbers.filter((x) =>
    winningNumbers.includes(x)
  );

  return {
    winningNumbers,
    playerNumbers,
    myWinningNumbers,
  };
};

const calcCardPoints = (card: Card): number => {
  const { winningNumbers, playerNumbers } = card;
  const winningPlayerNumbers = playerNumbers.filter((x) =>
    winningNumbers.includes(x)
  );
  if (winningPlayerNumbers.length > 0) {
    return 2 ** (winningPlayerNumbers.length - 1);
  }
  return 0;
};

const sum = (...nums: number[]): number => nums.reduce((a, b) => a + b, 0);

const pileUpCards = (cards: Card[]) => {
  const buckets: number[][] = Array.from({ length: cards.length }, (_, idx) => [
    idx,
  ]);

  let cardNum = 0;
  while (cardNum < buckets.length) {
    const buck = buckets[cardNum];

    buck.forEach(() => {
      const card = cards[cardNum];
      const { myWinningNumbers } = card;

      myWinningNumbers.forEach((_, idx) => {
        const nextCardNum = idx + cardNum + 1;
        buckets[nextCardNum].push(nextCardNum);
      });
    });

    cardNum++;
  }

  return buckets;
};

const main = async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const cards = lines.map(parseLine);
  // const allPoints = sum(...cards.map(calcCardPoints));
  const buckets = pileUpCards(cards);
  const cardos = buckets.flat();

  console.log("HERE:", cardos.length);
};

main();
