import fs from "fs";

// si no tienes el archivo input.txt real, puedes probar con el string de ejemplo descomentando abajo:
/*
const fileContent = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;
*/

// asegúrate de tener input.txt en la misma carpeta o usa el string anterior
const fileContent = fs.readFileSync("input.txt", "utf-8");

// líneas vacías y espacios AUF WIEDERSEHEN!
const lines = fileContent.split(/\r?\n/).filter((l) => l.length > 0);

let totalPresses = 0;

for (const line of lines) {
  // 1. parsear el objetivo (Luces)
  // extraer lo que está entre corchetes [...]
  const diagramMatch = line.match(/\[([.#]+)\]/);
  if (!diagramMatch) continue;

  const diagramStr = diagramMatch[1];
  let targetMask = 0;

  // convertimos el string de luces a un entero (bitmask)
  // índice 0 es el bit menos significativo
  for (let i = 0; i < diagramStr.length; i++) {
    if (diagramStr[i] === "#") {
      targetMask |= 1 << i;
    }
  }

  // 2. parsear los botones
  // extraer todos los grupos entre paréntesis (...)
  const buttonMatches = [...line.matchAll(/\(([\d,]+)\)/g)];
  const buttons = buttonMatches.map((match) => {
    const indices = match[1].split(",").map(Number);
    let buttonMask = 0;
    for (const idx of indices) {
      buttonMask |= 1 << idx;
    }
    return buttonMask;
  });

  // 3. búsqueda en Anchura (BFS) para encontrar el camino más corto
  // queue almacena: [estadoActual, pasos]
  const queue = [[0, 0]];
  const visited = new Set();
  visited.add(0);

  let found = false;

  // nota: usamos un array simple como cola. Para inputs masivos sería mejor una estructura Queue real,
  // pero para este problema el array.shift() es suficiente.
  while (queue.length > 0) {
    const [currentMask, steps] = queue.shift();

    // si alcanzamos el objetivo
    if (currentMask === targetMask) {
      totalPresses += steps;
      found = true;
      break;
    }

    // probar presionar cada botón desde el estado actual
    for (const btnMask of buttons) {
      // la operación XOR (^) alterna los bits (enciende si está apagado, apaga si está encendido)
      const nextMask = currentMask ^ btnMask;

      if (!visited.has(nextMask)) {
        visited.add(nextMask);
        queue.push([nextMask, steps + 1]);
      }
    }
  }

  if (!found) {
    console.error(
      "No se encontró solución para una de las máquinas. Revisa la entrada."
    );
  }
}

console.log(`La menor cantidad total de pulsaciones es: ${totalPresses}`);
