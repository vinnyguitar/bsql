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
        insert(values) {
            
        },
        select() {

        },
        update() {

        },
        delete() {

        }
    };
}