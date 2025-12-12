import { readFileSync } from "fs";

const parts = readFileSync("data/12.txt", "utf8").split('\n\n');

const shapeGrids: boolean[][][] = parts.slice(0, -1)
    .map(block => block.split('\n').slice(1))  // Skip the header line
    .map(shape => shape.map(row => row.split('').map(ch => ch === '#')));

interface Region {
    width: number,
    height: number,
    shapeCounters: number[],
}

const regions = parts.at(-1)?.split('\n').map((line) => {
    const parts = line.split(' ');
    const dim = parts[0].split('x');
    return {
        width: Number(dim[0]),
        height: Number(dim[1].split(':')[0]),
        shapeCounters: parts.slice(1).map(Number),
    }
}) ?? [];

const rotateShape = (shape: boolean[][], rotation: number): boolean[][] =>
    Array(rotation).fill(0).reduce(
        (acc) => acc[0].map((_, i) => acc.map(row => row[i]).reverse()),
        shape
    );

// Create a bitmask representing which cells a shape occupies when placed at a specific position and rotation
const shapeOccupancyMaskFromPositionAndRotation = (
    size: { width: number; height: number },
    pos: { x: number; y: number },
    shape: boolean[][],
    rotation: number
): bigint => {
    // For each occupied cell in the rotated shape, set the corresponding index bits in the mask
    return rotateShape(shape, rotation)
        .flatMap((row, y) =>
            row.map((occupied, x) =>
                occupied ? { x: pos.x + x, y: pos.y + y } : null
            )
        )
        .reduce((mask: bigint, cell) => {
            if (cell === null) return mask;
            const idx = cell.x + cell.y * size.width; // Convert 2D coords to 1D bit index
            return mask | (1n << BigInt(idx));
        }, 0n);
};

// Generate all valid occupancy masks for each shape type in the given region
// Returns an array where occupancyMasksPerShape[i] contains all possible placements for shape i
const preComputeOccupanyMasksPerShape = (size: { width: number, height: number }, shapes: boolean[][][]): bigint[][] => {
    const occupancyMasksPerShape: bigint[][] = shapes.map(() => []);

    // Try every position in the region (shapes are 3x3, so valid positions are from 0 to size-3)
    for (let y = 0; y <= size.height - 3; y++) {
        for (let x = 0; x <= size.width - 3; x++) {
            shapes.forEach((shape, shapeIndex) => {
                const uniqueOccupancyMasks = new Set<bigint>();
                for (let rotation = 0; rotation < 4; rotation++) {
                    const shapeOccupancyMask = shapeOccupancyMaskFromPositionAndRotation(size, { x, y }, shapes[shapeIndex], rotation);
                    if (!uniqueOccupancyMasks.has(shapeOccupancyMask)) {
                        uniqueOccupancyMasks.add(shapeOccupancyMask);
                        occupancyMasksPerShape[shapeIndex].push(shapeOccupancyMask);
                    }
                }
            });
        }
    }

    return occupancyMasksPerShape;
};

const countBitsSetInOccupancyMask = (n: bigint): number => {
    let count = 0;
    while (n > 0n) {
        count += Number(n & 1n);
        n >>= 1n;
    }
    return count;
};

const tryPlaceShapesInRegion = (region: Region, shapes: boolean[][][]): boolean => {
    const occupancyMasksPerShape: bigint[][] = preComputeOccupanyMasksPerShape({ width: region.width, height: region.height }, shapes);

    const findSolution = (
        remainingCounts: number[],
        currentOccupancyMask: bigint
    ): boolean => {
        if (remainingCounts.every(c => c === 0)) return true;

        const shapeIndicies = remainingCounts
            .map((count, shapeIndex) => ({ count, shapeIndex }))
            .filter(({ count }) => count > 0)
            .map(({ shapeIndex }) => shapeIndex);

        // Compute valid placements and coverable cells for each candidate shape
        const results = shapeIndicies.map((shapeIndex) => {
            const validOccupancyMasksForShape = occupancyMasksPerShape[shapeIndex]
                .filter(mask => (mask & currentOccupancyMask) === 0n);

            const occupancyMaskUnion = validOccupancyMasksForShape.reduce((acc, mask) => acc | mask, 0n);

            return {
                shapeIndex,
                validPlacements: validOccupancyMasksForShape,
                occupancyMaskUnion,
                numPlacements: validOccupancyMasksForShape.length,
            };
        });

        if (results.find((r) => r.numPlacements === 0 || r.numPlacements < remainingCounts[r.shapeIndex])) {
            return false;
        }

        // Choose most constrained shape 
        const mostConstrainedResult = results.reduce((best, curr) =>
            curr.numPlacements < best.numPlacements ? curr : best
        );

        // Try each valid placement recursively
        for (const placement of mostConstrainedResult.validPlacements) {
            remainingCounts[mostConstrainedResult.shapeIndex]--;
            if (findSolution(remainingCounts, currentOccupancyMask | placement)) {
                return true;
            }
            remainingCounts[mostConstrainedResult.shapeIndex]++; // backtrack
        }

        return false;
    };

    return findSolution([...region.shapeCounters], 0n);
};

console.log('Part1:', regions.map((region,index) => {
    const succeeded = tryPlaceShapesInRegion(region, shapeGrids);
    console.log(`region(${index})`, region, succeeded);
    return succeeded;
}).filter(Boolean).length);
