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
                if(opr === '$in') {
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
    return [
        parseConditionObject(and).join(' AND '),
        parseConditionObject(or).join(' OR ')
    ]
        .filter(x => !!x)
        .join(' OR ');
}

export function buildLimit(limit) {
    return `LIMIT=${limit}`;
}

export function buildOffset(offset) {
    return `OFFSET=${offset}`;
}

export function buildOrderBy(order) {
    return '';
}

export function buildGroupBy(column) {
    return '';
}

export function buildJoin() {
    return '';
}