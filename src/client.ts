import { Pool } from 'mysql';
import { QueryBatch } from 'query_batch';
import { QueryDelete } from 'query_delete';
import { QueryInsert } from 'query_insert';
import { QuerySelect } from 'query_select';
import { QueryUpdate } from 'query_update';

/**
 * Db Connection.
 */
export abstract class Connection {
    constructor(protected readonly db: Pool) { }
    /**
     * Select rows.
     * @param columns Columns to select.
     */
    public select<T = any>(...columns: string[]) {
        const select = new QuerySelect<T>(this.executor);
        return select.select(...columns);
    }
    /**
     * Count rows.
     * @param column Column name default *.
     */
    public count(column: string = '*') {
        const select = new QuerySelect<number>(this.db);
        return select.select(`count(${column})`);
    }

    /**
     * Insert values into table.
     * @param values Values to insert.
     */
    public insert(values: any) {
        const insert = new QueryInsert(this.db);
        return insert.values(values);
    }

    /**
     * Delete values from table.
     * @param filter Delete filter.
     */
    public delete(filter: any) {
        const del = new QueryDelete(this.db);
        return del.where(filter);
    }

    /**
     * Update values of table.
     * @param table Table name.
     */
    public update(table: string) {
        const update = new QueryUpdate(this.db);
        return update.update(table);
    }

    /**
     * Batch update values.
     * @param table Table name.
     */
    public batch(table: string) {
        return new QueryBatch(this.db, table);
    }

    public abstract executor(resolve: (value?) => void, reject: (reason?: any) => void): void;
}
