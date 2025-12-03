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

const cache = new Map<string, number>();
const findMaxMemoized = (str: string, n: number): number => {
  if (n === 0 || str.length < n) {
    return 0;
  }
  const key = `${str}-${n}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const rest = str.slice(1)
  const pickFirst = (+str[0]) * (10 ** (n - 1)) + findMaxMemoized(rest, n - 1);
  const skipFirst = findMaxMemoized(rest, n);
  const result = Math.max(pickFirst, skipFirst);
  cache.set(key, result);
  return result;
}

console.log('Part2:', batteries.map((l) => findMaxMemoized(l, 12)).reduce((a,v) => a+v, 0));
