import fs from "fs";
// total de los elementos
let iResult = 0;
// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada elemento
let [row1, row2, row3, row4, operations] = fileContent.split("\n");
let matrix = [
  row1
    .split(" ")
    .map((str) => parseInt(str))
    .filter(Boolean),
  row2
    .split(" ")
    .map((str) => parseInt(str))
    .filter(Boolean),
  row3
    .split(" ")
    .map((str) => parseInt(str))
    .filter(Boolean),
  row4
    .split(" ")
    .map((str) => parseInt(str))
    .filter(Boolean),
];
console.log(
  matrix[0].length +
    ", " +
    matrix[1].length +
    ", " +
    matrix[2].length +
    ", " +
    matrix[3].length
);
let operationsVector = operations.split(" ").filter(Boolean);

let auxArr;
for (let i = 0; i < matrix[0].length; i++) {
  auxArr = [matrix[0][i], matrix[1][i], matrix[2][i], matrix[3][i]];
  if (auxArr) {
    console.log(auxArr);
  }
  iResult += auxArr.reduce((a, b) => {
    if (operationsVector[i] == "+") return a + b;
    else if (operationsVector[i] == `*`) return a * b;
  });
}

console.log(iResult);
