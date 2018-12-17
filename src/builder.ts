import { escape, escapeId, format } from "mysql";

const map = new Map([
    ["$not", "<>"],
    ["$gt", ">"],
    ["$gte", ">="],
    ["$lt", "<"],
    ["$lte", "<="],
    ["$in", "IN"],
    ["$notIn", "NOT IN"],
    ["$like", "LIKE"],
    ["$notLike", "NOT LIKE"],
    ["$isNull", "IS NULL"],
    ["_isNotNull", "IS NOT NULL"],
]);

function parseConditionObject(condition) {
    if (!condition) {
        return [];
    }
    return Object.keys(condition).map((key) => {
        const value = condition[key];
        if (typeof value === "object") {
            let [opr] = Object.keys(value).filter((k) => map.has(k));
            if (opr) {
                let resultValue = escape(value[opr]);
                if ((opr === "$in" || opr === "$notIn")) {
                    if (!resultValue) { return ""; }
                    resultValue = `(${resultValue})`;
                } else if (opr === "$isNull") {
                    if (resultValue === "false") {
                        opr = "_isNotNull";
                    }
                    resultValue = "";
                }
                return `${escapeId(key)} ${map.get(opr)} ${resultValue}`;
            }
        } else {
            return `${escapeId(key)} = ${escape(value)}`;
        }
    })
        .map((x) => x.trim());
}

export function buildWhere(...args) {
    if (typeof args[0] === "string") {
        return `WHERE ${format(args[0], args[1])}`;
    } else {
        const ors = args
            .map((arg) => {
                const ands = parseConditionObject(arg);
                if (ands.length === 1 || args.length === 1) {
                    return ands.join(" AND ");
                } else {
                    return `(${ands.join(" AND ")})`;
                }
            })
            .filter((x) => !!x);
        if (!ors.length) { return ""; }
        return "WHERE " + ors.join(" OR ");
    }

}

export function buildLimit(limit) {
    return `LIMIT ${escape(limit)}`;
}

export function buildOffset(offset) {
    return `OFFSET ${escape(offset)}`;
}

export function buildOrderBy(...orders) {
    const orderSql = orders.map(([key, sort]) => `${escapeId(key)} ${sort > 0 ? "ASC" : "DESC"}`).join(", ");
    return `ORDER BY ${orderSql}`;
}

export function buildGroupBy(column) {
    return `GROUP BY ${escapeId(column)}`;
}

export function joinSql(list) {
    return list.filter((x) => !!x).join(" ");
}
