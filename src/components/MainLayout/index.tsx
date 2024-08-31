import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Cabecalho from '../Cabecalho';
import MenuComponent from '../MenuComponent';
import './style.css'; // Adicione o arquivo CSS

const MainLayout: React.FC = () => {
    const [isMenuVisivel, setIsMenuVisivel] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisivel(!isMenuVisivel);
    };

    return (
        <div>
            <Cabecalho toggleMenu={toggleMenu} />
            <div className='content'>
                <MenuComponent isMenuVisivel={isMenuVisivel} />
                <div style={{ flex: '1' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
