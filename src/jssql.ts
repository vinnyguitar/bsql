import mysql from 'mysql';
import { createTrigger } from './trigger';
import { buildWhere } from './builder';
export function jssql(config) {
    const connection = mysql.createConnection(config);
    connection.connect();
    return {
        connection,
        count(table) {
            const sql = [`SELECT COUNT(*) FROM ${table}`];
            return createTrigger({
                where(and, or) {
                    const where = buildWhere(and, or);
                    if (sql.indexOf(where) === -1) {
                        sql.push(where);
                    }
                    return this;
                }
            }, () => connection.query(sql.join(' ')));
        },
        insert(rows) {
            const keys = [];
            const values = [];
            rows.forEach(row => {
                const value = [];
                Object.keys(row).forEach(key => {
                    if (keys.indexOf(key) === -1) {
                        keys.push(key);
                    }
                    const index = keys.indexOf(key);
                    value[index] = row[key];

                });
                values.push(values);
            });
            const sql = [`INSERT (${connection.escape(keys)}) INTO`];
            return createTrigger({
                into(table) {
                    sql.push(table);
                    sql.push(`(${connection.escape(values)})`);
                    return this;
                }
            }, () => connection.query(sql.join(' ')));
        },
        select() {

        },
        update() {

        },
        delete() {

        }
    };
}