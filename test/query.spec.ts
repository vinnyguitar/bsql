import { count, deleteFrom, insertInto, select, update } from "../src/query";
describe("test query", () => {
    test("test count", async () => {
        const tob1 = "SELECT COUNT(*) AS count FROM `user`";
        const tob2 = "SELECT COUNT(*) AS count FROM `user` WHERE `a` = 1 OR `b` = 'c'";
        expect(await count("user", (sql, resolve) => resolve(sql))).toBe(tob1);
        expect(await count("user", (sql, resolve) => resolve(sql)).where({ a: 1 }, { b: "c" })).toBe(tob2);
    });

    test("test select", async () => {
        const sql = await select(["name", "age"], (sql1, resolve) => resolve(sql1))
            .from("user")
            .where({ age: { $gt: 1 } })
            .groupBy("age")
            .orderBy(["age", -1])
            .limit(10)
            .offset(9);
        const tobe = "SELECT `name`,`age` FROM `user` WHERE `age` > 1 " +
            "GROUP BY `age` ORDER BY `age` DESC LIMIT 10 OFFSET 9";
        expect(sql).toBe(tobe);
    });

    test("test insertInto", async () => {
        const vs = [{ a: 1, b: 2 }, { a: 2, b: 3, c: 4 }];
        expect(await insertInto("user", (sql, resolve) => resolve(sql)).values(vs))
            .toBe("INSERT INTO `user` (`a`,`b`,`c`) VALUES (1, 2, NULL),(2, 3, 4)");
    });

    test("test deleteFrom", async () => {
        expect(await deleteFrom("user", (sql, resolve) => resolve(sql)).where({ a: 1 }).limit(2).offset(10))
            .toBe("DELETE FROM `user` WHERE `a` = 1 LIMIT 2 OFFSET 10");
    });

    test("test update", async () => {
        expect(await update("user", (sql, resolve) => resolve(sql)).set({ a: 1, b: 2 }).where({ c: 3 }))
            .toBe("UPDATE `user` SET `a` = 1, `b` = 2 WHERE `c` = 3");
    });
});
