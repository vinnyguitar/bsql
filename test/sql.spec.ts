import bsql, { Bsql } from '../src';

interface TestUser {
    id: number;
    name: string;
    age: number;
    address: string;
    zipCode: number;
}

describe('query test', () => {
    let db: Bsql;

    beforeAll(async () => {
        db = bsql({
            database: 'bsql_test',
            host: 'cd-cdb-lkbs4hfm.sql.tencentcdb.com',
            password: 'bsql_test',
            port: 63841,
            user: 'bsql_test',
        });
    });

    test('insert one', async () => {
        const result = await db.insert([{ name: 'first test', zipCode: 88 }]).into('user');
        const [user] = await db.select<TestUser>('zipCode').from('user').where({ id: result.insertId });
        expect(user.zipCode).toBe(88);
    });

    test('delete all', async () => {
        const result = await db.delete({ id: { $gt: 0 } }).from('user');
        expect(result.affectedRows).toBeGreaterThan(0);
    });

    test('insert many', async () => {
        const users = [{
            address: 'a1',
            age: 1,
            name: 'one',
            zipCode: 11,
        }, {
            address: 'a2',
            age: 2,
            name: 'two',
            zipCode: 11,
        }, {
            address: 'a3',
            age: 3,
            name: 'three',
            zipCode: 22,
        }, {
            address: 'a4',
            age: 4,
            name: 'four',
            zipCode: 22,
        }];
        const result = await db.insert(users).into('user');
        expect(result.affectedRows).toBe(users.length);
    });

    test('count', async () => {
        const count = await db.count().where({ zipCode: 22 });
        expect(count).toBe(2);
    });

    test('select all', async () => {
        const users = await db.select<TestUser>('*').from('user');
        expect(users.length).toBe(4);
        const first = users[0];
        expect(first.name).toBe('one');
        expect(first.age).toBe(1);
        expect(first.address).toBe('a1');
        expect(first.zipCode).toBe(11);
    });

    test('select one column', async () => {
        const [user] = await db.select<TestUser>('id', 'name').from('user');
        expect(user.name).toBe('one');
        expect(user.id).toBeGreaterThan(0);
        expect(user.address).toBeUndefined();
    });

});
