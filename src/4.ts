import { readFileSync } from "fs";

const masterGrid = readFileSync("data/4.txt", "utf8").split("\n").map((l) => l.split(""))

const countNeighbors = (grid: string[][], x: number, y: number) => {
    return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].map(([dx, dy]) => {
        const [nx, ny] = [x + dx, y + dy];
        return ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length && grid[ny][nx] === "@";
    }).filter(v => v).length;
}

function* gridCoordinates(grid: string[][]): Generator<[number, number, string]> {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            yield [x, y, grid[y][x]];
        }
    }
}

const countMovables = (grid: string[][],limit: number) => {
    return [...gridCoordinates(grid)].map(([x, y, value]) => {
        return value === "@" && countNeighbors(grid, x, y) < limit;
    }).filter(v => v).length;
}

console.log("Part1:", countMovables(masterGrid, 4));
