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

console.log("Part1:", values.reduce((macc, row) => {
    row.forEach((value, idx) => {
        macc[idx].acc = macc[idx].fn(macc[idx].acc, value);
    });
    return macc;
}, metaAcc1).reduce((acc, { acc: val }) => acc + val, 0));

const splitAtColumns_ = (line: string, columns: number[]): string[] => {
    const effectiveColumns = columns.filter(col => 0 <= col && col <= line.length);
    const { parts, start } = effectiveColumns.reduce(
        ({ start, parts }, col) => ({ start: col, parts: [...parts, line.slice(start + 1, col)] }),
        { start: -1, parts: [] as string[] }
    );
    return start < line.length ? [...parts, line.slice(start + 1)] : parts;
};

const splitAtColumns = (line: string, columns: number[]): string[] =>
    columns
        .reduce((parts, col, idx) => {
            const start = idx === 0 ? 0 : columns[idx - 1] + 1;
            return [...parts, line.slice(start, col)];
        }, [] as string[])
        .concat(line.slice(columns.at(-1)! + 1));

const columnsToSplitAt = Array.from(
    { length: Math.max(0, ...data.map(l => l.length)) },
    (_, col) => col
).filter(col => data.every(line => line[col] === ' '));

console.log("Part2:", data
    .slice(0, -1)
    .map((line) => splitAtColumns(line, columnsToSplitAt))
    .reduce((acc, line) => {
        line.forEach((part, idx) => {
            for (let i = 0; i < part.length; i++) {
                acc[idx][i] = (acc[idx][i] || "") + part.at(i);
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
    .reduce((a, b) => a + b, 0));
