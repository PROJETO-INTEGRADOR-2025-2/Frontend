import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const WASTE_TYPES = ['PLASTICO', 'PAPEL', 'METAL', 'VIDRO', 'ORGANICO', 'ELETRONICO'];

// Componente de Feedback Visual
const FeedbackMessage = ({ type, message }: { type: 'success' | 'error', message: string }) => {
    if (!message) return null;
    return (
        <div style={{
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.9rem',
            marginTop: '20px',
            textAlign: 'center',
            backgroundColor: type === 'success' ? 'rgba(0, 220, 130, 0.1)' : 'rgba(255, 80, 80, 0.1)',
            color: type === 'success' ? 'var(--primary)' : '#ff5555',
            border: `1px solid ${type === 'success' ? 'var(--primary)' : '#ff5555'}`,
            animation: 'fadeIn 0.3s ease'
        }}>
            {message}
        </div>
    );
};

export function OperacoesGerenciais() {
  const [activeTab, setActiveTab] = useState<'TRUCKS' | 'POINTS' | 'ROUTES' | 'SCHEDULE'>('TRUCKS');
  const navigate = useNavigate();
  const { logout } = useAuth(); // Para o botão Sair
  
  // DADOS E ESTADOS
  const [points, setPoints] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  
  // Inputs
  const [newTruckPlate, setNewTruckPlate] = useState('');
  const [newTruckDriver, setNewTruckDriver] = useState('');
  const [newPointName, setNewPointName] = useState('');
  const [newPointAddress, setNewPointAddress] = useState('');
  const [newPointWasteTypes, setNewPointWasteTypes] = useState<string[]>([]);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteDistance, setNewRouteDistance] = useState('');
  const [selectedPointIds, setSelectedPointIds] = useState<number[]>([]);
  const [scheduleTruckId, setScheduleTruckId] = useState('');
  const [scheduleRouteId, setScheduleRouteId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // --- API ---
  const fetchAllData = async () => {
    try {
      const [pointsRes, trucksRes, routesRes] = await Promise.all([
        api.get('/points'), api.get('/trucks'), api.get('/routes')
      ]);
      setPoints(pointsRes.data);
      setTrucks(trucksRes.data);
      setRoutes(routesRes.data);
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // --- HANDLERS (Mantidos da versão anterior) ---
  const handleCreateTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    try {
      await api.post('/trucks', { plate: newTruckPlate, driverName: newTruckDriver, capacity: 1000, wasteTypes: ["PLASTICO", "PAPEL"] });
      setFeedback({ type: 'success', message: 'Caminhão cadastrado!' });
      setNewTruckPlate(''); setNewTruckDriver('');
      fetchAllData();
    } catch (err) { setFeedback({ type: 'error', message: 'Erro: Placa duplicada ou falha na conexão.' }); }
  };

  const handleCreatePoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (newPointWasteTypes.length === 0) return setFeedback({ type: 'error', message: 'Selecione ao menos um resíduo.' });
    try {
      await api.post('/points', { name: newPointName, address: newPointAddress, responsible: 'Admin', contact: '12345678', wasteTypes: newPointWasteTypes });
      setFeedback({ type: 'success', message: 'Ponto criado!' });
      setNewPointName(''); setNewPointAddress(''); setNewPointWasteTypes([]);
      fetchAllData();
    } catch (e) { setFeedback({ type: 'error', message: 'Erro ao criar ponto.' }); }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (selectedPointIds.length < 2) return setFeedback({ type: 'error', message: 'Mínimo de 2 pontos por rota.' });
    try {
      await api.post('/routes', { name: newRouteName, distanceKm: parseFloat(newRouteDistance), pointIds: selectedPointIds });
      setFeedback({ type: 'success', message: 'Rota criada!' });
      setNewRouteName(''); setNewRouteDistance(''); setSelectedPointIds([]);
      fetchAllData();
    } catch (e) { setFeedback({ type: 'error', message: 'Erro ao criar rota.' }); }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!scheduleTruckId || !scheduleRouteId || !scheduleDate) return setFeedback({ type: 'error', message: 'Preencha todos os campos.' });
    try {
      await api.post('/itineraries', { truckId: parseInt(scheduleTruckId), routeId: parseInt(scheduleRouteId), date: scheduleDate });
      setFeedback({ type: 'success', message: 'Itinerário agendado com sucesso!' });
      setScheduleTruckId(''); setScheduleRouteId(''); setScheduleDate('');
    } catch (e: any) {
        const msg = e.response?.data?.error || 'Erro desconhecido';
        setFeedback({ type: 'error', message: msg });
    }
  };

  // Funções de Delete Genéricas
  const handleDelete = async (endpoint: string, id: number, label: string) => {
      if (!window.confirm(`Excluir ${label}?`)) return;
      try {
          await api.delete(`/${endpoint}/${id}`);
          setFeedback({ type: 'success', message: `${label} excluído!` });
          fetchAllData();
      } catch (e: any) {
          const msg = e.response?.data?.error || 'Erro ao excluir.';
          setFeedback({ type: 'error', message: msg });
      }
  };

  // --- RENDERS ---

  const renderTrucks = () => (
    <div className="panel-grid">
        <div className="form-card">
            <h3>Novo Caminhão</h3>
            <form onSubmit={handleCreateTruck}>
                <div className="input-group">
                    <label>Placa do Veículo</label>
                    <input placeholder="EX: ABC-1234" value={newTruckPlate} onChange={e => setNewTruckPlate(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label>Motorista Responsável</label>
                    <input placeholder="Nome Completo" value={newTruckDriver} onChange={e => setNewTruckDriver(e.target.value)} required />
                </div>
                <button type="submit" className="btn-submit">Cadastrar Frota</button>
            </form>
            {feedback && activeTab === 'TRUCKS' && <FeedbackMessage type={feedback.type} message={feedback.message} />}
        </div>

        <div className="list-card">
            <h3>Frota Ativa ({trucks.length})</h3>
            <div className="items-list">
                {trucks.map(t => (
                    <div key={t.id} className="item-row">
                        <div>
                            <span className="item-title">{t.plate}</span>
                            <span className="item-subtitle">{t.driverName}</span>
                        </div>
                        <button onClick={() => handleDelete('trucks', t.id, 'Caminhão')} className="btn-delete">Remover</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderPoints = () => (
    <div className="panel-grid">
        <div className="form-card">
            <h3>Novo Ponto</h3>
            <form onSubmit={handleCreatePoint}>
                <input placeholder="Nome do Local (Ex: Supermercado X)" value={newPointName} onChange={e => setNewPointName(e.target.value)} required />
                <input placeholder="Endereço Completo" value={newPointAddress} onChange={e => setNewPointAddress(e.target.value)} required />
                
                <label style={{marginTop: 15, display:'block', fontSize:'0.9rem', color:'#aaa'}}>Tipos de Resíduos:</label>
                <div className="waste-grid">
                    {WASTE_TYPES.map(type => (
                        <div key={type} 
                             className={`waste-chip ${newPointWasteTypes.includes(type) ? 'active' : ''}`}
                             onClick={() => {
                                 if (newPointWasteTypes.includes(type)) setNewPointWasteTypes(prev => prev.filter(t => t !== type));
                                 else setNewPointWasteTypes(prev => [...prev, type]);
                             }}
                        >
                            {type}
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn-submit">Salvar Ponto</button>
            </form>
            {feedback && activeTab === 'POINTS' && <FeedbackMessage type={feedback.type} message={feedback.message} />}
        </div>

        <div className="list-card">
            <h3>Pontos de Coleta ({points.length})</h3>
            <div className="items-list">
                {points.map(p => (
                    <div key={p.id} className="item-row">
                        <div style={{flex: 1}}>
                            <span className="item-title">{p.name}</span>
                            <span className="item-subtitle">{p.address}</span>
                            <div className="mini-tags">
                                {p.wasteTypes.map((w: string) => <span key={w}>{w}</span>)}
                            </div>
                        </div>
                        <button onClick={() => handleDelete('points', p.id, 'Ponto')} className="btn-delete">Remover</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderRoutes = () => (
    <div className="panel-grid">
        <div className="form-card">
            <h3>Criar Rota</h3>
            <form onSubmit={handleCreateRoute}>
                <input placeholder="Nome da Rota" value={newRouteName} onChange={e => setNewRouteName(e.target.value)} required />
                <input type="number" placeholder="Distância (Km)" value={newRouteDistance} onChange={e => setNewRouteDistance(e.target.value)} required />
                
                <label style={{marginTop: 10, display:'block', fontSize:'0.9rem', color:'#aaa'}}>Adicionar Pontos (Sequência):</label>
                <select 
                    value="" 
                    onChange={e => {
                        const pid = parseInt(e.target.value);
                        if(pid && !selectedPointIds.includes(pid)) setSelectedPointIds([...selectedPointIds, pid]);
                    }}
                >
                    <option value="" disabled>Selecione um ponto...</option>
                    {points.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>

                <div className="sequence-list">
                    {selectedPointIds.map((id, idx) => {
                        const pt = points.find(p => p.id === id);
                        return <div key={id} className="seq-item"><span>{idx+1}.</span> {pt?.name}</div>
                    })}
                </div>

                <button type="submit" className="btn-submit">Salvar Rota</button>
            </form>
            {feedback && activeTab === 'ROUTES' && <FeedbackMessage type={feedback.type} message={feedback.message} />}
        </div>

        <div className="list-card">
            <h3>Rotas Definidas ({routes.length})</h3>
            <div className="items-list">
                {routes.map(r => (
                    <div key={r.id} className="item-row">
                        <div>
                            <span className="item-title">{r.name} ({r.distanceKm}km)</span>
                            <span className="item-subtitle">{r.points.length} paradas</span>
                        </div>
                        <button onClick={() => handleDelete('routes', r.id, 'Rota')} className="btn-delete">Remover</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderSchedule = () => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="form-card">
            <h3 style={{textAlign: 'center'}}>Agendar Coleta</h3>
            <p style={{textAlign: 'center', color: '#888', marginBottom: 20}}>O sistema valida automaticamente a compatibilidade entre Caminhão e Rota.</p>
            <form onSubmit={handleSchedule}>
                <label>Caminhão Disponível</label>
                <select value={scheduleTruckId} onChange={e => setScheduleTruckId(e.target.value)} required>
                    <option value="" disabled>Selecione...</option>
                    {trucks.map(t => <option key={t.id} value={t.id}>{t.plate} - {t.driverName}</option>)}
                </select>

                <label>Rota Planejada</label>
                <select value={scheduleRouteId} onChange={e => setScheduleRouteId(e.target.value)} required>
                    <option value="" disabled>Selecione...</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.distanceKm}km)</option>)}
                </select>

                <label>Data da Coleta</label>
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} required />

                <button type="submit" className="btn-submit">Confirmar Agendamento</button>
            </form>
            {feedback && activeTab === 'SCHEDULE' && <FeedbackMessage type={feedback.type} message={feedback.message} />}
        </div>
    </div>
  );

  return (
    <div className="page-container">
      <style>{`
        /* ESTILOS ESPECÍFICOS DESTA PÁGINA */
        .page-container {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color); color: var(--text-color);
            min-height: 100vh;
        }
        
        /* Header Consistente */
        header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 40px; border-bottom: 1px solid var(--border-color);
            background: var(--header-bg); backdrop-filter: blur(10px);
            position: sticky; top: 0; z-index: 10;
        }
        .brand { font-size: 1.2rem; font-weight: 800; color: var(--text-color); cursor: pointer; }
        .brand span { color: var(--primary); }

        /* Navegação de Abas (Estilo Pílula) */
        .tabs-container {
            display: flex; justify-content: center; gap: 10px;
            padding: 30px 0; border-bottom: 1px solid var(--border-color);
            margin-bottom: 30px; background: var(--bg-color);
        }
        .tab-btn {
            background: transparent; border: 1px solid var(--border-color);
            color: var(--text-color); padding: 10px 24px; borderRadius: 20px;
            cursor: pointer; font-weight: 600; transition: all 0.3s ease;
        }
        .tab-btn:hover { border-color: var(--primary); color: var(--primary); }
        .tab-btn.active {
            background: var(--primary); color: #000; border-color: var(--primary);
            box-shadow: 0 0 15px rgba(0, 220, 130, 0.4);
        }

        /* Layout Grid Principal */
        .content-area { max-width: 1200px; margin: 0 auto; padding: 0 20px 40px; }
        .panel-grid {
            display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px;
            align-items: start;
        }
        @media (max-width: 900px) { .panel-grid { grid-template-columns: 1fr; } }

        /* Cards 3D (Form e List) */
        .form-card, .list-card {
            background: var(--card-bg); border: 1px solid var(--border-color);
            padding: 30px; border-radius: 12px;
            box-shadow: 5px 5px 15px rgba(0,0,0,0.2), -5px -5px 15px var(--shadow-light);
        }
        h3 { color: var(--primary); margin-bottom: 20px; font-size: 1.3rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 10px; }

        /* Inputs & Form Elements */
        .input-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-size: 0.85rem; color: #888; }
        input, select {
            width: 100%; padding: 12px; border-radius: 8px;
            background: var(--input-bg); border: 1px solid var(--border-color);
            color: var(--text-color); outline: none; margin-bottom: 10px;
            transition: 0.3s;
        }
        input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(0, 220, 130, 0.2); }

        .btn-submit {
            width: 100%; padding: 12px; background: var(--primary); color: #000;
            border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;
            transition: 0.2s;
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 220, 130, 0.3); }

        /* Chips de Resíduos */
        .waste-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; margin-top: 5px; }
        .waste-chip {
            padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; cursor: pointer;
            border: 1px solid var(--border-color); color: var(--text-color); transition: 0.2s;
        }
        .waste-chip:hover { border-color: var(--primary); }
        .waste-chip.active { background: var(--primary); color: #000; border-color: var(--primary); font-weight: bold; }

        /* Listas */
        .item-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 15px; border-bottom: 1px solid var(--border-color);
            background: rgba(255,255,255,0.02); margin-bottom: 8px; border-radius: 6px;
        }
        .item-title { display: block; font-weight: bold; font-size: 1rem; color: var(--text-color); }
        .item-subtitle { font-size: 0.85rem; color: #888; display: block; }
        .mini-tags span { font-size: 0.7rem; color: var(--primary); margin-right: 5px; }
        
        .btn-delete {
            background: rgba(255, 80, 80, 0.1); color: #ff5555; border: 1px solid rgba(255, 80, 80, 0.3);
            padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: 0.2s;
        }
        .btn-delete:hover { background: #ff5555; color: white; }

        .sequence-list { margin: 15px 0; max-height: 150px; overflow-y: auto; background: var(--input-bg); padding: 10px; border-radius: 8px; }
        .seq-item { font-size: 0.9rem; margin-bottom: 5px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px; }
        .seq-item span { color: var(--primary); font-weight: bold; margin-right: 5px; }
      `}</style>

      <header>
        <div className="brand" onClick={() => navigate('/dashboard')}>GreenLog<span>.</span> Operações</div>
        <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
            <ThemeToggle />
            <button onClick={() => navigate('/dashboard')} style={{background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--border-color)', padding:'8px 16px', borderRadius:6, cursor:'pointer'}}>Voltar</button>
        </div>
      </header>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'TRUCKS' ? 'active' : ''}`} onClick={() => {setActiveTab('TRUCKS'); setFeedback(null);}}>Caminhões</button>
        <button className={`tab-btn ${activeTab === 'POINTS' ? 'active' : ''}`} onClick={() => {setActiveTab('POINTS'); setFeedback(null);}}>Pontos</button>
        <button className={`tab-btn ${activeTab === 'ROUTES' ? 'active' : ''}`} onClick={() => {setActiveTab('ROUTES'); setFeedback(null);}}>Rotas</button>
        <button className={`tab-btn ${activeTab === 'SCHEDULE' ? 'active' : ''}`} onClick={() => {setActiveTab('SCHEDULE'); setFeedback(null);}}>Agendamento</button>
      </div>

      <div className="content-area">
        {activeTab === 'TRUCKS' && renderTrucks()}
        {activeTab === 'POINTS' && renderPoints()}
        {activeTab === 'ROUTES' && renderRoutes()}
        {activeTab === 'SCHEDULE' && renderSchedule()}
      </div>
    </div>
  );
}