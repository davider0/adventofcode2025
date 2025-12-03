import fs from "fs"; // lectura de fichero de entrada

const largestJoltages = []; // acumulador

const findLargestJoltage = (sLine) => {
  // convertir línea a array de dígitos
  const digits = sLine
    .trim()
    .split("")
    .map((d) => parseInt(d, 10));
  const n = digits.length;
  const k = 12; // número de baterías a encender
  if (n < k) return 0n; // no hay suficientes dígitos
  let start = 0; // posición desde la que podemos elegir el siguiente dígito
  const out = new Array(k); // resultado de 12 dígitos
  for (let t = 0; t < k; t++) {
    let best = -1; // mejor dígito encontrado en la ventana
    let pos = start; // índice del mejor dígito
    const end = n - (k - t); // última posición viable para poder completar k
    for (let j = start; j <= end; j++) {
      const d = digits[j];
      if (d > best) {
        best = d;
        pos = j;
        if (best === 9) break; // 9 es óptimo; podemos parar
      }
    }
    out[t] = best; // guardar dígito elegido
    start = pos + 1; // avanzar para mantener el orden
  }
  const s = out.join(""); // construir número final
  return BigInt(s); // devolver como BigInt
};

// lee el archivo y separa bancos por línea
const fileContent = fs.readFileSync("input.txt", "utf-8");

// sumar el joltage máximo de cada banco
const lines = fileContent.split("\n");
let total = 0n;
for (const line of lines) {
  if (line.trim()) {
    total += findLargestJoltage(line);
  }
}

console.log(total.toString()); // salida total
