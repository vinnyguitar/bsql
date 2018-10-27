import { buildOffset, buildLimit, buildWhere, buildOrderBy, buildGroupBy } from '../src/builder';
describe('test builder', () => {
    test('test buildWhere', () => {
        expect(buildWhere({ a: 1, b: 2, c: 3 })).toBe('WHERE `a` = 1 AND `b` = 2 AND `c` = 3');
        expect(buildWhere({ a: 1, b: 2 }, { c: 3, d: 4 })).toBe('WHERE (`a` = 1 AND `b` = 2) OR (`c` = 3 AND `d` = 4)');
        expect(buildWhere({ a: { $gt: 1 }, b: { $gte: 2 }, c: { $not: 3 } })).toBe('WHERE `a` > 1 AND `b` >= 2 AND `c` <> 3');
        expect(buildWhere({ a: { $lt: 1 }, b: { $lte: 2 }, c: { $in: [1, 2, 3] } })).toBe('WHERE `a` < 1 AND `b` <= 2 AND `c` IN (1, 2, 3)');
        expect(buildWhere({ c: { $notIn: [1, 2, 3] } })).toBe('WHERE `c` NOT IN (1, 2, 3)');
        expect(buildWhere({ a: { $like: 'abc%' } })).toBe('WHERE `a` LIKE \'abc%\'');
        expect(buildWhere({ a: { $notLike: 'abc%' } })).toBe('WHERE `a` NOT LIKE \'abc%\'');
        expect(buildWhere({ a: { $isNull: true } })).toBe('WHERE `a` IS NULL');
        expect(buildWhere({ a: { $isNull: false } })).toBe('WHERE `a` IS NOT NULL');
    })

    test('test buildLimit', () => {
        expect(buildLimit(10)).toBe('LIMIT 10');
    })

    test('test buildOffset', () => {
        expect(buildOffset(10)).toBe('OFFSET 10');
    })

    test('test buildOrderBy', () => {
        expect(buildOrderBy({ a: 'asc', b: 'desc' })).toBe('ORDER BY `a` ASC, `b` DESC');
    })

    test('test buildGroupBy', () => {
        expect(buildGroupBy('name')).toBe('GROUP BY `name`');
    })

});