import React, { useState } from 'react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    nom: false,
    email: false,
    message: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      nom: !formData.nom.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      message: !formData.message.trim()
    };
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      setError("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nom,
          email: formData.email,
          content: formData.message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi du feedback");
      }

      setSubmitSuccess(true);
      setFormData({ nom: '', email: '', message: '' });
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      setError(err.message || "Une erreur est survenue lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Donnez votre avis</h1>
      
      {submitSuccess && (
        <div style={styles.successMessage}>
          Merci pour votre feedback ! Nous apprécions votre temps.
        </div>
      )}
      
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        {/* Champ Nom */}
        <div style={styles.formGroup}>
          <label htmlFor="nom" style={styles.label}>
            Nom complet *
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            placeholder="Votre nom complet"
            value={formData.nom}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(formErrors.nom && styles.inputError)
            }}
            required
          />
          {formErrors.nom && (
            <span style={styles.errorText}>Ce champ est obligatoire</span>
          )}
        </div>

        {/* Champ Email */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Adresse email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(formErrors.email && styles.inputError)
            }}
            required
          />
          {formErrors.email && (
            <span style={styles.errorText}>Veuillez entrer une adresse email valide</span>
          )}
        </div>

        {/* Champ Message */}
        <div style={styles.formGroup}>
          <label htmlFor="message" style={styles.label}>
            Votre message *
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Dites-nous ce que vous pensez..."
            value={formData.message}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...styles.textarea,
              ...(formErrors.message && styles.inputError)
            }}
            required
            rows="5"
          />
          {formErrors.message && (
            <span style={styles.errorText}>Ce champ est obligatoire</span>
          )}
        </div>

        {/* Bouton Envoyer */}
        <button 
          type="submit" 
          style={
            isSubmitting 
              ? {...styles.button, ...styles.buttonSubmitting} 
              : styles.button
          }
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

// Styles pour la page
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '2rem auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#333',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  formGroup: {
    marginBottom: '1.2rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#444',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border 0.3s ease',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#c0392b',
      outline: 'none',
    }
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdedec',
  },
  textarea: {
    minHeight: '150px',
    resize: 'vertical',
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    alignSelf: 'flex-end',
    marginTop: '0.5rem',
    ':hover': {
      backgroundColor: '#a5281b',
    }
  },
  buttonSubmitting: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#6c757d',
    }
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
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem 1.25rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    width: '100%',
    textAlign: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '0.8rem',
    marginTop: '0.3rem',
    display: 'block',
  }
};

export default Feedback;