import { readFileSync } from "fs";

interface Machine {
    lightsMask: number,
    buttonMasks: number[],
    buttonSeqs: number[][],
    joltage: number[],
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
        buttonSeqs: buttonIndex,
        joltage: peelString(parts[parts.length - 1]).split(',').map(Number),
    };
}

const machines = readFileSync("data/10_test.txt", "utf8").split("\n").map(toMachine);

const findMinimumPresses = (machine: Machine): number => {
    if (machine.lightsMask === 0) return 0;
    if (machine.buttonMasks.length === 0) return Infinity;

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

const findMinimumJoltagePresses = (machine: Machine): number => {
    if (machine.lightsMask === 0) return 0;
    if (machine.buttonMasks.length === 0) return Infinity;

    const toKey = (joltage: number[]): number => {
        let key = 0;
        for (let i = 0; i < joltage.length; i++) {
            key = key * 32 + joltage[i];
        }
        return key;
    };
    const visited = new Set<number>();
    const allLightsOff = 0;
    const joltageQueue: number[][] = [machine.joltage.map((_) => 0)];
    visited[toKey(joltageQueue[0])] = true;

    let buttonPresses = 0;
    while (joltageQueue.length > 0) {
        const joltageToCheck = joltageQueue.length;
        ++buttonPresses;

        for (let i = 0; i < joltageToCheck; i++) {
            const joltage = joltageQueue.shift()!;
            console.log('joltage', joltage, i);

            for (const seq of machine.buttonSeqs) {
                for (const idx of seq) joltage[idx]++;
                const undoJoltageChange = () => {
                    for (const idx of seq) joltage[idx]--;
                }

                if (joltage.some((v, i) => v > machine.joltage[i])) {
                    undoJoltageChange();
                    continue;
                }

                if (joltage.every((v, i) => v === machine.joltage[i])) {
                    return buttonPresses;
                }

                const key: number = toKey(joltage);
                if (!visited.has(key)) {
                    visited.add(key);
                    joltageQueue.push(joltage.slice()); // only copy when enqueueing new state
                }

                undoJoltageChange();
            }
        }
    }

    return Infinity;
}


console.log("Part2:", machines.map(findMinimumJoltagePresses).reduce((a, v) => a + v, 0));
