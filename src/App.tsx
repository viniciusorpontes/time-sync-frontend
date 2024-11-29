import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Agendamentos from './pages/Agendamentos';
import CadastroCliente from './pages/CadastroUsuario';
import Servicos from './pages/Servicos';
import Empresas from './pages/Empresas';
import Inicio from './pages/Inicio';  // Landing Page
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Inicio />} /> {/* Rota inicial */}
          <Route path="agendamentos/:empresaId" element={<Agendamentos />} />
          <Route path='cadastro' element={<CadastroCliente />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="login/:urlDirecionada/:id" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
