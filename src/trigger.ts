export function createTrigger(handler, start) {
    return new Proxy({}, {
        get(target: any, name) {
            if (name === 'then') {
                start();
                return target.then;
            } else {
                return name in handler ? handler[name] : target[name];
            }
        }
    });
}