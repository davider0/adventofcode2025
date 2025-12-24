import fs from "fs";
import _ from "lodash";

/**
 * calcula el coste mínimo para llegar a joltage cero.
 * @param {Array<Set<number>>} buttons - lista de Sets con índices.
 * @param {Array<number>} joltage - vector/túpla de joltage inicial.
 * @returns {number} coste calculado.
 */
function joltageCost(buttons, joltage) {
  // 1. ayudita: (a - b) // 2
  const subHalve = (jA, jB) => {
    return jA.map((a, i) => Math.floor((a - jB[i]) / 2));
  };

  // 2. ayudita: calcular efecto de pulsar una lista de botones
  const press = (btns) => {
    // crear un array de ceros del tamaño del vector de joltage
    const res = new Array(joltage.length).fill(0);

    // python: sum(i in b for b in btns)
    for (let i = 0; i < joltage.length; i++) {
      let count = 0;
      for (const btn of btns) {
        if (btn.has(i)) count++;
      }
      res[i] = count;
    }
    return res;
  };

  // 3. ayudita: calcular paridad (n % 2)
  const pattern = (jolts) => {
    // ((n % 2) + 2) % 2 maneja negativos correctamente en js
    return jolts.map((n) => ((n % 2) + 2) % 2);
  };

  // 4. ayudita: generar combinaciones (sustituye itertools.combinations)
  function* combinations(arr, k) {
    if (k === 0) {
      yield [];
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      const head = arr[i];
      const tail = arr.slice(i + 1);
      for (const tailComb of combinations(tail, k - 1)) {
        yield [head, ...tailComb];
      }
    }
  }

  // 5. construir diccionario press_patterns
  // itertools.groupby de python requiere entrada ordenada; aquí iteramos y metemos en un map
  const pressPatterns = {};

  // generar combinaciones de todas las longitudes (0 a len(buttons))
  for (let n = 0; n <= buttons.length; n++) {
    for (const btnCombo of combinations(buttons, n)) {
      const p = pattern(press(btnCombo));

      // los objetos de js necesitan claves string (python usa tuplas)
      const key = JSON.stringify(p);

      if (!pressPatterns[key]) {
        pressPatterns[key] = [];
      }
      pressPatterns[key].push(btnCombo);
    }
  }

  // 6. función de coste recursiva memoizada
  // damos un resolvedor para memo porque los arrays en js son referencias
  const cost = _.memoize(
    (jolts) => {
      // si no hay ningún jolts distinto de cero -> devolver 0
      if (jolts.every((j) => j === 0)) {
        return 0;
      }

      const currentPattern = pattern(jolts);
      const patternKey = JSON.stringify(currentPattern);

      // si hay algún j < 0 o el patrón no está en pressPatterns
      if (jolts.some((j) => j < 0) || !pressPatterns[patternKey]) {
        // devuelve la suma del joltage INICIAL (variable de cierre), igual que en python
        return _.sum(joltage);
      }

      const btnCombos = pressPatterns[patternKey];

      // min(len(btns) + 2 * cost(...) para btns en btn_combos)
      const costs = btnCombos.map((btns) => {
        const nextJolts = subHalve(jolts, press(btns));
        return btns.length + 2 * cost(nextJolts);
      });

      return Math.min(...costs);
    },
    (jolts) => JSON.stringify(jolts)
  ); // resolvedor de clave de caché

  return cost(joltage);
}

function solveTotal(inputLines) {
  const lines = inputLines.trim().split("\n");
  let totalPresses = 0;

  for (const line of lines) {
    if (!line.trim()) continue;

    // parsear botones (...)
    const buttonMatches = [...line.matchAll(/\(([^)]+)\)/g)];
    const buttons = buttonMatches.map((match) => {
      const indices = match[1].split(",").map((n) => parseInt(n.trim(), 10));
      return new Set(indices);
    });

    // parsear joltage {...}
    const joltageMatch = line.match(/\{([^}]+)\}/);
    let joltage = [];
    if (joltageMatch) {
      joltage = joltageMatch[1].split(",").map((n) => parseInt(n.trim(), 10));
    }

    // calcular coste para esta máquina
    const machineCost = joltageCost(buttons, joltage);
    totalPresses += machineCost;

    console.log(`Machine result: ${machineCost}`);
  }

  console.log("---");
  console.log(`TOTAL FEWEST PRESSES: ${totalPresses}`);
  return totalPresses;
}
solveTotal(fs.readFileSync("input.txt", "utf-8"));
