import { Query } from 'query';
export class QueryBatch<T> extends Query<any> {
    constructor(db: any, private readonly table: string) {
        super(db);
    }
    public count() {
        //
    }
    public from() {
        //
    }
    protected getSql() {
        return '';
    }
}
