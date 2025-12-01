import fs from "fs";

// variable que almacena el resultado
let iPassword = 0;
let iActualDialStep = 50;

// función que hace las rotaciones
const dialCalc = (iStep, sMovement) => {
  const dir = sMovement.substring(0, 1);
  let dist = parseInt(sMovement.substring(1), 10);

  let returned = iStep;
  if (dir === "R") {
    while (dist > 0) {
      returned++;
      if (returned === 100) {
        returned = 0;
        iPassword++;
      }
      dist--;
    }
  } else {
    while (dist > 0) {
      returned--;
      if (returned === -1) {
        returned = 99;
      }
      if (returned === 0) iPassword++;
      dist--;
    }
  }
  return returned;
};

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada línea
const lines = fileContent.split("\n");
for (const line of lines) {
  if (line.trim()) {
    iActualDialStep = dialCalc(iActualDialStep, line);
  }
}

console.log(iPassword);
