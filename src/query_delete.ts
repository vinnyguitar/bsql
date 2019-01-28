import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { WhereFilter } from './where_filter';
export class QueryDelete extends Query<MysqlResult> {
    public from(table: string) {
        return this;
    }
    public where(filter: WhereFilter) {
        return this;
    }
    protected getSql() {
        return '';
    }
}
