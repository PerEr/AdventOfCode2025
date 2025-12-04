import { readFileSync } from "fs";

const masterGrid = readFileSync("data/4.txt", "utf8").split("\n").map((l) => l.trim().split(""))
const deltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const countNeighbors = (grid: string[][], x: number, y: number) => {
    return deltas.filter(([dx, dy]) => {
        const [nx, ny] = [x + dx, y + dy];
        return ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length && grid[ny][nx] === "@";
    }).length;
}

function* gridCoordinates(grid: string[][]): Generator<[number, number, string]> {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            yield [x, y, grid[y][x]];
        }
    }
}

const countMovables = (grid: string[][], limit: number) => {
    return [...gridCoordinates(grid)].filter(([x, y, value]) => {
        return value === "@" && countNeighbors(grid, x, y) < limit;
    }).length;
}

console.log("Part1:", countMovables(masterGrid, 4));

const pruneGrid = (grid: string[][], limit: number) => {
    let outGrid = grid.map(row => row.slice());
    return [...gridCoordinates(grid)].reduce((acc, [x, y, value]) => {
        if (value === "@" && countNeighbors(grid, x, y) < limit) {
            acc.grid[y][x] = ".";
            acc.count++;
        }
        return acc;
    }, { grid: outGrid, count: 0 });
}

const countRequiredPrunings = (grid: string[][], limit: number): number => {
    const result: { grid: string[][], count: number } = pruneGrid(grid, limit);
    return result.count === 0 ? 0 : result.count + countRequiredPrunings(result.grid, limit);
};

console.log("Part2:", countRequiredPrunings(masterGrid, 4));