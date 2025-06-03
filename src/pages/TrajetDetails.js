import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';



const TrajetDetails = () => {
  const { id } = useParams();
  const [trajet, setTrajet] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/trajets/${id}`)
      .then(res => res.json())
      .then(data =>{
        console.log(id);
        setTrajet(data.data)
        
        
      });
  }, 
  [id]);

  if (!trajet) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
      <h1>Détails du Trajet</h1>
      <p><strong>Départ:</strong> {trajet.depart}</p>
      <p><strong>Arrivée:</strong> {trajet.arrivee}</p>
      <p><strong>Date:</strong> {new Date(trajet.date).toLocaleDateString('fr-FR')}</p>
      <p><strong>Heure:</strong> {trajet.heure}</p>
      <p><strong>Conducteur:</strong> {trajet.conducteur.nom} {trajet.conducteur.prenom}</p>
      <p><strong>Téléphone:</strong> {trajet.conducteur.telephone}</p>
      <p><strong>Places disponibles:</strong> {trajet.places}</p>
      <p><strong>Prix:</strong> {trajet.prix} TD</p>
      <p><strong>Statut :</strong> 
        {trajet.status === "pending" && "En attente"}
        {trajet.status === "accepted" && "Accepté"}
        {trajet.status === "completed" && "Terminé"}
        {trajet.status === "rejected" && "Annulé"}
      </p>

      <Link to="/gestion-trajets" style={{ textDecoration: 'none', color: 'white' }}>
        <button style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer'
        }}>
          Retour
        </button>
      </Link>
    </div>
  );
};

export default TrajetDetails;