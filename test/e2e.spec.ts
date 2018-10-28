import { jssql } from '../src/jssql';

const db = jssql({
    host: 'cd-cdb-lkbs4hfm.sql.tencentcdb.com',
    port: '63841',
    database: 'test',
    user: 'ib_dev',
    password: 'beVT2z*7zPsk^g',
});

const testData = [
    { name: 'abc', age: 1 },
    { name: 'def', age: 2 },
    { name: 'ghi', age: 3 }
];

describe('jssql e2e test', async () => {
    beforeAll(async () => {
        await db.deleteFrom('sql_test');
    });

    test('insert', async () => {
        const result = await db.insertInto('sql_test').values(testData);
        expect(result.affectedRows).toBe(3);
    });

    test('count', async () => {
        const count = await db.count('sql_test').where({ age: { $gte: 2 } });
        expect(count).toBe(2);
    });

    test('select', async () => {
        const result = await db.select(['name', 'age']).from('sql_test').where({ age: { $gte: 1 } });
        expect(result).toEqual(testData);
    });
});