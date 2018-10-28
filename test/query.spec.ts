import { count, select, insertInto, deleteFrom } from '../src/query';
describe('test query', () => {
    test('test count', async () => {
        expect(await count('user', (sql, resolve) => resolve(sql))).toBe('SELECT COUNT(*) FROM `user`');
        expect(await count('user', (sql, resolve) => resolve(sql)).where({ a: 1 }, { b: 'c' })).toBe('SELECT COUNT(*) FROM `user` WHERE `a` = 1 OR `b` = \'c\'');
    });

    test('test select', async () => {
        const sql = await select(['name', 'age'], (sql, resolve) => resolve(sql))
            .from('user')
            .where({ age: { $gt: 1 } })
            .groupBy('age')
            .orderBy({ age: 'desc' })
            .limit(10)
            .offset(9);
        expect(sql).toBe('SELECT `name`,`age` FROM `user` WHERE `age` > 1 GROUP BY `age` ORDER BY `age` DESC LIMIT 10 OFFSET 9');
    });

    test('test insertInto', async () => {
        const vs = [{ a: 1, b: 2 }, { a: 2, b: 3, c: 4 }];
        expect(await insertInto('user', (sql, resolve) => resolve(sql)).values(vs))
            .toBe('INSERT INTO `user` (`a`,`b`,`c`) VALUES (1, 2, NULL),(2, 3, 4)');
    });

    test('test deleteFrom', async () => {
        expect(await deleteFrom('user', (sql, resolve) => resolve(sql)).where({a: 1}).limit(2).offset(10))
            .toBe('DELETE FROM `user` WHERE `a` = 1 LIMIT 2 OFFSET 10');
    });
});