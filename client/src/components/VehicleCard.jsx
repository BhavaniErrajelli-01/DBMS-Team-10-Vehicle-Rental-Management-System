import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="card">
      <img 
        src={vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400&h=250'} 
        alt={vehicle.name} 
        className="vehicle-img" 
      />
      <div className="vehicle-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="vehicle-type">{vehicle.type}</span>
          {vehicle.vehicle_number && <span style={{ fontSize: '0.8rem', backgroundColor: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>{vehicle.vehicle_number}</span>}
        </div>
        <h3 className="vehicle-title">{vehicle.name}</h3>
        {vehicle.speed && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Top Speed: {vehicle.speed} km/h</div>}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <div className="vehicle-price">${vehicle.price_per_day}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/day</span></div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {vehicle.availability ? (
              <Link to={`/vehicles/${vehicle.vehicle_id}/book`} className="btn btn-primary">Book Now</Link>
            ) : (
              <button className="btn btn-outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Unavailable</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
