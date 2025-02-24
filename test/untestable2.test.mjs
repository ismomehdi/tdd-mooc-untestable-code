import { describe, test, vi } from "vitest";
import { expect } from "chai";
import { diceHandValueRefactored, diceRoll } from "../src/untestable2.mjs";

describe("Untestable 2: a dice game", () => {
  test("returns correct points for all dice combinations", () => {
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        if (i === j) {
          expect(diceHandValueRefactored(i, j)).to.equal(100 + i);
        } else {
          expect(diceHandValueRefactored(i, j)).to.equal(Math.max(i, j));
        }
      }
    }
  });

  test("returns correct value for dice roll", () => {
    vi.spyOn(global.Math, "random").mockReturnValue(0.123456789);
    expect(diceRoll()).to.equal(1);
  });
});
