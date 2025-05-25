import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/logo2.png';

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Contenu principal centré */}
      <div style={styles.centeredContent}>
        <h1 style={styles.title}>Bienvenue sur Mashi Maak</h1>
        <div style={styles.subtitle}>
          <span style={styles.subtitlePart}>Covoiturage</span>
          <span style={styles.subtitlePart}>Simple</span>
          <span style={styles.subtitlePart}>Économique</span>
        </div>

        {/* Bouton d'action principal */}
        <div style={styles.actionArea}>
          <Link to="/rechercher-trajet" style={styles.navLink}>
            <button style={styles.primaryBtn}>
              <span style={styles.btnIcon}>🔍</span> 
              <span style={styles.btnText}>Trouver un trajet</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Styles avec nouvelles couleurs
const styles = {
  container: {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    marginLeft: '250px',
    padding: '40px',
    boxSizing: 'border-box',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    color: '#FF6B6B',  // Nouvelle couleur rouge corail
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: '3rem',
  },
  subtitlePart: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.2)',
    color: 'rgb(84, 78, 205)',  // Nouvelle couleur turquoise
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  actionArea: {
    marginTop: '2rem',
    width: '100%',
    maxWidth: '300px',
  },
  navLink: {
    textDecoration: 'none',
  },
  primaryBtn: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#FF6B6B', // Même rouge que le titre
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#FF5252',
    }
  },
  btnIcon: {
    fontSize: '1.3rem',
  },
  btnText: {
    textAlign: 'center',
  },
};

export default Home;