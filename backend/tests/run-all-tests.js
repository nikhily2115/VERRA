const { execSync } = require('child_process');

console.log('🚀 Running All VERRA Backend Tests...\n');
console.log('=' .repeat(60));

const tests = [
  { name: 'Authentication API', file: 'auth-api-test.js' },
  { name: 'Product API', file: 'product-api-test.js' },
  { name: 'Product Admin', file: 'product-admin-test.js' },
  { name: 'User Profile & Cart', file: 'user-api-test.js' },
  { name: 'Payment Integration', file: 'payment-api-test.js' },
  { name: 'Order Management', file: 'order-api-test.js' },
  { name: 'Admin Dashboard', file: 'admin-api-test.js' },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  console.log(`\n📋 Running: ${test.name}`);
  console.log('-'.repeat(60));
  
  try {
    execSync(`node tests/${test.file}`, { 
      stdio: 'inherit',
      cwd: __dirname + '/..'
    });
    passed++;
    console.log(`✅ ${test.name} - PASSED`);
  } catch (error) {
    failed++;
    console.log(`❌ ${test.name} - FAILED`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Test Summary:`);
console.log(`   Total: ${tests.length}`);
console.log(`   Passed: ${passed}`);
console.log(`   Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed!\n');
  process.exit(1);
}
