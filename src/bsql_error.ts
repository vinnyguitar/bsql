export function assert(value: any, message: string) {
    if (!value) {
        throw new BsqlError('BsqlError: ' + message);
    }
}

export class BsqlError {
    constructor(public readonly message: string) { }
}
