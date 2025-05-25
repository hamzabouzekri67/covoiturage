import React from 'react';
import { Link } from 'react-router-dom';

const HistoriquePassager = () => {
  const trajetsPasses = [
    {
      id: 1,
      trajet: "Tunis → Sousse",
      date: "10/06/2023",
      conducteur: "Ali Ben Salah",
      note: 4,
      commentaire: "Très bon trajet, conducteur ponctuel"
    },
    {
      id: 2,
      trajet: "Sfax → Gabès",
      date: "05/06/2023",
      conducteur: "Fatma Ben Mohamed",
      note: 5,
      commentaire: "Excellent service, voiture très confortable"
    }
  ];

  const renderEtoiles = (note) => {
    return (
      <span style={{ color: '#f39c12', fontSize: '18px' }}>
        {'★'.repeat(note)}{'☆'.repeat(5 - note)}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mon Historique de Trajets</h1>
      <Link to="/profile-passager" style={styles.backButton}>
        ← Retour au profil
      </Link>

      <div style={styles.filtres}>
        <select style={styles.selectFiltre}>
          <option>Tous les trajets</option>
          <option>Ce mois</option>
          <option>Ce trimestre</option>
        </select>
      </div>

      <div style={styles.trajetsList}>
        {trajetsPasses.map(trajet => (
          <div key={trajet.id} style={styles.trajetCard}>
            <div style={styles.trajetHeader}>
              <h3 style={styles.trajetTitre}>{trajet.trajet}</h3>
              <span style={styles.trajetDate}>{trajet.date}</span>
            </div>
            
            <div style={styles.trajetDetails}>
              <p>
                <span style={styles.label}>Conducteur: </span>
                {trajet.conducteur}
              </p>
              <p>
                <span style={styles.label}>Note: </span>
                {renderEtoiles(trajet.note)}
              </p>
              {trajet.commentaire && (
                <p style={styles.commentaire}>
                  <span style={styles.label}>Avis: </span>
                  "{trajet.commentaire}"
                </p>
              )}
            </div>
            
            <div style={styles.actions}>
              <button style={styles.btnFeedback}>
                {trajet.commentaire ? 'Modifier avis' : 'Laisser un avis'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    backgroundColor: '#f8f9fa'
  },
  title: {
    color: '#3498db',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '28px'
  },
  backButton: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  filtres: {
    marginBottom: '25px'
  },
  selectFiltre: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: '100%',
    maxWidth: '300px'
  },
  trajetsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  trajetCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  trajetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  trajetTitre: {
    margin: '0',
    color: '#2c3e50'
  },
  trajetDate: {
    color: '#7f8c8d'
  },
  trajetDetails: {
    marginBottom: '15px'
  },
  label: {
    color: '#7f8c8d',
    fontWeight: 'bold'
  },
  commentaire: {
    fontStyle: 'italic',
    color: '#34495e',
    marginTop: '10px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  btnFeedback: {
    padding: '10px 20px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default HistoriquePassager;