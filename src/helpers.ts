import { BigInt } from "@graphprotocol/graph-ts";
import { Counter } from "../generated/schema";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const COUNTER_ID = "0001";

export const COUNTER_FIELDS = Counter.prototype.entries;
export function getCount(id: string, fieldName: string, inc: boolean): BigInt {
    let counter = Counter.load(id);
    if (counter) {
        let cnt: BigInt = counter[fieldName] as BigInt;
        if (inc) {
            counter[fieldName] = cnt.plus(BigInt.fromI32(1));
            counter.save();
            return cnt;
        }
        return counter[fieldName] as BigInt;
    }
    counter = new Counter(id);
    counter.updateSpec = BigInt.fromString(inc ? "1" : "0");
    counter.save();
    return BigInt.fromI32(0);
}