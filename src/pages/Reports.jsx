import { useState, useEffect } from 'react';
import { getPeritagens } from '../services/peritagemService';
import { generatePeritagemPDF } from '../services/pdfService';
import { FileText, Download, Search } from 'lucide-react';

export default function Reports() {
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
                console.error('Erro ao buscar peritagens para relatórios:', error);
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
            <h1 style={{ marginBottom: '1.5rem' }}>Central de Relatórios PDF</h1>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <Search color="var(--color-text-secondary)" />
                <input
                    type="text"
                    placeholder="Buscar peritagem por cliente ou ID para gerar relatório..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%' }}
                />
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando peritagens...</div>
                ) : filtered.map((item) => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.cliente} <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'normal' }}>#{item.id.slice(0, 8)}</span></h3>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>{item.equipamento} - {new Date(item.created_at || item.date).toLocaleDateString()}</div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '10px', backgroundColor: '#eee', color: '#555' }}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                            <button onClick={() => generatePeritagemPDF(item, 'sem_custo')} className="btn-report">
                                <FileText size={16} /> PDF Sem Custo
                            </button>
                            <button onClick={() => generatePeritagemPDF(item, 'comprador')} className="btn-report">
                                <FileText size={16} /> PDF Comprador
                            </button>
                            <button onClick={() => generatePeritagemPDF(item, 'orcamentista')} className="btn-report">
                                <FileText size={16} /> PDF Orçamentista
                            </button>
                            <button onClick={() => generatePeritagemPDF(item, 'cliente')} className="btn-report primary">
                                <Download size={16} /> PDF Cliente
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && filtered.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Nenhuma peritagem encontrada.</div>
                )}
            </div>

            <style>{`
                .btn-report {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background-color: white;
                    border: 1px solid #ddd;
                    color: #555;
                    padding: 0.5rem 1rem;
                    borderRadius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }
                .btn-report:hover {
                    background-color: #f9f9f9;
                    border-color: #ccc;
                }
                .btn-report.primary {
                    background-color: var(--color-primary);
                    color: white;
                    border-color: var(--color-primary);
                }
                .btn-report.primary:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
}
