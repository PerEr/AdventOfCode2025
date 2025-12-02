import { readFileSync } from "fs";

const ranges = readFileSync("data/2.txt", "utf8").split(",").map((r) => {
    const parts = r.split("-");
    return { l: +parts[0], h: +parts[1] };
})

const findInvalidIds = (pair: { l: number, h: number }, isInvalid: (str: string) => boolean) => {
    let invalidIds: Array<number> = [];
    for (let ii = pair.l; ii <= pair.h; ii++) {
        const str = ii.toString();
        if (isInvalid(str)) {
            invalidIds.push(ii);
        }
    }
    return invalidIds;
}

console.log("Part1: ", ranges.flatMap((pair: { l: number, h: number }) => {
    return findInvalidIds(pair, (str: string) =>
        str.length % 2 == 0 && str.slice(0, str.length / 2) === str.slice(str.length / 2)
    );
}).reduce((a, b) => a + b, 0));

console.log("Part2: ", ranges.flatMap((pair: { l: number, h: number }) => {
    return findInvalidIds(pair, (str: string) => {
        for (let jj = 1; jj <= str.length / 2; jj++) {
            if (str.slice(0, jj).repeat(str.length / jj) == str) {
                return true;
            }
        }
        return false;
    });
}).reduce((a, b) => a + b, 0));