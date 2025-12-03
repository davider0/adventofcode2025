import fs from "fs";

const content = fs.readFileSync("input.txt", "utf-8").trim();
let total = 0n;

const ranges = content
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const isInvalid = (s) => /^(\d+?)\1+$/.test(s);

for (const r of ranges) {
  const [startStr, endStr] = r.split("-");
  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);
  for (let i = start; i <= end; i++) {
    const s = String(i);
    if (isInvalid(s)) total += BigInt(i);
  }
}

console.log(total.toString());
