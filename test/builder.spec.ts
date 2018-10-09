import { buildOffset, buildLimit, buildWhere } from '../src/builder';
describe('test builder', () => {
    test('test buildWhere', () => {
        expect(buildWhere({a: 1, b: 2, c: 3})).toBe('`a` = 1 AND `b` = 2 AND `c` = 3');
        expect(buildWhere(null, {a: 1, b: 2, c: 3})).toBe('`a` = 1 OR `b` = 2 OR `c` = 3');
        expect(buildWhere({a: 1, b: 2}, {c: 3, d: 4})).toBe('`a` = 1 AND `b` = 2 OR `c` = 3 OR `d` = 4');
        expect(buildWhere({a: {$gt: 1}, b: {$gte: 2}, c: {$not: 3}})).toBe('`a` > 1 AND `b` >= 2 AND `c` <> 3');
        expect(buildWhere({a: {$lt: 1}, b: {$lte: 2}, c: {$in: [1, 2, 3]}})).toBe('`a` < 1 AND `b` <= 2 AND `c` IN (1, 2, 3)');
        expect(buildWhere({a: {$like: 'abc%'}})).toBe('`a` LIKE \'abc%\'');
    })

    test('test buildLimit', () => {
        expect(buildLimit(10)).toBe('LIMIT=10');
    })

    test('test buildOffset', () => {
        expect(buildOffset(10)).toBe('OFFSET=10');
    })
});