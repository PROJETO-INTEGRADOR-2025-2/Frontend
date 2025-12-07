import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateAuthStatus } = useAuth();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/register', { name, email, password });
      const token = response.data.token;
      localStorage.setItem('coleta_token', token);
      updateAuthStatus(token);
      alert("Conta criada!");
      navigate('/dashboard');
    } catch (err) {
      alert("Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Criar Conta">
      <style>{`
        input { width: 100%; background: var(--input-bg); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 15px; border-radius: 8px; color: var(--text-color); outline: none; }
        input:focus { border-color: var(--primary); }
        .btn-submit { width: 100%; padding: 14px; background: var(--primary); color: #000; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .btn-submit:hover { background: #00ff95; transform: translateY(-2px); }
        .link { display: block; text-align: center; margin-top: 20px; color: #888; cursor: pointer; }
        .link:hover { color: var(--primary); }
      `}</style>
      <form onSubmit={handleRegister}>
        <input placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'CADASTRANDO...' : 'CRIAR CONTA'}
        </button>
      </form>
      <span onClick={() => navigate('/login')} className="link">Já tem conta? Faça Login.</span>
    </AuthLayout>
  );
}