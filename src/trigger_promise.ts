export default class TriggerPromise {
    constructor(executor, mixin) {
        let resolve;
        let reject;
        const promise = new Promise((s, j) => {
            resolve = s;
            reject = j;
        });
        return new Proxy(promise, {
            get(target: any, name) {
                if (name === 'then' || name === 'catch' || name === 'finally') {
                    executor(resolve, reject);
                    return target[name].bind(target);
                } else {
                    return name in mixin ? mixin[name] : target[name];
                }
            }
        });
    }
}