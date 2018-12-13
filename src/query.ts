import { Column } from "index";
import { escape, escapeId, format } from "mysql";
import { buildGroupBy, buildLimit, buildOffset, buildOrderBy, buildWhere, joinSql } from "./builder";
import { transformToDb } from "./case_transform";
import TriggerPromise from "./trigger_promise";

export interface IResult {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
}
export interface ICount extends Promise<number> {
    where(condiction: string): ICount;
    where(...condictions: object[]): ICount;
}

export interface ISelect<T> extends Promise<T[]> {
    from(table: string): ISelect<T>;
    where(condiction: string): ISelect<T>;
    where(...condictions: object[]): ISelect<T>;
    groupBy(column: string): ISelect<T>;
    orderBy(...orders: Array<[string, number]>): ISelect<T>;
    limit(limit: number): ISelect<T>;
    offset(offset: number): ISelect<T>;

}

export interface IInsert extends Promise<IResult> {
    values(values: object[]): IInsert;
}

export interface IDelete extends Promise<IResult> {
    where(condiction: string): IDelete;
    where(...condictions: object[]): IDelete;
    limit(limit: number): IDelete;
    offset(offset: number): IDelete;
}

export interface IUpdate extends Promise<IResult> {
    where(condiction: string): IUpdate;
    where(...condictions: object[]): IUpdate;
    set(value: object): IUpdate;
    set(values: object[], by): IUpdate;
}

export function select<T>(columns: string[] | string, exec: (sql, resolve, reject) => void) {
    const sql: any = {
        select: "SELECT",
    };
    if (columns instanceof Array) {
        sql.columns = transformToDb(columns).map((c) => escapeId(c)).join(", ");
    } else {
        sql.columns = columns;
    }
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.select, sql.columns, sql.from, sql.where, sql.groupBy,
            sql.orderBy, sql.limit, sql.offset]), resolve, reject);
        }, {
            from(table) {
                sql.from = `FROM ${escapeId(transformToDb(table))}`;
                return this;
            },
            where(...args) {
                sql.where = buildWhere(...transformToDb(args));
                return this;
            },
            groupBy(column) {
                sql.groupBy = buildGroupBy(transformToDb(column));
                return this;
            },
            orderBy(...orders) {
                sql.orderBy = buildOrderBy(...transformToDb(orders));
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
        }) as ISelect<T>;
}

export function count(table: string, exec: (sql, resolve, reject) => void) {
    const sql = {
        select: `SELECT COUNT(*) AS count FROM ${escapeId(transformToDb(table))}`,
        where: "",
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.select, sql.where]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...transformToDb(args));
                return this;
            },
        }) as ICount;
}

export function insertInto(table, exec: (sql, resolve, reject) => void) {
    const sql = {
        insert: `INSERT INTO`,
        table: "",
        values: "",
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.insert, sql.table, sql.values]), resolve, reject);
        }, {
            values(values) {
                const dbValues = transformToDb(values);
                const keys = [];
                dbValues.forEach((value) => Object.keys(value).forEach((k) => {
                    if (keys.indexOf(k) === -1) {
                        keys.push(k);
                    }
                }));
                sql.table = `${escapeId(transformToDb(table))} (${keys.map((k) => escapeId(k)).join(",")}) VALUES`;
                sql.values = dbValues.map((value) => {
                    const arr = new Array(keys.length);
                    Object.keys(value).forEach((k) => {
                        arr[keys.indexOf(k)] = value[k];
                    });
                    return `(${escape(arr)})`;
                }).join(",");
                return this;
            },
        }) as IInsert;
}

export function deleteFrom(table: string, exec: (sql, resolve, reject) => void) {
    const sql: any = {
        deleteFrom: `DELETE FROM ${escapeId(transformToDb(table))}`,
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.deleteFrom, sql.where, sql.limit, sql.offset]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...transformToDb(args));
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
        }) as IDelete;
}

export function update(table: string, exec: (sql, resolve, reject) => void) {
    const sql: any = {
        update: `UPDATE ${escapeId(transformToDb(table))}`,
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.update, sql.set, sql.where]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...transformToDb(args));
                return this;
            },
            set(value, by) {
                if (value instanceof Array) {
                    const lines = [];
                    const columns = new Map<string, string[]>();
                    value.forEach((v) => {
                        Object.keys(v).forEach((k) => {
                            if (k !== by) {
                                const column = columns.get(k) || [];
                                column.push(format(`WHEN ?? = ? THEN ?`, [by, v[by], v[k]]));
                                columns.set(k, column);
                            }
                        });
                    });
                    columns.forEach((v, k) => {
                        lines.push(`${escapeId(k)} = CASE ${v.join(" ")} ELSE ${escapeId(k)} END`);
                    });
                    sql.set = `SET ${lines.join(" , ")}`;
                } else {
                    sql.set = `SET ${escape(transformToDb(value))}`;
                }
                return this;
            },
        }) as IUpdate;
}
