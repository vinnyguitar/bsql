import { escape, escapeId } from 'mysql';
import TriggerPromise from './trigger_promise';
import { buildWhere, buildGroupBy, buildSql } from './builder';

export function count(table: string) {
    const sql = {
        select: `SELECT COUNT(*) FROM ${escapeId(table)}`,
        where: '',
    };
    return new TriggerPromise(
        (resolve) => {
            resolve(buildSql([sql.select, sql.where]));
        }, {
            where(and, or) {
                sql.where = buildWhere(and, or);
                return this;
            }
        }) as any;
}
// export default {
//     count(table, onTrigger) {
//         const sql = [`SELECT COUNT(*) FROM ${table}`];
//         return createTriggerPromise({
//             where(and, or) {
//                 const where = buildWhere(and, or);
//                 if (sql.indexOf(where) === -1) {
//                     sql.push(where);
//                 }
//                 return this;
//             }
//         }, () => onTrigger(sql.join(' ')));
//     },
//     insert(rows, onTrigger) {
//         const keys = [];
//         const values = [];
//         rows.forEach(row => {
//             const value = [];
//             Object.keys(row).forEach(key => {
//                 if (keys.indexOf(key) === -1) {
//                     keys.push(key);
//                 }
//                 const index = keys.indexOf(key);
//                 value[index] = row[key];

//             });
//             values.push(values);
//         });
//         const sql = [`INSERT (${escape(keys)}) INTO`];
//         return createTriggerPromise({
//             into(table) {
//                 sql.push(table);
//                 sql.push(`(${escape(values)})`);
//                 return this;
//             }
//         }, () => connection.query(sql.join(' ')));
//     },
//     select(columns) {
//         const sql = ['SELECT'];
//         sql.push(!columns ? '*' : columns.join(', '));
//         return {
//             from(table) {
//                 sql.push(`FROM ${table}`);
//                 return createTriggerPromise({
//                     where(and, or) {
//                         sql.push(buildWhere(and, or));
//                         return this;
//                     },
//                     groupBy(column) {
//                         sql.push(buildGroupBy(column));
//                         return this;
//                     },
//                     orderBy(order) {
//                         const arr = [];
//                         Object.keys(order).forEach(key => arr.push(`${key} ${order[key]}`));
//                         sql.push(`ORDER BY ${arr.join(',')}`);
//                         return this;
//                     },
//                     limit(limit) {
//                         sql.push(`LIMIT ${limit}`);
//                         return this;
//                     },
//                     offset(offset) {
//                         sql.push(`OFFSET ${offset}`);
//                         return this;
//                     }
//                 }, () => connection.query(sql.join(' ')));
//             }
//         };
//     },
//     update(table) {
//         const sql = [`UPDATE ${table}`];
//         return {
//             set(value) {
//                 if (value.length) {

//                 } else {
//                     sql.push(`SET ${connection.escape(value)}`);
//                 }
//                 return createTriggerPromise({
//                     when(column) {

//                     },
//                     where(and, or) {
//                         sql.push(buildWhere(and, or));
//                         return this;
//                     }
//                 }, () => connection.query(sql.join(' ')));
//             }
//         }

//     },
//     delete(table) {
//         const sql = [`DELETE FROM ${table}`];
//         return createTriggerPromise({
//             where(and, or) {
//                 sql.push(buildWhere(and, or));
//                 return this;
//             }
//         }, () => connection.query(sql.join(' ')));
//     }
// }