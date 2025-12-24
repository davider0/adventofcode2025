import fs from "fs";

const input = fs
  .readFileSync("input.txt", "utf8")
  .split(/\r?\n/)
  .filter((line) => line.trim() !== "");

const graph = {};
input.forEach((line) => {
  const [node, targetsStr] = line.split(": ");
  graph[node] = targetsStr ? targetsStr.split(" ") : [];
});

// tabla de memo usando clave string: "nodeName-hasDac-hasFft"
const memo = {};

function countPaths(node, hasDac, hasFft) {
  // actualizar estado si el nodo actual es uno de los objetivos
  if (node === "dac") hasDac = true;
  if (node === "fft") hasFft = true;

  // caso base: llegamos a la salida
  if (node === "out") {
    // solo cuenta este camino si ambos objetivos fueron visitados
    return hasDac && hasFft ? 1 : 0;
  }

  // generar clave única para el estado actual
  const key = `${node}-${hasDac}-${hasFft}`;
  if (memo[key] !== undefined) return memo[key];

  if (!graph[node]) return 0;

  let total = 0;
  for (const neighbor of graph[node]) {
    total += countPaths(neighbor, hasDac, hasFft);
  }

  memo[key] = total;
  return total;
}

// empezar desde el rack del servidor (svr) con ambas banderas en falso
const result = countPaths("svr", false, false);

console.log(`--- Reactor Analysis: Part Two ---`);
console.log(
  `Total paths from 'svr' to 'out' visiting both 'dac' and 'fft': ${result}`
);
