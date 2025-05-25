import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ReserverTrajet() {

  const { state } = useLocation();
  const navigate = useNavigate();
  const trajet = state?.trajetData;
  
  const passagersInitiaux = state?.passagers || 1;
  const preferences = state?.preferences || {};

  const [formData, setFormData] = useState({
    places: passagersInitiaux,
    paiement: 'espèces',
    message: '',
    accepteConditions: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!trajet) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>Erreur de réservation</h2>
        <p style={styles.errorText}>Aucune donnée de trajet disponible.</p>
        <button 
          onClick={() => navigate('/recherche-trajet')} 
          style={styles.backButton}
        >
          Retour à la recherche
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.accepteConditions) {
      setError("Veuillez accepter les conditions générales");
      return;
    }

    if (formData.places > trajet.placesDisponibles) {
      setError(`Nombre de places insuffisant. Il ne reste que ${trajet.placesDisponibles} place(s) disponible(s).`);
      return;
    }

    setIsLoading(true);
    
     
    try {
      const reservationData = {
        tripId: trajet._id,
        places: formData.places,
        paymentMethod: formData.paiement,
        message: formData.message,
        preferences,
        totalPrice: calculateTotal(),
      };

      const response = await fetch('http://localhost:5000/api/v1/reservations/createdResrve/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reservationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réservation');
      }

     // const data = await response.json();
      console.log("Réservation réussie:", reservationData);
      setReservationSuccess(true);
      
      // Mettre à jour le stock de places disponibles (optionnel)
      // Vous pourriez vouloir rafraîchir les données du trajet ici
      
    } catch (err) {
      console.error("Erreur de réservation:", err);
      setError(err.message || 'Une erreur est survenue lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return trajet.prix * formData.places;
  };

  if (reservationSuccess) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.successTitle}>Réservation confirmée !</h2>
        <p style={styles.successText}>
          Votre réservation pour le trajet {trajet.depart} → {trajet.arrivee} 
          le {trajet.date} a bien été enregistrée.
        </p>
        <div style={styles.reservationSummary}>
          <p><strong>Conducteur:</strong> {trajet.conducteur.nom} {trajet.conducteur.prenom}</p>
          <p><strong>Places réservées:</strong> {formData.places}</p>
          <p><strong>Total:</strong> {calculateTotal()} DNT</p>
          <p><strong>Mode de paiement:</strong> {formData.paiement}</p>
          {formData.message && (
            <p><strong>Message:</strong> {formData.message}</p>
          )}
        </div>
        <button 
          onClick={() => navigate('/mes-reservations')} 
          style={styles.homeButton}
        >
          Voir mes réservations
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Réservation du trajet</h2>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <div style={styles.trajetCard}>
        <h3 style={styles.trajetRoute}>
          {trajet.depart} → {trajet.arrivee}
          <span style={styles.trajetPrice}>{trajet.prix} DNT/place</span>
        </h3>
        
        <div style={styles.trajetDetails}>
          <p><strong>Date:</strong> {new Date(trajet.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })} à {trajet.heure}</p>
          <p><strong>Conducteur:</strong> {trajet.conducteur.nom} {trajet.conducteur.prenom}</p>
          <p><strong>Véhicule:</strong> {trajet.vehicule || 'Non spécifié'}</p>
          <p><strong>Places disponibles:</strong> {trajet.places}</p>
          
          {preferences && (
            <div style={styles.preferences}>
              <p><strong>Préférences:</strong></p>
              <ul style={styles.preferencesList}>
                {preferences.climatisation && <li>Climatisation</li>}
                {preferences.animaux && <li>Animaux acceptés</li>}
                {preferences.fumeur && <li>Fumeur</li>}
                {preferences.musique && <li>Musique autorisée</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Nombre de places *
            <input
              type="number"
              name="places"
              min="1"
              max={trajet.places}
              value={formData.places}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Mode de paiement *
            <select
              name="paiement"
              value={formData.paiement}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="espèces">Espèces</option>
              <option value="carte">Carte bancaire</option>
              <option value="virement">Virement</option>
            </select>
          </label>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Message au conducteur (optionnel)
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Précisez votre point de rencontre ou autres informations..."
            />
          </label>
        </div>
        
        <div style={styles.totalContainer}>
          <p style={styles.totalText}>Total: <strong>{calculateTotal()} DNT</strong></p>
        </div>
        
        <div style={styles.conditionsGroup}>
          <label style={styles.conditionsLabel}>
            <input
              type="checkbox"
              name="accepteConditions"
              checked={formData.accepteConditions}
              onChange={handleChange}
              style={styles.checkbox}
              required
            />
            J'accepte les conditions générales de réservation
          </label>
        </div>
        
        <button 
          type="submit" 
          style={isLoading ? {...styles.submitButton, ...styles.buttonDisabled} : styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Traitement en cours...' : 'Confirmer la réservation'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    fontSize: '28px',
    marginBottom: '25px',
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '600'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  trajetCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '25px',
    border: '1px solid #e0e0e0'
  },
  trajetRoute: {
    fontSize: '20px',
    color: '#2c3e50',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  trajetPrice: {
    fontSize: '18px',
    color: '#27ae60',
    fontWeight: 'bold'
  },
  trajetDetails: {
    fontSize: '15px',
    color: '#34495e',
    lineHeight: '1.6'
  },
  preferences: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px dashed #ddd'
  },
  preferencesList: {
    margin: '5px 0 0 20px',
    padding: 0,
    listStyleType: 'none'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '15px',
    color: '#34495e',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '15px',
    backgroundColor: '#fff',
    transition: 'border 0.3s'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '15px',
    backgroundColor: '#fff'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '15px',
    minHeight: '100px',
    resize: 'vertical'
  },
  totalContainer: {
    textAlign: 'right',
    margin: '20px 0',
    fontSize: '18px'
  },
  totalText: {
    color: '#2c3e50'
  },
  conditionsGroup: {
    margin: '20px 0'
  },
  conditionsLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#34495e'
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    accentColor: '#3498db'
  },
  submitButton: {
    padding: '14px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#219653'
    }
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#6c757d'
    }
  },
  errorContainer: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  errorTitle: {
    color: '#e74c3c',
    fontSize: '24px',
    marginBottom: '15px'
  },
  errorText: {
    color: '#7f8c8d',
    fontSize: '16px',
    marginBottom: '25px'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  successContainer: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
  },
  successIcon: {
    fontSize: '60px',
    color: '#27ae60',
    marginBottom: '20px'
  },
  successTitle: {
    fontSize: '26px',
    color: '#2c3e50',
    marginBottom: '15px'
  },
  successText: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '25px',
    lineHeight: '1.6'
  },
  reservationSummary: {
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    margin: '25px 0',
    fontSize: '15px'
  },
  homeButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  }
};

export default ReserverTrajet;