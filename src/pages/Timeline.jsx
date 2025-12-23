import { useState } from 'react';
import {
    ChevronRight,
    X,
    FileText,
    CheckSquare,
    ShoppingCart,
    DollarSign,
    Zap,
    User,
    Calendar,
    Clock
} from 'lucide-react';

export default function Timeline() {
    // Current user context mock
    const currentUser = { name: "Matheus Stanley (Programador)", role: "Programador" };

    // Controlled state: usually this would come from props or API
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [modalStage, setModalStage] = useState(null);

    const stages = [
        {
            id: 0,
            label: 'PERITAGEM CRIADA',
            role: 'PERITO',
            icon: FileText,
            exec_date: '22/12/2025', exec_time: '17:49', responsible: 'João Perito'
        },
        {
            id: 1,
            label: 'PERITAGEM FINALIZADA',
            role: 'PERITO',
            icon: CheckSquare,
            exec_date: null, exec_time: null, responsible: null
        },
        {
            id: 2,
            label: 'AGUARDANDO COMPRAS',
            role: 'COMPRADOR',
            icon: ShoppingCart,
            exec_date: null, exec_time: null, responsible: null
        },
        {
            id: 3,
            label: 'CUSTOS INSERIDOS',
            role: 'COMPRADOR',
            icon: DollarSign,
            exec_date: null, exec_time: null, responsible: null
        },
        {
            id: 4,
            label: 'AGUARDANDO ORÇAMENTO',
            role: 'ORÇAMENTISTA',
            icon: Zap,
            exec_date: null, exec_time: null, responsible: null
        },
        {
            id: 5,
            label: 'ORÇAMENTO FINALIZADO',
            role: 'ORÇAMENTISTA',
            icon: CheckSquare,
            exec_date: null, exec_time: null, responsible: null
        },
    ];

    const currentStageData = stages[currentStageIndex];

    const handleCardClick = (stage) => {
        setModalStage(stage);
    };

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#999', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px' }}>
                        <Clock size={16} />
                        MONITORAMENTO DE PROCESSO
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>Etapa atual:</span>
                        <span style={{ color: '#1A7F3C' }}>{currentStageData.label}</span>
                    </div>
                </div>

                {/* Responsible Sector Card */}
                <div style={{
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    padding: '0.75rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}>
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%', border: '2px solid #1A7F3C',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#1A7F3C'
                    }}>
                        <User size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: '700', textTransform: 'uppercase' }}>SETOR RESPONSÁVEL</div>
                        <div style={{ fontSize: '1rem', fontWeight: '800' }}>{currentStageData.role}</div>
                    </div>
                </div>
            </div>

            {/* Timeline Cards Container */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {stages.map((stage, index) => {
                    const isActive = index === currentStageIndex;
                    const isPassed = index < currentStageIndex;
                    // Colors based on mocks
                    // Active: Yellow/Gold background #F4D03F
                    // Inactive/Future: Beige/Pinkish #E6C2BF (approximate from image) - actually looks like a soft rose/brown
                    // Let's use a soft rose color #Dbbdbd or similar.

                    const cardBg = isActive ? '#FFD700' : '#D4B8B8'; // Adjusted to match "pinkish-beige"
                    const cardInnerSquare = isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.3)';
                    const textColor = isActive ? 'black' : '#5a4a4a';

                    return (
                        <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>

                            {/* Card */}
                            <div
                                onClick={() => handleCardClick(stage)}
                                style={{
                                    width: '180px',
                                    height: '180px',
                                    backgroundColor: cardBg,
                                    borderRadius: '24px',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    boxShadow: isActive ? '0 10px 25px rgba(255, 215, 0, 0.3)' : 'none',
                                    opacity: isPassed ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {/* Step Number */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    opacity: 0.6
                                }}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                {/* Icon Square */}
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: cardInnerSquare,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <stage.icon size={24} color="#333" strokeWidth={2.5} />
                                </div>

                                {/* Label */}
                                <div style={{
                                    textAlign: 'center',
                                    fontWeight: '800',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.2',
                                    marginBottom: '0.25rem',
                                    color: '#2c2c2c'
                                }}>
                                    {stage.label}
                                </div>

                                {/* Role */}
                                <div style={{
                                    textAlign: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    color: 'rgba(0,0,0,0.5)',
                                    textTransform: 'uppercase'
                                }}>
                                    {stage.role}
                                </div>

                                {/* Active Badge */}
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-12px',
                                        backgroundColor: 'black',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        padding: '0.25rem 1rem',
                                        borderRadius: '20px',
                                        letterSpacing: '0.5px',
                                        animation: 'pulse 1.5s infinite',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                    }}>
                                        ATIVO
                                    </div>
                                )}
                            </div>

                            {/* Chevron Arrow */}
                            {index < stages.length - 1 && (
                                <div style={{ margin: '0 0.5rem', color: '#ccc' }}>
                                    <ChevronRight size={32} strokeWidth={3} />
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>

            {/* Footer Legend */}
            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#F8F9FA', borderRadius: '16px' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2ecc71' }}></div>
                        EXECUTADO
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFD700' }}></div>
                        ETAPA ATUAL
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#e74c3c' }}></div>
                        PENDENTE
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', fontWeight: '700', color: '#aaa', fontStyle: 'italic' }}>
                    <div>CLIQUE NOS CARDS PARA VER DETALHES</div>
                    <div>ID: PER-2025-0001</div>
                </div>
            </div>


            {/* MODAL */}
            {modalStage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(3px)'
                }} onClick={() => setModalStage(null)}>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '2rem',
                            width: '450px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                            position: 'relative'
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '50px', height: '50px',
                                    border: '1px solid #eee', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <modalStage.icon size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{modalStage.label}</h3>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: '#9FABBA', letterSpacing: '0.5px' }}>INFORMAÇÕES DE EXECUÇÃO</p>
                                </div>
                            </div>
                            <button onClick={() => setModalStage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="#333" />
                            </button>
                        </div>

                        {/* Info Rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Date Row */}
                            <div style={{ backgroundColor: '#F8F9FB', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', border: '1px solid #EAEAEA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A7F3C' }}>
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#9FABBA', textTransform: 'uppercase' }}>EXECUTADO EM</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#333' }}>
                                        {modalStage.exec_date || '--/--/----'}
                                    </div>
                                </div>
                            </div>

                            {/* Time Row */}
                            <div style={{ backgroundColor: '#F8F9FB', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', border: '1px solid #EAEAEA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A7F3C' }}>
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#9FABBA', textTransform: 'uppercase' }}>HORÁRIO</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#333' }}>
                                        {modalStage.exec_time || '--:--'}
                                    </div>
                                </div>
                            </div>

                            {/* User Row */}
                            <div style={{ backgroundColor: '#F8F9FB', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', border: '1px solid #EAEAEA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A7F3C' }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#9FABBA', textTransform: 'uppercase' }}>RESPONSÁVEL</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#333' }}>
                                        {modalStage.responsible || (currentUser ? currentUser.name : '--')}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                                        {modalStage.responsible ? 'RESPONSÁVEL TÉCNICO' : currentUser.role}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setModalStage(null)}
                            style={{
                                width: '100%',
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '30px',
                                marginTop: '2rem',
                                fontSize: '0.8rem',
                                fontWeight: '800',
                                border: 'none',
                                cursor: 'pointer',
                                letterSpacing: '1px'
                            }}
                        >
                            FECHAR DETALHES
                        </button>

                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
                }
            `}</style>
        </div>
    );
}
