import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

// Testing functions that read from the file system can be tricky
// because the file system is a global variable
export async function parsePeopleCsv(filePath) {
  const csvData = await readFile(filePath, { encoding: "utf8" });
  const records = parse(csvData, {
    skip_empty_lines: true,
    trim: true,
  });
  return records.map(([firstName, lastName, age, gender]) => {
    const person = {
      firstName,
      lastName,
      gender: gender.charAt(0).toLowerCase(),
    };
    if (age !== "") {
      person.age = parseInt(age);
    }
    return person;
  });
}

// Decoupling the file reading from the parsing makes the code easier to test
export function parsePeopleCsvRefactored(csvData) {
  const records = parse(csvData, {
    skip_empty_lines: true,
    trim: true,
  });
  return records.map(([firstName, lastName, age, gender]) => {
    const person = {
      firstName,
      lastName,
      gender: gender.charAt(0).toLowerCase(),
    };
    if (age !== "") {
      person.age = parseInt(age);
    }
    return person;
  });
}

export async function readUtf8File(path) {
  return await readFile(path, { encoding: "utf8" });
}
