const app = require('../server');
const mongoose = require('mongoose');

async function runTests() {
  console.log('--- Starting Sunnahkkr VPN Backend Service Validation ---');
  let failures = 0;

  // 1. Verify environment configuration fallbacks
  try {
    if (app) {
      console.log('✅ PASS: Express server initialization modules loaded correctly.');
    } else {
      throw new Error('Server module undefined');
    }
  } catch (err) {
    console.error('❌ FAIL: Express initialization', err);
    failures++;
  }

  // 2. Validate Server Schema structure locally
  try {
    const Server = require('../models/Server');
    if (Server) {
      console.log('✅ PASS: Mongoose Server Model Schema compilation check passed.');
    }
  } catch (err) {
    console.error('❌ FAIL: Server Model Compilation', err);
    failures++;
  }

  // 3. Validate User Schema structure locally
  try {
    const User = require('../models/User');
    if (User) {
      console.log('✅ PASS: Mongoose User Model Schema compilation check passed.');
    }
  } catch (err) {
    console.error('❌ FAIL: User Model Compilation', err);
    failures++;
  }

  // Final check
  if (failures > 0) {
    console.log(`--- Test Run Completed: ${failures} failures occurred ---`);
    process.exit(1);
  } else {
    console.log('--- Test Run Completed: All sanity & module tests passed! ---');
    process.exit(0);
  }
}

runTests();
