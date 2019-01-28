import { escapeId } from 'mysql';
import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { buildWhereSql, WhereFilter } from './where_filter';
export class QueryDelete extends Query<MysqlResult> {
    public from(table: string) {
        this.sql.from = `DELETE FROM ${escapeId(table)}`;
        return this;
    }
    public where(filter: WhereFilter) {
        this.sql.where = `WHERE ${buildWhereSql(filter)}`;
        return this;
    }
    protected getSql() {
        return [this.sql.from, this.sql.where];
    }
}
