const http = require('http');

const adminCredentials = JSON.stringify({
  regimentalNumber: '4COY2T',
  password: '4/2coy'
});

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  try {
    console.log('1. Attempting login as Admin...');
    const loginResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(adminCredentials)
      }
    }, adminCredentials);

    console.log('Login Response Status:', loginResult.statusCode);
    console.log('Login Response Body:', loginResult.body);

    const data = JSON.parse(loginResult.body);
    if (!data.token) {
      console.error('Failed to obtain token from backend.');
      return;
    }

    const token = data.token;
    console.log('\n2. Fetching cadets...');
    const cadetsResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/cadets',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Cadets Response Status:', cadetsResult.statusCode);
    console.log('Cadets Response Body:', cadetsResult.body);
  } catch (err) {
    console.error('Error during API diagnostics:', err.message);
  }
}

run();
