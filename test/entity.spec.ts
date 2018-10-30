import { Column, Entity } from "../src/entity";

class User extends Entity {
    @Column("name")
    public name: string;

    @Column("age")
    public age: string;

    @Column("created_at")
    public createAt: number;
}

describe("test entity", () => {
    test("test from", async () => {
        expect(new User({ name: "abc", age: 1, created_at: 123 })).toEqual({ name: "abc", age: 1, createAt: 123 });
    });
    test("test to row", async () => {
        const user = new User({ name: "abc", age: 1, created_at: 123 }) as User;
        expect(user.toRow()).toEqual({ name: "abc", age: 1, created_at: 123 });
    });
});
