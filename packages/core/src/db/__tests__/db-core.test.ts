import { describe, expect, it } from "vitest";
import { parseJSON } from "../db-core";

describe("parseJSON", () => {
  it("parses valid JSON string", () => {
    expect(parseJSON('["a","b"]', [])).toEqual(["a", "b"]);
  });

  it("returns fallback for null input", () => {
    expect(parseJSON(null, [])).toEqual([]);
  });

  it("returns fallback for undefined input", () => {
    expect(parseJSON(undefined, "default")).toBe("default");
  });

  it("returns fallback for empty string", () => {
    expect(parseJSON("", { key: "val" })).toEqual({ key: "val" });
  });

  it("returns fallback for invalid JSON", () => {
    expect(parseJSON("{broken", 42)).toBe(42);
  });

  it("parses nested objects", () => {
    const input = '{"a":{"b":1},"c":[2,3]}';
    expect(parseJSON(input, null)).toEqual({ a: { b: 1 }, c: [2, 3] });
  });
});

