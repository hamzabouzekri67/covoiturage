import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; 
import MotDePasseOublie from './pages/MotDePasseOublie';
import ProfileAdmin from './pages/ProfileAdmin';
import ProfileConducteur from './pages/ProfileConducteur';
import ProfilePassager from './pages/ProfilePassager';
import RechercheTrajet from './pages/RechercheTrajet';
import ReserverTrajet from './pages/ReserverTrajet';
import ProposeTrajet from './pages/ProposeTrajet';
import Feedback from './pages/Feedback';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import MesReservations from './pages/MesReservations';
import HistoriquePassager from './pages/HistoriquePassager';
import MesTrajets from './pages/MesTrajets';
import HistoriqueConducteur from './pages/HistoriqueConducteur';
import GestionInscriptions from './pages/GestionInscriptions';
import GestionReservations from './pages/GestionReservations';
import GestionTrajets from './pages/GestionTrajets';
import GestionFeedbacks from './pages/GestionFeedbacks';
import TrajetDetails from './pages/TrajetDetails';

import './App.css';

function AppContent() {
  const location = useLocation();
  
  // Liste des routes où la SideBar doit être masquée
  const hiddenSidebarRoutes = [
    '/profile-admin',
    '/profile-conducteur',
    '/profile-passager',
    '/mes-reservations',
    '/historique-passager',
    '/mes-trajets',
    '/historique-conducteur',
    '/gestion-inscriptions',
    '/gestion-reservations',
    '/gestion-trajets',
    '/gestion-feedbacks',
    '/trajet/:id'
  ];

  const showSideBar = !hiddenSidebarRoutes.includes(location.pathname);

  return (
    <div className="app">
      <TopBar />
      <div className="main-content">
        {showSideBar && <SideBar />}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>}/>
            <Route path="/mot-de-passe-oublie"element={<MotDePasseOublie/>}/>
            
            {/* Pages de profil (sans SideBar) */}
            <Route path="/profile-admin" element={<ProfileAdmin />} />
            <Route path="/profile-conducteur" element={<ProfileConducteur />} />
            <Route path="/profile-passager" element={<ProfilePassager />} />
            
            {/* Pages fonctionnelles passager */}
            <Route path="/mes-reservations" element={<MesReservations />} />
            <Route path="/historique-passager" element={<HistoriquePassager />} />
            
            {/* Pages fonctionnelles conducteur */}
            <Route path="/mes-trajets" element={<MesTrajets />} />
            <Route path="/historique-conducteur" element={<HistoriqueConducteur />} />
            
            {/* Pages d'administration */}
            <Route path="/gestion-inscriptions" element={<GestionInscriptions />} />
            <Route path="/gestion-reservations" element={<GestionReservations />} />
            <Route path="/gestion-trajets" element={<GestionTrajets />} />
            <Route path="/gestion-feedbacks" element={<GestionFeedbacks />} />
            <Route path="/trajet/:id" element={<TrajetDetails />} />

            
            {/* Autres pages (avec SideBar) */}
            <Route path="/rechercher-trajet" element={<RechercheTrajet />} />
            <Route path="/reserver-trajet" element={<ReserverTrajet />} />
            <Route path="/proposer-trajet" element={<ProposeTrajet />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;