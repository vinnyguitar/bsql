import { Query } from './query';

export class QueryUpdate<T> extends Query<any> {
    public update(table: string) {
        //
    }
    public set(value: any) {
        //
    }
    public where(filter: any) {
        //
    }
    protected getSql() {
        return '';
    }
}
