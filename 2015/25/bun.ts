const firstCode = 20151125;

const calcNextCode = (code: number): number => {
  return (code * 252533) % 33554393;
};

const findCodePosition = (row: number, column: number): number => {
  let r = 1;
  let firstCol = 1;
  while (r < row) {
    firstCol += r;
    r++;
  }

  let codePos = firstCol;
  let c = 1;
  while (c < column) {
    codePos += r + c;
    c++;
  }

  return codePos;
};

const calcCodeAtPosition = (codePos: number): number => {
  let code = firstCode;
  let i = 1;
  while (i < codePos) {
    code = calcNextCode(code);
    i++;
  }
  return code;
};

async function main() {
  const codePos = findCodePosition(3010, 3019);
  const code = calcCodeAtPosition(codePos);

  console.log(code);
}

main();
