import { MysqlError } from 'mysql';
import { Client } from './client';

export class Transaction extends Client {
    public commit() {
        return new Promise((resolve, reject) => {
            this.db.commit((err: MysqlError) => err ? reject(err) : resolve());
        });
    }

    public rollback() {
        return new Promise((resolve) => {
            this.db.commit(() => resolve());
        });
    }
}
