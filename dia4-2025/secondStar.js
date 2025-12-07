import fs from "fs";

// almacena los números máximos de cada línea (juntos) 🎄
let iCountOfPulledGiftPaper = 0;

// añadir un método a la clase String que reemplaza según el índice
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

// función que encuentra el papel de regalo al que puede acceder el forklift o como se llame, y las reemplaza por X
const iCountOfGiftPaperPerLine = (arrayLines, iIteration) => {
  const upper = iIteration != 0 ? arrayLines[iIteration - 1] : null;
  const lower =
    iIteration != arrayLines.length - 1 ? arrayLines[iIteration + 1] : null;
  const middle = arrayLines[iIteration].split("");

  let total = 0;
  const add = (arr, idx) =>
    arr && idx >= 0 && idx < arr.length && arr[idx] === "@" ? 1 : 0;
  for (let j = 0; j < middle.length; j++) {
    if (middle[j] !== "@") continue;
    let vecinos = 0;
    vecinos += add(upper, j - 1) + add(upper, j) + add(upper, j + 1);
    vecinos += add(middle, j - 1) + add(middle, j + 1);
    vecinos += add(lower, j - 1) + add(lower, j) + add(lower, j + 1);
    if (vecinos < 4) {
      total++;
      arrayLines[iIteration] = arrayLines[iIteration].replaceAt(j, "X");
    }
  }
  return total;
};
// convierte, de un array de strings, todas las 'X' por '.'
const convertXtoDot = (linesArray) => {
  return linesArray.map((line) => line.replace(/X/g, "."));
};
// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar globalmente hasta que no haya cambios
var lines = fileContent.split("\n");
var oldLines;
// primero hace una iteración porque sino oldLines y lines serían iguales y el bucle no funcionaría
do {
  oldLines = Array.from(lines);

  for (let i = 0; i < lines.length; i++) {
    iCountOfPulledGiftPaper += iCountOfGiftPaperPerLine(lines, i);
  }

  lines = convertXtoDot(lines);
} while (JSON.stringify(oldLines) !== JSON.stringify(lines));

console.log(iCountOfPulledGiftPaper);

