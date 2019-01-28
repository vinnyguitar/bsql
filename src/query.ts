/**
 * 重写promise，延迟到调用then或catch时触发查询。
 */
export abstract class Query<T> implements Promise<T> {
    public readonly [Symbol.toStringTag] = 'Promise';
    protected sql: any = {};
    private promise: Promise<T>;
    private readonly plugins = [];
    constructor(private readonly query: (sql: string, cb) => void) {
        let resolve;
        let reject;
        const promise = new Promise<T>((s, j) => {
            resolve = s;
            reject = j;
        });
        const that = this;
        this.promise = promise;
        return new Proxy(promise, {
            get(target: any, name) {
                if (name === 'then' || name === 'catch') {
                    that.execute(resolve, reject);
                    return target[name].bind(target);
                } else {
                    return name in that ? that[name] : target[name];
                }
            },
        });
    }

    get then() {
        return this.promise.then;
    }

    get catch() {
        return this.promise.catch;
    }
    /**
     * 插件，用于数据后处理.
     * @param cb 回调
     */
    public plugin(cb) {
        this.plugins.push(cb);
    }
    /**
     * 获取sql，子类实现具体逻辑
     */
    protected abstract getSql(): string;
    /**
     * 子类实现具体触发后逻辑
     * @param resolve 通过回调
     * @param reject 拒绝回调
     */
    private execute(resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) {
        this.query(this.getSql(), (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(this.plugins.reduce((pre, cur) => cur(pre), results));
            }
        });
    }

}
