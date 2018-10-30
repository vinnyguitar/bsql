export class Entity {
    constructor(row: object) {
        const { columns = [] } = this.constructor as any;
        columns.forEach(([columnName, propertyName]) => {
            const value = row[columnName];
            if (value !== undefined) {
                this[propertyName] = value;
            }
        });
    }

    public toRow(): object {
        const { columns = [] } = this.constructor as any;
        const row = {};
        columns.forEach(([columnName, propertyName]) => {
            const value = this[propertyName];
            if (value !== undefined) {
                row[columnName] = this[propertyName];
            }
        });
        return row;
    }
}

export function Column(name) {
    return (target, propertyName) => {
        const { constructor } = target;
        const columns = constructor.columns || [];
        columns.push([name, propertyName]);
        constructor.columns = columns;
    };
}
