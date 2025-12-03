import fs from "fs";

// almacena los números máximos de cada línea (juntos) 🎄
const largestJoltages = [];

// función encuentra el mayor voltaje de una línea
const findLargestJoltage = (sLine) => {
  const digits = sLine
    .trim()
    .split("")
    .map((d) => parseInt(d, 10));
  const n = digits.length;

  // si la línea es de longitud 2, no hay mayor voltaje
  if (n < 2) return 0;
  // se crea un vector con todo ceros
  const suffixMax = new Array(n).fill(0);
  let currentMax = 0;
  // se busca el máximo para meterlo en el vector auxiliar, excepto si es menor que el del original que en ese caso se mete el del original
  for (let i = n - 1; i >= 0; i--) {
    suffixMax[i] = currentMax;
    if (digits[i] > currentMax) currentMax = digits[i];
  }
  let best = 0;
  // se busca el mejor número posible combinando el número actual con el máximo de la derecha
  for (let i = 0; i < n - 1; i++) {
    const cand = digits[i] * 10 + suffixMax[i];
    if (cand > best) best = cand;
  }
  return best;
};

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada elemento
const lines = fileContent.split("\n");
for (const line of lines) {
  if (line.trim()) {
    largestJoltages.push(findLargestJoltage(line));
  }
}

console.log(largestJoltages.reduce((a, b) => a + b, 0));
