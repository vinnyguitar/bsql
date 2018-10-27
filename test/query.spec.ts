import { count, select } from '../src/query';
describe('test query', () => {
    test('test count', async () => {
        expect(await count('user', (sql, resolve) => resolve(sql))).toBe('SELECT COUNT(*) FROM `user`');
        expect(await count('user', (sql, resolve) => resolve(sql)).where({ a: 1 }, { b: 'c' })).toBe('SELECT COUNT(*) FROM `user` WHERE `a` = 1 OR `b` = \'c\'');
    });

    test('test select', async () => {
        const sql = await select(['name', 'age'], (sql, resolve) => resolve(sql))
            .from('user')
            .where({age: {$gt: 1}})
            .groupBy('age')
            .orderBy({age: 'desc'})
            .limit(10)
            .offset(9);
        expect(sql).toBe('SELECT `name`,`age` FROM `user` WHERE `age` > 1 GROUP BY `age` ORDER BY `age` DESC LIMIT 10 OFFSET 9');
    });
});