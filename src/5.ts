import { readFileSync } from "fs";

const [r, ingredients] = readFileSync("data/5.txt", "utf8").split("\n\n").slice(0, 2);
const ranges = r.split("\n").map(line => line.split("-").map(Number));

console.log("Part1:", ingredients.split("\n").map(Number).filter((n) => ranges.some(([start, end]) => n >= start && n <= end)).length);

console.log("Part2:", ranges.flatMap(([start, end]) =>
    [[start, 1], [end, 0]]
).sort((a: number[], b: number[]) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return b[1] - a[1];
}).reduce(({ count, depth, prev }, [pos, type]) => {
    if (type === 1) {
        if (depth++ === 0) prev = pos;
    } else {
        if (--depth === 0) count += (pos - prev + 1);
    }
    return { count, depth, prev };
}, { count: 0, depth: 0, prev: 0 }).count);

