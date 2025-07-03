/**
 * @file simple-test.js
 * @description Simple test script that doesn't rely on a testing framework
 */

// Simple function to test
function sum(a, b) {
  return a + b;
}

// Test function
function testSum() {
  console.log('Running sum test...');
  
  // Test case 1
  const result1 = sum(1, 2);
  const expected1 = 3;
  if (result1 !== expected1) {
    console.error(`Test failed: sum(1, 2) returned ${result1}, expected ${expected1}`);
    process.exit(1);
  }
  
  // Test case 2
  const result2 = sum(-1, 1);
  const expected2 = 0;
  if (result2 !== expected2) {
    console.error(`Test failed: sum(-1, 1) returned ${result2}, expected ${expected2}`);
    process.exit(1);
  }
  
  console.log('All tests passed!');
}

// Run the test
testSum();