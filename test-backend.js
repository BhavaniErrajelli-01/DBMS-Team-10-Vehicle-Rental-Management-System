(async () => {
  try {
    const res = await fetch('https://dbms-team-10-vehicle-rental-management.onrender.com/');
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text}`);
  } catch (e) {
    console.error(`Error:`, e);
  }
})();
