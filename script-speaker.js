const { spawn, spawnSync } = require("child_process");
const fs = require("fs");

const file = process.argv[2];

const script = fs
  .readFileSync(file)
  .toString("utf-8")
  .split("\n");

let voices = ["daniel"];

const regex = [
  /([A-Z][a-zA-Z. ]+):/,
  /([A-Z][a-zA-Z. ]+) and ([A-Z][a-zA-Z. ]+):/,
  /([A-Z][a-zA-Z. ]+), ([A-Z][a-zA-Z. ]+) and ([A-Z][a-zA-Z. ]+):/
];

script.forEach(line => {
  const results = regex.map(r => r.exec(line));
  let names = [];
  if (results[2]) {
    names = [results[2][1], results[2][2], results[2][3]];
    line = line.replace(results[2][0], "");
  } else if (results[1]) {
    names = [results[1][1], results[1][2]];
    line = line.replace(results[1][0], "");
  } else if (results[0]) {
    names = [results[0][1]];
    line = line.replace(results[0][0], "");
  }

  if (names.length === 0) {
    return;
  };

  voices = names.map(name => {
    switch (name) {
      case "SpongeBob":
        return "junior";
      case "Squidward":
        return "daniel";
      case "French Narrator":
        return "thomas";
      case "Mr. Krabs":
        return "ralph";
      case "Hervy":
      case "The Unnamed Guy":
        return "bruce";
      case "Patrick":
        line = `[[pbas 40]] ${line}`;
        return "fred";
      case "Plankton":
        line = `[[pbas 55]] ${line}`;
        return "alex";
      default:
        return "alex";
    }
  });

  if (voices.length > 1) {
    console.log(`${voices[1]} says ${line}`);
    spawn("say", ["-v", voices[1], line]);
  }
  if (voices.length > 2) {
    console.log(`${voices[2]} says ${line}`);
    spawn("say", ["-v", voices[2], line]);
  }
  console.log(`${voices[0]} says ${line}`);
  spawnSync("say", ["-v", voices[0], line]);
});
