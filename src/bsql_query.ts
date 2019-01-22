import { Connection } from 'mysql';

export class BsqlQuery<T> implements PromiseLike<T> {
    constructor(private readonly db: Connection) { }

    public getSql(): string {
        return '';
    }

    public then<R = T>(onfulfilled, onrejected): Promise<R> {
        return new Promise(() => {
            const sql = this.getSql();
            this.db.query(sql, (err, results) => {
                if (err) {
                    onrejected(err);
                } else {
                    onfulfilled(results);
                }
            });
        });
    }
}
