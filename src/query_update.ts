import { escape, escapeId } from 'mysql';
import { assert } from './bsql_error';
import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { snakeCase } from './transform';
import { buildWhereSql, WhereFilter } from './where_filter';

export class QueryUpdate extends Query<MysqlResult> {
    public update(table: string) {
        assert(typeof table === 'string' && table, `Parameter table expected an not empty string, but get: ${table}.`);
        this.sql.update = `UPDATE ${escapeId(table)}`;
        return this;
    }
    public set(value: {}) {
        assert(typeof value === 'object',
            `Parameter value expected an not empty object, but get: ${value}.`);
        this.sql.set = `SET ${escape(snakeCase(value))}`;
        return this;
    }
    public where(filter: WhereFilter) {
        assert(typeof filter === 'object' && filter,
            `Parameter filter expected an not empty object, but get: ${filter}.`);
        this.sql.where = `WHERE ${buildWhereSql(filter)}`;
        return this;
    }
    protected getSql() {
        assert(this.sql.set, 'Value is required, please call set(value).');
        assert(this.sql.where, 'Filter is required, please call where(filter).');
        return [this.sql.update, this.sql.set, this.sql.where];
    }
}
