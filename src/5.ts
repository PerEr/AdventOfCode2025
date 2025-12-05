import { readFileSync } from "fs";

const [r, ingredients] = readFileSync("data/5.txt", "utf8").split("\n\n").slice(0, 2);
const ranges = r.split("\n").map(line => line.split("-").map(Number));

console.log("Part1:", ingredients.split("\n").map(Number).filter((n) => ranges.some(([start, end]) => n >= start && n <= end)).length);
