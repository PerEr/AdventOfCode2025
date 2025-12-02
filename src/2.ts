import { readFileSync } from "fs";

const ranges = readFileSync("data/2.txt", "utf8").split(",").map((r) => {
  const parts = r.split("-");
  return {l: +parts[0], h: +parts[1]};
})

const findInvalids = (pair: {l: number, h: number}) => {
    let invalids: Array<number> = [];
    for (let ii=pair.l; ii<=pair.h; ii++) {
        const str = ii.toString();
        if (str.length % 2 == 0) {
            if (str.slice(0, str.length/2) === str.slice(str.length/2)) {
                invalids.push(ii);
            }
        }
    }
    return invalids;
}

const findInvalids2 = (pair: {l: number, h: number}) => {
    let invalids: Array<number> = [];
    for (let ii=pair.l; ii<=pair.h; ii++) {
        const str = ii.toString();
        for (let jj=1; jj<=str.length/2; jj++) {
            const pattern = str.slice(0, jj);
            let repeatPattern = "";
            while (repeatPattern.length < str.length) {
                repeatPattern += pattern;
            }
            if (repeatPattern == str) {
                invalids.push(ii);
                break;
            }
        }
    }
    return invalids;
}


console.log("Part1: ", ranges.flatMap(findInvalids).reduce((a, b) => a + b, 0));
console.log("Part2: ", ranges.flatMap(findInvalids2).reduce((a, b) => a + b, 0));