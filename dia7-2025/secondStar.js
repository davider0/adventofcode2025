import fs from "fs";

// lee el archivo
const data = fs.readFileSync("input.txt", "utf-8");
const lines = data.trimEnd().split("\n");

// parsea el grid para localizar los comienzos (S) y separadores (^)
// se organizan los separadores por columnas para que el ordenador gaste menos luz
// clos[c] contendrá una lista ordenada de índices de filas donde los separadores existen en la columna c
let startPos = null;
const cols = []; 
const allSplitters = []; // para iterar en orden

for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === 'S') {
            startPos = { r, c };
        } else if (char === '^') {
            if (!cols[c]) cols[c] = [];
            cols[c].push(r);
            allSplitters.push({ r, c, val: 0n });
        }
    }
}

// los separadores por ID (fila,col) para fácilmente actualizar sus valores más tarde
// se usarán 'cols' para encontrar los índices de las filas
const splitterValues = new Map();

// genera una única key por valor del mapa
const getKey = (r, c) => `${r},${c}`;


// encuentra el primer separador en la columna 'c' que está por debajo de 'fila'
// devuelve el índice de la fila del separador encontrado, o null si no existe (al fondo)
function findNextSplitterRow(c, currentRow) {
    const rows = cols[c];
    if (!rows) return null; // la columna está vacía o fuera de alcance

    // búsqueda binaria
    let low = 0;
    let high = rows.length - 1;
    let res = null;

    while (low <= high) {
        const mid = (low + high) >>> 1;
        if (rows[mid] > currentRow) {
            res = rows[mid];
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return res;
}
// Algoritmo:
// 1. ordena todos los separadores de abajo hacia arriba
// 2. para cada separador, mira hacia dónde van las ramas izquierda y derecha
//    - si una rama acierta con otro separador, añade el valor precalculado de ese separador
//    - si una rama acierta con null, añade 1

allSplitters.sort((a, b) => b.r - a.r);

for (const s of allSplitters) {
    // 1. camino izquierda (col - 1)
    const leftTargetRow = findNextSplitterRow(s.c - 1, s.r);
    let leftCount = 1n; // Default: exits manifold
    if (leftTargetRow !== null) {
        // encuentra un separador abajo
        leftCount = splitterValues.get(getKey(leftTargetRow, s.c - 1));
    }

    // 2. camino derecha (col + 1)
    const rightTargetRow = findNextSplitterRow(s.c + 1, s.r);
    let rightCount = 1n; // valor por defecto: existe variedad
    if (rightTargetRow !== null) {
        rightCount = splitterValues.get(getKey(rightTargetRow, s.c + 1));
    }

    // total
    const total = leftCount + rightCount;
    splitterValues.set(getKey(s.r, s.c), total);
}

// paso final: rastreo desde el principio
if (startPos) {
    const firstHitRow = findNextSplitterRow(startPos.c, startPos.r);
    
    if (firstHitRow === null) {
        // no encuentra nada
        console.log("1");
    } else {
        // escribe por consola el primer valor que encontramos
        const result = splitterValues.get(getKey(firstHitRow, startPos.c));
        console.log(result.toString());
    }
} else {
    console.error("Error: No starting position 'S' found in input.");

}

