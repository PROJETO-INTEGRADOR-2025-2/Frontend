import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adicionado
import { ThemeToggle } from '../components/ThemeToggle'; // Adicionado

export function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const logoutButtonStyle = {
    background: 'rgba(255, 50, 50, 0.1)',
    color: '#ff5555',
    border: '1px solid rgba(255, 50, 50, 0.2)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.2s'
  };

  return (
    <div className="page-container">
      <style>{`
        /* --- MIGRAÇÃO PARA VARIÁVEIS CSS (Do index.css) --- */
        .page-container {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-color); /* Usa variável */
          color: var(--text-color); /* Usa variável */
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          position: relative; /* Necessário para ThemeToggle absoluto */
        }

        /* HEADER */
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 60px;
          backdrop-filter: blur(10px);
          background: var(--header-bg); /* Usa variável */
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--border-color); /* Usa variável */
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          color: var(--text-color); /* Usa variável */
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        
        .logo span { color: var(--primary); } /* Usa variável */

        /* BOTÕES */
        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--border-color); /* Usa variável */
          color: var(--text-color); /* Usa variável */
        }
        .btn-outline:hover { border-color: var(--primary); color: var(--primary); }

        .btn-primary {
          background: var(--primary); /* Usa variável */
          border: none;
          color: #000;
          box-shadow: 0 0 15px rgba(0, 220, 130, 0.3);
        }
        .btn-primary:hover {
          background: #00ff95;
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(0, 220, 130, 0.5);
        }

        /* HERO SECTION */
        main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 60px;
          /* Usa transparências baseadas no tema para o radial */
          background: radial-gradient(circle at 50% 10%, rgba(0, 220, 130, 0.1) 0%, transparent 50%); 
        }

        .hero-content { text-align: center; max-width: 900px; animation: fadeIn 1s ease-out; }

        h1 {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 24px;
          /* Usa variável para cor de texto do gradiente */
          background: linear-gradient(180deg, var(--text-color) 0%, #aaaaaa 100%); 
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle { font-size: 1.25rem; color: #888; line-height: 1.6; margin-bottom: 60px; max-width: 700px; margin-left: auto; margin-right: auto; }

        /* CARDS */
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }

        .card {
          background: var(--card-bg); /* Usa variável */
          border: 1px solid var(--border-color); /* Usa variável */
          padding: 30px;
          border-radius: 16px;
          text-align: left;
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 220, 130, 0.3);
        }

        .card h3 { font-size: 2.5rem; font-weight: 700; color: var(--primary); /* Usa variável */ margin-bottom: 8px; }
        
        .card p { color: #aaa; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }

        /* FOOTER */
        footer { text-align: center; padding: 40px; border-top: 1px solid var(--border-color); color: #888; font-size: 0.8rem; }
      `}</style>

      <header>
        {/* LOGO GREENLOG (CLICÁVEL) */}
        <div 
          onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/')} 
          className="logo"
        >
          <div style={{ width: 12, height: 12, background: 'var(--primary)', borderRadius: '50%'}}></div>
          GreenLog<span>.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>
                Olá, {user?.name.split(' ')[0]}!
              </span>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn-primary"
                style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}
              >
                DASHBOARD
              </button>
              <button 
                onClick={logout} 
                style={logoutButtonStyle}
              >
                SAIR
              </button>
            </div>
          ) : (
            
            // SE NÃO ESTIVER LOGADO: Mostra os botões Login e Cadastro
            <div style={{ display: 'flex', gap: 16 }}>
                <ThemeToggle/>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/register')}
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO HERO */}
      <main>
        <div className="hero-content">
          <h1>Logística Reversa <br/> Inteligente & Sustentável.</h1>
          
          <p className="subtitle">
            A plataforma completa para gestão de resíduos urbanos. Conecte pontos de coleta, 
            otimize rotas de caminhões e monitore o impacto ambiental em tempo real.
          </p>

          <div className="stats-grid">
            <div className="card">
              <h3>+12k</h3>
              <p>Toneladas Coletadas</p>
            </div>
            <div className="card">
              <h3>98%</h3>
              <p>Eficiência de Rota</p>
            </div>
            <div className="card">
              <h3>24/7</h3>
              <p>Monitoramento Real</p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        © 2025 GreenLog Systems. Todos os direitos reservados.
      </footer>
    </div>
  );
}