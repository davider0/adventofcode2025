import fs from "fs";

// almacena el conteo de los IDs válidos
let iCountOfFreshIDs = 0;

const isInRange = (nNumber, strRange) => {
  let range = strRange.split("-").map((str) => BigInt(str));
  return nNumber >= range[0] && nNumber <= range[1];
};

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada elemento
const lines = fileContent.split("\n\n");
let [sIDRanges, sNumbers] = [lines[0], lines[1]];
let IDRanges = sIDRanges.split("\n");
let numbers = sNumbers.split("\n").map((str) => BigInt(str));

for (let i = 0; i <= numbers.length; i++) {
  iCountOfFreshIDs += IDRanges.some((IDRange) => isInRange(numbers[i], IDRange))
    ? 1
    : 0;
}

console.log(iCountOfFreshIDs);
