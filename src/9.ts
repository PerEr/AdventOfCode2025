import { readFileSync } from "fs";

type Point = { x: number; y: number };

const input: Point[] = readFileSync("data/9.txt", "utf8").split("\n")
    .map((line) => line.split(",").map(Number))
    .map((num) => ({ x: num[0], y: num[1] }));

const findMaxArea = (points: Point[]) => {
    return points.flatMap((p1, ix) =>
        points.slice(ix + 1).map(p2 =>
            (Math.abs(p2.x - p1.x) + 1) * (Math.abs(p2.y - p1.y) + 1)
        )
    ).reduce((a, v) => Math.max(a, v), 0);
};
console.log("Part1:", findMaxArea(input));

const isPointInside = (points: Point[], point: Point): boolean=> {
    const isOnLine = (p: Point, a: Point, b: Point): boolean => {
        if (a.y === b.y) { // Horizontal
            if (p.y !== a.y) return false;
            const minX = Math.min(a.x, b.x);
            const maxX = Math.max(a.x, b.x);
            return p.x >= minX && p.x <= maxX;
        }
        if (a.x === b.x) { // Vertical
            if (p.x !== a.x) return false;
            const minY = Math.min(a.y, b.y);
            const maxY = Math.max(a.y, b.y);
            return p.y >= minY && p.y <= maxY;
        }
        return false;
    }

    let inside = false;
    for (let i = 0; i < points.length; i++) {
        const [a, b] = [points[i], points[(i + 1) % points.length]];
        if (isOnLine(point, a, b)) return true;
        if (a.y === b.y) continue;
        const [lower, higher] = a.y <= b.y ? [a, b] : [b, a];
        const crosses = point.y > lower.y && point.y <= higher.y && higher.x > point.x;
        if (crosses) inside = !inside;
    }

    return inside;
}

const findMaxAreaInside = (points: Point[]) => {
    const xs = Array.from(new Set(points.map(p => p.x)));
    const ys = Array.from(new Set(points.map(p => p.y)));

    const isInsideLookupMap = new Map<string, boolean>();
    xs.forEach(x =>
        ys.forEach(y => {
            isInsideLookupMap.set(`${x},${y}`, isPointInside(points, { x, y }));
        })
    );

    const isPointInsidePrecomputed = (x: number, y: number): boolean => {
        const key = `${x},${y}`;
        return isInsideLookupMap.get(key) ?? false;
    }

    return points.flatMap((p1, ix) =>
        points.slice(ix + 1).map(p2 => {
            const [x1, x2] = [Math.min(p1.x, p2.x), Math.max(p1.x, p2.x)];
            const [y1, y2] = [Math.min(p1.y, p2.y), Math.max(p1.y, p2.y)];
            const allInside = xs
                .filter(x => x >= x1 && x <= x2)
                .every(x =>
                    ys.filter(y => y >= y1 && y <= y2)
                        .every(y => isPointInsidePrecomputed(x, y))
                );
            return allInside ? (x2 - x1 + 1) * (y2 - y1 + 1) : 0;
        })
    ).reduce((a, v) => Math.max(a, v), 0);
};

console.log("Part2", findMaxAreaInside(input));
