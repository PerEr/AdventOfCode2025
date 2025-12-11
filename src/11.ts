import { readFileSync } from "fs";

const nodes: Map<string, string[]> = readFileSync("data/11.txt", "utf8").split("\n").reduce((n, l) => {
    const parts = l.split(": ");
    n.set(parts[0], parts[1].split(' '))
    return n;
}, new Map<string, string[]>());

const countPaths = (
    graph: Map<string, string[]>,
    start: string,
    target: string
): number => {
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

console.log('Part1:', countPaths(nodes, 'you', 'out'));
