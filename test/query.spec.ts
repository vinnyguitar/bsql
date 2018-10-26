import { count } from '../src/query';
describe('test query', () => {
    test('test count', async() => {
        expect( await count('user')).toBe('SELECT COUNT(*) FROM `user`');
        expect( await count('user').where({a: 1}, {b: 'c'})).toBe('SELECT COUNT(*) FROM `user` WHERE `a` = 1 OR `b` = \'c\'');
    });
});