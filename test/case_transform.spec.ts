import { camelCase, snakeCase } from '../src/case_transform';

describe('case_transform', () => {
    test('camelCase', () => {
        expect(camelCase('case_transform')).toBe('caseTransform');
        expect(camelCase({ 'user_name': 'lili', 'user_age': 28 })).toEqual({
            userName: 'lili',
            userAge: 28
        });
        expect(camelCase([{ 'user_name': 'lili', 'user_age': 28 }])).toEqual([{
            userName: 'lili',
            userAge: 28
        }]);
    });

    test('snakeCase', () => {
        expect(snakeCase('caseTransform')).toBe('case_transform');
        expect(snakeCase({
            userName: 'lili',
            userAge: 28
        })).toEqual({ 'user_name': 'lili', 'user_age': 28 });
        expect(snakeCase([{
            userName: 'lili',
            userAge: 28
        }])).toEqual([{ 'user_name': 'lili', 'user_age': 28 }]);
    });
});