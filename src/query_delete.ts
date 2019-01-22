import { BsqlQuery } from 'bsql_query';
export class QueryDelete<T> extends BsqlQuery<any> {
    constructor(db: any, private readonly filter: any) {
        super(db);
    }
    public count() {
        //
    }
    public from() {
        //
    }
}
