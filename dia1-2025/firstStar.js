import fs from "fs";

// variable que almacena el resultado
let iPassword = 0;
let iActualDialStep = 50;

// función que hace las rotaciones
const dialCalc = (iStep, sMovement) => {
  let factor = sMovement.substring(0, 1) == "R" ? 1 : -1;

  let step = parseInt(sMovement.substring(1, sMovement.length));

  let returned = iStep + factor * step;
  while (returned < 0 || returned > 99) {
    returned =
      returned < 0 ? returned + 100 : returned > 99 ? returned - 100 : returned;
  }
  if (returned == 0) iPassword++;
  return returned;
};

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada línea
const lines = fileContent.split("\n");
for (const line of lines) {
  if (line.trim()) {
    if (
      parseInt(line.substring(1, line.length)) > 99 ||
      parseInt(line.substring(1, line.length)) < 0
    ) {
      console.log(iActualDialStep);
    }
    iActualDialStep = dialCalc(iActualDialStep, line);
    if (
      parseInt(line.substring(1, line.length)) > 99 ||
      parseInt(line.substring(1, line.length)) < 0
    ) {
      console.log(line);
      console.log(iActualDialStep);
    }
  }
}

console.log(iPassword);
