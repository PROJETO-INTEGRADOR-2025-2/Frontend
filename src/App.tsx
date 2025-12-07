import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { OperacoesGerenciais } from './pages/OperacoesGerenciais'; // Assumindo que o arquivo existe
import { ItinerarioCaminhoneiro } from './pages/ItinerarioCaminhoneiro'
import { useAuth } from './context/AuthContext';
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  // Se não estiver logado, manda pro login
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/gerenciar" element={<PrivateRoute><OperacoesGerenciais /></PrivateRoute>} />
        <Route path="/itinerarios" element={<PrivateRoute><ItinerarioCaminhoneiro /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;