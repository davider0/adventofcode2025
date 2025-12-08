import fs from "fs";

// contador de números de ID frescos
let freshIDsCount = 0n;

// necesitaremos una función para calcular el mínimo y máximo de un array de BigInts
const bigIntMinAndMax = (...args) => {
  return args.reduce(
    ([min, max], e) => {
      return [e < min ? e : min, e > max ? e : max];
    },
    [args[0], args[0]]
  );
};

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada elemento
const lines = fileContent.split("\n\n");
let sIDRanges = lines[0];
let IDRanges = sIDRanges.split("\n");

let isOverlapping = false;
for (let i = 0; i < IDRanges.length; i++) {
  if (IDRanges[i] === undefined) {
    continue;
  }
  isOverlapping = false;
  let range1 = IDRanges[i].split("-").map((str) => BigInt(str));

  for (let j = i + 1; j < IDRanges.length; j++) {
    if (IDRanges[j] === undefined || IDRanges[i] === undefined) {
      continue;
    }

    let range2 = IDRanges[j].split("-").map((str) => BigInt(str));
    isOverlapping = range1[0] <= range2[1] && range2[0] <= range1[1];
    if (isOverlapping) {
      const [min, max] = bigIntMinAndMax(...range1, ...range2);
      IDRanges[i] = min + "-" + max;
      range1 = IDRanges[i].split("-").map((str) => BigInt(str));
      IDRanges.splice(j, 1);
    }
  }

  freshIDsCount += range1[1] - range1[0] + 1n;
}

console.log(freshIDsCount.toString());
