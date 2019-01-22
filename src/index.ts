import * as mysql from 'mysql';
import { Client } from './client';
import { Transaction } from './transaction';

export const escape = mysql.escape;
export const escapeId = mysql.escapeId;

export class Bsql extends Client {
    public beginTransaction() {
        return new Transaction(this.db);
    }
}

export default function bsql(config) {
    const db = mysql.createPool(config);
    return new Bsql(db);
}
