const validate = (input: string): boolean => {
  // - exactly 8 letters
  if (input.length !== 8) {
    return false;
  }

  let hasStraight = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // - lower case letters (a-z)
    if (char < "a" || char > "z") {
      return false;
    }

    // - no i, o, l
    if (char === "i" || char === "o" || char === "l") {
      return false;
    }

    // - straight of 3 letters
    if (!hasStraight && i > 1) {
      const prev = input[i - 1];
      const prevPrev = input[i - 2];

      if (
        char.charCodeAt(0) - prev.charCodeAt(0) === 1 &&
        prev.charCodeAt(0) - prevPrev.charCodeAt(0) === 1
      ) {
        hasStraight = true;
      }
    }
  }

  let pairs = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // - 2 pairs
    if (i > 0) {
      const prev = input[i - 1];

      if (char === prev) {
        pairs++;
        i++;
      }
    }
  }
  return hasStraight && pairs >= 2;
};

const increment = (input: string): string => {
  for (let i = input.length - 1; i >= 0; i--) {
    const char = input[i];
    const prev = input[i - 1];

    if (char === "z") {
      if (prev === "z") {
        continue;
      } else {
        return (
          input.slice(0, i - 1) +
          String.fromCharCode(prev.charCodeAt(0) + 1) +
          "a".repeat(input.length - i)
        );
      }
    } else {
      return (
        input.slice(0, i) +
        String.fromCharCode(char.charCodeAt(0) + 1) +
        "a".repeat(input.length - i - 1)
      );
    }
  }

  return input;
};

const generateNewPassword = (input: string): string => {
  let pass = input;
  let valid = false;
  while (!valid) {
    pass = increment(pass);
    valid = validate(pass);
  }
  return pass;
};

async function main() {
  const newPass = generateNewPassword("cqjxjnds");
  const nextPass = generateNewPassword(newPass);

  console.log(newPass, nextPass);
}

main();
