import fs from "fs";
// total de los elementos
let iResult = 0;
// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");
const lines = fileContent.split(/\r?\n/).filter((l) => l.length > 0);
const height = lines.length;
const width = lines[0]?.length ?? 0;
let sRow = -1;
let sCol = -1;
for (let r = 0; r < height; r++) {
  const c = lines[r].indexOf("S");
  if (c !== -1) {
    sRow = r;
    sCol = c;
    break;
  }
}
if (sRow !== -1 && sCol !== -1) {
  let current = new Set([sCol]);
  for (let r = sRow + 1; r < height; r++) {
    const next = new Set();
    for (const col of current) {
      if (col < 0 || col >= width) continue;
      const ch = lines[r][col];
      if (ch === "^") {
        iResult++;
        if (col - 1 >= 0) next.add(col - 1);
        if (col + 1 < width) next.add(col + 1);
      } else {
        next.add(col);
      }
    }
    current = next;
    if (current.size === 0) break;
  }
}
console.log(iResult);
