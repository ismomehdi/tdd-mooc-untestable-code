import { readFileSync } from "fs";
import { beforeAll, describe, test, expect, afterAll } from "vitest";
import { PasswordServiceRefactored, PostgresUserDaoRefactored, connectToDb } from "../src/untestable4.mjs";

// should actually use .env file for these
process.env.PGUSER = "untestable";
process.env.PGPASSWORD = "secret";
process.env.PGDATABASE = "untestable";
process.env.PGHOST = "localhost";
process.env.PGPORT = "5432";

const initTestDb = async () => {
  try {
    const db = connectToDb();

    // Drop and recreate the tables
    await db.query(readFileSync("./src/drop-tables.sql", { encoding: "utf8", flag: "r" }));
    await db.query(readFileSync("./src/create-tables.sql", { encoding: "utf8", flag: "r" }));

    return db;
  } catch (e) {
    throw new Error(
      "Failed to connect to the database. Is the Docker container running? Run 'docker-compose up -d' first.",
    );
  }
};

class FakePasswordHasher {
  hashPassword(password) {
    return password;
  }
  verifyPassword(hash, password) {
    return hash === this.hashPassword(password);
  }
}

describe("Untestable 4: enterprise application", () => {
  describe("PosrgresUserDao", async () => {
    let dao;
    let db;

    beforeAll(async () => {
      db = await initTestDb();
      dao = new PostgresUserDaoRefactored(db);
    });

    afterAll(async () => {
      await db.end();
    });

    test("save user & get by id", async () => {
      await dao.save({ userId: 1, passwordHash: "hash" });
      let user = await dao.getById(1);
      expect(user).toEqual({ userId: 1, passwordHash: "hash" });
    });
  });

  describe("PasswordService", () => {
    let service;
    let db;
    let hasher;
    let dao;

    beforeAll(async () => {
      db = await initTestDb();
      dao = new PostgresUserDaoRefactored(db);
      hasher = new FakePasswordHasher();
      service = new PasswordServiceRefactored(dao, hasher);
    });

    afterAll(async () => {
      await db.end();
    });

    test("save user & change password", async () => {
      await dao.save({ userId: 1, passwordHash: "old" });
      await service.changePassword(1, "old", "new");
      let user = await service.users.getById(1);
      expect(user).toEqual({ userId: 1, passwordHash: "new" });
    });
  });
});
