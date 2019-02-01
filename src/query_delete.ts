import { escapeId } from 'mysql';
import { assert } from './bsql_error';
import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { buildWhereSql, WhereFilter } from './where_filter';
export class QueryDelete extends Query<MysqlResult> {
    public from(table: string) {
        assert(typeof table === 'string' && table, `Parameter table expected an not empty string, but get: ${table}.`);
        this.sql.from = `DELETE FROM ${escapeId(table)}`;
        return this;
    }
    public where(filter: WhereFilter) {
        assert(typeof filter === 'object' && filter,
            `Parameter table expected an not empty object, but get: ${filter}.`);
        this.sql.where = `WHERE ${buildWhereSql(filter)}`;
        return this;
    }
    protected getSql() {
        assert(this.sql.from, 'Table name is required, please call from(table).');
        assert(this.sql.where, 'Filter is required, please call where(filter).');
        return [this.sql.from, this.sql.where];
    }
}
