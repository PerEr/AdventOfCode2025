import { readFileSync } from "fs";

const batteries = readFileSync("data/3.txt", "utf8").split("\n")

const findMax = (str: string) => {
  if (str.length >= 2) {
    const rest = str.slice(1)
    const n = rest.split("").map(s => +s).reduce((a,v) => Math.max(a,v), 0);
    return Math.max(10*(+str[0]) + n, findMax(rest));
  }
  return 0
}

console.log('Part1:', batteries.map(findMax).reduce((a,v) => a+v, 0));
