const fs = require('fs');

const files = [
  'client/src/context/AuthContext.jsx',
  'client/src/pages/AddVehicle.jsx',
  'client/src/pages/AdminDashboard.jsx',
  'client/src/pages/Booking.jsx',
  'client/src/pages/DeleteVehicle.jsx',
  'client/src/pages/UserDashboard.jsx',
  'client/src/pages/Vehicles.jsx',
  'client/src/components/VehicleCard.jsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/http:\/\/localhost:5000/g, '');
    fs.writeFileSync(f, content);
    console.log(`Updated ${f}`);
  }
});
