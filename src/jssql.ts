import mysql from 'mysql';
import { createTrigger } from './trigger';
export function jssql(config) {
    const connection = mysql.createConnection(config);
    connection.connect();
    return {
        connection,
        count() {

        },
        insert() {
            const sql = [];
            createTrigger({}, connection.query(sql.join(' ')));
        },
        select() {

        },
        update() {

        },
        delete() {

        }
    };
}