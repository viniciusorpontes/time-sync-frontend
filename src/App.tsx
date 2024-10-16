import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Agendamentos from './pages/Agendamentos';
import Servicos from './pages/Servicos';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
