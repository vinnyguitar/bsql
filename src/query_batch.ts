import { BsqlQuery } from 'bsql_query';
export class QueryBatch<T> extends BsqlQuery<any> {
    constructor(db: any, private readonly table: string) {
        super(db);
    }
    public count() {
        //
    }
    public from() {
        //
    }
}
