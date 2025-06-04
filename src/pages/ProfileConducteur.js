import logo from '../assets/logo3.png'; 
import {Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';// Import de l'image

const ProfileConducteur = () => {
   const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"))??null;
    useEffect(() => {
    if (!user || user.role === "passager" || user.role === "admin") {      
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

  if (!user || user.role === "passager"|| user.role === "admin") return null;
  return (
    <div style={styles.container}>
      {/* Conteneur du logo avec taille augmentée */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo Mashi Maak" style={styles.logo} />
      </div>
      
      <h1 style={styles.title}>Profil Conducteur</h1>
      <div style={styles.buttonContainer}>
        <Link to="/" style={styles.button}>Accueil</Link>
        <Link to="/mes-trajets" style={styles.button}>Mes Trajets</Link>
        <Link to="/historique-conducteur" style={styles.button}>Modifier Mon Profil</Link>
        <Link to="/proposer-trajet" style={styles.link}>
                  <button style={styles.button}>🚗 Proposer un trajet</button>
                </Link>
      </div>
      
      <div style={styles.profileSection}>
        <h2 style={styles.sectionTitle}>Informations Véhicule</h2>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Modèle:</span>
          <span>Peugeot 208</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Immatriculation:</span>
          <span>205TU1547</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Couleur:</span>
          <span>Blanche</span>
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
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  logo: {
    width: '300px', // Taille augmentée (au lieu de maxWidth)
    height: 'auto',
    objectFit: 'contain' // Garde les proportions originales
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
    backgroundColor: '#c0392b',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  profileSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    color: '#3498db',
    borderBottom: '2px solid #3498db',
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

export default ProfileConducteur;