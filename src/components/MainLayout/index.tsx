import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Cabecalho from '../Cabecalho';
import MenuComponent from '../MenuComponent';
import './style.css';

const MainLayout: React.FC = () => {
    const [isMenuVisivel, setIsMenuVisivel] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisivel(!isMenuVisivel);
    };

    return (
        <div className="main-layout-container">
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
