// Native fetch used

async function testAPI() {
    const baseUrl = 'http://localhost:3000/api';
    console.log('--- Starting API Verification ---');

    // 1. Test Login & Get IDs
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'rahul@student.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('1. Login:', loginRes.ok ? 'OK' : 'FAIL');
    const studentId = loginData.student;

    if (!studentId) {
        console.error('Cannot proceed without studentId');
        return;
    }

    // 2. Test Dashboard
    const dashboardRes = await fetch(`${baseUrl}/dashboard?studentId=${studentId}`);
    const dashboardData = await dashboardRes.json();
    console.log('2. Dashboard API:', dashboardRes.ok ? 'OK' : 'FAIL');
    if (!dashboardRes.ok) console.error(dashboardData);

    // 3. Test Hostels Search
    const searchRes = await fetch(`${baseUrl}/hostels`);
    const searchData = await searchRes.json();
    console.log('3. Hostels Search:', searchRes.ok && searchData.length > 0 ? 'OK' : 'FAIL');

    // 4. Test Weekly Mess Menu
    // We need a hostelBlockId. Let's get it from the first search result.
    const hostelId = searchData[0]?._id;
    const menuRes = await fetch(`${baseUrl}/mess-menu/week?hostelBlockId=${hostelId}`);
    console.log('4. Weekly Mess Menu:', menuRes.ok ? 'OK' : 'FAIL');

    // 5. Test Notices
    const noticesRes = await fetch(`${baseUrl}/notices`);
    console.log('5. Notices API:', noticesRes.ok ? 'OK' : 'FAIL');

    console.log('--- Verification Completed ---');
}

testAPI();
