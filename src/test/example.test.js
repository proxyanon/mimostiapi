/**
 * @file example.test.js
 * @description Simple example test to demonstrate Jest testing
 */

// Simple function to test
function sum(a, b) {
  return a + b;
}

// Jest test suite
describe('Example Test Suite', () => {
  // Test case
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  // Another test case
  test('adds -1 + 1 to equal 0', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});