import { BsqlQuery } from 'bsql_query';
export class QueryInsert<T> extends BsqlQuery<any> {
    constructor(db: any, private readonly columns: string[]) {
        super(db);
    }
    public count() {
        //
    }
    public from() {
        //
    }
}
