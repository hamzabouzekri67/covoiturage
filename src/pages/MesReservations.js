import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  useEffect(()=>{
    const Reserve =async()=>{
         const response = await fetch('http://localhost:5000/api/v1/reservations/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
       
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réservation');
      }
       const data = await response.json(); 
        console.log(data["data"]);
        setReservations(data["data"]);
       
      
    }
   Reserve();

  },[])

  const handleAnnuler = async (reservationId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Erreur lors de l\'annulation');
     setReservations(prev => prev.filter(r => r._id !== reservationId));
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mes Réservations</h1>
      <Link to="/profile-passager" style={styles.backButton}>
        ← Retour au profil
      </Link>

      <div style={styles.filtres}>
        <select style={styles.selectFiltre}>
          <option>Toutes les réservations</option>
          <option>Confirmées</option>
          <option>En attente</option>
          <option>Annulées</option>
        </select>
      </div>

      <div style={styles.reservationsList}>
        {reservations.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3 style={styles.emptyTitle}>Aucune réservation trouvée</h3>
            <p style={styles.emptyText}>
              Vous n'avez pas encore effectué de réservation.
            </p>
          </div>
        ) : (
          reservations.map(reservation => (
            <div key={reservation.id} style={styles.reservationCard}>
              <div style={styles.header}>
                <h3 style={styles.trajet}>
                  {reservation.trajet.depart} → {reservation.trajet.arrivee}
                </h3>
                <span style={styles.prix}>{reservation.totalPrice} DT</span>
              </div>

              <div style={styles.details}>
                <p>
                  <span style={styles.label}>Conducteur: </span>
                  {reservation.trajet.conducteur.prenom}{' '}
                  {reservation.trajet.conducteur.nom}
                </p>
                <p>
                  <span style={styles.label}>Date: </span>
                  {new Date(reservation.trajet.date).toLocaleDateString(
                    'fr-FR',
                    {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    }
                  )}{' '}
                  à {reservation.trajet.heure}
                </p>
                <p>
                  <span style={styles.label}>Point de RDV: </span>
                  {reservation.pointRDV}
                </p>
              </div>

              <div style={styles.footer}>
                <span
                  style={
                    reservation.statut === 'Confirmée'
                      ? styles.statutConfirmé
                      : styles.statutAttente
                  }
                >
                  {reservation.statut}
                </span>
                <div style={styles.actions}>
                  <button
                    style={styles.btnAnnuler}
                    onClick={() => handleAnnuler(reservation._id)}
                  >
                    Annuler
                  </button>
                  <a
                    href={`tel:${reservation.trajet.conducteur.telephone}`}
                    style={{
                      ...styles.btnContacter,
                      textDecoration: 'none',
                      color: 'white'
                    }}
                    title={`Contacter ${reservation.trajet.conducteur.nom}`}
                  >
                    +{reservation.trajet.conducteur.telephone}
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
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
  reservationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  reservationCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  trajet: {
    margin: '0',
    color: '#2c3e50'
  },
  prix: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: '20px'
  },
  details: {
    marginBottom: '15px'
  },
  label: {
    color: '#7f8c8d',
    fontWeight: 'bold'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },
  statutConfirmé: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  statutAttente: {
    color: '#f39c12',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  btnAnnuler: {
    padding: '8px 15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnContacter: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  emptyBox: {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  marginTop: '40px',
  color: '#666',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
},
emptyTitle: {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '10px'
},
emptyText: {
  fontSize: '16px'
}
};

export default MesReservations;