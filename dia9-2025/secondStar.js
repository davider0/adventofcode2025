import fs from "fs";

function solve() {
  // 1. Leer la entrada
  const rawInput = fs.readFileSync("input.txt", "utf-8").trim();
  if (!rawInput) return;

  const points = rawInput.split("\n").map((l) => {
    const [x, y] = l.trim().split(",").map(Number);
    return { x, y };
  });

  // 2. Compresión de coordenadas, versión expandida
  // Mapeamos coords únicas a índices impares (1, 3, 5...)
  // Los pares (0, 2, 4...) son huecos/acolchado para que no se pegue nada
  const sortedX = [...new Set(points.map((p) => p.x))].sort((a, b) => a - b);
  const sortedY = [...new Set(points.map((p) => p.y))].sort((a, b) => a - b);

  const mapX = new Map();
  const mapY = new Map();

  sortedX.forEach((val, idx) => mapX.set(val, idx * 2 + 1));
  sortedY.forEach((val, idx) => mapY.set(val, idx * 2 + 1));

  // Dimensiones del grid: (N * 2) + 1 para huecos/acolchado
  const W = sortedX.length * 2 + 2; // +2 para acolchar el lado derecho
  const H = sortedY.length * 2 + 2; // +2 para acolchar la parte de abajo

  // 0 = Desconocido (potencialmente dentro), 1 = Muro (borde del loop), 2 = Fuera
  const grid = new Int8Array(W * H).fill(0);

  function setGrid(x, y, val) {
    grid[y * W + x] = val;
  }
  function getGrid(x, y) {
    return grid[y * W + x];
  }

  // 3. Rasterizar el loop
  // Dibujar líneas entre puntos consecutivos sobre el grid expandido
  const numPoints = points.length;
  for (let i = 0; i < numPoints; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % numPoints]; // Envolver alrededor

    const x1 = mapX.get(p1.x),
      y1 = mapY.get(p1.y);
    const x2 = mapX.get(p2.x),
      y2 = mapY.get(p2.y);

    if (x1 === x2) {
      // Línea vertical
      const start = Math.min(y1, y2);
      const end = Math.max(y1, y2);
      for (let y = start; y <= end; y++) setGrid(x1, y, 1);
    } else {
      // Línea horizontal
      const start = Math.min(x1, x2);
      const end = Math.max(x1, x2);
      for (let x = start; x <= end; x++) setGrid(x, y1, 1);
    }
  }

  // 4. Relleno del exterior
  // Empezamos en (0,0) que por el acolchado seguro es fuera
  const queue = [0]; // índice codificado (y * W + x)
  grid[0] = 2; // Marcar como Fuera

  while (queue.length > 0) {
    const idx = queue.pop();
    const cx = idx % W;
    const cy = Math.floor(idx / W);

    const neighbors = [
      { x: cx + 1, y: cy },
      { x: cx - 1, y: cy },
      { x: cx, y: cy + 1 },
      { x: cx, y: cy - 1 },
    ];

    for (const n of neighbors) {
      if (n.x >= 0 && n.x < W && n.y >= 0 && n.y < H) {
        const nIdx = n.y * W + n.x;
        if (grid[nIdx] === 0) {
          // Si estaba Desconocido
          grid[nIdx] = 2; // Marcar Fuera
          queue.push(nIdx);
        }
      }
    }
  }

  // 5. Imagen integral (prefix sum 2D)
  // Contamos celdas ‘Fuera’. Si un rectángulo suma 0, está totalmente dentro
  const prefixSum = new Int32Array(W * H).fill(0);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const isOutside = getGrid(x, y) === 2 ? 1 : 0;
      const up = y > 0 ? prefixSum[(y - 1) * W + x] : 0;
      const left = x > 0 ? prefixSum[y * W + (x - 1)] : 0;
      const upLeft = y > 0 && x > 0 ? prefixSum[(y - 1) * W + (x - 1)] : 0;

      prefixSum[y * W + x] = isOutside + up + left - upLeft;
    }
  }

  function getSum(x1, y1, x2, y2) {
    const A = prefixSum[y2 * W + x2];
    const B = x1 > 0 ? prefixSum[y2 * W + (x1 - 1)] : 0;
    const C = y1 > 0 ? prefixSum[(y1 - 1) * W + x2] : 0;
    const D = x1 > 0 && y1 > 0 ? prefixSum[(y1 - 1) * W + (x1 - 1)] : 0;
    return A - B - C + D;
  }

  // 6. Probar todos los rectángulos
  let maxArea = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i];
      const p2 = points[j];

      // Limites del grid
      const gx1 = mapX.get(p1.x);
      const gy1 = mapY.get(p1.y);
      const gx2 = mapX.get(p2.x);
      const gy2 = mapY.get(p2.y);

      const minGx = Math.min(gx1, gx2);
      const maxGx = Math.max(gx1, gx2);
      const minGy = Math.min(gy1, gy2);
      const maxGy = Math.max(gy1, gy2);

      // Comprobar si el rectángulo contiene alguna celda “Fuera” (2)
      const outsideCount = getSum(minGx, minGy, maxGx, maxGy);

      if (outsideCount === 0) {
        // Calcular área real usando coords originales
        const width = Math.abs(p1.x - p2.x) + 1;
        const height = Math.abs(p1.y - p2.y) + 1;
        const area = width * height;
        if (area > maxArea) {
          maxArea = area;
        }
      }
    }
  }

  console.log("Área válida máxima:", maxArea);
}

solve();
