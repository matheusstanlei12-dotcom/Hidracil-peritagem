import jsPDF from 'jspdf';

const COLORS = {
    primary: '#006945',      // Hidracil Green
    primaryLight: '#E8F5E9', // Soft Green for blocks
    secondary: '#1A1A1A',    // Deep Black for titles
    text: '#374151',         // Gray for body text
    border: '#D1D5DB',       // Light Border
    accent: '#059669',       // Accent Green
    white: '#FFFFFF',
    red: '#DC2626'
};

const PAGE = {
    w: 210,
    h: 297,
    m: 15, // Slightly larger margins for a modern look
    cw: 180
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

export const generatePeritagemPDF = (peritagem, type) => {
    const doc = new jsPDF();
    let currentY = 0;

    // --- CAPA ---
    const drawCover = () => {
        // Logo center
        doc.setFillColor(COLORS.white);
        try {
            // Using a rectangle as placeholder for logo if not available, 
            // but in Hidracil we expect logo.png to exist in public.
            doc.addImage("/logo.png", "PNG", (PAGE.w / 2) - 40, 40, 80, 40);
        } catch (e) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.setTextColor(COLORS.primary);
            doc.text("HIDRACIL", PAGE.w / 2, 60, { align: 'center' });
        }

        // Title Section
        doc.setDrawColor(COLORS.primary);
        doc.setLineWidth(1);
        doc.line(PAGE.m, 110, PAGE.w - PAGE.m, 110);

        doc.setFontSize(26);
        doc.setTextColor(COLORS.secondary);
        doc.setFont('helvetica', 'bold');
        doc.text("RELATÓRIO TÉCNICO", PAGE.w / 2, 130, { align: 'center' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.text);
        doc.text("PERITAGEM E ANÁLISE DE EQUIPAMENTOS", PAGE.w / 2, 140, { align: 'center' });

        doc.line(PAGE.m, 150, PAGE.w - PAGE.m, 150);

        // Client Info Block on Cover
        currentY = 180;
        doc.setFillColor(COLORS.primaryLight);
        doc.roundedRect(PAGE.m, currentY, PAGE.cw, 50, 3, 3, 'F');

        doc.setFontSize(10);
        doc.setTextColor(COLORS.primary);
        doc.setFont('helvetica', 'bold');
        doc.text("DADOS DO CLIENTE E EQUIPAMENTO", PAGE.m + 5, currentY + 10);

        doc.setTextColor(COLORS.secondary);
        doc.setFontSize(11);
        doc.text(`CLIENTE: ${peritagem.cliente || "-"}`, PAGE.m + 5, currentY + 22);
        doc.text(`EQUIPAMENTO: ${peritagem.equipamento || "-"}`, PAGE.m + 5, currentY + 30);
        doc.text(`ORÇAMENTO: #${peritagem.orcamento || peritagem.id || "-"}`, PAGE.m + 5, currentY + 38);

        // Footer Cover
        doc.setFontSize(9);
        doc.setTextColor(COLORS.text);
        doc.text(`Goiânia, ${formatDate(peritagem.created_at || new Date())}`, PAGE.w / 2, PAGE.h - 20, { align: 'center' });
        doc.text("www.hidracil.com.br", PAGE.w / 2, PAGE.h - 15, { align: 'center' });
    };

    // --- CABEÇALHO TÉCNICO (V4.0) ---
    const drawTechnicalHeader = () => {
        currentY = 10;

        // 1. Logo and Company Info Grid
        try {
            doc.addImage("/logo.png", "PNG", PAGE.m, currentY, 45, 20);
        } catch (e) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(COLORS.primary);
            doc.text("HIDRACIL", PAGE.m, currentY + 12);
        }

        doc.setFontSize(12);
        doc.setTextColor(COLORS.secondary);
        doc.setFont('helvetica', 'bold');
        doc.text("Hidracil Componentes Hidráulicos Ltda", 80, currentY + 5);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.text);
        doc.text("CNPJ: 00.376.390/0001-07", 80, currentY + 10);
        doc.text("I.E.: 10.271.903-9", 140, currentY + 10);
        doc.text("Fone: (62) 4006-5151", 80, currentY + 14);
        doc.text("Fax: (62) 4006-5130", 140, currentY + 14);
        doc.text("Rua Guararapes, 120 Qd.34 Lt.01    Bairro Ipiranga", 80, currentY + 18);

        currentY += 28;

        // 2. Main Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.secondary);
        doc.text("RELATÓRIO TÉCNICO", PAGE.w / 2, currentY, { align: 'center' });

        currentY += 5;

        // 3. Rounded Box 1: Cliente
        doc.setDrawColor(COLORS.secondary);
        doc.setLineWidth(1.2);
        const boxH1 = 30;
        doc.roundedRect(PAGE.m, currentY, PAGE.cw, boxH1, 5, 5, 'D');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text("Cliente:", PAGE.m + 5, currentY + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(peritagem.cliente || "-", PAGE.m + 20, currentY + 8);

        doc.setFont('helvetica', 'bold');
        doc.text("Endereço:", PAGE.m + 5, currentY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text(peritagem.endereco || "-", PAGE.m + 24, currentY + 15);

        doc.setFont('helvetica', 'bold');
        doc.text("Bairro:", PAGE.w / 2 + 20, currentY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text(peritagem.bairro || "-", PAGE.w / 2 + 35, currentY + 15);

        doc.setFont('helvetica', 'bold');
        doc.text("Município:", PAGE.m + 5, currentY + 22);
        doc.setFont('helvetica', 'normal');
        doc.text(peritagem.municipio || peritagem.cidade || "-", PAGE.m + 24, currentY + 22);

        doc.setFont('helvetica', 'bold');
        doc.text("UF:", PAGE.w / 2 + 20, currentY + 22);
        doc.setFont('helvetica', 'normal');
        doc.text(peritagem.uf || "-", PAGE.w / 2 + 28, currentY + 22);

        currentY += boxH1 + 2;

        // 4. Rounded Box 2: Equipamento
        const boxH2 = 55;
        doc.roundedRect(PAGE.m, currentY, PAGE.cw, boxH2, 5, 5, 'D');

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("IDENTIFICAÇÃO DO EQUIPAMENTO", PAGE.w / 2, currentY + 10, { align: 'center' });

        doc.setFontSize(9);
        doc.text("Orçamento:", PAGE.m + 5, currentY + 20);
        doc.setFont('helvetica', 'normal');
        doc.text(String(peritagem.orcamento || "-"), PAGE.m + 28, currentY + 20);

        doc.setFont('helvetica', 'bold');
        doc.text("Equipamento:", PAGE.m + 5, currentY + 27);
        doc.setFont('helvetica', 'normal');
        const equipText = doc.splitTextToSize(peritagem.equipamento || "-", PAGE.cw - 30);
        doc.text(equipText, PAGE.m + 30, currentY + 27);

        doc.setFont('helvetica', 'bold');
        doc.text("CX:", PAGE.m + 5, currentY + 34);
        doc.setFont('helvetica', 'normal');
        doc.text(String(peritagem.cx || "-"), PAGE.m + 15, currentY + 34);

        doc.setFont('helvetica', 'bold');
        doc.text("TAG:", PAGE.m + 5, currentY + 41);
        doc.setFont('helvetica', 'normal');
        doc.text(String(peritagem.tag || "-"), PAGE.m + 15, currentY + 41);

        doc.setFont('helvetica', 'bold');
        doc.text("NF:", PAGE.m + 5, currentY + 48);
        doc.setFont('helvetica', 'normal');
        doc.text(String(peritagem.nf || "-"), PAGE.m + 15, currentY + 48);

        currentY += boxH2 + 15;

        // 5. Responsible and Date footer of Header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("Responsável:", PAGE.w / 2 - 30, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(peritagem.responsavel_tecnico || peritagem.perito_name || "-", PAGE.w / 2 - 5, currentY);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const city = peritagem.cidade || "Goiânia";
        doc.text(`${city}, ${formatDate(peritagem.created_at || new Date())}`, PAGE.w - PAGE.m, currentY, { align: 'right' });

        currentY += 10;
        doc.setLineWidth(0.1);
        doc.line(PAGE.m, currentY, PAGE.w - PAGE.m, currentY);
        currentY += 10;
    };

    // --- CONTENT HEADER (simplified version for other pages) ---
    const drawHeader = () => {
        currentY = PAGE.m;
        try {
            doc.addImage("/logo.png", "PNG", PAGE.m, currentY, 30, 15);
        } catch (e) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(COLORS.primary);
            doc.text("HIDRACIL", PAGE.m, currentY + 10);
        }

        doc.setFontSize(8);
        doc.setTextColor(COLORS.text);
        doc.setFont('helvetica', 'normal');
        doc.text(`Relatório #${peritagem.orcamento || peritagem.id}`, PAGE.w - PAGE.m, currentY + 5, { align: 'right' });
        doc.text(`Equipamento: ${peritagem.equipamento}`, PAGE.w - PAGE.m, currentY + 10, { align: 'right' });

        currentY += 20;
        doc.setDrawColor(COLORS.border);
        doc.setLineWidth(0.1);
        doc.line(PAGE.m, currentY, PAGE.w - PAGE.m, currentY);
        currentY += 10;
    };

    // 1. Initial Cover (now the technical header)
    drawTechnicalHeader();

    peritagem.items.forEach((item, idx) => {
        // Space Check
        if (currentY + 60 > PAGE.h - PAGE.m) {
            doc.addPage();
            drawHeader();
        }

        // Technical Block Header
        doc.setFillColor(COLORS.primary);
        doc.rect(PAGE.m, currentY, PAGE.cw, 8, 'F');
        doc.setTextColor(COLORS.white);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`ITEM ${idx + 1}: ${item.component?.toUpperCase() || "COMPONENTE"}`, PAGE.m + 5, currentY + 5.5);

        currentY += 8;

        // Metadata Grid (Anomalia / Solução)
        const blockH = 25;
        doc.setFillColor(COLORS.primaryLight);
        doc.rect(PAGE.m, currentY, PAGE.cw, blockH, 'F');

        doc.setFontSize(8);
        doc.setTextColor(COLORS.accent);
        doc.text("ANOMALIA IDENTIFICADA:", PAGE.m + 5, currentY + 6);
        doc.setTextColor(COLORS.secondary);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        // Use splitTextToSize for long text
        const anomalyLines = doc.splitTextToSize(item.anomalies || "Nenhuma anomalia relatada.", PAGE.cw - 10);
        doc.text(anomalyLines, PAGE.m + 5, currentY + 11);

        doc.setDrawColor(COLORS.border);
        doc.line(PAGE.m + 5, currentY + 13, PAGE.w - PAGE.m - 5, currentY + 13);

        const solutionY = currentY + 18;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.accent);
        doc.text("SOLUÇÃO RECOMENDADA:", PAGE.m + 5, solutionY);
        doc.setTextColor(COLORS.secondary);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const solutionLines = doc.splitTextToSize(item.solution || "Manutenção padrão / Limpeza.", PAGE.cw - 10);
        doc.text(solutionLines, PAGE.m + 5, solutionY + 5);

        currentY += blockH + 10;

        // Extra info (Custo/Valor) - discreet
        if (type === 'comprador' || type === 'orcamentista' || type === 'cliente') {
            doc.setFontSize(8);
            doc.setTextColor(COLORS.text);
            let label = "";
            let val = "";
            if (type === 'comprador') {
                label = "CUSTO ESTIMADO:";
                val = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.costs?.cost || 0);
            } else {
                label = "VALOR UNITÁRIO:";
                val = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.budget?.sellPrice || 0);
            }
            doc.setFont('helvetica', 'bold');
            doc.text(label, PAGE.m, currentY - 5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLORS.accent);
            doc.text(val, PAGE.m + 35, currentY - 5);
        }

        // PHOTOS GRID
        if (item.photos && item.photos.length > 0) {
            const photoW = 86;
            const photoH = 58;
            const gap = 8;

            item.photos.forEach((photo, pIdx) => {
                const col = pIdx % 2;
                const x = PAGE.m + (col * (photoW + gap));

                if (col === 0 && currentY + photoH + 15 > PAGE.h - PAGE.m) {
                    doc.addPage();
                    drawHeader();
                }

                try {
                    // Frame
                    doc.setDrawColor(COLORS.border);
                    doc.setLineWidth(0.1);
                    doc.rect(x, currentY, photoW, photoH);
                    doc.addImage(photo, 'JPEG', x + 1, currentY + 1, photoW - 2, photoH - 2);

                    // Technical Caption
                    doc.setFontSize(7);
                    doc.setTextColor(COLORS.text);
                    doc.setFont('helvetica', 'italic');
                    doc.text(`Registro ${idx + 1}.${pIdx + 1}: Vista técnica do componente ${item.component || ""}`, x, currentY + photoH + 5);
                } catch (e) {
                    doc.text("Erro ao processar imagem", x + 5, currentY + 20);
                }

                if (col === 1 || pIdx === item.photos.length - 1) {
                    currentY += photoH + 15;
                }
            });
        }

        currentY += 5; // spacing between items
    });

    // --- SIGNATURES SECTION (LAST PAGE) ---
    // Check space for signature
    if (currentY + 40 > PAGE.h - PAGE.m - 20) {
        doc.addPage();
        drawHeader();
        currentY = 60; // Start higher on empty last page
    } else {
        currentY += 20;
    }

    const sigW = 75;
    const sigY = currentY + 15;

    doc.setDrawColor(COLORS.secondary);
    doc.setLineWidth(0.5);

    // Left Sig: Hidracil
    doc.line(PAGE.m, sigY, PAGE.m + sigW, sigY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.secondary);
    doc.text("HIDRACIL COMPONENTES HIDRÁULICOS LTDA", PAGE.m + (sigW / 2), sigY + 5, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    doc.text("RESPONSÁVEL TÉCNICO / ENGENHARIA", PAGE.m + (sigW / 2), sigY + 9, { align: 'center' });

    // Right Sig: Cliente
    const rightSigX = PAGE.w - PAGE.m - sigW;
    doc.line(rightSigX, sigY, PAGE.w - PAGE.m, sigY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.secondary);
    doc.text("ACEITE DO CLIENTE", rightSigX + (sigW / 2), sigY + 5, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    doc.text("RESPONSÁVEL / DATA: ___/___/___", rightSigX + (sigW / 2), sigY + 9, { align: 'center' });


    // --- GLOBAL FOOTER (ON ALL PAGES) ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor("#9CA3AF"); // Light Gray (Discreet)
        doc.setFont('helvetica', 'normal');

        const footerY = PAGE.h - 15;
        const footerText = `HIDRACIL Componentes Hidráulicos | Documento Gerado em ${new Date().toLocaleDateString('pt-BR')} | Página ${i} de ${totalPages}`;
        doc.text(footerText, PAGE.w / 2, footerY, { align: 'center' });

        doc.setFontSize(7);
        doc.text("Documento técnico gerado automaticamente pelo sistema TrustEng", PAGE.w / 2, footerY + 4, { align: 'center' });
    }

    doc.save(`Relatório_Técnico_Hidracil_${peritagem.orcamento || "Draft"}.pdf`);
};
