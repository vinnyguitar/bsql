import { createTrigger } from '../src/trigger';
describe('test trigger', () => {
    test('test createTrigger', done => {
        const trigger = createTrigger({
            name: 'abc',
            test() {
                return this.name;
            }
        }, (resolve) => {
            resolve(123);
        });
        expect(trigger.test()).toBe('abc');
        trigger.then(v => {
            expect(v).toBe(123);
            done();
        });
    });
});