const oprMap = {
    $gt: '>',
    $gte: '>=',
    $not: '<>',
    $lt: '<',
    $lte: '<='
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
                return `${key}${oprMap[opr]}${value}`;
            }
        } else {
            return `${key}=${value}`;
        }
    });
}

export const selectBuilder = {
    select(columns) {
        const set = new Set(['SELECT']);
        set.add(!columns ? '*' : columns.join(''));
        return {
            from(table) {
                set.add(`FROM ${table}`);
                const resolve = () => 1;
                const reject = () => 2;
                const exec = (resolve, reject) => 1;
                const promise = new Promise(exec);
                return new Proxy(promise, {
                    get: function (target, key, receiver) {
                        switch (key) {
                            case 'then':
                                break;
                            case 'where':
                                break;
                        }
                        return target;
                    }
                    // where(and, or) {
                    //     set.add(buildWhere(and, or));
                    //     return this;
                    // },
                    // limit(limit) {
                    //     set.add(buildLimit(limit));
                    //     return this;
                    // },
                    // offset(limit) {
                    //     set.add(buildLimit(limit));
                    //     return this;
                    // },
                    // orderBy(order) {
                    //     set.add(buildOrderBy(order));
                    //     return this;
                    // },
                    // groupBy(column) {
                    //     set.add(buildGroupBy(column));
                    //     return this;
                    // },
                    // then() {

                    // }
                });
            }
        };
    }
};

export function buildWhere(and, or) {
    return [
        parseConditionObject(and).join(' AND '),
        parseConditionObject(or).join(' OR ')

    ].join(' ');
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