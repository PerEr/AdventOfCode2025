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

const blankColumns = (data: string[]): number[] =>
    Array.from(
        { length: Math.max(0, ...data.map(l => l.length)) },
        (_, col) => col
    ).filter(col => data.every(line => !line[col] || line[col] === ' '));

function splitAtColumns(line: string, columns: number[]): string[] {
    const parts: string[] = [];
    let start = -1;

    for (const col of columns) {
        if (col > start && col <= line.length) {
            parts.push(line.slice(start + 1, col));
            start = col;
        }
    }

    if (start < line.length) {
        parts.push(line.slice(start + 1));
    }

    return parts;
}

const part2 = data
    .slice(0, -1)
    .map((line) => splitAtColumns(line, blankColumns(data)))
    .reduce((acc, line) => {
        line.forEach((part, idx) => {
            for (let i = 0; i < part.length; i++) {
                const c = part.at(i) || "";
                acc[idx][i] = (acc[idx][i] || "") + c;
            }
        });
        return acc;
    }, operators.map((_) => [""]))
    .map((row) => row.map(Number))
    .map((row, index) => {
        const op = operators[index];
        return row.reduce((a, b) => {
            return op === "+" ? a + b : a * b;
        }, op === "+" ? 0 : 1)
    })
    .reduce((a, b) => a + b, 0);

console.log("Part2:", part2);
