import fs from "fs";

// leer los datos de entrada, como siempre, suelen ser un par
const data = fs.readFileSync("input.txt", "utf-8");

// líneas vacías y espacios FUERA!
const lines = data
  .trim()
  .split(/\r?\n/)
  .filter((line) => line.trim().length > 0);

const junctions = lines.map((line, index) => {
  // expresión regular para separar por coma o punto
  const coords = line.split(/[,\.]/).map(Number);
  return {
    id: index,
    x: coords[0],
    y: coords[1],
    z: coords[2],
  };
});

// calcular todas las distancias posibles (longitud euclídea)
const edges = [];
for (let i = 0; i < junctions.length; i++) {
  for (let j = i + 1; j < junctions.length; j++) {
    const a = junctions[i];
    const b = junctions[j];

    // fórmula euclidiana de distancia en 3 dimensiones
    const dist = Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
    );

    edges.push({ u: i, v: j, dist });
  }
}

// al contrario que los cuartos de muchos programadores,
// ordenamos las distancias de menor a mayor
// crucial para calcular las distancias más cercanas primero
edges.sort((a, b) => a.dist - b.dist);

// union-find (disjoint set union)

// 'parent' indica el padre de cada nodo, al inicio, cada nodo es su propio padre
const parent = Array.from({ length: junctions.length }, (_, i) => i);
// 'size' guarda el tamaño del circuito, al inicio, todos son tamaño 1
const size = new Array(junctions.length).fill(1);

// función para encontrar el 'padre' (o raiz) del circuito
// recursivo porque no me gusta trabajar
function find(i) {
  if (parent[i] === i) return i;
  parent[i] = find(parent[i]);
  return parent[i];
}

// unión cantoriana
function union(i, j) {
  const rootI = find(i);
  const rootJ = find(j);

  if (rootI !== rootJ) {
    // se unen el más pequeño con el más grande para balancearlo
    if (size[rootI] < size[rootJ]) {
      parent[rootI] = rootJ;
      size[rootJ] += size[rootI];
    } else {
      parent[rootJ] = rootI;
      size[rootI] += size[rootJ];
    }
    return true; // se realizó una unión (eran circuitos diferentes)
  }
  return false; // ya estaban en el mismo circuito (no pasa nada)
}

// conectar los 1000 pares más cercanos
const LIMIT = 1000;
// usamos Math.min por si la lista de entrada es pequeña (como en el ejemplo de 20 líneas)
const operations = Math.min(LIMIT, edges.length);

for (let i = 0; i < operations; i++) {
  const edge = edges[i];
  union(edge.u, edge.v);
}

// recopilar los tamaños de los circuitos resultantes
const finalCircuitSizes = [];
for (let i = 0; i < junctions.length; i++) {
  // solo miramos las raíces (donde parent[i] === i) porque ellas guardan el tamaño total acumulado
  if (parent[i] === i) {
    finalCircuitSizes.push(size[i]);
  }
}

// ah shit here we go again
finalCircuitSizes.sort((a, b) => b - a);

// obtener los 3 más grandes
const top1 = finalCircuitSizes[0] || 1;
const top2 = finalCircuitSizes[1] || 1;
const top3 = finalCircuitSizes[2] || 1;

const result = top1 * top2 * top3;

console.log(`Top 3 tamaños: ${top1}, ${top2}, ${top3}`);
console.log(`Resultado final: ${result}`);
