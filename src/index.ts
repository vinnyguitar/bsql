import * as mysql from 'mysql';
import { Client } from './client';
import { Transaction } from './transaction';

export const escape = mysql.escape;
export const escapeId = mysql.escapeId;

export class Bsql extends Client {
    constructor(private readonly pool: mysql.Pool) {
        super((...args: any[]) => pool.query.apply(pool, args));
    }
    public async beginTransaction() {
        return new Promise<Transaction>((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
                if (err) {
                    reject(err);
                } else {
                    connection.beginTransaction((e: mysql.MysqlError) => {
                        if (e) {
                            reject(e);
                        } else {
                            resolve(new Transaction(connection));
                        }
                    });

                }
            });
        });
    }

    public async end() {
        return new Promise((resolve, reject) => {
            this.pool.end((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

export default function bsql(config: mysql.PoolConfig): Bsql {
    const db = mysql.createPool(config);
    return new Bsql(db);
}
