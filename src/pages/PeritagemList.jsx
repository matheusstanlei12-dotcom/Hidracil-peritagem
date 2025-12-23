import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPeritagens } from '../services/peritagemService';
import { PlusCircle, Search } from 'lucide-react';

export default function PeritagemList() {
    const [peritagens, setPeritagens] = useState([]);
    const [filter, setFilter] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPeritagens = async () => {
            try {
                setLoading(true);
                const data = await getPeritagens();
                setPeritagens(data);
            } catch (error) {
                console.error('Erro ao carregar peritagens:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPeritagens();
    }, []);

    const filtered = peritagens.filter(p =>
        p.cliente?.toLowerCase().includes(filter.toLowerCase()) ||
        p.id?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Todas as Peritagens</h1>
                <Link to="/nova-peritagem" style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--border-radius-sm)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: '600'
                }}>
                    <PlusCircle size={20} style={{ marginRight: '0.5rem' }} />
                    Nova Peritagem
                </Link>
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
                            <th style={{ padding: '1rem' }}>Número da Peritagem</th>
                            <th style={{ padding: '1rem' }}>Cliente</th>
                            <th style={{ padding: '1rem' }}>Data da Execução</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Prioridade</th>
                            <th style={{ padding: '1rem' }}>Verificar Análise</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Carregando peritagens...</td>
                            </tr>
                        ) : filtered.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{item.id.slice(0, 8)}</td>
                                <td style={{ padding: '1rem' }}>{item.cliente}</td>
                                <td style={{ padding: '1rem' }}>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        backgroundColor: item.status === 'Orçamento Finalizado' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(244, 208, 63, 0.2)',
                                        color: item.status === 'Orçamento Finalizado' ? 'var(--color-success)' : '#d4ac0d',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600'
                                    }}>
                                        {item.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{item.prioridade || 'Normal'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <Link to={`/peritagem/${item.id}`} style={{ marginRight: '1rem', color: 'var(--color-primary)', fontWeight: '500' }}>ABRIR</Link>
                                </td>
                            </tr>
                        ))}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                    Nenhuma peritagem encontrada.
                                </td>
                            </tr>
                        ) || null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
