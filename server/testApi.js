const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function test() {
  try {
    // 1. Create a normal user
    console.log("Creating user...");
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'password',
      phone: '123'
    });
    const token = regRes.data.token;
    console.log("Token acquired.");

    // 2. Add vehicle
    console.log("Adding vehicle...");
    
    // Create dummy image file
    fs.writeFileSync('dummy.jpg', 'fake image data');
    
    const form = new FormData();
    form.append('name', 'Test Vehicle');
    form.append('type', 'Sedan');
    form.append('price_per_day', 50);
    form.append('image', fs.createReadStream('dummy.jpg'));
    form.append('speed', 200);
    form.append('vehicle_number', 'TEST-123');

    const addRes = await axios.post('http://localhost:5000/api/vehicles', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Success! Status:", addRes.status, addRes.data);
  } catch (err) {
    if (err.response) {
      console.error("Failed with status:", err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

test();
