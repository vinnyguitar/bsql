import { Query } from 'query';

interface Filter {
    [propName: string]: any;
}

enum OrderType {
    Asc = 1,
    Desc = -1,
}

export class QuerySelect<T> extends Query<T> {
    constructor() {
        super();
    }
    public select(...columns: string[]) {
        return this;
    }
    public from(table: string) {
        return this;
    }
    public where(filter: Filter) {
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
    protected execute(resolve, reject) {
        const sql = '';
        // this.query(sql, sdf);
        return this;
    }
}
