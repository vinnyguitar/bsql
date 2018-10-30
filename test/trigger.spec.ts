import TriggerPromise from "../src/trigger_promise";
describe("test trigger", () => {
    test("test createTrigger", (done) => {
        const trigger: any = new TriggerPromise(
            (resolve) => {
                resolve(123);
            },
            {
                name: "abc",
                test() {
                    return this.name;
                },
            });
        expect(trigger.test()).toBe("abc");
        trigger.then((v) => {
            expect(v).toBe(123);
            done();
        });
    });
});
