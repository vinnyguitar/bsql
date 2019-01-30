import { escape, escapeId } from 'mysql';
import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { snakeCase } from './transform';
import { buildWhereSql, WhereFilter } from './where_filter';

export class QueryUpdate extends Query<MysqlResult> {
    public update(table: string) {
        this.sql.update = `UPDATE ${escapeId(table)}`;
        return this;
    }
    public set(value: {}) {
        this.sql.set = `SET ${escape(snakeCase(value))}`;
        return this;
    }
    public where(filter: WhereFilter) {
        this.sql.where = `WHERE ${buildWhereSql(filter)}`;
        return this;
    }
    protected getSql() {
        return [this.sql.update, this.sql.set, this.sql.where];
    }
}
