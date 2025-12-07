import fs from "fs";

// almacena los números máximos de cada línea (juntos) 🎄
let iCountOfValidGiftPaper = 0;

// función encuentra el mayor voltaje de una línea
const iCountOfGiftPaperPerLine = (sMiddleLine, sUpperLine, sLowerLine) => {
  const upper = sUpperLine ? sUpperLine.split("") : null;
  const lower = sLowerLine ? sLowerLine.split("") : null;
  const middle = sMiddleLine.split("");
  let total = 0;
  const add = (arr, idx) =>
    arr && idx >= 0 && idx < arr.length && arr[idx] === "@" ? 1 : 0;
  for (let j = 0; j < middle.length; j++) {
    if (middle[j] === ".") continue;
    let vecinos = 0;
    vecinos += add(upper, j - 1) + add(upper, j) + add(upper, j + 1);
    vecinos += add(middle, j - 1) + add(middle, j + 1);
    vecinos += add(lower, j - 1) + add(lower, j) + add(lower, j + 1);
    if (vecinos < 4) total++;
  }
  return total;
};

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada elemento
const lines = fileContent.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (i == 0) {
    iCountOfValidGiftPaper += iCountOfGiftPaperPerLine(
      lines[i],
      null,
      lines[i + 1]
    );
  } else if (i == lines.length - 1) {
    iCountOfValidGiftPaper += iCountOfGiftPaperPerLine(
      lines[i],
      lines[i - 1],
      null
    );
  } else {
    iCountOfValidGiftPaper += iCountOfGiftPaperPerLine(
      lines[i],
      lines[i - 1],
      lines[i + 1]
    );
  }
}

console.log(iCountOfValidGiftPaper);
