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
    constructor(protected readonly query) { }
    /**
     * Select rows.
     * @param columns Columns to select.
     */
    public select<T>(...columns: string[]) {
        const select = new QuerySelect<T>(this.query);
        return select.select(...columns);
    }
    /**
     * Count rows.
     * @param column Column name default *.
     */
    public count(column: string = '*') {
        const select = new QuerySelect<number>(this.query);
        select.plugin((result) => result[0].count);
        return select.select(`COUNT(${column}) AS count`);
    }

    /**
     * Insert values into table.
     * @param values Values to insert.
     */
    public insert(values: Array<{}>) {
        const insert = new QueryInsert(this.query);
        return insert.values(values);
    }

    /**
     * 删除值.
     * @param filter 删除条件.
     */
    public delete(filter: WhereFilter) {
        const del = new QueryDelete(this.query);
        return del.where(filter);
    }

    /**
     * Update values of table.
     * @param table Table name.
     */
    public update(table: string) {
        const update = new QueryUpdate(this.query);
        return update.update(table);
    }

    /**
     * Batch update values.
     * @param table Table name.
     */
    public batch(table: string) {
        const batch = new QueryBatch(this.query);
        return batch.batch(table);
    }
}
