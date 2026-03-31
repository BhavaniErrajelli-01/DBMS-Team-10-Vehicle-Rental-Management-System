import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeleteVehicle = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price_per_day: '',
    speed: '',
    vehicle_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you absolutely sure you want to delete this vehicle? This action cannot be undone.')) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('/api/vehicles/delete-match', formData, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess(response.data.message || 'Vehicle securely deleted based on matching records!');
      // Reset form on success
      setFormData({
        name: '', type: '', price_per_day: '', speed: '', vehicle_number: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting vehicle. Make sure all details match perfectly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--danger)' }}>Securely Delete Vehicle</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        To delete a vehicle, you must enter its exact details perfectly. If the data matches our records, the vehicle will be permanently removed.
      </p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.25rem' }}>{error}</div>}
      {success && <div style={{ color: '#065f46', marginBottom: '1rem', padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '0.25rem' }}>{success}</div>}

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vehicle Name</label>
            <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Toyota Civic 2023" />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <input type="text" name="type" className="form-input" required value={formData.type} onChange={handleInputChange} placeholder="e.g. Sedan, SUV, Motorcycle" />
          </div>
          <div className="form-group">
            <label className="form-label">Price per Day ($)</label>
            <input type="number" name="price_per_day" className="form-input" required min="1" value={formData.price_per_day} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Top Speed (km/h)</label>
            <input type="number" name="speed" className="form-input" required value={formData.speed} onChange={handleInputChange} placeholder="e.g. 220" />
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle Number (License Plate)</label>
            <input type="text" name="vehicle_number" className="form-input" required value={formData.vehicle_number} onChange={handleInputChange} placeholder="e.g. ABC 1234" />
          </div>
          
          <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', backgroundColor: 'var(--danger)', color: 'white', border: 'none' }} disabled={loading}>
            {loading ? 'Verifying & Deleting...' : 'Confirm & Delete Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteVehicle;
