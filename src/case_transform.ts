import * as Case from 'case';
import { getConfig } from './config';

const config = getConfig();

export function transformToDb(value: any) {
    return config.caseTransform ? snakeCase(value) : value;
}

export function transformToEntity(value: any) {
    return config.caseTransform ? camelCase(value) : value;
}

export function camelCase(value: any) {
    return transform(value, Case.camel);
}

export function snakeCase(value: any) {
    return transform(value, Case.snake);
}

function transform(value: any, func) {
    const type = typeof value;
    if (type === 'string') {
        return func(value);
    } else if (type === 'object') {
        if (value instanceof Array) {
            return value.map(v => transform(v, func));
        } else {
            const tmp = {};
            Object.keys(value).forEach(k => {
                tmp[func(k)] = value[k];
            });
            return tmp;
        }
    }
    return value;
}