import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // États pour gérer les champs du formulaire
  const [role, setRole] = useState('passager'); // 'conducteur' ou 'passager'
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [genre, setGenre] = useState('homme'); // 'homme' ou 'femme'
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cin, setCin] = useState('');
  const navigate = useNavigate();

  // Validation des champs
  const validateForm = () => {
    const newErrors = {};
    
    if (!prenom) newErrors.prenom = 'Prénom requis';
    if (!nom) newErrors.nom = 'Nom requis';
    
    if (!email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (email !== confirmEmail) {
      newErrors.confirmEmail = 'Les emails ne correspondent pas';
    }
    
    if (!telephone) {
      newErrors.telephone = 'Téléphone requis';
    } else if (!/^[0-9]{10,15}$/.test(telephone)) {
      newErrors.telephone = 'Numéro de téléphone invalide';
    }
    
    if (!motDePasse) {
      newErrors.motDePasse = 'Mot de passe requis';
    } else if (motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (motDePasse !== confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    if (!/^\d{8}$/.test(cin)) {
      setErrors(prev => ({ ...prev, cin: 'Le CIN doit contenir exactement 8 chiffres.' }));
      return;
     }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userData = {
        role: role === 'conducteur' ? 'conducteur' : 'passager', // Adaptation pour le backend
        prenom: prenom,
        nom: nom,
        email,
        telephone: telephone,
        password: motDePasse,
        gender: genre === 'homme' ? 'male' : 'female',
        cin : cin,
       // telephone : telephone
      };

      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de l'inscription");
      }

      setSuccessMessage('Inscription réussie ! Redirection...');
      
      // Stockage des données utilisateur et redirection
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setTimeout(() => {
        navigate(role === 'conducteur' ? '/profile-conducteur' : '/profile-passager');
      }, 2000);
      window.location.href = "/"

    } catch (error) {
      console.log(error);
      
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Inscrivez-vous</h1>
      
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      {errors.submit && <div style={styles.errorMessage}>{errors.submit}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Choix du rôle (conducteur ou passager) */}
        <div style={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="role"
              value="conducteur"
              checked={role === 'conducteur'}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            />
            Conducteur
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="passager"
              checked={role === 'passager'}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            />
            Passager
          </label>
        </div>

        {/* Champ Prénom */}
        <div style={styles.inputGroup}>
          <label>Prénom</label>
          <input
            type="text"
            placeholder="Entrez votre prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            style={errors.prenom ? styles.inputError : styles.input}
            disabled={isLoading}
          />
          {errors.prenom && <span style={styles.errorText}>{errors.prenom}</span>}
        </div>

        {/* Champ Nom */}
        <div style={styles.inputGroup}>
          <label>Nom</label>
          <input
            type="text"
            placeholder="Entrez votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={errors.nom ? styles.inputError : styles.input}
            disabled={isLoading}
          />
          {errors.nom && <span style={styles.errorText}>{errors.nom}</span>}
        </div>

        {/* Champ Email */}
        <div style={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={errors.email ? styles.inputError : styles.input}
            disabled={isLoading}
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        {/* Confirmation Email */}
        <div style={styles.inputGroup}>
          <label>Confirmez votre email</label>
          <input
            type="email"
            placeholder="Confirmez votre email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            style={errors.confirmEmail ? styles.inputError : styles.input}
            disabled={isLoading}
          />
          {errors.confirmEmail && <span style={styles.errorText}>{errors.confirmEmail}</span>}
        </div>

        {/* Champ Téléphone mobile */}
        <div style={styles.inputGroup}>
          <label>Téléphone mobile</label>
          <input
            type="tel"
            placeholder="Entrez votre numéro de téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={errors.telephone ? styles.inputError : styles.input}
            disabled={isLoading}
          />
          {errors.telephone && <span style={styles.errorText}>{errors.telephone}</span>}
        </div>

        <div style={styles.inputGroup}>
        <label>Numéro CIN</label>
        <input
          type="text"
          placeholder="Entrez votre numéro CIN"
          value={cin}
          onChange={(e) => setCin(e.target.value)}
          style={errors.cin ? styles.inputError : styles.input}
          disabled={isLoading}
        />
        {errors.cin && <span style={styles.errorText}>{errors.cin}</span>}
        </div>

        {/* Champ Mot de passe */}
        <div style={styles.inputGroup}>
          <label>Mot de passe (min. 6 caractères)</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={errors.motDePasse ? styles.inputError : styles.input}
            disabled={isLoading}
          />
          {errors.motDePasse && <span style={styles.errorText}>{errors.motDePasse}</span>}
        </div>

        {/* Confirmation Mot de passe */}
        <div style={styles.inputGroup}>
          <label>Confirmez votre mot de passe</label>
          <input
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={confirmMotDePasse}
            onChange={(e) => setConfirmMotDePasse(e.target.value)}
            style={errors.confirmMotDePasse ? styles.inputError : styles.input}
            disabled={isLoading}
          />
          {errors.confirmMotDePasse && <span style={styles.errorText}>{errors.confirmMotDePasse}</span>}
        </div>

        {/* Choix du genre (homme ou femme) */}
        <div style={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="genre"
              value="homme"
              checked={genre === 'homme'}
              onChange={(e) => setGenre(e.target.value)}
              disabled={isLoading}
            />
            Homme
          </label>
          <label>
            <input
              type="radio"
              name="genre"
              value="femme"
              checked={genre === 'femme'}
              onChange={(e) => setGenre(e.target.value)}
              disabled={isLoading}
            />
            Femme
          </label>
        </div>

        {/* Bouton S'inscrire */}
        <button 
          type="submit" 
          style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

// Styles pour la page
const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '1.5rem',
  },
  successMessage: {
    color: '#28a745',
    backgroundColor: '#d4edda',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  radioGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  inputError: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #dc3545',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
};

export default Register;