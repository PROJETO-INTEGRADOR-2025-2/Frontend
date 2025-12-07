import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function ItinerarioCaminhoneiro() {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // O tipo de resíduo aceito pelo caminhão logado (simulação, pois não temos login de motorista)
  const truckWasteTypes = ["PLASTICO", "PAPEL", "METAL"];

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/schedule');
      setItineraries(res.data);
    } catch (e) {
      console.error("Erro ao buscar itinerários:", e);
      alert("Erro ao buscar a agenda de coletas.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (itineraryId: number, newStatus: string) => {
    try {
        const endpoint = `/itineraries/${itineraryId}/status`;
        await api.patch(endpoint, { status: newStatus });
        
        alert(`Status do itinerário #${itineraryId} alterado para ${newStatus}.`);
        fetchItineraries(); // Atualiza a lista na tela
    } catch (e) {
        alert("Falha ao atualizar o status.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return '#f39c12'; // Laranja
      case 'IN_PROGRESS': return '#3498db'; // Azul
      case 'COMPLETED': return '#2ecc71'; // Verde
      default: return '#999';
    }
  };

  return (
    <div className="page-container">
      <style>{`
        /* PADRÃO 3D E VARIÁVEIS */
        .page-container {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          min-height: 100vh;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border-color);
          background: var(--header-bg);
          backdrop-filter: blur(10px);
        }
        .brand { font-size: 1.2rem; font-weight: 700; color: var(--text-color); }
        .grid-layout {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
            padding: 40px;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        /* CARD ITINERÁRIO (3D ELEVADO) */
        .itinerary-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 25px;
            border-radius: 12px;
            transition: 0.3s;
            /* Sombra 3D de elevação */
            box-shadow: 
                4px 4px 10px rgba(0, 0, 0, 0.2), 
                -4px -4px 10px rgba(255, 255, 255, 0.05);
        }
        .itinerary-card:hover { border-color: var(--primary); transform: translateY(-2px); }

        .card-header { margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 10px; }
        .card-title { color: var(--primary); font-size: 1.2rem; font-weight: 700; }
        .status-badge { 
            padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; 
            margin-top: 5px; display: inline-block; 
            color: #000;
        }
        .info-item { margin-bottom: 8px; color: #aaa; font-size: 0.9rem; }
        .info-item strong { color: var(--text-color); font-weight: 600; }

        .btn-action {
            border: none; padding: 10px; border-radius: 6px;
            font-weight: 700; cursor: pointer; margin-top: 15px; width: 100%;
            transition: 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .btn-action:hover {
            transform: translateY(1px);
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
        }
        .btn-start { background: var(--primary); color: #000; }
        .btn-details { background: #333; color: #fff; border: 1px solid #555; }
      `}</style>

      <header>
        <div className="brand">GreenLog<span>.</span> Motorista</div>
        <button onClick={() => navigate('/dashboard')} style={{ 
          background: 'var(--card-bg)', 
          color: 'var(--text-color)', 
          border: '1px solid var(--border-color)', 
          padding: '8px 16px', 
          borderRadius: 6, 
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          ← Voltar (Gerência)
        </button>
      </header>

      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '2rem', borderBottom: '1px solid #222', paddingBottom: '10px', color: 'var(--text-color)' }}>
            Agenda de Itinerários
        </h1>

        {loading && <p style={{ textAlign: 'center', color: 'var(--primary)' }}>Carregando agenda...</p>}
        
        {!loading && itineraries.length === 0 && <p style={{ textAlign: 'center', color: '#aaa' }}>Nenhum itinerário agendado.</p>}

        <div className="grid-layout">
          {itineraries.map(itin => (
            <div key={itin.id} className="itinerary-card">
              <div className="card-header">
                <div className="card-title">Rota #{itin.route.id}: {itin.route.name}</div>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(itin.status) }}
                >
                  {itin.status}
                </span>
              </div>
              
              <div className="info-item">
                Data: <strong>{new Date(itin.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</strong>
              </div>
              <div className="info-item">
                Caminhão: <strong>{itin.truck.plate} ({itin.truck.driverName})</strong>
              </div>
              <div className="info-item">
                Pontos de Coleta: <strong>{itin.route.points.length}</strong>
              </div>
              <div className="info-item">
                Resíduos Necessários: <strong>{truckWasteTypes.join(', ')}</strong>
              </div>

              {itin.status === 'SCHEDULED' && (
                <button 
                    onClick={() => handleUpdateStatus(itin.id, 'IN_PROGRESS')} 
                    className="btn-action btn-start"
                >
                    INICIAR ROTA AGORA
                </button>
              )}
              {itin.status === 'IN_PROGRESS' && (
                <button 
                    onClick={() => handleUpdateStatus(itin.id, 'COMPLETED')} 
                    className="btn-action"
                    style={{ background: '#2ecc71', color: 'white' }}
                >
                    FINALIZAR / CONCLUIR ROTA
                </button>
              )}
              {itin.status === 'COMPLETED' && (
                <button className="btn-action btn-details" disabled>
                    ROTA CONCLUÍDA
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}