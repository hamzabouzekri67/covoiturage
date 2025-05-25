import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ProposerTrajet() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"))??null;
    useEffect(() => {
    if (!user || user.role === "passager" || user.role === "admin") {      
      navigate('/');
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    trajet: "",
    pointDepart: "",
    pointArrivee: "",
    date: "",
    heureDepart: "",
    heureArrivee: "",
    nombrePlaces: 1,
    prix: "",
    bagages: "Petit bagage",
    animaux: false,
    fumeur: false
  });
  const [loading, setLoading] = useState(false); // حالة التحميل

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const dataToSend = {
        ...formData,
        conducteurId: user.id,
        prix: parseInt(formData.prix, 10),
        nombrePlaces: parseInt(formData.nombrePlaces, 10)
      };

      const response = await fetch(`http://localhost:5000/api/v1/trajets/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la publication');
      }

      toast.success("🚗 Trajet publié avec succès !");
      navigate(-1)
    } catch (error) {
      console.error("Erreur:", error.message);
      alert("Erreur lors de la publication du trajet");
    } finally {
      setLoading(false);
    }
  };
  
  if (!user || user.role === "passager"|| user.role === "admin") return null;
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Proposer un Trajet</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Informations du trajet */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Informations du trajet</h3>

          <div style={styles.formGroup}>
            <label htmlFor="pointDepart" style={styles.label}>Ville de départ *</label>
            <input type="text" id="pointDepart" name="pointDepart" value={formData.pointDepart} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="pointArrivee" style={styles.label}>Ville d'arrivée *</label>
            <input type="text" id="pointArrivee" name="pointArrivee" value={formData.pointArrivee} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, flex: 1, marginRight: '10px' }}>
              <label htmlFor="date" style={styles.label}>Date *</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label htmlFor="heureDepart" style={styles.label}>Heure de départ *</label>
              <input type="time" id="heureDepart" name="heureDepart" value={formData.heureDepart} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* Détails du trajet */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Détails du trajet</h3>

          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, flex: 1, marginRight: '10px' }}>
              <label htmlFor="nombrePlaces" style={styles.label}>Places disponibles *</label>
              <select id="nombrePlaces" name="nombrePlaces" value={formData.nombrePlaces} onChange={handleChange} style={styles.input} required>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} place{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label htmlFor="prix" style={styles.label}>Prix par place (DTN) *</label>
              <input type="number" id="prix" name="prix" min="1" step="1" value={formData.prix} onChange={handleChange} style={styles.input} required />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="bagages" style={styles.label}>Type de bagages autorisés</label>
            <select id="bagages" name="bagages" value={formData.bagages} onChange={handleChange} style={styles.input}>
              <option value="Petit bagage">Petit bagage</option>
              <option value="Moyen bagage">Moyen bagage</option>
              <option value="Gros bagage">Gros bagage</option>
            </select>
          </div>
        </div>

        {/* Préférences */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Préférences</h3>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="animaux" checked={formData.animaux} onChange={handleChange} style={styles.checkbox} />
              Animaux acceptés
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="fumeur" checked={formData.fumeur} onChange={handleChange} style={styles.checkbox} />
              Fumeur
            </label>
          </div>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Publication en cours..." : "Publier le trajet"}
        </button>
      </form>
    </div>
  );
}
// Styles améliorés
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#2c3e50",
    textAlign: "center",
    fontWeight: "600"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  section: {
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee"
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#3498db",
    marginBottom: "15px",
    fontWeight: "500"
  },
  formGroup: {
    marginBottom: "15px",
    width: "100%"
  },
  formRow: {
    display: "flex",
    justifyContent: "space-between",
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
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border 0.3s ease",
    backgroundColor: "#f8f9fa",
    ":focus": {
      borderColor: "#3498db",
      outline: "none"
    }
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#34495e"
  },
  checkbox: {
    marginRight: "8px",
    accentColor: "#3498db"
  },
  button: {
    padding: "12px",
    backgroundColor: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "500",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#2980b9"
    }
  },
};

export default ProposerTrajet;