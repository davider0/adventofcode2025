import fs from "fs";

// recuento de los IDs frescos (IDs que están entre los rangos, sin repetirse)
let freshIDsCount = 0n;

// lee el archivo
const fileContent = fs.readFileSync("input.txt", "utf-8");
// separamos los rangos de los números, el susodicho no se emplea en esta práctica
const lines = fileContent.split("\n\n");
const IDRanges = lines[0].trim().split("\n").filter(Boolean);

// ordenamos los rangos desde el inicio de menor a mayor, para poder identificar los solapamientos
// como es bigInt y no enteros, tenemos que concretar las comparaciones
const ranges = IDRanges.map((l) => l.split("-").map((s) => BigInt(s))).sort(
  (a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0
);

// recorremos los rangos, y si hay solapamiento, actualizamos el rango actual
// si no, sumamos los IDs frescos entre el rango actual y el siguiente
if (ranges.length > 0) {
  let [curStart, curEnd] = ranges[0];
  for (let i = 1; i < ranges.length; i++) {
    const [s, e] = ranges[i];
    if (s <= curEnd) {
      if (e > curEnd) curEnd = e;
    } else {
      freshIDsCount += curEnd - curStart + 1n;
      curStart = s;
      curEnd = e;
    }
  }
  freshIDsCount += curEnd - curStart + 1n;
}

console.log(freshIDsCount.toString());
