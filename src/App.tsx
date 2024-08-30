import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Agendamentos from './pages/Agendamentos';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="agendamentos" element={<Agendamentos />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
