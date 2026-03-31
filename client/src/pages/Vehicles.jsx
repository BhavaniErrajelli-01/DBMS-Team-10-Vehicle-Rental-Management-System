import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('/api/vehicles');
        setVehicles(res.data);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const types = ['All', ...new Set(vehicles.map(v => v.type))];

  const filteredVehicles = filterType === 'All' 
    ? vehicles 
    : vehicles.filter(v => v.type === filterType);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading vehicles...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Available Vehicles</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '500' }}>Filter by Type:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            {types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          No vehicles found.
        </div>
      ) : (
        <div className="vehicle-grid">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
