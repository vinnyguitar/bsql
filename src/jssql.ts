import mysql from 'mysql';
import { count } from './query';
export function jssql(config) {
    const connection = mysql.createConnection(config);
    connection.connect();
    return {
        connection,
        count(table) {
            return count(table, (sql, resolve, reject) => {
                // 操作db
                connection.query(sql, (err, results, fields) => {
                    
                });
            })
        },
        select(columns) {

        }
    };
}
// db.a().b()