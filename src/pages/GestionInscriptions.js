import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GestionInscriptions = () => {
   const [error, setError] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/users/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des inscriptions");
        }

        const data = await response.json();
        console.log(data);
        
        setInscriptions(data.data); // تأكد من بنية البيانات
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false); // إيقاف التحميل بعد انتهاء الطلب
      }
    };

    fetchUsers();
  }, []);

  const handleValidation = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/users/acceptedUser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation');
    }

    // Optionnel: mettre à jour localement la liste
     setInscriptions(prev =>
      prev.filter(inscription => inscription._id !== id)
    );
  } catch (error) {
    console.error(error);
  }
};

const handleRejection = async (id) => {
  try {
   const response = await fetch(`http://localhost:5000/api/v1/users/rejectedUser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation');
    }
     setInscriptions(prev =>
      prev.filter(inscription => inscription._id !== id)
    );
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion des Inscriptions</h1>
      <Link to="/profile-admin" style={styles.backButton}>← Retour au panneau admin</Link>

      {loading ? (
        <p style={{ color: 'blue' }}>Chargement en cours...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div style={styles.stats}>
            <div style={styles.statCard}>
              <h3 style={styles.statTitle}>Nouvelles demandes</h3>
              <p style={styles.statValue}>{inscriptions.length}</p>
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inscriptions.map(inscription => (
                <tr key={inscription._id} style={styles.tr}>
                  <td style={styles.td}>{inscription.nom}</td>
                  <td style={styles.td}>{inscription.email}</td>
                  <td style={styles.td}>{inscription.role}</td>
                  <td style={styles.td}>
                    {new Date(inscription.createdAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusPending}>{"en_attente"}</span>
                  </td>
                 <td style={styles.td}>
                      <button style={styles.validateBtn} onClick={() => handleValidation(inscription._id)}>
                        Valider
                      </button>
                      <button style={styles.rejectBtn} onClick={() => handleRejection(inscription._id)}>
                        Rejeter
                      </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, sans-serif"
  },
  title: {
    color: '#8e44ad',
    textAlign: 'center',
    marginBottom: '20px'
  },
  backButton: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#8e44ad',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    flex: '1',
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  statTitle: {
    color: '#7f8c8d',
    margin: '0 0 10px 0',
    fontSize: '16px'
  },
  statValue: {
    color: '#8e44ad',
    margin: '0',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  th: {
    backgroundColor: '#8e44ad',
    color: 'white',
    padding: '12px',
    textAlign: 'left'
  },
  tr: {
    borderBottom: '1px solid #ddd',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  td: {
    padding: '12px',
    verticalAlign: 'middle'
  },
  statusPending: {
    color: '#f39c12',
    fontWeight: 'bold'
  },

  validateBtn: {
    padding: '6px 12px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  rejectBtn: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default GestionInscriptions;