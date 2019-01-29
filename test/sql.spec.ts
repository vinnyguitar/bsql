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
            debug: ['ComQueryPacket'],
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
        }, {
            name: 'five',
        }];
        const result = await db.insert(users).into('user');
        expect(result.affectedRows).toBe(users.length);
    });

    test('count', async () => {
        const count = await db.count().from('user').where({ zipCode: 22 });
        expect(count).toBe(2);
    });

    test('select all', async () => {
        const users = await db.select<TestUser>('*').from('user');
        expect(users.length).toBe(5);
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

    test('select where gt', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $gt: 2 } });
        expect(list.length).toBe(2);
        expect(list[0].name).toBe('three');
    });

    test('select where gte', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $gte: 2 } });
        expect(list.length).toBe(3);
        expect(list[0].name).toBe('two');
    });

    test('select where lt', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $lt: 2 } });
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('one');
    });

    test('select where lte', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $lte: 2 } });
        expect(list.length).toBe(2);
        expect(list[0].name).toBe('one');
    });

    test('select where not', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $not: 1 } });
        expect(list.length).toBe(3);
        expect(list[0].name).toBe('two');
    });

    test('select where like', async () => {
        const list = await db.select<TestUser>().from('user').where({ name: { $like: '%o%' } });
        expect(list.length).toBe(3);
        expect(list[0].name).toBe('one');
    });

    test('select where not like', async () => {
        const list = await db.select<TestUser>().from('user').where({ name: { $notLike: '%o%' } });
        expect(list.length).toBe(2);
        expect(list[0].name).toBe('three');
    });

    test('select where in', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $in: [3, 4] } });
        expect(list.length).toBe(2);
        expect(list[0].name).toBe('three');
    });

    test('select where not in', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $notIn: [1, 2] } });
        expect(list.length).toBe(2);
        expect(list[0].name).toBe('three');
    });

    test('select where is null', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $isNull: true } });
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('five');
    });

    test('select where is not null', async () => {
        const list = await db.select<TestUser>().from('user').where({ age: { $isNull: false } });
        expect(list.length).toBe(4);
        expect(list[0].name).toBe('one');
    });

    test('select where and', async () => {
        const [user] = await db.select<TestUser>().from('user').where({ zipCode: 22, address: 'a4' });
        expect(user.name).toBe('four');
    });

    test('select where or', async () => {
        const list = await db.select<TestUser>()
            .from('user')
            .where({ $or: [{ age: { $lt: 2 } }, { zipCode: 22 }] });
        expect(list.length).toBe(3);
        expect(list[0].name).toBe('one');
    });

});
