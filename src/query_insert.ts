import { escape, escapeId } from 'mysql';
import { assert } from './bsql_error';
import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { snakeCase } from './transform';
export class QueryInsert extends Query<MysqlResult> {
    public into(table: string) {
        assert(typeof table === 'string' && table, `Parameter table expected an not empty string, but get: ${table}.`);
        this.sql.insert = `INSERT INTO ${escapeId(table)}`;
        return this;
    }
    public values(values: any[]) {
        assert(Object.prototype.toString.call(values) === '[object Array]' && values.length,
            `Parameter values expected an not empty array, but get: ${values}.`);
        const formatted = snakeCase(values);
        const keys = [];
        formatted.forEach((value: {}) => Object.keys(value).forEach((k) => {
            if (keys.indexOf(k) === -1) {
                keys.push(k);
            }
        }));
        this.sql.column = `(${keys.map((k) => escapeId(k)).join(',')})`;

        this.sql.values = 'VALUES' + formatted.map((value: {}) => {
            const arr = new Array(keys.length);
            Object.keys(value).forEach((k) => {
                arr[keys.indexOf(k)] = value[k];
            });
            return `(${escape(arr)})`;
        }).join(',');
        return this;
    }
    public onDuplicateKey(sql: string) {
        this.sql.duplicate = `ON DUPLICATE KEY ${sql}`;
        return this;
    }
    protected getSql() {
        assert(this.sql.insert, 'Table name is required, please call into(table).');
        assert(this.sql.column, 'Values is required, please call values(values).');
        return [this.sql.insert, this.sql.column, this.sql.values, this.sql.duplicate];
    }
}
