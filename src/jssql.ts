import * as mysql from 'mysql';
import { count, insertInto, deleteFrom, select, update } from './query';
export function jssql(config) {
    const pool = mysql.createPool(config);
    return {
        pool,
        count(table) {
            return count(table, (sql, resolve, reject) => {
                // 操作db
                pool.query(sql, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0].count);
                    }
                });
            })
        },
        select(columns) {
            return select(columns, (sql, resolve, reject) => {
                // 操作db
                pool.query(sql, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            })
        },
        insertInto(table) {
            return insertInto(table, (sql, resolve, reject) => {
                // 操作db
                pool.query(sql, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        },
        deleteFrom(table) {
            return deleteFrom(table, (sql, resolve, reject) => {
                // 操作db
                pool.query(sql, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        },
        update(table) {
            return update(table, (sql, resolve, reject) => {
                // 操作db
                pool.query(sql, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
    };
}