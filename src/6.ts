import { readFileSync } from "fs";

const data = readFileSync("data/6.txt", "utf8").split("\n");
const [values, operators] = [
    data.slice(0, -1).map((line) => line.trim().split(/\s+/)).map((line) => line!.map(Number)),
    data.at(-1)!.trim().split(/\s+/).map((op) => op!.trim())
];

const metaAcc1 = operators!.map((op) =>
    op === "+" ? { acc: 0, fn: (a: number, b: number) => a + b } :
        { acc: 1, fn: (a: number, b: number) => a * b }
);

const result = values.reduce((macc, row) => {
    row.forEach((value, idx) => {
        macc[idx].acc = macc[idx].fn(macc[idx].acc, value);
    });
    return macc;
}, metaAcc1);

console.log("Part1:", result.reduce((acc, { acc: val }) => acc + val, 0));
