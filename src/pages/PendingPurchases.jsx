import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPeritagens } from '../services/peritagemService';
import { Search } from 'lucide-react';

export default function PendingPurchases() {
    const [peritagens, setPeritagens] = useState([]);
    const [filter, setFilter] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                setLoading(true);
                const data = await getPeritagens();
                const pending = data.filter(p => p.status === 'Aguardando Compras');
                setPeritagens(pending);
            } catch (error) {
                console.error('Erro ao buscar pendências:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const filtered = peritagens.filter(p =>
        p.cliente?.toLowerCase().includes(filter.toLowerCase()) ||
        p.id?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Aguardando Compras</h1>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <Search color="var(--color-text-secondary)" />
                <input
                    type="text"
                    placeholder="Buscar por cliente ou ID..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%' }}
                />
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Número</th>
                            <th style={{ padding: '1rem' }}>Cliente</th>
                            <th style={{ padding: '1rem' }}>Data</th>
                            <th style={{ padding: '1rem' }}>Equipamento</th>
                            <th style={{ padding: '1rem' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td>
                            </tr>
                        ) : filtered.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{item.id.slice(0, 8)}</td>
                                <td style={{ padding: '1rem' }}>{item.cliente}</td>
                                <td style={{ padding: '1rem' }}>{new Date(item.created_at || item.date).toLocaleDateString('pt-BR')}</td>
                                <td style={{ padding: '1rem' }}>{item.equipamento}</td>
                                <td style={{ padding: '1rem' }}>
                                    <Link to={`/peritagem/${item.id}`} style={{
                                        backgroundColor: '#e67e22',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold'
                                    }}>
                                        INSERIR CUSTOS
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                    Nenhuma peritagem aguardando compras.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
