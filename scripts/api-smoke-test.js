const endpoints = [
    { name: 'Root API Status', url: '/api/hostel-blocks', method: 'GET' },
    { name: 'Auth Login Endpoint', url: '/api/auth/login', method: 'POST', body: {} },
    { name: 'Public Search API', url: '/api/hostel-blocks', method: 'GET' }
];

async function runSmokeTests() {
    const baseUrl = process.env.API_URL || 'http://localhost:3000';
    console.log(`🚀 Starting API Smoke Tests on ${baseUrl}...\n`);

    let passed = 0;
    let failed = 0;

    for (const endpoint of endpoints) {
        try {
            const options = {
                method: endpoint.method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (endpoint.body) options.body = JSON.stringify(endpoint.body);

            const start = Date.now();
            const res = await fetch(`${baseUrl}${endpoint.url}`, options);
            const duration = Date.now() - start;

            if (res.status < 500) {
                console.log(`✅ [PASS] ${endpoint.name} (${res.status}) - ${duration}ms`);
                passed++;
            } else {
                console.log(`❌ [FAIL] ${endpoint.name} (${res.status}) - ${duration}ms`);
                failed++;
            }
        } catch (err) {
            console.log(`❌ [ERROR] ${endpoint.name} failed: ${err.message}`);
            failed++;
        }
    }

    console.log(`\n📊 Results: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) process.exit(1);
}

runSmokeTests();
