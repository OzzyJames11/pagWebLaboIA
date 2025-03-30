import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
//importar paths
import { ROUTES } from '../assets/Strings/routes';
import imagenHome from '../assets/img/BannerLaboIA.png';
import '../assets/css/Home.css'; // Importa los estilos para Home
import Button from '../components/Elements/Button';



const Home = () => {
    return (
        <div className="home">
            <div className = "background-image">
                <img src={imagenHome} alt="Background" className="background-img" />
                <div className="overlay"></div>
            </div>
            <h2 style={{textAlign: 'left'}}>Registro de Pasantes</h2>
            <Button variant="contained" color="pink" /*onClick={handleGuardar}*/ align="center">{"asdf"}</Button>
        </div>
    );
};

export default Home;
