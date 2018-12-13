import { camelCase, snakeCase } from "../src/case_transform";

describe("case_transform", () => {
    test("camelCase", () => {
        expect(camelCase("case_transform")).toBe("caseTransform");
        expect(camelCase({ user_name: "lili", user_age: 28 })).toEqual({
            userAge: 28,
            userName: "lili",
        });
        expect(camelCase([{ user_name: "lili", user_age: 28 }])).toEqual([{
            userAge: 28,
            userName: "lili",
        }]);
    });

    test("snakeCase", () => {
        expect(snakeCase("caseTransform")).toBe("case_transform");
        expect(snakeCase({
            userAge: 28,
            userName: "lili",
        })).toEqual({ user_name: "lili", user_age: 28 });
        expect(snakeCase([{
            userAge: 28,
            userName: "lili",
        }])).toEqual([{ user_name: "lili", user_age: 28 }]);
    });
});
