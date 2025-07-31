```javascript
const sum = require('./sum');

describe('sum function', () => {
    // Test setup can be done here if needed

    afterEach(() => {
        // Test teardown can be done here if needed
    });

    test('should return the sum of two positive numbers', () => {
        expect(sum(1, 2)).toBe(3);
    });

    test('should return the sum of two negative numbers', () => {
        expect(sum(-1, -2)).toBe(-3);
    });

    test('should return the sum of a positive and a negative number', () => {
        expect(sum(1, -1)).toBe(0);
    });

    test('should return the sum of zero and a number', () => {
        expect(sum(0, 5)).toBe(5);
    });

    test('should return the sum of two zeros', () => {
        expect(sum(0, 0)).toBe(0);
    });

    test('should throw a TypeError if the first argument is not a number', () => {
        expect(() => sum('1', 2)).toThrow(TypeError);
        expect(() => sum(null, 2)).toThrow(TypeError);
        expect(() => sum(undefined, 2)).toThrow(TypeError);
    });

    test('should throw a TypeError if the second argument is not a number', () => {
        expect(() => sum(1, '2')).toThrow(TypeError);
        expect(() => sum(1, null)).toThrow(TypeError);
        expect(() => sum(1, undefined)).toThrow(TypeError);
    });

    test('should throw a TypeError if both arguments are not numbers', () => {
        expect(() => sum('1', '2')).toThrow(TypeError);
        expect(() => sum(null, null)).toThrow(TypeError);
        expect(() => sum(undefined, undefined)).toThrow(TypeError);
    });
});
```