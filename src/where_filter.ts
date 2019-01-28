import { escape, escapeId } from 'mysql';
import { snakeCase } from './transform';
export interface WhereOpr {
    $gt?: number;
    $lt?: number;
    $not?: number | boolean | string;
    $gte?: number;
    $lte?: number;
    $like?: string;
    $notLike?: string;
    $in?: any[];
    $notIn?: any[];
    $isNull?: boolean;
}

export interface WhereFilter {
    $or?: WhereOpr[];
    [propName: string]: boolean | string | number | WhereOpr | WhereOpr[];
}

export function buildWhereSql(filter: WhereFilter) {
    return Object.keys(filter).map((key) => {
        if (key === '$or') {
            return filter.$or.join(' OR ');
        } else {
            return buildOpr(key, filter[key] as WhereOpr);
        }
    }).join(' AND ');
}

function buildOpr(key: string, opr: WhereOpr) {
    const type = typeof opr;
    const left = escapeId(snakeCase(key));
    let operator: string;
    let right: string;
    if (type === 'number' || type === 'string' || type === 'boolean') {
        operator = '=';
    } else if (type === 'object') {
        if ('$gt' in opr) {
            operator = '>';
            right = escape(opr.$gt);
        } else if ('$lt' in opr) {
            operator = '<';
            right = escape(opr.$lt);
        } else if ('$not' in opr) {
            operator = '<>';
            right = escape(opr.$not);
        } else if ('$gte' in opr) {
            operator = '>=';
            right = escape(opr.$gte);
        } else if ('$lte' in opr) {
            operator = '<=';
            right = escape(opr.$lte);
        } else if ('$like' in opr) {
            operator = 'LIKE';
            right = escape(opr.$like);
        } else if ('$notLike' in opr) {
            operator = 'NOT LIKE';
            right = escape(opr.$notLike);
        } else if ('$in' in opr) {
            operator = 'IN';
            right = escape(opr.$in);
        } else if ('$notIn' in opr) {
            operator = 'NOT IN';
            right = escape(opr.$notIn);
        } else if ('$isNull' in opr) {
            operator = opr.$isNull ? 'IS NULL' : 'IS NOT NULL';
        }
        return [left, operator, right].filter((y) => !!y).join(' ');
    }
}
