import React, { useState , useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';



function RechercheTrajet() {
  const user = JSON.parse(localStorage.getItem("user")); 
  const navigate = useNavigate()
  useEffect(()=>{
    if (!user || user.role === "conducteur") {
      navigate("/")
    }

  })
  const [formData, setFormData] = useState({
    depart: "",
    destination: "",
    dateAller: "",
    dateRetour: "",
    heureDepart: "",
    passagers: 1,
    bagages: "Petit bagage",
    preferences: {
      climatisation: false,
      animaux: false,
      fumeur: false,
      musique: false
    }
  });

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
   

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name in formData.preferences) {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [name]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!formData.depart || !formData.destination || !formData.dateAller) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setError("");
    
    setIsLoading(true);
    setHasSearched(false);
    
    try {
      // Construction des paramètres de recherche
      const searchParams = new URLSearchParams();
      searchParams.append('depart', formData.depart);
      searchParams.append('destination', formData.destination);
      searchParams.append('date', formData.dateAller);
      if (formData.heureDepart) searchParams.append('heure', formData.heureDepart);
      searchParams.append('places', formData.passagers);
      
      // Ajout des préférences si elles sont sélectionnées
      Object.entries(formData.preferences).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });

      const response = await fetch(`http://localhost:5000/api/v1/trajets/all?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Si authentification requise
        }
      });
    
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des trajets');
      }

      const data = await response.json();


     if (Array.isArray(data["data"])) {
      console.log(data["data"]);
      
       const formattedResults =data["data"]
      setSearchResults(formattedResults);
      setHasSearched(true);
     }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la recherche");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservation = (trajetId) => {
    const trajet = searchResults.find(t => t.id === trajetId);
    if (trajet) {
      navigate("/reserver-trajet", { 
        state: { 
          trajetData: trajet,
          passagers: formData.passagers,
          preferences: formData.preferences
        } 
      });
    } else {
      alert("Désolé, ce trajet n'est plus disponible");
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      options.push(hour + ":00");
      options.push(hour + ":30");
    }
    return options;
  };

  // Styles (identique à votre version originale)
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "30px auto",
      padding: "25px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: "relative"
    },
    title: {
      fontSize: "28px",
      marginBottom: "25px",
      color: "#2c3e50",
      textAlign: "center",
      fontWeight: "600"
    },
    form: {
      display: "flex",
      flexDirection: "column"
    },
    section: {
      marginBottom: "30px",
      paddingBottom: "20px",
      borderBottom: "1px solid #eee"
    },
    sectionTitle: {
      fontSize: "18px",
      color: "#3498db",
      marginBottom: "15px",
      fontWeight: "500"
    },
    formRow: {
      display: "flex",
      gap: "20px",
      marginBottom: "15px"
    },
    formGroup: {
      flex: 1,
      marginBottom: "15px"
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      color: "#34495e",
      fontWeight: "500"
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#f8f9fa",
      transition: "border 0.3s"
    },
    preferences: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: "15px",
      marginTop: "15px"
    },
    preferenceLabel: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#34495e"
    },
    checkbox: {
      marginRight: "8px",
      width: "16px",
      height: "16px",
      accentColor: "#3498db"
    },
    button: {
      padding: "14px",
      backgroundColor: "#c0392b",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.3s",
      marginTop: "10px"
    },
    resultsSection: {
      marginTop: "30px",
      paddingTop: "20px",
      borderTop: "1px solid #eee"
    },
    resultsTitle: {
      fontSize: "22px",
      color: "#2c3e50",
      marginBottom: "20px",
      textAlign: "center"
    },
    resultsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    trajetCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #ddd",
      transition: "transform 0.2s",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      }
    },
    trajetInfo: {
      flex: 1
    },
    trajetRoute: {
      fontSize: "18px",
      color: "#2c3e50",
      marginBottom: "5px"
    },
    trajetDetail: {
      fontSize: "14px",
      color: "#7f8c8d",
      margin: "3px 0"
    },
    trajetPrice: {
      fontSize: "16px",
      color: "#27ae60",
      fontWeight: "bold",
      marginTop: "5px"
    },
    reserveButton: {
      padding: "10px 20px",
      backgroundColor: "#27ae60",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.3s",
      ":hover": {
        backgroundColor: "#219653"
      }
    },
    noResults: {
      textAlign: "center",
      color: "#7f8c8d",
      fontSize: "16px"
    },
    errorText: {
      color: "#e74c3c",
      textAlign: "center",
      margin: "10px 0",
      fontSize: "14px"
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    },
    loadingSpinner: {
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #3498db",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      animation: "spin 1s linear infinite"
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" }
    }
  };


  if(!user || user.role === "conducteur") return

  return (
    <div style={styles.container}>
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}></div>
        </div>
      )}
      
      <h1 style={styles.title}>Rechercher un Trajet</h1>
      
      {error && <p style={styles.errorText}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Section Principale */}
        <div style={styles.section}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="depart" style={styles.label}>
                Ville de départ *
              </label>
              <input
                type="text"
                id="depart"
                name="depart"
                placeholder="Ex: Tunis"
                value={formData.depart}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="destination" style={styles.label}>
                Ville d'arrivée *
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="Ex: Sfax"
                value={formData.destination}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="dateAller" style={styles.label}>
                Date aller *
              </label>
              <input
                type="date"
                id="dateAller"
                name="dateAller"
                value={formData.dateAller}
                onChange={handleChange}
                style={styles.input}
                min={today}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="dateRetour" style={styles.label}>
                Date retour
              </label>
              <input
                type="date"
                id="dateRetour"
                name="dateRetour"
                value={formData.dateRetour}
                onChange={handleChange}
                style={styles.input}
                min={formData.dateAller || today}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="heureDepart" style={styles.label}>
                Heure de départ
              </label>
              <select
                id="heureDepart"
                name="heureDepart"
                value={formData.heureDepart}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Toute heure</option>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="passagers" style={styles.label}>
                Passagers *
              </label>
              <select
                id="passagers"
                name="passagers"
                value={formData.passagers}
                onChange={handleChange}
                style={styles.input}
                required
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num > 1 ? "personnes" : "personne"}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section Options */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Options supplémentaires</h3>
          
          <div style={styles.formGroup}>
            <label htmlFor="bagages" style={styles.label}>
              Type de bagages
            </label>
            <select
              id="bagages"
              name="bagages"
              value={formData.bagages}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Petit bagage">Petit bagage</option>
              <option value="Moyen bagage">Moyen bagage</option>
              <option value="Gros bagage">Gros bagage</option>
            </select>
          </div>

          <div style={styles.preferences}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                name="climatisation"
                checked={formData.preferences.climatisation}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Climatisation
            </label>

            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                name="animaux"
                checked={formData.preferences.animaux}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Animaux acceptés
            </label>

            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                name="fumeur"
                checked={formData.preferences.fumeur}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Fumeur
            </label>

            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                name="musique"
                checked={formData.preferences.musique}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Musique autorisée
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? "Recherche en cours..." : "Rechercher des trajets"}
        </button>
      </form>

      {/* Affichage des résultats */}
      {hasSearched && (
        <div style={styles.resultsSection}>
          <h2 style={styles.resultsTitle}>Résultats de la recherche</h2>
          {searchResults.length > 0 ? (
            <div style={styles.resultsContainer}>
              {searchResults.map(trajet => (
                <div key={trajet._id} style={styles.trajetCard}>
                  <div style={styles.trajetInfo}>
                    <h3 style={styles.trajetRoute}>
                      {trajet.depart} → {trajet.arrivee}
                      <span style={{ fontSize: "14px", color: "#3498db", marginLeft: "10px" }}>
                        ★ {4.5}/5.0
                      </span>
                    </h3>
                    <p style={styles.trajetDetail}>
                      <strong>Date:</strong> {new Date(trajet.date).toLocaleDateString('fr-FR')} à {trajet.heure}
                    </p>
                    <p style={styles.trajetDetail}>
                      <strong>Conducteur:</strong> {trajet.conducteur.nom}
                    </p>
                    <p style={styles.trajetDetail}>
                      <strong>Places disponibles:</strong> {trajet.places}
                    </p>
                    <p style={styles.trajetPrice}>
                      {trajet.prix} DNT
                    </p>
                  </div>
                 {!user ? (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      ...styles.reserveButton,
                      backgroundColor: '#007bff',
                      color: 'white',
                      textAlign: 'center',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    🔐 Connectez-vous pour réserver
                  </div>
                </Link>
                ) : user.role === 'admin' ? (
                <div
                  style={{
                    ...styles.reserveButton,
                    backgroundColor: '#ccc',
                    cursor: 'not-allowed',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    padding: '10px',
                    borderRadius: '8px'
                  }}
                >
                  🔒 Réservations non disponibles{"\n"}pour les administrateurs
                </div>
                ) : (
                <button 
                  onClick={() => handleReservation(trajet.id)}
                  style={styles.reserveButton}
                  disabled={trajet.placesDisponibles < formData.passagers}
                >
                  {trajet.placesDisponibles < formData.passagers 
                    ? "❌ Places insuffisantes" 
                    : "✅ Réserver"}
                </button>
                )}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noResults}>Aucun trajet trouvé pour vos critères de recherche.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RechercheTrajet;
 