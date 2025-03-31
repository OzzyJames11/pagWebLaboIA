import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import imagenHome from '../assets/img/BannerLaboIA.png';
import '../assets/css/Home.css';
import Button from '../components/Elements/Button';
import AuthModal from '../context/AuthModal';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginSuccess = () => {
    setModalOpen(false);
    // Redirige según el rol
    if (user?.rol === 'administrador') {
      navigate('/admin');
    } else {
      navigate('/datos');
    }
  };

  return (
    <div className="home">
      <div className="background-image">
        <img src={imagenHome} alt="Background" className="background-img" />
        <div className="overlay"></div>
      </div>
      <h2 style={{textAlign: 'left'}}>Registro de Pasantes</h2>
      <Button 
        variant="contained" 
        color="pink" 
        onClick={() => setModalOpen(true)} 
        align="center"
      >
        {"Regístrate"}
      </Button>
      
      <AuthModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Home;