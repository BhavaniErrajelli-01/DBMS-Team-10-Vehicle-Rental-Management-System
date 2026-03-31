import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <ShieldCheck size={32} />
          Vehicle Rental
        </Link>
        <div className="nav-links">
          <Link to="/vehicles" className="nav-link">Vehicles</Link>
          
          {user ? (
            <>
              <Link to="/add-vehicle" className="nav-link">Add Vehicle</Link>
              <Link to="/delete-vehicle" className="nav-link" style={{ color: 'var(--danger)' }}>Delete Vehicle</Link>
              {user.role === 'admin' ? (
                <Link to="/admin" className="nav-link">Admin</Link>
              ) : (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              )}
              <span className="nav-link">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
