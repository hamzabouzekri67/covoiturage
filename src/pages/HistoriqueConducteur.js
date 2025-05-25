import React from 'react';
import { Link } from 'react-router-dom';

const HistoriqueConducteur = () => {
  const trajetsEffectues = [
    {
      id: 1,
      trajet: 'Tunis → Sousse',
      date: '15/06/2023',
      passagers: 3,
      revenu: 75,
      note: 4.5
    },
    {
      id: 2,
      trajet: 'Sousse → Monastir',
      date: '18/06/2023',
      passagers: 2,
      revenu: 40,
      note: 4.0
    },
    {
      id: 3,
      trajet: 'Tunis → Nabeul',
      date: '20/06/2023',
      passagers: 4,
      revenu: 100,
      note: 5.0
    }
  ];

  const renderEtoiles = (note) => {
    const etoilesPleines = '★'.repeat(Math.floor(note));
    const etoilesVides = '☆'.repeat(5 - Math.floor(note));
    return (
      <span style={{ color: '#f39c12', fontSize: '18px' }}>
        {etoilesPleines}{etoilesVides} ({note.toFixed(1)})
      </span>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mon Historique de Trajets</h1>
      <Link to="/profile-conducteur" style={styles.backButton}>← Retour au profil</Link>
      
      <div style={styles.filtres}>
        <select style={styles.selectFiltre}>
          <option>Tous les trajets</option>
          <option>Ce mois</option>
          <option>Ce trimestre</option>
          <option>Cette année</option>
        </select>
        
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Total trajets:</span>
            <span style={styles.statValue}>24</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Revenu total:</span>
            <span style={styles.statValue}>580 DT</span>
          </div>
        </div>
      </div>
      
      <div style={styles.trajetsList}>
        {trajetsEffectues.map(trajet => (
          <div key={trajet.id} style={styles.trajetCard}>
            <div style={styles.trajetHeader}>
              <h3 style={styles.trajetTitre}>{trajet.trajet}</h3>
              <span style={styles.trajetDate}>{trajet.date}</span>
            </div>
            
            <div style={styles.trajetDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Passagers:</span>
                <span>{trajet.passagers}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Revenu:</span>
                <span style={styles.revenu}>{trajet.revenu} DT</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Note moyenne:</span>
                {renderEtoiles(trajet.note)}
              </div>
            </div>
            
            <div style={styles.actions}>
              <button style={styles.btnDetails}>Voir détails</button>
              <button style={styles.btnFeedback}>Gérer avis</button>
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
    color: '#e67e22',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '28px'
  },
  backButton: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#e67e22',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  filtres: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  selectFiltre: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    minWidth: '200px'
  },
  stats: {
    display: 'flex',
    gap: '20px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  statLabel: {
    color: '#7f8c8d'
  },
  statValue: {
    fontWeight: 'bold',
    color: '#e67e22'
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
    color: '#e67e22'
  },
  trajetDate: {
    color: '#7f8c8d'
  },
  trajetDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  detailLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '5px'
  },
  revenu: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end'
  },
  btnDetails: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
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

export default HistoriqueConducteur;