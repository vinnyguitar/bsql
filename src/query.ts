import { escape, escapeId } from "mysql";
import { buildGroupBy, buildLimit, buildOffset, buildOrderBy, joinSql, buildWhere } from "./builder";
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

export interface ISelect extends Promise<object[]> {
    from(table: string): ISelect;
    where(condiction: string): ISelect;
    where(...condictions: object[]): ISelect;
    groupBy(column: string): ISelect;
    orderBy(...orders: Array<[string, number]>): ISelect;
    limit(limit: number): ISelect;
    offset(offset: number): ISelect;

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
}



export function select(columns: string[] | string, exec: (sql, resolve, reject) => void) {
    const sql: any = {
        select: 'SELECT',
    };
    if (!columns) {
        sql.columns = '*';
    } else if (columns instanceof Array) {
        sql.columns = columns.map((c) => escapeId(c)).join(", ");
    } else {
        sql.columns = columns;
    }
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.select, sql.columns, sql.from, sql.where, sql.groupBy,
            sql.orderBy, sql.limit, sql.offset]), resolve, reject);
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
            orderBy(...orders) {
                sql.orderBy = buildOrderBy(...orders);
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
        }) as ISelect;
}

export function count(table: string, exec: (sql, resolve, reject) => void) {
    const sql = {
        select: `SELECT COUNT(*) AS count FROM ${escapeId(table)}`,
        where: "",
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.select, sql.where]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...args);
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
        }) as IInsert;
}

export function deleteFrom(table: string, exec: (sql, resolve, reject) => void) {
    const sql: any = {
        deleteFrom: `DELETE FROM ${escapeId(table)}`,
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.deleteFrom, sql.where, sql.limit, sql.offset]), resolve, reject);
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
        }) as IDelete;
}

export function update(table: string, exec: (sql, resolve, reject) => void) {
    const sql: any = {
        update: `UPDATE ${escapeId(table)}`,
    };
    return new TriggerPromise(
        (resolve, reject) => {
            exec(joinSql([sql.update, sql.set, sql.where]), resolve, reject);
        }, {
            where(...args) {
                sql.where = buildWhere(...args);
                return this;
            },
            set(value) {
                sql.set = `SET ${escape(value)}`;
                return this;
            },
        }) as IUpdate;
}
