import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MotDePasseOublie = () => {
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [methode, setMethode] = useState('email');
  const [etape, setEtape] = useState(1); // 1: Saisie, 2: Vérification, 3: Nouveau mot de passe
  const [codeVerif, setCodeVerif] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmationMdp, setConfirmationMdp] = useState('');

  const envoyerCodeVerification = () => {
    // Simulation d'envoi de code
    console.log(methode === 'email' 
      ? `Code envoyé à ${email}` 
      : `SMS envoyé au ${telephone}`);
    setEtape(2);
  };

  const verifierCode = () => {
    // Simulation de vérification
    if (codeVerif === '123456') { // Code test
      setEtape(3);
    } else {
      alert('Code incorrect. Essayez à nouveau.');
    }
  };

  const reinitialiserMdp = () => {
    if (nouveauMdp !== confirmationMdp) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    alert('Mot de passe réinitialisé avec succès!');
    // Ici, ajouter la logique pour enregistrer le nouveau mot de passe
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Réinitialisation du mot de passe</h1>
      
      {etape === 1 && (
        <div style={styles.formContainer}>
          <div style={styles.choixMethode}>
            <button 
              style={methode === 'email' ? styles.methodeActive : styles.methode}
              onClick={() => setMethode('email')}
            >
              Par email
            </button>
            <button 
              style={methode === 'sms' ? styles.methodeActive : styles.methode}
              onClick={() => setMethode('sms')}
            >
              Par SMS
            </button>
          </div>

          {methode === 'email' ? (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email enregistré</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.tn"
                style={styles.input}
              />
            </div>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Numéro de téléphone tunisien</label>
              <div style={styles.telephoneInput}>
                <span style={styles.indicator}>+216</span>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="20000000"
                  style={{ ...styles.input, borderLeft: 'none', borderRadius: '0 5px 5px 0' }}
                />
              </div>
            </div>
          )}

          <button 
            onClick={envoyerCodeVerification}
            style={styles.button}
            disabled={(methode === 'email' && !email) || (methode === 'sms' && !telephone)}
          >
            Envoyer le code de vérification
          </button>

          <Link to="/login" style={styles.lienRetour}>Retour à la connexion</Link>
        </div>
      )}

      {etape === 2 && (
        <div style={styles.formContainer}>
          <h3 style={styles.subtitle}>
            Entrez le code reçu par {methode === 'email' ? 'email' : 'SMS'}
          </h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Code à 6 chiffres</label>
            <input
              type="text"
              value={codeVerif}
              onChange={(e) => setCodeVerif(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              style={styles.input}
              maxLength="6"
            />
          </div>

          <button 
            onClick={verifierCode}
            style={styles.button}
            disabled={codeVerif.length !== 6}
          >
            Vérifier le code
          </button>

          <p style={styles.renvoyerCode}>
            Vous n'avez pas reçu de code ? 
            <button 
              onClick={envoyerCodeVerification}
              style={styles.lienAction}
            >
              Renvoyer le code
            </button>
          </p>
        </div>
      )}

      {etape === 3 && (
        <div style={styles.formContainer}>
          <h3 style={styles.subtitle}>Créez un nouveau mot de passe</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nouveau mot de passe</label>
            <input
              type="password"
              value={nouveauMdp}
              onChange={(e) => setNouveauMdp(e.target.value)}
              placeholder="Au moins 8 caractères"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmez le mot de passe</label>
            <input
              type="password"
              value={confirmationMdp}
              onChange={(e) => setConfirmationMdp(e.target.value)}
              style={styles.input}
            />
          </div>

          <button 
            onClick={reinitialiserMdp}
            style={styles.button}
            disabled={!nouveauMdp || nouveauMdp !== confirmationMdp}
          >
            Réinitialiser le mot de passe
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  choixMethode: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  methode: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#ecf0f1',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#7f8c8d'
  },
  methodeActive: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#2c3e50',
    fontWeight: '600'
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  telephoneInput: {
    display: 'flex'
  },
  indicator: {
    padding: '12px',
    backgroundColor: '#ecf0f1',
    border: '1px solid #ddd',
    borderRight: 'none',
    borderRadius: '5px 0 0 5px',
    color: '#7f8c8d'
  },
  button: {
    padding: '14px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px',
    ':disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed'
    }
  },
  subtitle: {
    color: '#2c3e50',
    textAlign: 'center',
    margin: '0 0 20px'
  },
  lienRetour: {
    textAlign: 'center',
    color: '#3498db',
    textDecoration: 'none',
    marginTop: '15px',
    display: 'block'
  },
  renvoyerCode: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: '15px'
  },
  lienAction: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '0 5px'
  }
};

export default MotDePasseOublie;