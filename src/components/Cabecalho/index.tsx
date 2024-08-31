import React from 'react';
import './style.css'; 
import { Button } from 'primereact/button';

interface CabecalhoProps {
  toggleMenu: () => void;
}

const Cabecalho: React.FC<CabecalhoProps> = ({ toggleMenu }) => {

  return (
    <div className='cabecalho-container'>
      <Button 
        icon="pi pi-bars" 
        className="transparent-button"
        onClick={toggleMenu}  // Chama a função do componente pai ao clicar
      />
      <h1 className='titulo-cabecalho'>TimeSync</h1>
    </div>
  );
};

export default Cabecalho;