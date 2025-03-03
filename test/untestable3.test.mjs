import { describe, test } from "vitest";
import { expect } from "chai";
import { parsePeopleCsvRefactored, readUtf8File } from "../src/untestable3.mjs";

describe("Untestable 3: CSV file parsing", () => {
  test("reads file", async () => {
    expect(await readUtf8File("./test/example.csv")).to.equal("testing\n");
  });

  test("parses data correctly", () => {
    const input = `Loid,Forger,,Male
                  Anya,Forger,6,Female
                  Yor,Forger,27,Female
                  `;

    const expected = [
      { firstName: "Loid", lastName: "Forger", gender: "m" },
      { firstName: "Anya", lastName: "Forger", age: 6, gender: "f" },
      { firstName: "Yor", lastName: "Forger", age: 27, gender: "f" },
    ];

    expect(parsePeopleCsvRefactored(input)).to.deep.equal(expected);
  });
});
