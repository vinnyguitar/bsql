import { escape, escapeId } from 'mysql';

const oprMap = {
    $gt: '>',
    $gte: '>=',
    $not: '<>',
    $lt: '<',
    $lte: '<=',
    $in: 'IN',
    $notIn: 'NOT IN',
    $like: 'LIKE',
    $notLike: 'NOT LIKE',
    $isNull: 'IS NULL',
    _isNotNull: 'IS NOT NULL',
};

function parseConditionObject(condition) {
    if (!condition) {
        return [];
    }
    return Object.keys(condition).map(key => {
        const value = condition[key];
        if (typeof value === 'object') {
            let [opr] = Object.keys(value).filter(k => k in oprMap);
            if (opr) {
                let resultValue = escape(value[opr]);
                if (opr === '$in' || opr === '$notIn') {
                    resultValue = `(${resultValue})`
                } else if (opr === '$isNull') {
                    if (resultValue === 'false') {
                        opr = '_isNotNull';
                    }
                    resultValue = '';
                }
                return `${escapeId(key)} ${oprMap[opr]} ${resultValue}`;
            }
        } else {
            return `${escapeId(key)} = ${escape(value)}`;
        }
    })
        .map(x => x.trim());
}

export function buildWhere(...args) {
    if (typeof args[0] === 'string') {
        return `WHERE ${args[0]}`;
    } else {
        let ors = args
            .map(arg => {
                const ands = parseConditionObject(arg);
                if (ands.length === 1 || args.length === 1) return ands.join(' AND ');
                else return `(${ands.join(' AND ')})`;
            })
            .filter(x => !!x)
        return 'WHERE ' + ors.join(' OR ');
    }

}

export function buildLimit(limit) {
    return `LIMIT ${escape(limit)}`;
}

export function buildOffset(offset) {
    return `OFFSET ${escape(offset)}`;
}

export function buildOrderBy(order) {
    const orders = Object.keys(order).map(key => `${escapeId(key)} ${order[key]}`).join(', ')
    return `ORDER BY ${orders.replace(/asc/i, 'ASC').replace(/desc/i, 'DESC')}`;
}

export function buildGroupBy(column) {
    return `GROUP BY ${escapeId(column)}`;
}

export function buildSql(list) {
    return list.filter(x => !!x).join(' ');
}