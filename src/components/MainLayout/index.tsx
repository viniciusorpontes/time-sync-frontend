import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../MenuComponent';

const MainLayout: React.FC = () => {
    return (
        <div>
            <Menu />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
