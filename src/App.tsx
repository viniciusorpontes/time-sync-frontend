import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Agendamentos from './pages/Agendamentos';
import MainLayout from './components/MainLayout';
import CadastroCliente from './Cadastro';
import Servicos from './pages/Servicos';
import Inicio from './pages/Inicio';  // Landing Page
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Inicio />} /> {/* Rota inicial */}
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path='cadastro' element={<CadastroCliente />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
