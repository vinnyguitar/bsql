import { Connection, Pool } from 'mysql';
import { QueryBatch } from './query_batch';
import { QueryDelete } from './query_delete';
import { QueryInsert } from './query_insert';
import { QuerySelect } from './query_select';
import { QueryUpdate } from './query_update';

/**
 * Db client.
 */
export class Client {
    constructor(protected readonly db: Connection | Pool) { }

    /**
     * Select rows.
     * @param args Columns to select.
     */
    public select<T = any>(...args: string[]) {
        return new QuerySelect<T>(this.db, args);
    }

    /**
     * Insert values into table.
     * @param values Values to insert.
     */
    public insert(values: any) {
        return new QueryInsert(this.db, values);
    }

    /**
     * Delete values from table.
     * @param filter Delete filter.
     */
    public delete(filter: any) {
        return new QueryDelete(this.db, filter);
    }

    /**
     * Update values of table.
     * @param table Table name.
     */
    public update(table: string) {
        return new QueryUpdate(this.db, table);
    }

    /**
     * Batch update values.
     * @param table Table name.
     */
    public batch(table: string) {
        return new QueryBatch(this.db, table);
    }

    /**
     * Execute sql.
     * @param sql
     * @param args
     */
    public query(sql, ...args) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, ...args, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}
