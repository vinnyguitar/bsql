import * as mysql from 'mysql';
import { Client } from './client';
import { Transaction } from './transaction';

export const escape = mysql.escape;
export const escapeId = mysql.escapeId;

export class Bsql extends Client {
    constructor(private readonly pool: mysql.Pool) {
        super(pool.query);
    }
    public async beginTransaction() {
        return new Promise<Transaction>((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
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
