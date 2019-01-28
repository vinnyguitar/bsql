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
        if (!columns || columns[0] === '*') {
            this.sql.select = 'SELECT *';
        } else {
            const formatted = columns.map((c) => {
                const match = /^(\w+)\((.+)\)(.*)/.exec(c);
                if (!match) {
                    return escapeId(snakeCase(c));
                } else {
                    return `${match[1]}(${match[2] === '*' ? '*' : escapeId(snakeCase(match[2]))})${match[3] || ''}`;
                }
            });
            this.sql.select = `SELECT ${formatted.join(',')}`;
        }
        return this;
    }
    public from(table: string) {
        this.sql.from = `FROM ${escapeId(table)}`;
        return this;
    }
    public where(filter: WhereFilter) {
        this.sql.where = `WHERE ${buildWhereSql(filter)}`;
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
        return [this.sql.select, this.sql.from, this.sql.where];
    }
}
