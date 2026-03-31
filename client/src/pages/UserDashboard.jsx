import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/bookings/mybookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/bookings/${bookingId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update local state
        setBookings(bookings.map(b => b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b));
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Pick-up Date</th>
                <th>Drop-off Date</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.booking_id}>
                  <td>#{booking.booking_id}</td>
                  <td>{booking.vehicle_name}</td>
                  <td>{new Date(booking.start_date).toLocaleDateString()}</td>
                  <td>{new Date(booking.end_date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600' }}>${booking.total_price}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      backgroundColor: booking.status === 'confirmed' ? '#d1fae5' : booking.status === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: booking.status === 'confirmed' ? '#065f46' : booking.status === 'pending' ? '#92400e' : '#991b1b'
                    }}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {booking.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleCancel(booking.booking_id)}
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
