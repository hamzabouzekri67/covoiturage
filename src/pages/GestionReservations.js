import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GestionReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationsToday, setReservationsToday] = useState(0);
  const [tauxConfirmation, setTauxConfirmation] = useState(0);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState("Tous les statuts");
    const [rechercheTexte, setRechercheTexte] = useState("");
  





  useEffect(()=>{

     const fetchReservations=async()=>{

      const response = await fetch('http://localhost:5000/api/v1/reservations/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
       
      });

       if (!response.ok) {
        // errorData = await response.json();
       // throw new Error(errorData.message || 'Erreur lors de la réservation');

       return
      }
       const data = await response.json();         
       setReservations(data["data"]); 
       const today = new Date().toISOString().split('T')[0];
        const todayReservations = data["data"].filter(res =>
        new Date(res.trajet.date).toISOString().split('T')[0] === today
      );
       setReservationsToday(todayReservations.length);
       const total = data["data"].length;
       const confirmées = data["data"].filter(res => res.statut === "confirmé").length;
       setTauxConfirmation(total > 0 ? Math.round((confirmées / total) * 100) : 0);
      
        // const trajetsAcceptés = data["data"].filter((e) => e.status === "accepted");
        // seTrajetsactif(trajetsAcceptés);
        // const trajetsEnAttente = data["data"].filter((e) => e.status === "pending");
        // seTrajetsapending(trajetsEnAttente)
        // const trajetsRejetés = data["data"].filter((e) => e.status === "rejected");
        // seTrajetsrejected(trajetsRejetés); // تأكد أن لديك useState لـ seTrajetsrejected
        //  const trajetsTerminés = data["data"].filter((e) => e.status === "completed");
        //  seTrajetscompleted(trajetsTerminés); // تأكد أن لديك useState لـ seTrajetscompleted

    }

    fetchReservations()
    

  },[])

   const reservationsFiltres = reservations.filter(reservations => {
    
        const matchStatut = 
       filtreStatut === "Tous les statuts" ||
      (filtreStatut === "Actifs" && reservations.statut === "confirmé") ||
      (filtreStatut === "En attente" && reservations.statut === "en_attente") ||
      (filtreStatut === "Terminés" && reservations.statut === "terminé")||
      (filtreStatut === "Annulé" && reservations.statut === "annulé");

      const matchRecherche = rechercheTexte.trim() === "" || 
      reservations.trajet.depart.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      reservations.trajet.arrivee.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      reservations.trajet.conducteur?.nom?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      reservations.trajet.conducteur?.prenom?.toLowerCase().includes(rechercheTexte.toLowerCase())||
      reservations.paymentMethod?.toLowerCase().includes(rechercheTexte.toLowerCase())||
      reservations.trajet?.prix?.toString().toLowerCase().includes(rechercheTexte.toLowerCase())



    return matchStatut && matchRecherche;
  });

 return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion des Réservations</h1>
      <Link to="/profile-admin" style={styles.backButton}>← Retour au tableau de bord</Link>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Réservations aujourd'hui</h3>
          <p style={styles.statValue}>{reservationsToday}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Taux de confirmation</h3>
          <p style={styles.statValue}>{tauxConfirmation}%</p>
        </div>
      </div>

      <div style={styles.filtres}>
        <input type="text" placeholder="Rechercher par passager ou trajet..."
        style={styles.inputRecherche}
        value={rechercheTexte}
        onChange={(e) => setRechercheTexte(e.target.value)} />
        <select 
        style={styles.selectFiltre}
        value={filtreStatut}
        onChange={(e) => setFiltreStatut(e.target.value)}
        >
          <option>Tous les statuts</option>
          <option>Confirmées</option>
          <option>En attente</option>
          <option>Annulées</option>
        </select>
      </div>

      {reservationsFiltres.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", marginTop: "2rem" }}>
          Aucune réservation trouvée pour les critères sélectionnés.
        </p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Passager</th>
                <th style={styles.th}>Trajet</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Prix</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservationsFiltres.map((reservation) => (
                <tr key={reservation._id} style={styles.tr}>
                  <td style={styles.td}>{reservation.paymentMethod}</td>
                  <td style={styles.td}>{reservation.passager.nom}</td>
                  <td style={styles.td}>{reservation.trajet.depart} → {reservation.trajet.arrivee}</td>
                  <td style={styles.td}>
                    {new Date(reservation.trajet.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td style={styles.td}>{reservation.trajet.prix} DT</td>
                  <td style={styles.td}>
                    <span style={reservation.statut === 'Confirmée' ? styles.statutConfirme : styles.statutAnnule}>
                      {reservation.statut}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.btnDetails} onClick={() => setSelectedReservation(reservation)}>
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal des détails */}
      {selectedReservation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Détails de la réservation</h2>
            <p><strong>Nom du passager:</strong> {selectedReservation.passager.nom}</p>
            <p><strong>Trajet:</strong> {selectedReservation.trajet.depart} → {selectedReservation.trajet.arrivee}</p>
            <p><strong>Date:</strong> {new Date(selectedReservation.trajet.date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure:</strong> {selectedReservation.trajet.heure}</p>
            <p><strong>Prix:</strong> {selectedReservation.trajet.prix} DT</p>
            <p><strong>Méthode de paiement:</strong> {selectedReservation.paymentMethod}</p>
            <p><strong>Statut:</strong> {selectedReservation.statut}</p>
            <button style={styles.closeButton} onClick={() => setSelectedReservation(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
    maxWidth: '1200px',
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
  statsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px'
  },
  statCard: {
    flex: '1',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statTitle: {
    color: '#7f8c8d',
    margin: '0 0 10px',
    fontSize: '16px'
  },
  statValue: {
    color: '#8e44ad',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0'
  },
  filtres: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px'
  },
  inputRecherche: {
    flex: '3',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  selectFiltre: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#8e44ad',
    color: 'white',
    padding: '15px',
    textAlign: 'left'
  },
  tr: {
    borderBottom: '1px solid #eee',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  td: {
    padding: '15px',
    color: '#333'
  },
  statutConfirme: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  statutAnnule: {
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  btnDetails: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  modalOverlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
},
modalContent: {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  maxHeight: '80vh',
  overflowY: 'auto',
},
closeButton: {
  marginTop: '20px',
  backgroundColor: '#ccc',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
}
};

export default GestionReservations;