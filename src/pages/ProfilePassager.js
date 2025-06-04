import logo from '../assets/logo4.png'; // Import de l'image
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';


const ProfilePassager = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))??null;
  useEffect(() => {
  if (!user || user.role === "conducteur"|| user.role === "admin") {
    navigate('/');
  }
}, [user, navigate]);
  
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/profile/delete/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        localStorage.removeItem("user");
        alert("Compte supprimé avec succès.");
        navigate('/');
        window.location.href = "/"
      } else {
        alert("Une erreur est survenue lors de la suppression du compte.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  if (!user || user.role === "conducteur"|| user.role === "admin") return null;

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo Mashi Maak" style={styles.logo} />
      </div>

      <h1 style={styles.title}>Profil Passager</h1>
      <div style={styles.buttonContainer}>
        <Link to="/" style={styles.button}>Accueil</Link>
        <Link to="/mes-reservations" style={styles.button}>Réservations</Link>
        <Link to="/historique-passager" style={styles.button}>Modifier Mon Profil</Link>
        <Link to="/rechercher-trajet" style={styles.link}>
          <button style={styles.button}>🔍 Rechercher un trajet</button>
        </Link>
      </div>
      
      <div style={styles.profileSection}>
        <h2 style={styles.sectionTitle}>Informations Personnelles</h2>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Nom Complet:</span>
          <span> {user.nom} {user.prenom}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>CIN:</span>
          <span>{user.cin}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Téléphone:</span>
          <span>+{user.telephone}</span>
        </div>

        <button onClick={handleDeleteAccount} style={styles.deleteButton}>
          🗑️ Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, sans-serif",
    backgroundColor: '#FFFFFFFF',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  logo: {
    maxWidth: '250px', // Taille modifiable selon vos besoins
    height: 'auto',
    display: 'block',
    margin: '0 auto'
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px'
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#c0392b'
    }
  },
  profileSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    color: '#E74C3CFF',
    borderBottom: '2px solid #e74c3c',
    paddingBottom: '10px',
    marginTop: '0'
  },
  infoItem: {
    marginBottom: '15px',
    display: 'flex',
    gap: '10px'
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#2c3e50',
    minWidth: '150px'
  },
   deleteButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#E74C3CFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default ProfilePassager;