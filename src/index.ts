import * as mysql from 'mysql';
import { Connection } from 'client';
import { Transaction } from './transaction';

export const escape = mysql.escape;
export const escapeId = mysql.escapeId;

export class Bsql extends Connection {
    constructor(private readonly pool: mysql.Pool) {
        super(pool);
    }
    public async beginTransaction() {
        return new Promise<Connection>((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, connection: mysql.Connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Transaction(connection));
                }
            });
        });
    }
}

export default function bsql(config) {
    const db = mysql.createPool(config);
    return new Bsql(db);
}
