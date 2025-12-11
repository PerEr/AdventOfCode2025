import { readFileSync } from "fs";

const graph: Map<string, string[]> = readFileSync("data/11.txt", "utf8").split("\n").reduce((n, l) => {
    const parts = l.split(": ");
    n.set(parts[0], parts[1].split(' '))
    return n;
}, new Map<string, string[]>());

const countPaths = (start: string, target: string): number => {
    const cache = new Map<string, number>();

    function dfs(node: string): number {
        if (node === target) return 1;
        if (cache.has(node)) return cache.get(node)!;
        const paths = (graph.get(node) || []).reduce((s, n) => s + dfs(n), 0);
        cache.set(node, paths);
        return paths;
    }

    return dfs(start);
}

console.log('Part1:', countPaths('you', 'out'));

const countPathsVia = (start: string, target: string, via1: string, via2: string): number =>
    countPaths(start, via1) * countPaths(via1, via2) * countPaths(via2, target) +
    countPaths(start, via2) * countPaths(via2, via1) * countPaths(via1, target);


console.log('Part2:', countPathsVia('svr', 'out', 'dac', 'fft'));
