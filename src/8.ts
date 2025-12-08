import { readFileSync } from "fs";

const positions = readFileSync("data/8.txt", "utf8").split("\n").map((line) => line.split(",").map(Number));

interface MergeState {
    parents: number[];
    sizes: number[];
}

const findRootParent = (state: MergeState, x: number): number => {
    if (state.parents[x] !== x) {
        state.parents[x] = findRootParent(state, state.parents[x]); // path compression
    }
    return state.parents[x];
};

interface Edge { a: number; b: number; dist: number }

const getEdges = (pos: number[][]) => {
    const edges: Edge[] = [];
    for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
            const [x1, y1, z1] = pos[i].slice(0, 3);
            const [x2, y2, z2] = pos[j].slice(0, 3);
            const distance = (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2;
            edges.push({ a: i, b: j, dist: distance });
        }
    }
    edges.sort((e1, e2) => e1.dist - e2.dist);
    return edges;
}

const mergeNodes = (state: MergeState, a: number, b: number) => {
    const parentA = findRootParent(state, a);
    const parentB = findRootParent(state, b);
    if (parentA === parentB) return false;

    const [biggerParent, smallerParent] = state.sizes[parentA] < state.sizes[parentB] ? [parentB, parentA] : [parentA, parentB];
    state.parents[smallerParent] = biggerParent;
    state.sizes[biggerParent] += state.sizes[smallerParent];
    state.sizes[smallerParent] = 0;

    return true;
};

const createMergeState = (pos: number[][]): MergeState => {
    return {
        parents: Array.from({ length: pos.length }, (_, i) => i),
        sizes: Array(pos.length).fill(1),
    };
};

const circuitSizes = (
    pos: number[][],
    connections: number
): number[] => {
    const edges = getEdges(pos);
    const mergeState = createMergeState(pos);

    edges.slice(0, connections).forEach(({a,b}) => {
        mergeNodes(mergeState, a, b);
    });

    const sizeMap = new Map<number, number>();
    mergeState.parents.forEach((p, ix) => {
        const root = findRootParent(mergeState, ix);
        sizeMap.set(root, mergeState.sizes[root]);
    })

    return [...sizeMap.values()].sort((a, b) => b - a);
};

const sizes = circuitSizes(positions, positions.length > 20 ? 1000 : 10).slice(0,3);
console.log("Part1:", sizes[0] * sizes[1] * sizes[2]);

const lastToMerge = (
    pos: number[][]
): number[] => {
    const edges = getEdges(pos);
    const mergeState = createMergeState(pos);

    let lastMerged: [number, number] = [0, 0];
    edges.forEach(({a,b})=> {
        if (mergeNodes(mergeState, a, b)) {
            lastMerged = [a,b];
        }
    });

    return lastMerged;
};

const lastMergedNodes = lastToMerge(positions);
console.log("Part2:", positions[lastMergedNodes[0]][0] * positions[lastMergedNodes[1]][0]);
