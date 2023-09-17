type CMD = {
  name: string;
  register: string;
  offset?: number;
};

const parseLine = (line: string): CMD => {
  let [rest, offset] = line.split(", ");
  const [name, register] = rest.split(" ");

  if (name === "jmp") {
    offset = register;
  }

  return {
    name,
    register,
    offset: offset ? Number(offset) : undefined,
  };
};

const runCmds = (cmds: CMD[]) => {
  const regs = { a: 1, b: 0 };

  let i = 0;
  while (i < cmds.length) {
    const cmd = cmds[i];

    switch (cmd.name) {
      case "hlf":
        {
          regs[cmd.register] = regs[cmd.register] / 2;
          i++;
        }
        break;
      case "tpl":
        {
          regs[cmd.register] = regs[cmd.register] * 3;
          i++;
        }
        break;
      case "inc":
        {
          regs[cmd.register]++;
          i++;
        }
        break;
      case "jmp":
        i += cmd.offset!;
        break;
      case "jie":
        {
          if (regs[cmd.register] % 2 === 0) {
            i += cmd.offset!;
          } else {
            i++;
          }
        }
        break;
      case "jio":
        {
          if (regs[cmd.register] === 1) {
            i += cmd.offset!;
          } else {
            i++;
          }
        }
        break;
      default:
        throw new Error("no such command: " + cmd.name);
    }
  }

  return regs;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const cmds = lines.map(parseLine);

  const res = runCmds(cmds);

  console.log(res);
}

main();
