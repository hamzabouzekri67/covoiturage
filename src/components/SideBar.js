import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"))??null; 
   
  if (location.pathname !== '/') {
  }

  return (
    <div style={styles.sideBar}>
      <h2 style={styles.title}>Menu</h2>
      
      <div style={styles.menuItems}>
        <Link to="/" style={styles.link}>
          <button style={styles.button}>🏠 Accueil</button>
        </Link>
        <Link to="/rechercher-trajet" style={styles.link}>
          <button style={styles.button}>🔍 Rechercher un trajet</button>
        </Link>
          {user != null && (user.role !== 'admin' && user.role !== 'conducteur') && (
              <>
               <Link to="/proposer-trajet" style={styles.link}>
                  <button style={styles.button}>🚗 Proposer un trajet</button>
              </Link>

              <Link to="/feedback" style={styles.link}>
                  <button style={styles.button}>💬 Donnez votre avis</button>
              </Link>
          </>
         )}
      </div>
    </div>
  );
};

const styles = {
  sideBar: {
    width: '200px',
    height: '100vh', // Prend toute la hauteur de l'écran
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #ddd',
    boxSizing: 'border-box', // Inclut le padding dans la largeur
    position: 'fixed', // Fixe la sidebar
    overflowY: 'auto', // Permet le scroll si nécessaire
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: '0 0 20px 0', // Reset des marges
    fontSize: '18px',
    color: '#333',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee', // Ligne de séparation
  },
  menuItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Espacement uniforme entre les boutons
    flex: 1, // Prend tout l'espace disponible
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    display: 'block', // Meilleure surface cliquable
  },
  button: {
    width: '100%',
    padding: '12px 10px', // Meilleur confort de clic
    backgroundColor: '#FF6B6B',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s', // Animation douce
    ':hover': {
      backgroundColor: '#0056b3', // Effet au survol
    },
    margin: 0, // Reset des marges
  },
};

export default SideBar;