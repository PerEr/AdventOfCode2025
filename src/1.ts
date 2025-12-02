import { readFileSync } from "fs";

const rotations = readFileSync("data/1.txt", "utf8").split("\n").map((l) => {
  const sign = l[0] == 'R' ? 1 : -1;
  return sign * parseInt(l.slice(1), 10);
})

console.log("Part1: ", rotations.reduce(({ position, hits }, value) => {
  position += value;
  if (position % 100 === 0) hits += 1;
  return { position, hits };
}, { position: 50, hits: 0 }).hits);

console.log("Part2: ", rotations.reduce(({ position, hits }, value) => {
  for (let ii=0 ; ii<Math.abs(value); ii += 1) {
    position += Math.sign(value);
    if (position < 0) position = 99;
    if (position % 100 === 0) hits++;
  }
  return { position: position % 100, hits };
}, { position: 50, hits: 0 }).hits);
