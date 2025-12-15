import fs from "fs";

// Read and prepare data
const data = fs.readFileSync("input.txt", "utf-8");
const lines = data.trimEnd().split("\n");

// Parse the grid to find Start (S) and all Splitters (^)
// We organize splitters by column for efficient vertical lookups.
// cols[c] will contain a sorted list of row indices where splitters exist in column c.
let startPos = null;
const cols = []; 
const allSplitters = []; // To iterate in order

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

// Map splitters by unique ID (row,col) to easily update their values later
// or we can just update the objects in 'cols' if we link them correctly.
// To keep it simple: we will use 'cols' to find the *Row Index*, 
// then use a Map to store the calculated value for that specific splitter.
const splitterValues = new Map();

// Helper: Generate a unique key for the map
const getKey = (r, c) => `${r},${c}`;

// Helper: Find the first splitter in column 'c' that is below 'row'
// Returns the row index of the found splitter, or null if none (hits bottom)
function findNextSplitterRow(c, currentRow) {
    const rows = cols[c];
    if (!rows) return null; // Column is empty or out of bounds

    // Binary search for the first row > currentRow
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

// Algorithm:
// 1. Sort all splitters by Row Descending (Bottom-Up).
// 2. For each splitter, look at where its Left and Right branches go.
//    - If a branch hits another splitter, add that splitter's pre-calculated value.
//    - If a branch hits the bottom (null), add 1.
allSplitters.sort((a, b) => b.r - a.r);

for (const s of allSplitters) {
    // 1. Trace Left Path (col - 1)
    const leftTargetRow = findNextSplitterRow(s.c - 1, s.r);
    let leftCount = 1n; // Default: exits manifold
    if (leftTargetRow !== null) {
        // Hits a splitter below
        leftCount = splitterValues.get(getKey(leftTargetRow, s.c - 1));
    }

    // 2. Trace Right Path (col + 1)
    const rightTargetRow = findNextSplitterRow(s.c + 1, s.r);
    let rightCount = 1n; // Default: exits manifold
    if (rightTargetRow !== null) {
        rightCount = splitterValues.get(getKey(rightTargetRow, s.c + 1));
    }

    // Total timelines for this splitter
    const total = leftCount + rightCount;
    splitterValues.set(getKey(s.r, s.c), total);
}

// Final Step: Trace from Start Position
if (startPos) {
    const firstHitRow = findNextSplitterRow(startPos.c, startPos.r);
    
    if (firstHitRow === null) {
        // Start beam goes straight to bottom without hitting anything
        console.log("1");
    } else {
        // Output the value of the first splitter we hit
        const result = splitterValues.get(getKey(firstHitRow, startPos.c));
        console.log(result.toString());
    }
} else {
    console.error("Error: No starting position 'S' found in input.");
}