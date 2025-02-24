import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmasRefactored } from "../src/untestable1.mjs";

describe("Untestable 1: days until Christmas", () => {
  test("returns days until Christmas", () => {
    const now = new Date("2025-12-01");
    expect(daysUntilChristmasRefactored(now)).to.equal(24);
  });
});
