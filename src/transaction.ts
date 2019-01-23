import { MysqlError, PoolConnection } from 'mysql';
import { Connection } from 'client';

export class Transaction extends Connection {
    constructor(private readonly connection: PoolConnection) {
        super(connection);
    }
    public commit() {
        return new Promise((resolve, reject) => {
            this.connection.commit((err: MysqlError) => {
                err ? reject(err) : resolve();
            });
        });
    }

    public rollback() {
        return new Promise((resolve) => {
            this.connection.commit(() => resolve());
        });
    }

    public executor(resolve, reject) {
        //
    }
}
