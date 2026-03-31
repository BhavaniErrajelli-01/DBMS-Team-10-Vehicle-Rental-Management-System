import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [newVehicle, setNewVehicle] = useState({ name: '', type: '', price_per_day: '', availability: true, image: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [vehiclesRes, bookingsRes] = await Promise.all([
          axios.get('/api/vehicles'),
          axios.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setVehicles(vehiclesRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Error fetching admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/vehicles', newVehicle, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh vehicles
      const vRes = await axios.get('/api/vehicles');
      setVehicles(vRes.data);
      setNewVehicle({ name: '', type: '', price_per_day: '', availability: true, image: '' });
      alert('Vehicle added successfully');
    } catch (err) {
      alert('Error adding vehicle');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Delete this vehicle?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(vehicles.filter(v => v.vehicle_id !== id));
      } catch (err) {
        alert('Error deleting vehicle');
      }
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bookings/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.map(b => b.booking_id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Admin Dashboard...</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Admin Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        {/* Add New Vehicle Form */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Vehicle</h3>
          <form onSubmit={handleAddVehicle}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" required value={newVehicle.name} onChange={e => setNewVehicle({...newVehicle, name: e.target.value})} placeholder="e.g. Toyota Camry" />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <input type="text" className="form-input" required value={newVehicle.type} onChange={e => setNewVehicle({...newVehicle, type: e.target.value})} placeholder="e.g. Sedan, SUV" />
            </div>
            <div className="form-group">
              <label className="form-label">Price per Day ($)</label>
              <input type="number" className="form-input" required min="1" value={newVehicle.price_per_day} onChange={e => setNewVehicle({...newVehicle, price_per_day: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="url" className="form-input" value={newVehicle.image} onChange={e => setNewVehicle({...newVehicle, image: e.target.value})} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Vehicle</button>
          </form>
        </div>

        {/* Manage Data */}
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Manage Vehicles</h3>
          <div style={{ height: '300px', overflowY: 'auto', marginBottom: '3rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
            <table className="table" style={{ margin: 0 }}>
              <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.vehicle_id}>
                    <td>#{v.vehicle_id}</td>
                    <td>{v.name}</td>
                    <td>{v.type}</td>
                    <td>${v.price_per_day}</td>
                    <td>
                      <button onClick={() => handleDeleteVehicle(v.vehicle_id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Manage Bookings</h3>
          <div style={{ height: '300px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
            <table className="table" style={{ margin: 0 }}>
              <thead><tr><th>ID</th><th>User</th><th>Vehicle</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.booking_id}>
                    <td>#{b.booking_id}</td>
                    <td>{b.user_name}</td>
                    <td>{b.vehicle_name}</td>
                    <td>{new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}</td>
                    <td>
                       <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          backgroundColor: b.status === 'confirmed' ? '#d1fae5' : b.status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: b.status === 'confirmed' ? '#065f46' : b.status === 'pending' ? '#92400e' : '#991b1b'
                        }}>
                          {b.status}
                        </span>
                    </td>
                    <td>
                        <select 
                          className="form-input" 
                          style={{ padding: '0.25rem', fontSize: '0.75rem', width: 'auto' }}
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.booking_id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
