import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPeritagens } from '../services/peritagemService';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        emAndamento: 0,
        aguardandoCompras: 0,
        aguardandoOrcamento: 0,
        finalizados: 0,
        clientesAtivos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getPeritagens();

                const statsUpdate = {
                    emAndamento: data.filter(p => p.stage_index > 0 && p.stage_index < 5).length,
                    aguardandoCompras: data.filter(p => p.status === 'Aguardando Compras').length,
                    aguardandoOrcamento: data.filter(p => p.status === 'Aguardando Orçamento' || p.status === 'Custos Inseridos').length,
                    finalizados: data.filter(p => p.status === 'Orçamento Finalizado').length,
                    clientesAtivos: new Set(data.map(p => p.cliente)).size
                };
                setStats(statsUpdate);
            } catch (error) {
                console.error('Erro ao buscar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // PERITO VIEW: Only show Monthly Analysis Chart
    if (user?.role === 'Perito') {
        return (
            <div>
                <h1 style={{ marginBottom: '1.5rem' }}>Painel do Perito</h1>

                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Total de Análises Mensal</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <PeritoAnalysisChart />
                    </div>
                </div>
            </div>
        );
    }

    // STANDARD VIEW (Gestor, Comprador, etc.)
    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Visão Geral do Sistema</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <KpiCard
                    title="Em Andamento"
                    value={loading ? '...' : stats.emAndamento}
                    icon="⏳"
                    color="var(--color-warning)"
                    onClick={() => navigate('/peritagens')}
                />
                <KpiCard
                    title="Aguardando Compras"
                    value={loading ? '...' : stats.aguardandoCompras}
                    icon="🛒"
                    color="#e67e22" // Orange
                    onClick={() => navigate('/pendentes-compras')}
                />
                <KpiCard
                    title="Aguardando Orçamento"
                    value={loading ? '...' : stats.aguardandoOrcamento}
                    icon="💰"
                    color="#27ae60" // Green
                    onClick={() => navigate('/pendentes-orcamento')}
                />
                <KpiCard
                    title="Finalizados"
                    value={loading ? '...' : stats.finalizados}
                    icon="✅"
                    color="var(--color-success)"
                    onClick={() => navigate('/peritagens')}
                />
                <KpiCard
                    title="Clientes Ativos"
                    value={loading ? '...' : stats.clientesAtivos}
                    icon="🏢"
                    color="var(--color-info)"
                    onClick={() => navigate('/peritagens')}
                />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Bar Chart: Clients */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Peritagens por Cliente (Top 5)</h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <Bar label="Cliente A" height="80%" />
                        <Bar label="Cliente B" height="60%" />
                        <Bar label="Cliente C" height="45%" />
                        <Bar label="Cliente D" height="30%" />
                        <Bar label="Cliente E" height="25%" />
                    </div>
                </div>

                {/* Donut Chart: Status */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Distribuição por Status</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DonutChart />
                    </div>
                </div>
            </div>

            {/* Line Chart: Monthly Evolution */}
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Evolução Mensal (2025)</h3>
                <div style={{ height: '200px', width: '100%' }}>
                    <LineChart />
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon, color, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: 'var(--color-surface)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }
            }}
        >
            <div style={{ fontSize: '2.5rem', marginRight: '1rem', color: color || 'var(--color-primary)' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</div>
            </div>
        </div>
    );
}

function Bar({ label, height }) {
    return (
        <div style={{ flex: 1, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer' }}>
            <div style={{ height: height, backgroundColor: 'var(--color-primary)', borderRadius: '4px 4px 0 0', width: '100%', opacity: 0.8, transition: 'opacity 0.2s' }}
                onMouseOver={(e) => e.target.style.opacity = 1}
                onMouseOut={(e) => e.target.style.opacity = 0.8}
            ></div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
        </div>
    )
}

function DonutChart() {
    // Simple pure CSS/SVG Donut
    // Data: Finished (Green), In Progress (Yellow), Pending (Blue)
    // Total 100. Let's say: 60% Finished, 25% In Progress, 15% Pending.
    // Circumference of r=16 is approx 100.
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {/* Background Circle */}
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="4" />

                    {/* Segment 1: Finished (Green) - 60% */}
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-success)" strokeWidth="4" strokeDasharray="60, 100" />

                    {/* Segment 2: In Progress (Yellow) - 25% (starts at 60%) */}
                    {/* transform not easy on path segments in simple svg without calc. 
                        Let's use slight transparency or just segments. 
                        Actually simpler: multiple circles on top of each other with different dashoffsets.
                    */}
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-warning)" strokeWidth="4" strokeDasharray="25, 100" strokeDashoffset="-60" />

                    {/* Segment 3: Pending (Red) - 15% (starts at 85%) */}
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-danger)" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-85" />
                </svg>
                {/* Center Text */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>124</span>
                    <span style={{ fontSize: '0.7rem', color: '#666' }}>Total</span>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
                    <span>Finalizados (60%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></div>
                    <span>Em Andamento (25%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></div>
                    <span>Pendentes (15%)</span>
                </div>
            </div>
        </div>
    );
}

function LineChart() {
    // Simple SVG Line Chart (12 months)
    // Jan-Dec data points (mock)
    const points = "0,90 9,85 18,80 27,60 36,70 45,50 54,40 63,45 72,30 81,35 90,20 100,15";

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', padding: '0 0 20px 30px' }}>
            {/* Y Axis Labels (Mock) */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.7rem', color: '#999' }}>
                <span>100</span>
                <span>50</span>
                <span>0</span>
            </div>

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Grid Lines */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#eee" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#eee" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#eee" strokeWidth="0.5" />

                {/* Line */}
                <polyline points={points} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                {/* Area under line */}
                <polygon points={`0,100 ${points} 100,100`} fill="var(--color-primary)" fillOpacity="0.1" />

                {/* Dots */}
                {[
                    [0, 90], [9, 85], [18, 80], [27, 60], [36, 70], [45, 50],
                    [54, 40], [63, 45], [72, 30], [81, 35], [90, 20], [100, 15]
                ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="1.5" fill="white" stroke="var(--color-primary)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
            </svg>

            {/* X Axis Labels */}
            <div style={{ position: 'absolute', left: '30px', right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#333', fontWeight: 'bold' }}>
                <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                <span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
            </div>
        </div>
    )
}

function PeritoAnalysisChart() {
    // Bar chart for individual Perito analysis count (12 months)
    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'end', gap: '0.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <Bar label="Jan" height="20%" />
            <Bar label="Fev" height="35%" />
            <Bar label="Mar" height="25%" />
            <Bar label="Abr" height="40%" />
            <Bar label="Mai" height="45%" />
            <Bar label="Jun" height="50%" />
            <Bar label="Jul" height="30%" />
            <Bar label="Ago" height="45%" />
            <Bar label="Set" height="60%" />
            <Bar label="Out" height="50%" />
            <Bar label="Nov" height="70%" />
            <Bar label="Dez" height="85%" />
        </div>
    );
}
