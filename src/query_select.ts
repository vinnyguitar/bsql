import { escape, escapeId } from 'mysql';
import { Query } from './query';
import { camelCase, snakeCase } from './transform';
import { buildWhereSql, WhereFilter } from './where_filter';

interface Filter {
    [propName: string]: any;
}

enum OrderType {
    Asc = 1,
    Desc = -1,
}

export class QuerySelect<T> extends Query<T[]> {

    constructor(query) {
        super(query);
        this.plugin((results) => camelCase(results));
    }

    public select(...columns: string[]) {
        if (!columns) {
            this.sql.select = 'SELECT *';
        } else {
            const formatted = snakeCase(columns);
            this.sql.select = `SELECT ${formatted.map(escapeId).join(',')}`;
        }
        return this;
    }
    public from(table: string) {
        this.sql.from = `FROM ${escapeId(table)}`;
        return this;
    }
    public where(filter: WhereFilter) {
        this.sql.where = buildWhereSql(filter);
        return this;
    }
    public groupBy(column: string) {
        return this;
    }
    public having(filter: Filter) {
        return this;
    }
    public orderBy(order: Array<[string, OrderType]>) {
        return this;
    }
    public limit(num: number) {
        return this;
    }
    public offset(num: number) {
        return this;
    }
    protected getSql() {
        return [this.sql.select, this.sql.from, this.sql.where].join(' ');
    }
}
