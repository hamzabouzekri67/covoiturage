import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function TopBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const checkUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserType(userData.role);
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  };

     checkUser();

     window.addEventListener('storage', checkUser);

  return () => {
    window.removeEventListener('storage', checkUser);
  };
}, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };

  const getProfilePath = () => {
    console.log(userType);
    
    switch(userType) {
      case 'admin': return '/profile-admin';
      case 'conducteur': return '/profile-conducteur';
      case 'passager': return '/profile-passager';
      default: return '/';
    }
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.logo}>Covoiturage</Link>
      
      <div style={styles.authSection}>
        {isLoggedIn ? (
          <>
            <Link to={getProfilePath()} style={styles.profileLink}>
              Mon Profil
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
             Déconnexion
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLogin} style={styles.loginButton}>
              Connexion
            </button>
            <button onClick={handleRegister} style={styles.registerButton}>
              S'inscrire
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#f8f9fa',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none',
  },
  authSection: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  loginButton: {
    padding: '8px 16px',
    backgroundColor: '#FF6B6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  registerButton: {
    padding: '8px 16px',
    backgroundColor: ' #FF6B6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  profileLink: {
    color: 'black',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    }
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default TopBar;