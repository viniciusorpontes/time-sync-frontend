import React, { useState, useEffect } from 'react';
import './style.css';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/LogoTimeSync.png';

interface CabecalhoProps {
    toggleMenu: () => void;
}

const Cabecalho: React.FC<CabecalhoProps> = ({ toggleMenu }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        // Inicializa o estado com base no localStorage
        const usuarioId = localStorage.getItem('usuarioId');
        setIsLoggedIn(!!usuarioId);

        // Listener para mudanças no localStorage
        const handleStorageChange = () => {
            const usuarioIdAtualizado = localStorage.getItem('usuarioId');
            setIsLoggedIn(!!usuarioIdAtualizado);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleLogin = () => {
        // Simulação de login
        localStorage.setItem('usuarioId', '123'); // Simulação de ID do usuário
        localStorage.setItem('token', 'seu_token_aqui');
        setIsLoggedIn(true); // Atualiza o estado local
        navigate('/login/inicio/0');
    };

    const handleCadastro = () => {
        navigate('/cadastro');
    };

    const handleLogout = () => {
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Atualiza o estado local
        navigate('/');
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
                {isLoggedIn ? (
                    <Button label="Logout" onClick={handleLogout} className="login-button" />
                ) : (
                    <>
                        <Button label="Login" onClick={handleLogin} className="login-button" />
                        <Button label="Cadastre-se" onClick={handleCadastro} className="cadastro-button" />
                    </>
                )}
            </div>
        </div>
    );
};

export default Cabecalho;
