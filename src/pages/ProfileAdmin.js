import {Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';//
import logo from '../assets/logo.png'; // Import de l'image

const ProfileAdmin = () => {
     const navigate = useNavigate();
     const user = JSON.parse(localStorage.getItem("user")); 
        useEffect(() => {
         if (!user || user.role === "passager" || user.role === "conducteur") {      
           navigate('/');
         }
       }, [user, navigate]);
   if (!user || user.role === "passager"|| user.role === "conducteur") return null;
  return (
    <div style={styles.container}>
      {/* Logo ajouté en haut */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo Mashi Maak" style={styles.logo} />
      </div>

      <h1 style={styles.title}>Profil Administrateur</h1>
      <div style={styles.buttonContainer}>
        <Link to="/" style={styles.button}>Accueil</Link>
        <Link to="/gestion-inscriptions" style={styles.button}>Gestion Inscriptions</Link>
        <Link to="/gestion-trajets" style={styles.button}>Gestion Trajets</Link>
        <Link to="/gestion-reservations" style={styles.button}>Gestion Réservations</Link>
        <Link to="/gestion-feedbacks" style={styles.button}>Gestion Avis</Link>
      </div>
      
      <div style={styles.adminInfo}>
        <h2 style={styles.sectionTitle}>Informations Administrateur</h2>
        <p><strong>Nom :</strong>{user.nom} {user.prenom}</p>
        <p><strong>Email :</strong>  {user.email}</p>
        <p><strong>Téléphone :</strong>+{user.telephone}</p>
        <p><strong>Agence :</strong>sfax</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, sans-serif",
    backgroundColor: '#f8f9fa'
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
    color: '#8e44ad',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px'
  },
  buttonContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#8e44ad',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#732d91'
    }
  },
  adminInfo: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    color: '#8e44ad',
    borderBottom: '2px solid #8e44ad',
    paddingBottom: '10px'
  }
};

export default ProfileAdmin;