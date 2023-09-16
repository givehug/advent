type Replacement = [from: string, to: string];

const parseLine = (line: string): Replacement => {
  const [from, to] = line.split(" => ");
  return [from, to];
};

const findMolecules = (input: string, replacements: Replacement[]) => {
  const out = new Set<string>();

  for (let i = 0; i < input.length; i++) {
    replacements.forEach(([from, to]) => {
      if (input.slice(i).startsWith(from)) {
        const newMoc = input.slice(0, i) + to + input.slice(i + from.length);
        out.add(newMoc);
      }
    });
  }

  return out;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const replacements = lines.map(parseLine);

  const molecules = findMolecules(
    "CRnCaCaCaSiRnBPTiMgArSiRnSiRnMgArSiRnCaFArTiTiBSiThFYCaFArCaCaSiThCaPBSiThSiThCaCaPTiRnPBSiThRnFArArCaCaSiThCaSiThSiRnMgArCaPTiBPRnFArSiThCaSiRnFArBCaSiRnCaPRnFArPMgYCaFArCaPTiTiTiBPBSiThCaPTiBPBSiRnFArBPBSiRnCaFArBPRnSiRnFArRnSiRnBFArCaFArCaCaCaSiThSiThCaCaPBPTiTiRnFArCaPTiBSiAlArPBCaCaCaCaCaSiRnMgArCaSiThFArThCaSiThCaSiRnCaFYCaSiRnFYFArFArCaSiRnFYFArCaSiRnBPMgArSiThPRnFArCaSiRnFArTiRnSiRnFYFArCaSiRnBFArCaSiRnTiMgArSiThCaSiThCaFArPRnFArSiRnFArTiTiTiTiBCaCaSiRnCaCaFYFArSiThCaPTiBPTiBCaSiThSiRnMgArCaF",
    replacements
  );

  console.log(molecules.size);
}

main();
