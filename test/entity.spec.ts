import { Entity, Column } from '../src/entity';

class User extends Entity {
    @Column('name')
    name: string;
    @Column('age')
    age: string;
    @Column('created_at')
    createAt: number;
}


describe('test entity', () => {
    test('test from', async () => {
        expect(User.from({ name: 'abc', age: 1, created_at: 123 })).toEqual({ name: 'abc', age: 1, createAt: 123 });
    });
    test('test to row', async () => {
        const user = User.from({ name: 'abc', age: 1, created_at: 123 }) as User;
        expect(user.toRow()).toEqual({ name: 'abc', age: 1, created_at: 123 });
    });
});