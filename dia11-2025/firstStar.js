import fs from "fs";

// 1. leer toda la entrada sin recortar
const input = fs
  .readFileSync("input.txt", "utf8")
  .split(/\r?\n/)
  .filter((line) => line.trim() !== ""); // quitar líneas vacías

// 2. construir el grafo
const graph = {};

input.forEach((line) => {
  // formato: "nombre: objetivo1 objetivo2"
  const [node, targetsStr] = line.split(": ");

  if (targetsStr) {
    graph[node] = targetsStr.split(" ");
  } else {
    graph[node] = [];
  }
});

// 3. contar caminos con dfs + memo
// memo guarda { nombreNodo: numeroDeCaminosHastaOut }
const memo = {};

function countPaths(node) {
  // caso base: si llegamos a 'out', es 1 camino
  if (node === "out") return 1;

  // revisar caché: si ya calculamos este nodo, devolvemos lo guardado
  if (memo[node] !== undefined) return memo[node];

  // callejón sin salida: si el nodo no está en el grafo, no va a ningún lado
  if (!graph[node]) return 0;

  // paso recursivo: sumar caminos de todos los vecinos
  let total = 0;
  for (const neighbor of graph[node]) {
    total += countPaths(neighbor);
  }

  // guardar en caché y devolver
  memo[node] = total;
  return total;
}

// 4. ejecutar
if (graph["you"]) {
  const result = countPaths("you");
  console.log(result);
} else {
  console.error("error: no encontré el dispositivo inicial 'you'");
}
