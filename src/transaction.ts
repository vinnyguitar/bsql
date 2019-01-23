import { MysqlError, PoolConnection } from 'mysql';
import { Client } from './client';

export class Transaction extends Client {
    constructor(private readonly connection: PoolConnection) {
        super(connection);
    }
    public commit() {
        return new Promise((resolve, reject) => {
            this.connection.commit((err: MysqlError) => {
                this.connection.release();
                err ? reject(err) : resolve();
            });
        });
    }

    public rollback() {
        return new Promise((resolve) => {
            this.connection.commit(() => resolve());
        });
    }
}
