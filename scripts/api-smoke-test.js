const endpoints = [
  { name: "Hostel Blocks API", url: "/api/hostel-blocks", method: "GET" },
  { name: "Auth Login Validation", url: "/api/auth/login", method: "POST", body: {} },
  { name: "Public Search API", url: "/api/hostel-blocks", method: "GET" },
];

async function runSmokeTests() {
  const baseUrl = process.env.API_URL || "http://localhost:3000";
  console.log(`Starting API smoke tests on ${baseUrl}`);

  let passed = 0;
  let failed = 0;

  for (const endpoint of endpoints) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const options = {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      };

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const start = Date.now();
      const response = await fetch(`${baseUrl}${endpoint.url}`, options);
      const durationMs = Date.now() - start;

      if (response.status < 500) {
        console.log(`[PASS] ${endpoint.name} (${response.status}) - ${durationMs}ms`);
        passed += 1;
      } else {
        console.log(`[FAIL] ${endpoint.name} (${response.status}) - ${durationMs}ms`);
        failed += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`[ERROR] ${endpoint.name} failed: ${message}`);
      failed += 1;
    } finally {
      clearTimeout(timeout);
    }
  }

  console.log(`Smoke test results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runSmokeTests();
