import React from 'react';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import './style.css'; 

interface MenuComponentProps {
  isMenuVisivel: boolean;
}

const MenuComponent: React.FC<MenuComponentProps> = ({ isMenuVisivel }) => {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Agendamentos',
      icon: 'pi pi-fw pi-calendar',
      command: () => navigate('/agendamentos')
    },
    {
      label: 'Servicos',
      icon: 'pi pi-fw pi-server',
      command: () => navigate('/servicos')
    },
    {
      label: 'Empresas',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/empresas')
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-database',
      command: () => navigate('/dashboard')
    }
  ];

  return (
    <div className={`menu-container ${!isMenuVisivel ? 'menu-hidden' : ''}`}>
      <Menu model={items} />
    </div>
  );
};

export default MenuComponent;
