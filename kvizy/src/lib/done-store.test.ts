import { describe, expect, it } from "vitest";
import { parseDoneIds, serializeDoneIds, withDone } from "./done-store";

describe("done ids in localStorage", () => {
  it("round-trips ids", () => {
    const ids = new Set([12, 3, 7]);
    expect(serializeDoneIds(ids)).toBe("[3,7,12]");
    expect([...parseDoneIds(serializeDoneIds(ids))].sort((a, b) => a - b)).toEqual([3, 7, 12]);
  });

  it("ignores missing, malformed and foreign values", () => {
    expect(parseDoneIds(null).size).toBe(0);
    expect(parseDoneIds("not json").size).toBe(0);
    expect(parseDoneIds('{"a":1}').size).toBe(0);
    expect([...parseDoneIds('[1,"2",-3,4.5,5]')]).toEqual([1, 5]);
  });

  it("marks and unmarks without mutating the previous set", () => {
    const empty = new Set<number>();
    const one = withDone(empty, 4, true);
    expect([...one]).toEqual([4]);
    expect(empty.size).toBe(0);
    expect(withDone(one, 4, true)).toBe(one);
    expect([...withDone(one, 4, false)]).toEqual([]);
  });
});
