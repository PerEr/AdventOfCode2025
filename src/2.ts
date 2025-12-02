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

console.log("Part1: ", ranges.flatMap(findInvalids).reduce((a, b) => a + b, 0));