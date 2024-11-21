import React from 'react';
import './style.css'; 
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/LogoTimeSync.png'; // Caminho para a imagem

interface CabecalhoProps {
  toggleMenu: () => void;
}

const Cabecalho: React.FC<CabecalhoProps> = ({ toggleMenu }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCadastro = () => {
    navigate('/cadastro');
  };

  return (
    <div className='cabecalho-container'>
      <Button 
        icon="pi pi-bars" 
        className="transparent-button"
        onClick={toggleMenu}  
      />
      
      <img 
        src={logoImage} 
        alt="Logo TimeSync" 
        className='logo-cabecalho' 
        onClick={handleGoHome}
        style={{ cursor: 'pointer' }}
      />

      <div className="cabecalho-botoes">
        <Button label="Login" onClick={handleLogin} className="login-button" />
        <Button label="Cadastre-se" onClick={handleCadastro} className="cadastro-button" />
      </div>
    </div>
  );
};

export default Cabecalho;
