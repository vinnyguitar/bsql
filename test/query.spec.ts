import { Query } from '../src/query';

class TestQuery extends Query<string> {
    public test() {
        return 'test';
    }

    protected getSql() {
        return ['sql'];
    }
}

describe('query test', () => {
    const query = new TestQuery((sql, cb) => setTimeout(() => cb(null, sql), 100));

    test('invoke method', async () => {
        expect(query.test()).toBe('test');
    });

    test('promise', async () => {
        expect(await query).toBe('sql;');
    });
});
