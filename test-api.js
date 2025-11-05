#!/usr/bin/env node

/**
 * Test script for API endpoints
 * Run this after starting the server and ensuring databases are running
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  const tests = [
    {
      name: 'Health Check',
      test: async () => {
        const result = await makeRequest('/health');
        return result.status === 200 && result.data.status === 'ok';
      }
    },
    {
      name: 'Get All Listings',
      test: async () => {
        const result = await makeRequest('/listings');
        return result.status === 200 && Array.isArray(result.data);
      }
    },
    {
      name: 'Create Listing',
      test: async () => {
        const listing = {
          title: 'Test Property',
          city: 'San Francisco',
          price: 400000,
          bedrooms: 3,
          agentId: 101
        };
        const result = await makeRequest('/listings', 'POST', listing);
        return result.status === 201 && result.data.id;
      }
    },
    {
      name: 'Get Listing by ID',
      test: async () => {
        const result = await makeRequest('/listings/1');
        return result.status === 200 && result.data.id === 1;
      }
    },
    {
      name: 'Update Listing',
      test: async () => {
        const update = {
          title: 'Updated Test Property',
          city: 'San Francisco',
          price: 425000,
          bedrooms: 3,
          agentId: 101
        };
        const result = await makeRequest('/listings/1', 'PUT', update);
        return result.status === 200 && result.data.price === '425000.00';
      }
    },
    {
      name: 'Get Active Agents Stats',
      test: async () => {
        const result = await makeRequest('/stats/active-agents');
        return result.status === 200 && Array.isArray(result.data);
      }
    },
    {
      name: 'Error Handling - Invalid ID',
      test: async () => {
        const result = await makeRequest('/listings/invalid');
        return result.status === 400 && result.data.error === true;
      }
    },
    {
      name: 'Error Handling - Not Found',
      test: async () => {
        const result = await makeRequest('/listings/99999');
        return result.status === 404 && result.data.error === true;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const { name, test } of tests) {
    try {
      const result = await test();
      if (result) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name} - Test failed`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Make sure databases are running and seeded.');
  }
}

// Check if server is running first
makeRequest('/health')
  .then(() => {
    console.log('✅ Server is running\n');
    runTests();
  })
  .catch((error) => {
    console.error('❌ Server is not running or not accessible');
    console.error('   Please start the server first: npm start');
    console.error('   Error:', error.message);
    process.exit(1);
  });

