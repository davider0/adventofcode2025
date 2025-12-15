import fs from "fs";

// SIN DUDA el ejercicio más jodido de lo que llevo del adviento

// total de los elementos, BigInt de costumbre 🥵
let iResult = 0n;

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// itero tranquilamente sobre los elementos
let lines = fileContent.split("\n").filter((line) => line.length > 0);
let [row1, row2, row3, row4, operations] = lines;

// inserto espacios para que las columnas tengan el mismo tamaño, parece una estupidez
// pero sin esto literalmente no funciona
const maxLength = Math.max(
  row1.length,
  row2.length,
  row3.length,
  row4.length,
  operations.length
);
row1 = row1.padEnd(maxLength, " ");
row2 = row2.padEnd(maxLength, " ");
row3 = row3.padEnd(maxLength, " ");
row4 = row4.padEnd(maxLength, " ");
operations = operations.padEnd(maxLength, " ");

let operation = "";
let minorLength = 0;

// el bucle empieza en el final, porque los cefalópodos leen de derecha a izquierda ()
for (let i = operations.length - 1; i >= 0; i--) {
  const char = operations.charAt(i);

  // el operador marca el pie de página y el prólogo de cada columna. hay que identificarlo
  // y asociarlo a sendas columnas
  if (char === "*" || char === "+") {
    operation = char;

    // se extrae la columna, sumando 1 para añadir el lugar del operador
    const len = minorLength + 1;

    let minorMatrix = [
      row1.substring(i, i + len).split(""),
      row2.substring(i, i + len).split(""),
      row3.substring(i, i + len).split(""),
      row4.substring(i, i + len).split(""),
    ];

    // Cálculo de la tarea de los cefalópodos
    let problemNumbers = [];

    // barrido de la matriz generada
    for (let j = minorMatrix[0].length - 1; j >= 0; j--) {
      let sNumber = "";

      // el dígito más significativo por delante
      sNumber +=
        minorMatrix[0][j] +
        minorMatrix[1][j] +
        minorMatrix[2][j] +
        minorMatrix[3][j];

      // eliminar espacios y saltos de línea o 'whitespaces', lo segundo mediante regexp
      // (JavaScript no nos regala la función esta vez)
      let cleanNum = sNumber.trim().replace(/\s/g, "");

      if (cleanNum.length > 0) {
        problemNumbers.push(BigInt(cleanNum));
      }
    }

    // calcular el resultado. como los elementos los contiene un vector (array), podemos usar
    // reduce()
    if (problemNumbers.length > 0) {
      const blockTotal = problemNumbers.reduce((a, b) =>
        operation == "*" ? a * b : a + b
      );
      iResult += blockTotal;
    }

    // resetear el contador que almacena el tamaño de la columna
    minorLength = 0;
  } else {
    // si no hay un operador, simplemente aumenta el tamaño de la columna
    minorLength++;
  }
}

// convertir de BigInt a String
console.log(iResult.toString());
