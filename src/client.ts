import { MysqlError } from 'mysql';
import { QueryBatch } from './query_batch';
import { QueryDelete } from './query_delete';
import { QueryInsert } from './query_insert';
import { QuerySelect } from './query_select';
import { QueryUpdate } from './query_update';
import { WhereFilter } from './where_filter';

/**
 * Db Client.
 */
export class Client {
    constructor(protected readonly queryFn) { }
    /**
     * Select rows.
     * @param columns Columns to select.
     */
    public select<T>(...columns: string[]) {
        const select = new QuerySelect<T[]>(this.queryFn);
        return select.select(...columns);
    }
    /**
     * Count rows.
     * @param column Column name default *.
     */
    public count(filter?: WhereFilter) {
        const select = new QuerySelect<number>(this.queryFn);
        select.plugin((result) => result[0].count);
        if (filter) {
            select.where(filter);
        }
        return select.select(`COUNT(*) AS count`);
    }

    /**
     * Insert values into table.
     * @param values Values to insert.
     */
    public insert(values: Array<{}>) {
        const insert = new QueryInsert(this.queryFn);
        return insert.values(values);
    }

    /**
     * 删除值.
     * @param filter 删除条件.
     */
    public delete(filter: WhereFilter) {
        const del = new QueryDelete(this.queryFn);
        return del.where(filter);
    }

    /**
     * Update values of table.
     * @param table Table name.
     */
    public update(table: string) {
        const update = new QueryUpdate(this.queryFn);
        return update.update(table);
    }

    /**
     * Batch update values.
     * @param table Table name.
     */
    public batch(table: string) {
        const batch = new QueryBatch(this.queryFn);
        return batch.batch(table);
    }
    /**
     * Excacute row sql.
     * @param options sql
     * @param values 
     */
    public query(options: string, values?: any) {
        return new Promise<any>((resolve, reject) => {
            this.queryFn(options, values, (err: MysqlError, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}
