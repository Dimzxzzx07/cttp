// CONTOH SIMPLE - file: ping-simple.js
const CTTPClient = require('./dist/index.js');

async function simplePing() {
  const client = new CTTPClient();
  
  try {
    console.log('🔍 Testing PING method...');
    
    // Simple PING
    const response = await client.ping('https://httpbin.org/get');
    console.log('✅ PING Success!');
    console.log('Status:', response.getStatus());
    console.log('Response:', response.getBody());
    
    // Health Check
    const healthy = await client.pingHealth('https://httpbin.org/get');
    console.log('Health Check:', healthy ? '✅ Healthy' : '❌ Unhealthy');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

simplePing();
