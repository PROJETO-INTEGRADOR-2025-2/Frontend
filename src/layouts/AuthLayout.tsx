import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <style>{`
        .page-container {
          min-height: 100vh;
          display: flex; flex-direction: column;
          background-color: var(--bg-color); color: var(--text-color);
          font-family: 'Inter', sans-serif;
        }
        /* Header Simplificado */
        header {
          padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid var(--border-color); background: var(--header-bg);
          backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 10;
        }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--text-color); display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .logo span { color: var(--primary); }
        
        /* Conteúdo Central */
        .auth-content {
            flex: 1; display: flex; align-items: center; justify-content: center; position: relative; padding: 40px;
        }
        .bg-glow {
            position: absolute; width: 600px; height: 600px;
            background: radial-gradient(circle, rgba(0, 220, 130, 0.15) 0%, transparent 70%);
            top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0;
        }
        .auth-card {
            background: var(--card-bg); border: 1px solid var(--border-color);
            padding: 40px; width: 100%; max-width: 400px; border-radius: 12px; z-index: 1;
            /* Sombra 3D */
            box-shadow: 5px 5px 15px rgba(0,0,0,0.2), -5px -5px 15px var(--shadow-light);
        }
        h2 { text-align: center; color: var(--primary); margin-bottom: 30px; }
        footer { text-align: center; padding: 20px; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: #888; }
      `}</style>

      <header>
        <div className="logo" onClick={() => navigate('/')}>
           <div style={{width: 12, height: 12, background: 'var(--primary)', borderRadius: '50%'}}></div>
           GreenLog<span>.</span>
        </div>
        <div style={{display:'flex', gap: 15, alignItems: 'center'}}>
            <ThemeToggle />
            <button onClick={() => navigate('/')} style={{background:'transparent', border: '1px solid var(--border-color)', color:'var(--text-color)', padding:'8px 16px', borderRadius: 6, cursor:'pointer'}}>Voltar</button>
        </div>
      </header>

      <div className="auth-content">
        <div className="bg-glow"></div>
        <div className="auth-card">
            <h2>{title}</h2>
            {children}
        </div>
      </div>

      <footer>© 2025 GreenLog Systems.</footer>
    </div>
  );
};