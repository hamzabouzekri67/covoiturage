/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const GestionTrajets = () => {
    const navigate = useNavigate();
      const user = JSON.parse(localStorage.getItem("user"))??null;
      useEffect(() => {
      if (!user || user.role !== "admin") {
        navigate('/');
      }
    }, [user, navigate]);
  const [trajets, seTrajets] = useState([]);
  const [trajetsactif, seTrajetsactif] = useState([]);
  const [trajetspending, seTrajetsapending] = useState([]);
  const [trajetsrejected, seTrajetsrejected] = useState([]);
  const [trajetscompleted, seTrajetscompleted] = useState([]);
  const [filtre, setFiltre] = useState("Tous les statuts");
  const [rechercheTexte, setRechercheTexte] = useState("");


  useEffect(()=>{
    const fetchAllTrajet=async()=>{

      const response = await fetch('http://localhost:5000/api/v1/trajets/all', {
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
        
        seTrajets(data["data"]); 
        const trajetsAcceptés = data["data"].filter((e) => e.status === "accepted");
        seTrajetsactif(trajetsAcceptés);
        const trajetsEnAttente = data["data"].filter((e) => e.status === "pending");
        seTrajetsapending(trajetsEnAttente)
        const trajetsRejetés = data["data"].filter((e) => e.status === "rejected");
        seTrajetsrejected(trajetsRejetés); // تأكد أن لديك useState لـ seTrajetsrejected
         const trajetsTerminés = data["data"].filter((e) => e.status === "completed");
         seTrajetscompleted(trajetsTerminés); // تأكد أن لديك useState لـ seTrajetscompleted

    }

    fetchAllTrajet()
  },[])

 const trajetsFiltres = trajets.filter(trajet => {
    const matchStatut = 
      filtre === "Tous les statuts" ||
      (filtre === "Actifs" && trajet.status === "accepted") ||
      (filtre === "En attente" && trajet.status === "pending") ||
      (filtre === "Terminés" && trajet.status === "completed")||
      (filtre === "Annulé" && trajet.status === "rejected");

    const matchRecherche = rechercheTexte.trim() === "" || 
      trajet.depart.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      trajet.arrivee.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      trajet.conducteur?.nom?.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      trajet.conducteur?.prenom?.toLowerCase().includes(rechercheTexte.toLowerCase());

    return matchStatut && matchRecherche;
  });

  const handleAccepter = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/v1/trajets/accepted/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
 // console.log(res);
  
    if (!res.ok) {
      return
    }
    const data = await res.json();     
    seTrajets((prev) =>
      prev.map((t) => (t._id === id ? data.data : t))
    );
  } catch (err) {
    console.error('Erreur lors de l’acceptation:', err);
  }
};

const handleAnnuler = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/v1/trajets/deleted/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });  
    if (!res.ok) {
      return
    }
    const data = await res.json();     
    seTrajets((prev) =>
      prev.map((t) => (t._id === id ? data.data : t))
    );
  } catch (err) {
    console.error('Erreur lors de l’annulation:', err);
  }
};

const handleCompleted = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/v1/trajets/completed/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });  
    if (!res.ok) {
      return
    }
    const data = await res.json();     
    seTrajets((prev) =>
      prev.map((t) => (t._id === id ? data.data : t))
    );
  } catch (err) {
    console.error('Erreur lors de l’annulation:', err);
  }
};

if (!user || user.role !== "admin")return

  return (
  <div style={styles.container}>
    <h1 style={styles.title}>Gestion des Trajets</h1>
    <Link to="/profile-admin" style={styles.backButton}>← Retour au tableau de bord</Link>

    <div style={styles.filtres}>
      <input 
        type="text" 
        placeholder="Rechercher par ville ou conducteur..."
        style={styles.inputRecherche}
        value={rechercheTexte}
        onChange={(e) => setRechercheTexte(e.target.value)}
      />
       <select 
       style={styles.selectFiltre}
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}>
        <option>Tous les statuts</option>
        <option>Actifs</option>
        <option>En attente</option>
        <option>Terminés</option>
        <option>Annulé</option>
      </select>
    </div>

    {trajetsFiltres.length === 0 ? (
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        🚫 Aucun trajet trouvé pour le moment.
      </div>
    ) : (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Itinéraire</th>
              <th style={styles.th}>Conducteur</th>
              <th style={styles.th}>Date/Heure</th>
              <th style={styles.th}>Places</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trajetsFiltres.map((trajet, index) => (
              <tr key={trajet.id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{trajet.depart} → {trajet.arrivee}</td>
                <td style={styles.td}>{trajet.conducteur.nom} {trajet.conducteur.prenom}</td>
                <td style={styles.td}>
                  {new Date(trajet.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })} à {trajet.heure}
                </td>
                <td style={styles.td}>{trajet.places}</td>
                <td style={styles.td}>
                  <span style={trajet.status === 'pending' ? styles.statutAttente : trajet.status === 'rejected' ? styles.statutdActif: styles.statutActif}>
                    {trajet.status === 'pending' ?'En attent':trajet.status === 'accepted' ? "Actif": trajet.status === 'completed'? "Terminés": "Annulé"}
                  </span>
                </td>
                <td style={{ 
                  ...styles.td, 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center' 
                }}>
                  <button 
                  style={styles.btnDetails} 
                  onClick={() => navigate(`/trajet/${trajet._id}`)}
                  >
                  Détails
                  </button>
                 {trajet.status === "pending" &&   (
                  <button 
                    style={styles.btnVoir} 
                    onClick={() => handleAccepter(trajet._id)}
                  >
                    Accepter
                  </button>
                  )
                  }{trajet.status === "accepted" &&(
                  <button 
                    style={styles.btntrm} 
                    onClick={() => handleCompleted(trajet._id)}
                  >
                    Terminés
                  </button>
                  )} 

                  {(trajet.status === "accepted" || trajet.status === "pending") &&    (
                  <button 
                    style={styles.btnModifier} 
                    onClick={() => handleAnnuler(trajet._id)}
                  >
                    Annuler
                  </button>
                  )}
                
                  <button 
                    style={styles.iconButton} 
                    title="Appeler le conducteur"
                    onClick={() => alert(`Numéro du conducteur : ${trajet.conducteurTelephone}`)}
                  >
                    <FaPhone />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    <div style={styles.stats}>
    <div style={styles.statCard}>
      <h3>Trajets Actifs</h3>
      <p style={styles.statValue}>{trajetsactif.length}</p>
    </div>
    <div style={styles.statCard}>
      <h3>Trajets en attente</h3>
      <p style={styles.statValue}>{trajetspending.length}</p>
    </div>
    <div style={styles.statCard}>
      <h3>Trajets Rejetés</h3>
      <p style={styles.statValue}>{trajetsrejected.length}</p>
    </div>
    <div style={styles.statCard}>
      <h3>Trajets Terminés</h3>
      <p style={styles.statValue}>{trajetscompleted.length}</p>
    </div>
    </div>
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
    marginBottom: '30px',
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
  statutActif: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  statutdActif: {
    color: '#FF0000FF',
    fontWeight: 'bold'
  },
  statutAttente: {
    color: '#f39c12',
    fontWeight: 'bold'
  },
  btnVoir: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  },
   btntrm: {
    padding: '8px 15px',
    backgroundColor: '#2AB91DFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  },
  btnModifier: {
    padding: '8px 15px',
    backgroundColor: '#FF0000FF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  stats: {
    display: 'flex',
    gap: '20px'
  },
  statCard: {
    flex: '1',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8e44ad',
    margin: '10px 0 0'
  }
};

export default GestionTrajets;