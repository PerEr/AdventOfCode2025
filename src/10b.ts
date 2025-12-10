import { readFileSync } from "fs";
import solver from 'javascript-lp-solver';

interface Machine {
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
        buttonSeqs: buttonIndex,
        joltage: peelString(parts[parts.length - 1]).split(',').map(Number),
    };
}

const machines = readFileSync("data/10.txt", "utf8").split("\n").map(toMachine);

const findMinimumJoltagePresses = (machine: Machine): number => {
    const toKey = (light: number, button: number) => `${light},${button}`;
    const activations = (() => {
        const s = new Set<string>();
        machine.buttonSeqs.forEach((buttons, bix) => {
            buttons.forEach((light) => {
                s.add(toKey(light, bix))
            })
        });
        return s;
    })();

    // Set up model
    const targetVar = 'totalPresses';
    const model = {
        optimize: targetVar,
        opType: 'min',
        constraints: {},
        variables: {},
        ints: {}
    };

    const toConstraintName = (lightIndex: number) => `light${lightIndex}`;

    // Add joltage constraints
    machine.joltage.forEach((targetJolt, lightIndex) => {
        // This is the constraint, light jolted == target
        model.constraints[toConstraintName(lightIndex)] = { equal: targetJolt };
    });

    // Add integer variables
    machine.buttonSeqs.forEach((ButtonSeq, buttonIndex) => {
        const varName = `button${buttonIndex}`;
        model.variables[varName] = {};
        model.ints[varName] = 1;
        model.variables[varName][targetVar] = 1;
        machine.joltage.forEach((targetJolt, lightIndex) => {
            if (activations.has(toKey(lightIndex, buttonIndex))) {
                model.variables[varName][toConstraintName(lightIndex)] = 1;
            }
        });
    });

    return solver.Solve(model).result;
};

console.log("Part2:", machines.map(findMinimumJoltagePresses).reduce((a, v) => a + v, 0));

/*

Machine:
{
  "buttonSeqs": [
    [0, 1, 2, 3, 4],
    [0, 3, 4],
    [0, 1, 2, 4, 5],
    [1, 2]
  ],
  "joltage": [10, 11, 11, 5, 10, 5]
}

Model:
{
  "optimize": "totalPresses",
  "opType": "min",
  "constraints": {
    "light0": {
      "equal": 10
    },
    "light1": {
      "equal": 11
    },
    "light2": {
      "equal": 11
    },
    "light3": {
      "equal": 5
    },
    "light4": {
      "equal": 10
    },
    "light5": {
      "equal": 5
    }
  },
  "variables": {
    "button0": {
      "totalPresses": 1,
      "light0": 1,
      "light1": 1,
      "light2": 1,
      "light3": 1,
      "light4": 1
    },
    "button1": {
      "totalPresses": 1,
      "light0": 1,
      "light3": 1,
      "light4": 1
    },
    "button2": {
      "totalPresses": 1,
      "light0": 1,
      "light1": 1,
      "light2": 1,
      "light4": 1,
      "light5": 1
    },
    "button3": {
      "totalPresses": 1,
      "light1": 1,
      "light2": 1
    }
  },
  "ints": {
    "button0": 1,
    "button1": 1,
    "button2": 1,
    "button3": 1
  }
}

Solution:
{
  feasible: true,
  result: 10,
  bounded: true,
  isIntegral: true,
  button4: 3,
  button1: 5,
  button3: 1,
  button0: 1
}
*/