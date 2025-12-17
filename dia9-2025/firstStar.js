import fs from "fs";

const calcAreaRectangle = (x1, y1, x2, y2) => {
  return BigInt(Math.abs(Number(x2 - x1))) * BigInt(Math.abs(Number(y2 - y1)));
};
// leer los datos de entrada, como siempre, suelen ser un par
const fileContent = fs.readFileSync("input.txt", "utf-8");
// líneas vacías y espacios AUF WIEDERSEHEN!
const lines = fileContent.split(/\r?\n/).filter((l) => l.length > 0);

// umbral para calcular el máximo
let iSolucion = 0n;

// matriz que almacena las coordenadas
let pointsMatrix = lines.map((line) => {
  // expresión regular para separar por coma o punto
  const coords = line.split(/[,\.]/).map(BigInt);
  return [coords[0], coords[1]];
});

// por cojones tendrá que recorrer todo entero dos veces
// sorry Donald Knuth
for (let i = 0; i < pointsMatrix.length; i++) {
  for (let j = 0; j < pointsMatrix.length; j++) {
    const a = pointsMatrix[i];
    const b = pointsMatrix[j];
    const area = calcAreaRectangle(a[0], a[1], b[0] + 1n, b[1] + 1n);
    iSolucion = BigInt(Math.max(Number(iSolucion), Number(area)));
  }
}

console.log(iSolucion);
