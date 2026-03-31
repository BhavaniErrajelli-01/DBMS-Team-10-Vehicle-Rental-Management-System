import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`/api/vehicles/${id}`);
        setVehicle(res.data);
      } catch (err) {
        setError('Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, user, navigate]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (days > 0) {
        setTotalPrice(days * vehicle.price_per_day);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, vehicle]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (totalPrice <= 0) {
      setError('Invalid date range');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/bookings',
        { vehicle_id: vehicle.vehicle_id, start_date: startDate, end_date: endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
  if (error && !vehicle) return <div className="container" style={{ padding: '4rem 0', color: 'red' }}>{error}</div>;

  return (
    <div className="container" style={{ padding: '2rem 0', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 500px' }}>
        <img 
          src={vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800&h=500'} 
          alt={vehicle.name} 
          style={{ width: '100%', borderRadius: '0.5rem', objectFit: 'cover' }} 
        />
        <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{vehicle.name}</h2>
        <span className="vehicle-type" style={{ marginTop: '0.5rem' }}>{vehicle.type}</span>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          Experience the thrill and comfort of driving the {vehicle.name}. Book now and enjoy premium service.
        </p>
      </div>

      <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Booking Details</h3>
        <p className="vehicle-price" style={{ marginBottom: '2rem' }}>${vehicle.price_per_day}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> / day</span></p>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label className="form-label">Pick-up Date</label>
            <input 
              type="date" 
              className="form-input" 
              required
              min={new Date().toISOString().split('T')[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Drop-off Date</label>
            <input 
              type="date" 
              className="form-input" 
              required
              min={startDate || new Date().toISOString().split('T')[0]}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>Total Amount</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>${totalPrice.toFixed(2)}</span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
