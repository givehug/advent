type Arg = string;

type Command =
  | {
      name: "signal";
      x: Arg;
      wire: string;
    }
  | {
      name: "and";
      x: Arg;
      y: Arg;
      wire: string;
    }
  | {
      name: "or";
      x: Arg;
      y: Arg;
      wire: string;
    }
  | {
      name: "not";
      x: Arg;
      wire: string;
    }
  | {
      name: "lshift";
      x: Arg;
      bits: number;
      wire: string;
    }
  | {
      name: "rshift";
      x: Arg;
      bits: number;
      wire: string;
    };

const parseCmd = (cmdStr: string): Command => {
  const [cmd, wire] = cmdStr.split(" -> ");

  if (cmd.includes("NOT")) {
    const [, x] = cmd.split("NOT ");
    return { name: "not", x, wire };
  }

  if (cmd.includes("AND")) {
    const [x, y] = cmd.split(" AND ");
    return { name: "and", x, y, wire };
  }

  if (cmd.includes("OR")) {
    const [x, y] = cmd.split(" OR ");
    return { name: "or", x, y, wire };
  }

  if (cmd.includes("LSHIFT")) {
    const [x, y] = cmd.split(" LSHIFT ");
    return { name: "lshift", x, bits: parseInt(y), wire };
  }

  if (cmd.includes("RSHIFT")) {
    const [x, y] = cmd.split(" RSHIFT ");
    return { name: "rshift", x, bits: parseInt(y), wire };
  }

  return { name: "signal", x: cmd, wire };
};

const processCmd = (wires: Map<string, number>, cmd: Command): void => {
  const get = (wire: string): number => {
    const parsed = parseInt(wire);
    if (!isNaN(parsed)) {
      return parsed;
    }

    if (wires.has(wire)) {
      return wires.get(wire)!;
    }

    throw new Error(`Wire ${wire} not found`);
  };

  const set = (wire: string, signal: number) => wires.set(wire, u16(signal));

  switch (cmd.name) {
    case "signal":
      set(cmd.wire, get(cmd.x));
      break;
    case "and":
      set(cmd.wire, get(cmd.x) & get(cmd.y));
      break;
    case "or":
      set(cmd.wire, get(cmd.x) | get(cmd.y));
      break;
    case "not":
      set(cmd.wire, ~get(cmd.x));
      break;
    case "lshift":
      set(cmd.wire, get(cmd.x) << cmd.bits);
      break;
    case "rshift":
      set(cmd.wire, get(cmd.x) >> cmd.bits);
      break;
    default:
      break;
  }
};

const u16 = (n: number): number => n & 0xffff;

const connectWires = (input: string): Map<string, number> => {
  const commands = input.split("\n").map(parseCmd);
  const wires = new Map<string, number>();

  // part 1
  // dummy cyclic loop until all commands are processed
  const allCommands = [...commands];
  while (allCommands.length) {
    const cmd = allCommands.shift()!;
    try {
      processCmd(wires, cmd);
      if (cmd.wire === "a") {
        break;
      }
    } catch {
      allCommands.push(cmd);
    }
  }

  // part 2
  const a = wires.get("a")!;
  wires.clear();
  wires.set("b", a);

  const commandsExceptB = commands.filter((cmd) => cmd.wire !== "b");
  while (commandsExceptB.length) {
    const cmd = commandsExceptB.shift()!;
    try {
      processCmd(wires, cmd);
      if (cmd.wire === "a") {
        break;
      }
    } catch {
      commandsExceptB.push(cmd);
    }
  }

  return wires;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();

  const wires = connectWires(input);

  console.log(wires.get("a"));
}

main();
