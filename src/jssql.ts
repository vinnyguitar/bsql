import mysql from 'mysql';
import { count } from './query';
export function jssql(config) {
    const connection = mysql.createConnection(config);
    connection.connect();
    return {
        connection,
        count(table) {
            return new Promise((resolve, reject) => {
                count(table, sql => connection.query(sql));
            });
        },
        select(columns) {

        }
    };
}