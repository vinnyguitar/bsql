import { Query } from 'query';
export class QueryInsert<T> extends Query<any> {
    public insert() {
        return this;
    }
    public into(table: string) {
        return this;
    }
    public values(values: any[]) {
        return this;
    }
    public onDuplicateKey(sql: string) {
        return this;
    }
}
