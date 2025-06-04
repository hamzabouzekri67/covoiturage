import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EditProfileConducteur = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const [formData, setFormData] = useState({
      nom: user.nom,
      prenom:  user.prenom,
      email:  user.email,
      telephone:  user.telephone,
    });
  
    const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevProfile) => ({
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
              "nom": formData.nom,
              "prenom":  formData.prenom,
              "email":  formData.email,
              "telephone":  formData.telephone,
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
      <Link to="/profile-conducteur" style={styles.backButton}>← Retour au profil</Link>

      <div style={styles.formGroup}>
        <label style={styles.label}>Prénom</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Téléphone</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {submitSuccess && (
        <div style={styles.successMessage}>
          ✅ Enregistrement réussi. Votre profil a été mis à jour.
        </div>
      )}

      <div style={styles.actions}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            ...styles.btnSave,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
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
    backgroundColor: '#fefefe'
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
    backgroundColor: '#e67e22',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'opacity 0.3s'
  },
  successMessage: {
    marginBottom: '15px',
    padding: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '16px'
  }
};

export default EditProfileConducteur;
