import { connect } from "../src/index";

const db = connect({
    database: "test",
    host: "cd-cdb-lkbs4hfm.sql.tencentcdb.com",
    password: "qa1234!!",
    port: "63841",
    user: "test",
});

const testData = [
    { name: "abc", age: 1 },
    { name: "def", age: 2 },
    { name: "ghi", age: 3 },
];

describe("jssql e2e test", async () => {
    beforeAll(async () => {
        await db.deleteFrom("sql_test");
    });

    test("insert", async () => {
        const result = await db.insertInto("sql_test").values(testData);
        expect(result.affectedRows).toBe(3);
    });

    test("count", async () => {
        const count = await db.count("sql_test").where({ age: { $gte: 2 } });
        expect(count).toBe(2);
    });

    test("select", async () => {
        const result = await db.select(["name", "age"]).from("sql_test").where({ age: { $gte: 1 } });
        expect(result).toEqual(testData);
    });

    test("update", async () => {
        const result = await db.update("sql_test").set({ name: "xyz" }).where({ name: "abc" });
        expect(result.affectedRows).toEqual(1);
    });

    test("batchUpdate", async () => {
        const rows = await db.select('*').from('sql_test');
        rows.forEach((r: any, i) => {
            r.name = i;
            r.age = i;
        });
        const result = await db.update("sql_test").set(rows, 'id');
        const rowsAfter = await db.select(['name', 'age']).from('sql_test');
        expect(rowsAfter).toEqual([
            { name: "0", age: 0 },
            { name: "1", age: 1 },
            { name: "2", age: 2 },
        ]);
    })
});
