import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '700' }}>Find Your Perfect Ride</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.9' }}>
            Choose from a wide range of premium vehicles for your next adventure.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Search by vehicle type or name..." 
              className="form-input"
              style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '0.5rem 0 0 0.5rem' }}
            />
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '0 0.5rem 0.5rem 0', backgroundColor: 'var(--primary-hover)' }}>
              <Search />
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Featured Vehicles</h2>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Browse our selection of the most popular rental cars.</p>
          <Link to="/vehicles" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
            View All Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
