import React from 'react';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

const MenuComponent: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Agendamentos',
      icon: 'pi pi-fw pi-calendar',
      command: () => navigate('/agendamentos')
    }
  ];

  return (
    <div className="menu-container">
      <Menu model={items} />
    </div>
  );
};

export default MenuComponent;
