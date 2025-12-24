import fs from "fs";

//  estructuras de datos

// representa una lista de coordenadas relativas a (0,0)
class ShapeVariant {
  constructor(coords) {
    this.coords = coords; // array de {r, c}
    this.width = 0;
    this.height = 0;
    this.calculateBounds();
  }

  calculateBounds() {
    let maxR = 0,
      maxC = 0;
    for (const p of this.coords) {
      if (p.r > maxR) maxR = p.r;
      if (p.c > maxC) maxC = p.c;
    }
    this.height = maxR + 1;
    this.width = maxC + 1;
  }
}

// --- lógica de parseo ---

const rawInput = fs.readFileSync("input.txt", "utf8").replace(/\r/g, "");
const lines = rawInput.split("\n").filter((l) => l.trim() !== "");

const shapes = [];
const regions = [];

let currentShapeIndex = null;
let currentShapeLines = [];

// función para finalizar un bloque de figura
function commitShape() {
  if (currentShapeIndex !== null && currentShapeLines.length > 0) {
    const coords = [];
    for (let r = 0; r < currentShapeLines.length; r++) {
      for (let c = 0; c < currentShapeLines[r].length; c++) {
        if (currentShapeLines[r][c] === "#") {
          coords.push({ r, c });
        }
      }
    }
    // calcular el área para ordenar luego
    shapes[currentShapeIndex] = {
      id: currentShapeIndex,
      coords,
      area: coords.length,
    };
  }
  currentShapeLines = [];
  currentShapeIndex = null;
}

lines.forEach((line) => {
  // comprobar definición de región (p. ej., "12x5: 1 0 1...")
  if (/^\d+x\d+:/.test(line)) {
    commitShape(); // terminar cualquier figura previa
    const [dims, countsStr] = line.split(":");
    const [w, h] = dims.split("x").map(Number);
    const counts = countsStr.trim().split(/\s+/).map(Number);
    regions.push({ w, h, counts });
  }
  // comprobar cabecera de figura (p. ej., "0:")
  else if (/^\d+:$/.test(line)) {
    commitShape();
    currentShapeIndex = parseInt(line.replace(":", ""), 10);
  }
  // cuerpo de la figura (p. ej., "###", "#..")
  else if (line.includes("#") || line.includes(".")) {
    currentShapeLines.push(line);
  }
});
commitShape(); // confirmar la figura final si existe

// --- utilidades de geometría ---

// normalizar coordenadas: mover para que la esquina superior izquierda quede en (0,0)
function normalize(coords) {
  if (coords.length === 0) return [];
  let minR = Infinity,
    minC = Infinity;
  for (const p of coords) {
    minR = Math.min(minR, p.r);
    minC = Math.min(minC, p.c);
  }
  return coords
    .map((p) => ({ r: p.r - minR, c: p.c - minC }))
    .sort((a, b) => a.r - b.r || a.c - b.c);
}

// generar las 8 simetrías (rotaciones/volteos)
function generateVariants(baseCoords) {
  const distinct = new Set();
  const variants = [];

  // función para guardar variantes únicas
  const add = (coords) => {
    const norm = normalize(coords);
    // crear una clave de texto para verificar unicidad
    const key = JSON.stringify(norm);
    if (!distinct.has(key)) {
      distinct.add(key);
      variants.push(new ShapeVariant(norm));
    }
  };

  let current = baseCoords;

  // 4 rotaciones
  for (let i = 0; i < 4; i++) {
    add(current);
    // voltear horizontal
    add(current.map((p) => ({ r: p.r, c: -p.c })));
    // voltear vertical
    add(current.map((p) => ({ r: -p.r, c: p.c })));

    // rotar 90° horario: (r, c) -> (c, -r)
    current = current.map((p) => ({ r: p.c, c: -p.r }));
  }

  return variants;
}

// precalcular variantes para todas las figuras
const shapeVariants = shapes.map((s) => generateVariants(s.coords));

// --- solucionador ---

function solveRegion(region) {
  const { w, h, counts } = region;

  // 1. preparar lista de piezas a colocar
  // cada pieza es un objeto: { shapeIndex, variantList }
  const piecesToPlace = [];
  let totalArea = 0;

  counts.forEach((count, shapeIdx) => {
    const shape = shapes[shapeIdx];
    for (let i = 0; i < count; i++) {
      piecesToPlace.push({
        shapeIdx: shapeIdx,
        area: shape.area,
        variants: shapeVariants[shapeIdx],
      });
      totalArea += shape.area;
    }
  });

  // salida temprana: comprobación de área
  if (totalArea > w * h) return false;

  // optimización: ordenar piezas de mayor a menor área
  // esto falla más rápido si las piezas grandes no caben.
  piecesToPlace.sort((a, b) => b.area - a.area);

  // 2. inicializar la rejilla (array 2D de booleanos)
  // false = vacío, true = ocupado
  const grid = Array(h)
    .fill(null)
    .map(() => Array(w).fill(false));

  // 3. retroceso recursivo
  // pieceIdx: índice en el array piecesToPlace
  // lastPos: usado para romper simetría (si se colocan piezas idénticas)
  function backtrack(pieceIdx, lastPos = -1) {
    // éxito: todas las piezas colocadas
    if (pieceIdx === piecesToPlace.length) return true;

    const piece = piecesToPlace[pieceIdx];

    // ruptura de simetría:
    // si esta pieza es idéntica a la anterior (mismo índice de figura),
    // se obliga a que ésta se coloque después de la anterior en la rejilla.
    // esto evita probar permutaciones de elementos idénticos (A luego B vs B luego A).
    const isIdenticalToPrev =
      pieceIdx > 0 && piecesToPlace[pieceIdx - 1].shapeIdx === piece.shapeIdx;
    let startLinear = 0;

    if (isIdenticalToPrev) {
      startLinear = lastPos + 1; // empezar estrictamente después de la instancia previa
    }

    // probar todas las variaciones de la figura
    for (const variant of piece.variants) {
      // optimización de límites: comprobación simple de dimensiones
      if (variant.height > h || variant.width > w) continue;

      // iterar sobre la rejilla
      // se recorre linealmente para manejar fácil la lógica "startAfter"
      for (let i = startLinear; i < w * h; i++) {
        const r = Math.floor(i / w);
        const c = i % w;

        // optimización: no intentar si la pieza se sale del tablero
        if (r + variant.height > h) continue; // optimización para filas
        if (c + variant.width > w) continue; // optimización para columnas

        // comprobar validez de la colocación
        let fits = true;
        for (const p of variant.coords) {
          if (grid[r + p.r][c + p.c]) {
            fits = false;
            break;
          }
        }

        if (fits) {
          // colocar pieza
          for (const p of variant.coords) {
            grid[r + p.r][c + p.c] = true;
          }

          // recursión
          if (backtrack(pieceIdx + 1, i)) return true;

          // retroceder (quitar pieza)
          for (const p of variant.coords) {
            grid[r + p.r][c + p.c] = false;
          }
        }
      }
    }

    return false;
  }

  return backtrack(0);
}

// --- ejecución principal ---

console.log("Analyzing Christmas Tree Farm...");

let validRegionsCount = 0;

regions.forEach((region, i) => {
  if (solveRegion(region)) {
    validRegionsCount++;
  }
});

console.log(`\n--- Result ---`);
console.log(`Regions that can fit all presents: ${validRegionsCount}`);
