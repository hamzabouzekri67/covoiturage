import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EditProfilePassager = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [profile, setProfile] = useState({
    nom: user.nom,
    prenom:  user.prenom,
    email:  user.email,
    telephone:  user.telephone,
  });

  const [loading, setLoading] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSave = async() => {
    setLoading(true);
    const response = await fetch(`http://localhost:5000/api/v1/users/editProfile/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body:JSON.stringify({
            "nom": profile.nom,
            "prenom":  profile.prenom,
            "email":  profile.email,
            "telephone":  profile.telephone,
          }),
         
        });
  
         if (!response.ok) {
          const errorData = await response.json();
          setLoading(false);
          throw new Error(errorData.message || 'Erreur lors de la réservation');

  
        }

          const data = await response.json();     
          localStorage.setItem('user', JSON.stringify(data.data));
          setLoading(false);
          setSubmitSuccess("true")
          

    
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Modifier Mon Profil</h1>
      <Link to="/profile-passager" style={styles.backButton}>
        ← Retour au profil
      </Link>

       {submitSuccess && (
        <div style={styles.successMessage}>
              ✅ Enregistrement réussi. Votre profil a été mis à jour
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>Prénom</label>
        <input
          type="text"
          name="prenom"
          value={profile.prenom}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Nom</label>
        <input
          type="text"
          name="nom"
          value={profile.nom}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Téléphone</label>
        <input
          type="tel"
          name="telephone"
          value={profile.telephone}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.actions}>
        <button
          onClick={handleSave}
          style={{
            ...styles.btnSave,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );

};

const styles = {
  container: {
    maxWidth: '600px',
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
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  actions: {
    textAlign: 'right'
  },
  btnSave: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '0.75rem 1.25rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    width: '100%',
    textAlign: 'center',
  },
};

export default EditProfilePassager;
