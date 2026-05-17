import { range } from "./util";

// generate dart map
const map = new Map<string, number>();
map.set('0', 0);
for (const points of [...range(1, 20), 25]){
    map.set(`${points}`, points);
    map.set(`D${points}`, 2*points);
    map.set(`T${points}`, 3*points);
}

/**
 * usage example: `dartMap('D20')`
 */
export function dartMap(dart: string) {
    if (!map.has(dart)) {
        throw new Error(`Dart '${dart}' not defined.`);
    }
    return map.get(dart)!;
}
