 import React from 'react';
import { Link } from 'react-router-dom';

const GestionFeedbacks = () => {
  const feedbacks = [
    {
      id: 1,
      utilisateur: 'Samira Ben Salah',
      note: 4,
      commentaire: "Conducteur très ponctuel et voiture confortable. Je recommande!",
      date: '15/06/2023',
      trajet: 'Tunis → Hammamet'
    },
    {
      id: 2,
      utilisateur: 'Karim Ben Amor',
      note: 2,
      commentaire: "Retard de 30 minutes au départ",
      date: '18/06/2023',
      trajet: 'Sousse → Monastir'
    }
  ];

  const renderEtoiles = (note) => {
    return '★'.repeat(note) + '☆'.repeat(5 - note);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion des Avis</h1>
      <Link to="/profile-admin" style={styles.backButton}>← Retour au tableau de bord</Link>
      
      <div style={styles.filtres}>
        <select style={styles.selectFiltre}>
          <option>Tous les avis</option>
          <option>Positifs (4-5 étoiles)</option>
          <option>Négatifs (1-2 étoiles)</option>
        </select>
        <input 
          type="text" 
          placeholder="Rechercher par utilisateur..."
          style={styles.inputRecherche}
        />
      </div>
      
      <div style={styles.feedbacksList}>
        {feedbacks.map(feedback => (
          <div key={feedback.id} style={styles.feedbackCard}>
            <div style={styles.feedbackHeader}>
              <div>
                <h3 style={styles.utilisateur}>{feedback.utilisateur}</h3>
                <p style={styles.trajet}>{feedback.trajet}</p>
              </div>
              <div style={styles.noteDate}>
                <span style={styles.note}>{renderEtoiles(feedback.note)}</span>
                <span style={styles.date}>{feedback.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    backgroundColor: '#f8f9fa'
  },
  title: {
    color: '#8e44ad',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '28px'
  },
  backButton: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#8e44ad',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  filtres: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px'
  },
  selectFiltre: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  inputRecherche: {
    flex: '2',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  feedbacksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  feedbackCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  feedbackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  utilisateur: {
    margin: '0',
    color: '#2c3e50'
  },
  trajet: {
    margin: '5px 0 0',
    color: '#7f8c8d',
    fontSize: '14px'
  },
  noteDate: {
    textAlign: 'right'
  },
  note: {
    color: '#f39c12',
    fontSize: '18px'
  },
  date: {
    display: 'block',
    color: '#7f8c8d',
    fontSize: '14px'
  },
  commentaire: {
    color: '#34495e',
    fontStyle: 'italic',
    margin: '0 0 15px',
    padding: '0 10px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  btnValider: {
    padding: '8px 15px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnSupprimer: {
    padding: '8px 15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default GestionFeedbacks;