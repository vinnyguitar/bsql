import * as mysql from 'mysql';

const oprMap = {
    $gt: '>',
    $gte: '>=',
    $not: '<>',
    $lt: '<',
    $lte: '<=',
    $in: 'IN',
    $like: 'LIKE'
};

function obj2str(obj, sep = '=', join = ',') {
    return Object.keys(obj).map(key => `${mysql.escapeId(key)}${sep}${obj[key]}`).join(join)
}

function parseConditionObject(condition) {
    if (!condition) {
        return [];
    }
    return Object.keys(condition).map(key => {
        const value = condition[key];
        if (typeof value === 'object') {
            const [opr] = Object.keys(value).filter(k => k in oprMap);
            if (opr) {
                let resultValue = mysql.escape(value[opr]);
                if (opr === '$in') {
                    resultValue = `(${resultValue})`
                }
                return `${mysql.escapeId(key)} ${oprMap[opr]} ${resultValue}`;
            }
        } else {
            return `${mysql.escapeId(key)} = ${mysql.escape(value)}`;
        }
    });
}

export function buildWhere(and, or?) {
    return 'WHERE ' + [
        parseConditionObject(and).join(' AND '),
        parseConditionObject(or).join(' OR ')
    ]
        .filter(x => !!x)
        .join(' OR ');
}

export function buildLimit(limit) {
    return `LIMIT=${mysql.escape(limit)}`;
}

export function buildOffset(offset) {
    return `OFFSET=${mysql.escape(offset)}`;
}

export function buildOrderBy(order) {
    return `ORDER BY ${obj2str(order, ' ', ', ').replace(/asc/i, 'ASC').replace(/desc/i, 'DESC')}`;
}

export function buildGroupBy(column) {
    return `GROUP BY ${mysql.escapeId(column)}`;
}

export function buildJoin() {
    return '';
}

export function buildSql(list) {
    return list.filter(x => !!x).join(' ');
}