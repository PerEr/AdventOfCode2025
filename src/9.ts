import { readFileSync } from "fs";

type Point = { x: number; y: number };

const positions = readFileSync("data/9.txt", "utf8").split("\n")
    .map((line) => line.split(",").map(Number))
    .map((num) => ({ x: num[0], y: num[1] }));

const findMaxArea = () => {
    let areas: number[] = [];
    for (let r = 0; r < positions.length; ++r) {
        const p1 = positions[r];
        for (let c = r + 1; c < positions.length; ++c) {
            const p2 = positions[c];
            const a: number = (Math.abs(p2.x - p1.x) + 1) * (Math.abs(p2.y - p1.y) + 1);
            areas.push(a);
        }
    }
    return areas.reduce((a, v) => Math.max(a, v), 0);
};
console.log("Part1:", findMaxArea());
