export function createTrigger(handler, onTrigger) {
    let resolve;
    let reject;
    const promise = new Promise((s, j) => {
        resolve = s;
        reject = j;
    });
    return new Proxy(promise, {
        get(target: any, name) {
            if (name === 'then' || name === 'catch' || name === 'finally') {
                onTrigger(resolve, reject);
                return target[name].bind(target);
            } else {
                return name in handler ? handler[name] : target[name];
            }
        }
    });
}