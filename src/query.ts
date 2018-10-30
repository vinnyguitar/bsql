import { escape, escapeId } from "mysql";
import { buildGroupBy, buildLimit, buildOffset, buildOrderBy, buildSql, buildWhere } from "./builder";
import TriggerPromise from "./trigger_promise";

export function count(table: string, exec: Function) {
    const sql = {
        select: `SELECT COUNT(*) AS count FROM ${escapeId(table)}`,
        where: "",
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(buildSql([sql.select, sql.where]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...args);
                return this;
            },
        }) as any;
}

export function select(columns: string[], exec: Function) {
    const sql: any = {
        select: `SELECT ${columns.map((c) => escapeId(c)).join(",")}`,
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(buildSql([sql.select, sql.from, sql.where, sql.groupBy, sql.orderBy, sql.limit, sql.offset]), resolve, reject);
        }, {
            from(table) {
                sql.from = `FROM ${escapeId(table)}`;
                return this;
            },
            where(...args) {
                sql.where = buildWhere(...args);
                return this;
            },
            groupBy(column) {
                sql.groupBy = buildGroupBy(column);
                return this;
            },
            orderBy(orders) {
                sql.orderBy = buildOrderBy(orders);
                return this;
            },
            limit(num) {
                sql.limit = buildLimit(num);
                return this;
            },
            offset(num) {
                sql.offset = buildOffset(num);
                return this;
            },
        }) as any;
}

export function insertInto(table, exec) {
    const sql = {
        insert: `INSERT INTO`,
        table: "",
        values: "",
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(buildSql([sql.insert, sql.table, sql.values]), resolve, reject);
        }, {
            values(values) {
                const keys = [];
                values.forEach((value) => Object.keys(value).forEach((k) => {
                    if (keys.indexOf(k) === -1) {
                        keys.push(k);
                    }
                }));
                sql.table = `${escapeId(table)} (${keys.map((k) => escapeId(k)).join(",")}) VALUES`;
                sql.values = values.map((value) => {
                    const arr = new Array(keys.length);
                    Object.keys(value).forEach((k) => {
                        arr[keys.indexOf(k)] = value[k];
                    });
                    return `(${escape(arr)})`;
                }).join(",");
                return this;
            },
        }) as any;
}

export function deleteFrom(table: string, exec: Function) {
    const sql: any = {
        deleteFrom: `DELETE FROM ${escapeId(table)}`,
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(buildSql([sql.deleteFrom, sql.where, sql.limit, sql.offset]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...args);
                return this;
            },
            limit(num) {
                sql.limit = buildLimit(num);
                return this;
            },
            offset(num) {
                sql.offset = buildOffset(num);
                return this;
            },
        }) as any;
}

export function update(table: string, exec: Function) {
    const sql: any = {
        update: `UPDATE ${escapeId(table)}`,
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(buildSql([sql.update, sql.set, sql.where]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...args);
                return this;
            },
            set(value) {
                sql.set = `SET ${escape(value)}`;
                return this;
            },
        }) as any;
}
