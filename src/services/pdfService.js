import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Keep in case we need mixed usage, though we'll likely do manual for main layout

// --- Constants & Config ---
const COLORS = {
    primary: '#004daa', // Hidracil/TrustEng Blue
    secondary: '#495057',
    text: '#212529',
    lightBg: '#f8f9fa',
    border: '#dee2e6',
    white: '#ffffff',
    success: '#28a745', // For approvals/badges
    warning: '#ffc107'
};

const PAGE = {
    width: 210,
    height: 297,
    margin: 10,
    contentWidth: 190
};

// --- Helper Functions ---
const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
};

export const generatePeritagemPDF = (peritagem, type) => {
    const doc = new jsPDF();
    let currentY = PAGE.margin;

    // --- Header Generator ---
    const drawHeader = () => {
        // Logo Placeholder or Text (Top Left)
        doc.setFillColor(COLORS.primary);
        doc.rect(PAGE.margin, PAGE.margin, 40, 20, 'F');
        doc.setTextColor(COLORS.white);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("HIDRACIL", PAGE.margin + 20, PAGE.margin + 12, { align: 'center' });

        // Company Info (Right of Logo)
        doc.setTextColor(COLORS.text);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        // doc.text("Rua Exemplo, 123 - Cidade/UF", PAGE.margin + 45, PAGE.margin + 5);
        // doc.text("Tel: (11) 99999-9999", PAGE.margin + 45, PAGE.margin + 10);

        // Report Title (Top Right)
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.primary);
        doc.text("RELATÓRIO TÉCNICO", PAGE.width - PAGE.margin, PAGE.margin + 8, { align: 'right' });

        // Subtitle (Type)
        doc.setFontSize(10);
        doc.setTextColor(COLORS.secondary);
        doc.text(type.toUpperCase().replace('_', ' '), PAGE.width - PAGE.margin, PAGE.margin + 14, { align: 'right' });

        // Info Box (Below Header)
        currentY = PAGE.margin + 25;

        doc.setDrawColor(COLORS.border);
        doc.setFillColor(COLORS.lightBg);
        doc.roundedRect(PAGE.margin, currentY, PAGE.contentWidth, 20, 3, 3, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(COLORS.secondary);

        // Column 1
        doc.text("CLIENTE:", PAGE.margin + 5, currentY + 6);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.text);
        doc.text(peritagem.cliente || "-", PAGE.margin + 5, currentY + 11);

        // Column 2
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.secondary);
        doc.text("EQUIPAMENTO:", PAGE.margin + 70, currentY + 6);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.text);
        doc.text(peritagem.equipamento || "N/A", PAGE.margin + 70, currentY + 11);

        // Column 3
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.secondary);
        doc.text("DATA:", PAGE.margin + 140, currentY + 6);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.text);
        doc.text(formatDate(peritagem.date || peritagem.createdAt), PAGE.margin + 140, currentY + 11);

        currentY += 25; // Space after info box
    };

    const drawFooter = (pageNumber) => {
        const totalPages = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(COLORS.secondary);
        doc.text(`Página ${pageNumber} de ${totalPages}`, PAGE.width / 2, PAGE.height - 10, { align: 'center' });
        doc.text("Gerado por Sistema Hidracil", PAGE.width - PAGE.margin, PAGE.height - 10, { align: 'right' });
    };

    // --- Initial Header ---
    drawHeader();

    // --- Items Loop ---
    doc.setFontSize(10);

    peritagem.items.forEach((item, index) => {
        // Calculate needed height for this item
        // A rough estimate: Base 40 + Image (opt) + Text lines
        // We will render text first to measure it.

        // Define column widths
        const colPhotoW = 40;
        const colContentW = type === 'sem_custo' ? 140 : 100;
        const colSideW = type === 'sem_custo' ? 0 : 40;

        const textAnomalias = doc.splitTextToSize(`Anomalias: ${item.anomalies || '-'}`, colContentW);
        const textSolucao = doc.splitTextToSize(`Solução: ${item.solution || '-'}`, colContentW);
        const textComponent = doc.splitTextToSize(`${item.component || 'Item sem nome'}`, colContentW);

        const linesHeight = (textAnomalias.length + textSolucao.length + textComponent.length) * 5;
        const itemHeight = Math.max(linesHeight + 20, 50); // Min height 50 (for photo space)

        // Page Break Check
        if (currentY + itemHeight > PAGE.height - PAGE.margin - 10) {
            doc.addPage();
            currentY = PAGE.margin; // Reset Y
            drawHeader(); // Re-draw header
        }

        // Draw Container
        doc.setDrawColor(COLORS.border);
        doc.setFillColor(COLORS.white);
        // doc.roundedRect(PAGE.margin, currentY, PAGE.contentWidth, itemHeight, 2, 2, 'S'); // Optional border for whole item

        // --- Photo Section (Left) ---
        const photoX = PAGE.margin;
        const photoY = currentY;

        // Background for photo area
        doc.setFillColor(COLORS.lightBg);
        doc.rect(photoX, photoY, colPhotoW, itemHeight, 'F');

        if (item.photos && item.photos.length > 0) {
            try {
                // Try to add the first image
                // doc.addImage assumes base64 jpeg/png
                doc.addImage(item.photos[0], 'JPEG', photoX + 2, photoY + 2, colPhotoW - 4, 30, undefined, 'FAST');
            } catch (e) {
                doc.setFontSize(6);
                doc.text("Erro img", photoX + 2, photoY + 10);
            }
        } else {
            doc.setFontSize(8);
            doc.setTextColor(COLORS.secondary);
            doc.text("Sem foto", photoX + 10, photoY + 15);
        }

        // --- Content Section (Middle) ---
        const contentX = photoX + colPhotoW + 5;
        let textY = currentY + 5;

        // Component Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.primary);
        doc.text(textComponent, contentX, textY);
        textY += (textComponent.length * 5) + 3;

        // Anomalies
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor('#dc3545'); // Red for anomalies
        doc.text(textAnomalias, contentX, textY);
        textY += (textAnomalias.length * 5) + 2;

        // Solution
        doc.setTextColor(COLORS.success); // Green for solution
        doc.text(textSolucao, contentX, textY);


        // --- Side Bar (Right) - Costs ---
        if (colSideW > 0) {
            const sideX = PAGE.width - PAGE.margin - colSideW;
            const sideY = currentY;

            // Separator Line
            doc.setDrawColor(COLORS.border);
            doc.line(sideX - 2, sideY, sideX - 2, sideY + itemHeight);

            let costY = sideY + 6;
            doc.setFontSize(8);
            doc.setTextColor(COLORS.secondary);

            if (type === 'comprador') {
                doc.text("Custo Estimado:", sideX, costY);
                doc.setFontSize(10);
                doc.setTextColor(COLORS.text);
                doc.text(formatCurrency(item.costs?.cost), sideX, costY + 5);

                costY += 15;
                doc.setFontSize(8);
                doc.setTextColor(COLORS.secondary);
                doc.text("Fornecedor:", sideX, costY);
                doc.setFontSize(9);
                doc.setTextColor(COLORS.text);
                // Wrap long supplier names
                const supText = doc.splitTextToSize(item.costs?.supplier || '-', colSideW - 2);
                doc.text(supText, sideX, costY + 5);
            }

            if (type === 'orcamentista' || type === 'cliente') {
                const isCliente = type === 'cliente';
                const label = isCliente ? "Valor Unit.:" : "Preço Venda:";

                doc.text(label, sideX, costY);
                doc.setFontSize(10);
                doc.setTextColor(COLORS.text);
                // Orcamentista sees 'sellPrice', Comprador saw 'cost'.
                // If this is client, they see the final price.
                const price = item.budget?.sellPrice || 0;
                doc.text(formatCurrency(price), sideX, costY + 5);

                if (isCliente) {
                    costY += 15;
                    doc.setFontSize(8);
                    doc.setTextColor(COLORS.secondary);
                    // doc.text("Total Item:", sideX, costY); // If qty exists
                }
            }
        }

        // Advance Y
        currentY += itemHeight + 5; // Margin between items

        // Draw separator line at bottom of item
        doc.setDrawColor(COLORS.border);
        doc.line(PAGE.margin, currentY - 2.5, PAGE.width - PAGE.margin, currentY - 2.5);

    });

    // --- Footer Loop to add page numbers ---
    // Note: jsPDF adds pages dynamically, so we can't easily jump back to add footers unless we use a different pattern.
    // However, we can simply number them at the end if we know how many pages.
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawFooter(i);
    }

    // Save
    doc.save(`Relatorio_${peritagem.id || 'Draft'}_${type}.pdf`);
};
