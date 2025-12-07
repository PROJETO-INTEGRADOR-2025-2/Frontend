// FILE: frontend/src/pages/Dashboard.tsx

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext'; // Importado para usar logout e isAuthenticated

export function Dashboard() {
  const [trucks, setTrucks] = useState<any[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Usando o hook de autenticação

  useEffect(() => {
    // Se, por algum motivo, o useAuth determinar que não está autenticado, redireciona.
    // Isso evita que o componente tente rodar se o token estiver totalmente ausente.
    if (!localStorage.getItem('coleta_token')) {
        navigate('/login');
        return;
    }
    
    // Tenta buscar os dados
    const fetchTrucks = async () => {
        try {
            const res = await api.get('/trucks');
            setTrucks(res.data);
        } catch (error: any) {
            // Se a API retornar 401 (Unauthorized), o token expirou.
            if (error.response && error.response.status === 401) {
                alert("Sua sessão expirou. Faça login novamente.");
                logout(); // Limpa o token e redireciona para a Home (e daí para o Login)
            } else {
                // Caso seja um erro 500 ou outro erro de rede
                console.error("Erro ao carregar frota:", error);
            }
        }
    };
    fetchTrucks();
  }, [navigate, logout]);


  return (
    <div className="dashboard-container">
      <style>{`
        /* ESTILOS PROFISSIONAIS 3D */
        .dashboard-container {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-color); 
          color: var(--text-color);
          min-height: 100vh;
          position: relative;
        }

        /* HEADER */
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border-color);
          background: var(--header-bg);
          backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 10;
        }

        .brand { font-size: 1.2rem; font-weight: 700; color: var(--text-color); }
        .brand span { color: var(--primary); }

        .btn-logout {
          background: rgba(255, 50, 50, 0.1);
          color: #ff5555;
          border: 1px solid rgba(255, 50, 50, 0.2);
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-logout:hover { background: rgba(255, 50, 50, 0.2); }

        /* ÁREA DE AÇÕES RÁPIDAS (3D COM SOMBRAS MÚLTIPLAS) */
        .content-area { padding: 40px; max-width: 1400px; margin: 0 auto; }
        
        .quick-actions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin: 30px 0 50px;
        }
        .action-button {
            padding: 30px;
            border-radius: 8px;
            font-size: 1.15rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            text-shadow: none; 
            border: none;
            box-shadow: 
                5px 5px 10px rgba(0, 0, 0, 0.2), 
                -5px -5px 10px rgba(255, 255, 255, 0.05); 
        }
        
        /* Botão 1: Gerenciamento (Solid Profissional) */
        .btn-manage {
            background: var(--primary); 
            color: #000;
            border: 1px solid var(--primary);
        }
        .btn-manage:hover {
            transform: translateY(1px); 
            box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.4); 
            background: #00e080;
        }

        /* Botão 2: Agenda (Outline Profissional) */
        .btn-agenda {
            background: transparent;
            color: var(--text-color); 
            border: 1px solid var(--border-color);
        }
        .btn-agenda:hover {
            transform: translateY(1px);
            border-color: var(--primary);
            color: var(--primary);
            box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.4);
        }

        /* LISTA DE CAMINHÕES (Cards com 3D) */
        .fleet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .truck-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          padding: 20px;
          border-radius: 8px;
          transition: 0.2s;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 
            4px 4px 10px rgba(0, 0, 0, 0.2), 
            -4px -4px 10px rgba(255, 255, 255, 0.05);
        }

        .truck-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 
            0 8px 15px rgba(0, 0, 0, 0.3), 
            0 0 10px var(--primary);
        }

        .truck-plate { font-size: 1.4rem; font-weight: 800; color: var(--primary); }
        .truck-driver { color: #888; font-size: 0.9rem; }
        
        .badges { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px; }
        .badge {
          background: rgba(0, 220, 130, 0.1);
          color: var(--primary);
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 220, 130, 0.2);
        }
      `}</style>

      <header>
        <div className="brand">GreenLog<span>.</span> Dashboard</div>
        <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
          <ThemeToggle />
          <button onClick={logout} className="btn-logout">Sair</button>
        </div>
      </header>

      <div className="content-area">
        <h1 style={{color: 'var(--text-color)'}}>Painel de Controle</h1>
        <p style={{marginBottom: 10, color: '#aaa'}}>Visão geral e acesso rápido às operações do sistema.</p>
        
        {/* --- ÁREA DE AÇÕES RÁPIDAS (COM EFEITO 3D) --- */}
        <div className="quick-actions-grid">
            <button 
                className="action-button btn-manage"
                onClick={() => navigate('/gerenciar')}
            >
                1. Gerenciar Frota, Pontos e Rotas
            </button>
            <button 
                className="action-button btn-agenda"
                onClick={() => navigate('/itinerarios')}
            >
                2. Visualizar Agenda de Coletas
            </button>
        </div>


        {/* --- VISUALIZAÇÃO: Situação da Frota --- */}
        <h2 style={{color: 'var(--text-color)', fontSize: '1.5rem', marginTop: 30, marginBottom: 15}}>Situação da Frota Ativa ({trucks.length})</h2>
        
        {trucks.length === 0 ? (
          <div style={{ 
            padding: 40, 
            border: '1px dashed var(--border-color)', 
            borderRadius: 10, 
            textAlign: 'center', 
            color: '#666',
            background: 'var(--card-bg)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            Nenhum caminhão operando no momento. Cadastre o primeiro caminhão em "Gerenciar Pontos e Rotas".
          </div>
        ) : (
          <div className="fleet-grid">
            {trucks.map(truck => (
              <div key={truck.id} className="truck-card">
                <div className="truck-plate">{truck.plate}</div>
                <div className="truck-driver">Motorista: {truck.driverName}</div>
                <div className="badges">
                  {truck.wasteTypes.map((type: string) => (
                    <span key={type} className="badge">{type}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}