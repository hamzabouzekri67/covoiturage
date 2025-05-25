import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation des champs
      if (!email || !password) {
        throw new Error('Tous les champs sont obligatoires');
      }

      // Appel à l'API backend
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion');
      }

      // Stockage du token et des informations utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      
      // Redirection vers le profil approprié
      window.location.href = "/"
      // switch(data.user.role) {
      //   case 'admin':
      //     navigate('/profile-admin');
      //     break;
      //   case 'conducteur':
      //     navigate('/profile-conducteur');
      //     break;
      //   default:
      //     navigate('/profile-passager');
      // }
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Connexion</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Adresse email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={isLoading}
            placeholder="Votre adresse email"
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading}
            placeholder="Votre mot de passe"
          />
        </div>

        <button 
          type="submit" 
          style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>

        <div style={styles.footerLinks}>
          <a href="/mot-de-passe-oublie" style={styles.link}>
            Mot de passe oublié ?
          </a>
          <span style={styles.separator}>|</span>
          <a href="/register" style={styles.link}>
            Créer un compte
          </a>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '1.5rem',
  },
  error: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#495057',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.15s',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.15s',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
    gap: '1rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  separator: {
    color: '#6c757d',
  },
};

export default Login;