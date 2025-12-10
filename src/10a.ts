import { readFileSync } from "fs";

interface Machine {
    lightsMask: number,
    buttonMasks: number[],
};

const toMachine = (line: string): Machine => {
    const peelString = (str: string): string => {
        return str.slice(1, -1);
    };
    const parts = line.split(' ');
    const buttonIndex: number[][] = parts.slice(1, -1).map(peelString).map((s) => s.split(',').map(Number));

    return {
        lightsMask: peelString(parts[0]).split('').reduce((a, v, i) => a + ((v === '#' ? 1 : 0) << i), 0),
        buttonMasks: buttonIndex.map((l) => l.reduce((mask, v) => mask + (1 << v), 0)),
    };
}

const machines = readFileSync("data/10.txt", "utf8").split("\n").map(toMachine);

const findMinimumPresses = (machine: Machine): number => {
    const visited = new Set<number>();
    const allLightsOff = 0;
    const lightsMaskQueue: number[] = [allLightsOff];
    visited[allLightsOff] = true;

    let buttonPresses = 0;
    while (lightsMaskQueue.length > 0) {
        const maskToCheck = lightsMaskQueue.length;
        ++buttonPresses;

        for (let i = 0; i < maskToCheck; i++) {
            const lightsMask = lightsMaskQueue.shift()!;

            for (const buttonMask of machine.buttonMasks) {
                const nextLightsMask = lightsMask ^ buttonMask;

                if (nextLightsMask === machine.lightsMask) {
                    return buttonPresses;
                }

                if (!visited.has(nextLightsMask)) {
                    visited.add(nextLightsMask);
                    lightsMaskQueue.push(nextLightsMask);
                }
            }
        }
    }

    return Infinity;
}

console.log("Part1:", machines.map(findMinimumPresses).reduce((a, v) => a + v, 0));
