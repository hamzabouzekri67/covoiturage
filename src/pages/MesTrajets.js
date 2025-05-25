import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const MesTrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`http://localhost:5000/api/v1/trajets/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des trajets");
        }

        const data = await response.json();        
        setTrajets(data["data"]);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrajets();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mes Trajets Proposés</h1>
      <Link to="/profile-conducteur" style={styles.backButton}>← Retour au profil</Link>

      {loading ? (
        <p>Chargement des trajets...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Erreur : {error}</p>
      ) : trajets.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", marginTop: "2rem" }}>
          Aucun trajet proposé actuellement.
        </p>
      ) : (
        <div style={styles.trajetsList}>
          {trajets.map(trajet => (
            <div key={trajet._id} style={styles.trajetCard}>
              <div style={styles.trajetHeader}>
                <h3>{trajet.depart} → {trajet.arrivee}</h3>
                <span style={styles.prix}>{trajet.prix} DT</span>
              </div>
              <div style={styles.trajetDetails}>
                <p><strong>Date :</strong> {trajet.date} à {trajet.heure}</p>
                <p><strong>Places disponibles :</strong> {trajet.places}</p>
              </div>
              <div style={styles.actions}>
                <button style={styles.editBtn}>Modifier</button>
                <button style={styles.deleteBtn}>Annuler</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/proposer-trajet" style={styles.addButton}>+ Proposer un nouveau trajet</Link>
    </div>
  );
};
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, sans-serif"
  },
  title: {
    color: '#e67e22',
    textAlign: 'center',
    marginBottom: '20px'
  },
  backButton: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#e67e22',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  trajetsList: {
    marginBottom: '30px'
  },
  trajetCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  trajetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  prix: {
    color: '#e67e22',
    fontWeight: 'bold',
    fontSize: '20px'
  },
  trajetDetails: {
    marginBottom: '15px'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  editBtn: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '8px 15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  addButton: {
    display: 'block',
    padding: '12px',
    backgroundColor: '#2ecc71',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: 'bold'
  }
};

export default MesTrajets;
