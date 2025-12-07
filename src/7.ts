import { readFileSync } from "fs";

const { grid, startPos } = ((filename: string) => {
    const grid = readFileSync(filename, "utf8").split(/\r?\n/);
    const start = grid.flatMap((line, r) =>
        line.includes("S") ? [{ r, c: line.indexOf("S") }] : []
    )[0] || { r: 0, c: 0 };
    return { grid, startPos: start };
})("data/7.txt");

type Pos = { r: number; c: number };
const posToKey = (pos: Pos) => `${pos.r},${pos.c}`;

const findSplits = ({ r, c }: Pos, splits = new Set<string>()): number => {
    if (r >= grid.length) return splits.size;
    const key = posToKey({ r, c });
    if (splits.has(key)) return splits.size;
    if (grid[r][c] === '^') {
        splits.add(key);
        findSplits({ r, c: c - 1 }, splits);
        findSplits({ r, c: c + 1 }, splits);
        return splits.size;
    }
    return findSplits({ r: r + 1, c }, splits);
}

console.log("Part1: ", findSplits(startPos));

const findQuantumPaths = ({ r, c }: Pos, cache = new Map<string, number>()): number => {
    if (r >= grid.length) return 1;
    if (c < 0 || c >= grid[r].length) return 0;
    const key = posToKey({ r, c });
    if (cache.has(key)) return cache.get(key)!;
    const res = grid[r][c] === '^'
        ? findQuantumPaths({ r, c: c - 1 }, cache) + findQuantumPaths({ r, c: c + 1 }, cache)
        : findQuantumPaths({ r: r + 1, c }, cache);
    cache.set(key, res);
    return res;
};

console.log("Part2: ", findQuantumPaths(startPos));
