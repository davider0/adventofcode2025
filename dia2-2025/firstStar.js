import fs from "fs";

// variable que almacena los IDs inválidos
let invalidIDs = [0];

// calcula si un ID es válido, si no lo es, lo pushea a invalidIDs
const isID = (sInterval) => {
  let vectorID = [];
  // array de dos items: primer y último elemento del rango
  vectorID.push(parseInt(sInterval.split("-")[0]));
  vectorID.push(parseInt(sInterval.split("-")[1]));

  console.log(vectorID);

  for (let i = vectorID[0]; i <= vectorID[1]; i++) {
    // si es impar, sigue con el bucle
    if (((i + "").length & 1) != 0) continue;

    // si no, comprueba si la mitad izquierda es igual a la mitad derecha
    if (
      (i + "").substring(0, (i + "").length / 2) -
        (i + "").substring((i + "").length / 2, (i + "").length) ==
      0
    )
      invalidIDs.push(i);
  }
};
// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");

// iterar sobre cada elemento
const lines = fileContent.split(",");
for (const line of lines) {
  if (line.trim()) {
    console.log("Intervalo: " + line);
    isID(line);
    console.log("IDs inválidos: " + invalidIDs);
  }
}

console.log(invalidIDs.reduce((a, b) => a + b, 0));
