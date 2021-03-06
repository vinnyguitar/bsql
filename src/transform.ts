export function camelCase(value: any) {
    return transform(value, (str) => str.replace(/_([a-z])/g, ($1: string, $2: string) => $2.toUpperCase()));
}

export function snakeCase(value: any) {
    return transform(value, (str) => str.replace(/^[A-Z]/, ($1) => $1.toLowerCase())
        .replace(/[A-Z][a-z]/g, ($1: string) => '_' + $1.toLowerCase()));

}

function transform(value: any, func: (value: any) => string) {
    const type = typeof value;
    if (type === 'string') {
        return func(value);
    } else if (type === 'object') {
        if (value instanceof Array) {
            return value.map((v) => transform(v, func));
        } else {
            const tmp = {};
            Object.keys(value).forEach((k) => {
                tmp[func(k)] = value[k];
            });
            return tmp;
        }
    }
    return value;
}
