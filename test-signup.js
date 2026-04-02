(async () => {
  try {
    const res = await fetch('https://dbms-team-10-vehicle-rental-management.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'testuser', email: 'test12345@test.com', password: 'password123' })
    });
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text}`);
  } catch (e) {
    console.error(`Error:`, e);
  }
})();
