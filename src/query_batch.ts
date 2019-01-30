import { escapeId, format } from 'mysql';
import { MysqlResult } from './mysql_result';
import { Query } from './query';
import { snakeCase } from './transform';
export class QueryBatch extends Query<MysqlResult> {
    public batch(table: string) {
        this.sql.update = `UPDATE ${table}`;
        return this;
    }

    public update(rows: Array<{}>, matchColumn: string = 'id') {
        const lines = [];
        const columns = new Map<string, string[]>();
        snakeCase(rows).forEach((v) => {
            Object.keys(v).forEach((k) => {
                if (k !== matchColumn) {
                    const column = columns.get(k) || [];
                    column.push(format(`WHEN ?? = ? THEN ?`, [matchColumn, v[matchColumn], v[k]]));
                    columns.set(k, column);
                }
            });
        });
        columns.forEach((v, k) => {
            lines.push(`${escapeId(k)} = CASE ${v.join(' ')} ELSE ${escapeId(k)} END`);
        });
        this.sql.set = `SET ${lines.join(' , ')}`;
        return this;
    }

    protected getSql() {
        return [this.sql.update, this.sql.set];
    }
}
