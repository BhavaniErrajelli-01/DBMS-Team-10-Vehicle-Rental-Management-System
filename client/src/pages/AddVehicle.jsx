import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddVehicle = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price_per_day: '',
    speed: '',
    vehicle_number: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('name', formData.name);
    form.append('type', formData.type);
    form.append('price_per_day', formData.price_per_day);
    form.append('speed', formData.speed);
    form.append('vehicle_number', formData.vehicle_number);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      await axios.post('/api/vehicles', form, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Vehicle added successfully!');
      navigate('/vehicles');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>List Your Vehicle</h2>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.25rem' }}>{error}</div>}

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
            <input type="text" name="speed" className="form-input" required value={formData.vehicle_number} onChange={(e) => setFormData({...formData, vehicle_number: e.target.value})} placeholder="e.g. ABC 1234" />
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle Photo</label>
            <input type="file" name="image" className="form-input" accept="image/*" required onChange={handleFileChange} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
