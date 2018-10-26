const entityConfigs = new Map();
function createEntity(def: any, row: object) {
    const entity = new def();
    const { columns } = entityConfigs.get(def);
    columns.forEach(([columnName, propertyName]) => {
        const value = row[columnName];
        if (value !== undefined)
            entity[propertyName] = value;
    });
    return entity;
}

export class Entity {
    static from(row): Entity | Entity[] {
        if (Object.prototype.toString.call(row) === '[object Array]') {
            return row.map(r => createEntity(this, r));
        } else {
            return createEntity(this, row);
        }
    }

    static toRows(entities: Entity[]) {
        return entities.map(e => e.toRow());
    }

    toRow(): any {
        const { columns } = entityConfigs.get(this.constructor);
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
        const key = target.constructor;
        const config = entityConfigs.get(key) || { columns: [] };
        config.columns.push([name, propertyName]);
        entityConfigs.set(key, config);
    };
}