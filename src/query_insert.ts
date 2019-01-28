import { escape, escapeId } from 'mysql';
import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { snakeCase } from './transform';
export class QueryInsert extends Query<MysqlResult> {
    public into(table: string) {
        this.sql.insert = `INSERT INTO ${escapeId(table)}`;
        return this;
    }
    public values(values: any[]) {
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
        this.sql.duplicate = sql;
        return this;
    }
    protected getSql() {
        return [this.sql.insert, this.sql.column, this.sql.values, this.sql.duplicate].join(' ');
    }
}
