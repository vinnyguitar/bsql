import { count, deleteFrom, insertInto, select, update } from "./query";
import { transformToEntity } from './case_transform';

/**
 * Database connection client.
 */
export class Client {
    constructor(private readonly db) { }
    /**
     * Count rows.
     * @param table Table name;
     */
    public count(table: string) {
        return count(table, (sql, resolve, reject) => {
            this.db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    }
    /**
     * Select rows.
     * @param columns Columns to select.
     */
    public select(columns: string[] | string) {
        return select(columns, createExecutor(this.db));
    }
    /**
     * Insert values into table.
     * @param table Table name.
     */
    public insertInto(table: string) {
        return insertInto(table, createExecutor(this.db));
    }
    /**
     * Delete values from table.
     * @param table Table name.
     */
    public deleteFrom(table: string) {
        return deleteFrom(table, createExecutor(this.db));
    }
    /**
     * Update values for table.
     * @param table Table name.
     */
    public update(table: string) {
        return update(table, createExecutor(this.db));
    }
    /**
     *  Terminating a connection gracefully.
     */
    public end() {
        return new Promise((resolve, reject) => {
            this.db.end((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public query(sql, values?) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

function createExecutor(db) {
    return (sql, resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(transformToEntity(results));
            }
        });
    };
}
