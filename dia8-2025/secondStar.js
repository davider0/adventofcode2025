import fs from "fs";

// leer y procesar los escasos datos 🥱
const data = fs.readFileSync("input.txt", "utf-8");

// espacios y líneas vacías ADIEU!
const lines = data
  .trim()
  .split(/\r?\n/)
  .filter((line) => line.trim().length > 0);

const junctions = lines.map((line, index) => {
  // regexp para separar por coma o punto y digo si me lío
  const coords = line.split(/[,\.]/).map(Number);
  return {
    id: index,
    x: coords[0],
    y: coords[1],
    z: coords[2],
  };
});

// calcular todas las distancias posibles
const edges = [];
for (let i = 0; i < junctions.length; i++) {
  for (let j = i + 1; j < junctions.length; j++) {
    const a = junctions[i];
    const b = junctions[j];

    // distancia euclidiana
    // nota: Para ordenar bastaría con la distancia al cuadrado (ahorra la raíz cuadrada),
    // pero usamos sqrt para mantener la lógica física clara.
    const dist = Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
    );

    edges.push({ u: i, v: j, dist });
  }
}

// ordenar las conexiones de menor a mayor distancia
edges.sort((a, b) => a.dist - b.dist);

// implementación de Union-Find (DSU)
const parent = Array.from({ length: junctions.length }, (_, i) => i);
const size = new Array(junctions.length).fill(1);

// variable para rastrear cuántos circuitos separados quedan.
// al principio, cada caja es su propio circuito.
let numComponents = junctions.length;

function find(i) {
  if (parent[i] === i) return i;
  parent[i] = find(parent[i]);
  return parent[i];
}

function union(i, j) {
  const rootI = find(i);
  const rootJ = find(j);

  if (rootI !== rootJ) {
    if (size[rootI] < size[rootJ]) {
      parent[rootI] = rootJ;
      size[rootJ] += size[rootI];
    } else {
      parent[rootJ] = rootI;
      size[rootI] += size[rootJ];
    }
    return true; // se fusionaron dos circuitos diferentes
  }
  return false; // ya estaban conectados
}

// proceso principal: Conectar hasta que quede un solo circuito
let lastConnection = null;

for (const edge of edges) {
  // intentamos unir los dos nodos de esta arista
  if (union(edge.u, edge.v)) {
    // si la unión fue exitosa, disminuimos el número de componentes
    numComponents--;

    // si solo queda 1 componente, esta fue la conexión final
    if (numComponents === 1) {
      lastConnection = edge;
      break; // terminamos
    }
  }
}

// resultado final
if (lastConnection) {
  const boxA = junctions[lastConnection.u];
  const boxB = junctions[lastConnection.v];

  const result = boxA.x * boxB.x;

  console.log("¡Todo conectado!");
  console.log(
    `Última conexión entre Caja ${boxA.id} (X=${boxA.x}) y Caja ${boxB.id} (X=${boxB.x})`
  );
  console.log(`Distancia de la conexión: ${lastConnection.dist}`);
  console.log(`Respuesta Parte 2 (Multiplicación de X): ${result}`);
} else {
  console.log("No se pudo conectar todo el grafo (¿faltan datos?).");
}
