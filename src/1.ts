import { readFileSync } from "fs";

const instructions = readFileSync("data/1.txt", "utf8").split("\n").map((l) => {
  const sign = l[0] == 'R' ? 1 : -1;
  return sign * parseInt(l.slice(1), 10);
})

console.log("Part1: ", instructions.reduce(({ position, hits }, value) => {
  const newPosition = position + value;
  const newHits = newPosition % 100 === 0 ? hits + 1 : hits;
  return { position: newPosition, hits: newHits };
}, { position: 50, hits: 0 }).hits);
