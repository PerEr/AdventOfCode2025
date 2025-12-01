import { readFileSync } from "fs";

const rotations = readFileSync("data/1.txt", "utf8").split("\n").map((l) => {
  const sign = l[0] == 'R' ? 1 : -1;
  return sign * parseInt(l.slice(1), 10);
})

console.log("Part1: ", rotations.reduce(({ position, hits }, value) => {
  const newPosition = position + value;
  const newHits = newPosition % 100 === 0 ? hits + 1 : hits;
  return { position: newPosition, hits: newHits };
}, { position: 50, hits: 0 }).hits);

console.log("Part2: ", rotations.reduce(({ position, hits }, value) => {
  const delta = Math.sign(value);
  const steps = Math.abs(value);
  for (let ii=0 ; ii<Math.abs(value); ii += 1) {
    position += delta;
    if (position < 0) position = 99;
    if (position % 100 === 0) hits++;
  }
  return { position: position % 100, hits };
}, { position: 50, hits: 0 }).hits);
