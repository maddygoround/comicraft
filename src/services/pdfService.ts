import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ComicPanel } from '../types';

export interface PDFGenerationOptions {
    title?: string;
    author?: string;
    includePageNumbers?: boolean;
    includeTitlePage?: boolean;
}

export const generateComicPDF = async (
    panels: ComicPanel[],
    options: PDFGenerationOptions = {}
): Promise<Blob> => {
    const {
        title = 'Comic Craft Comic',
        author = 'Comic Craft',
        includePageNumbers = true,
        includeTitlePage = true
    } = options;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);

    let currentPage = 0;

    // Add title page if requested
    if (includeTitlePage) {
        pdf.addPage();
        currentPage++;

        // Title
        pdf.setFontSize(32);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });

        // Author
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`by ${author}`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });

        // Generated with Comic Craft
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Generated with Comic Craft', pageWidth / 2, pageHeight - 50, { align: 'center' });

        // Reset text color
        pdf.setTextColor(0, 0, 0);
    }

    // Process each panel
    for (let i = 0; i < panels.length; i++) {
        const panel = panels[i];

        // Add new page for each panel (except first if no title page)
        if (i > 0 || includeTitlePage) {
            pdf.addPage();
            currentPage++;
        }

        // Add page number if requested
        if (includePageNumbers) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
            pdf.setTextColor(0, 0, 0);
        }

        // Add panel number
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Panel ${panel.panelNumber}`, margin, margin + 10);

        // Add narration
        if (panel.narration) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            const narrationY = margin + 25;
            const narrationLines = pdf.splitTextToSize(panel.narration, contentWidth);
            pdf.text(narrationLines, margin, narrationY);
        }

        // Add character dialogues
        if (panel.characters && panel.characters.length > 0) {
            let dialogueY = margin + 50;

            for (const character of panel.characters) {
                if (character.dialogue) {
                    pdf.setFontSize(11);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(`${character.name}:`, margin, dialogueY);

                    pdf.setFont('helvetica', 'normal');
                    const dialogueLines = pdf.splitTextToSize(character.dialogue, contentWidth - 30);
                    pdf.text(dialogueLines, margin + 20, dialogueY);

                    dialogueY += dialogueLines.length * 5 + 5;
                }
            }
        }

        // Add generated image if available
        if (panel.generatedImage) {
            try {
                // Convert base64 image to canvas
                const img = new Image();
                img.crossOrigin = 'anonymous';

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = panel.generatedImage;
                });

                // Calculate image dimensions to fit in content area
                const maxImageWidth = contentWidth;
                const maxImageHeight = contentHeight - 100; // Leave space for text

                let imageWidth = img.width;
                let imageHeight = img.height;

                // Scale down if too large
                if (imageWidth > maxImageWidth) {
                    const scale = maxImageWidth / imageWidth;
                    imageWidth = maxImageWidth;
                    imageHeight = imageHeight * scale;
                }

                if (imageHeight > maxImageHeight) {
                    const scale = maxImageHeight / imageHeight;
                    imageHeight = maxImageHeight;
                    imageWidth = imageWidth * scale;
                }

                // Center the image
                const imageX = margin + (contentWidth - imageWidth) / 2;
                const imageY = margin + 80;

                // Add image to PDF
                pdf.addImage(
                    panel.generatedImage,
                    'JPEG',
                    imageX,
                    imageY,
                    imageWidth,
                    imageHeight
                );
            } catch (error) {
                console.error('Error adding image to PDF:', error);
                // Add placeholder text if image fails
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'italic');
                pdf.setTextColor(150, 150, 150);
                pdf.text('Image could not be loaded', margin, margin + 80);
                pdf.setTextColor(0, 0, 0);
            }
        }
    }

    // Generate PDF blob
    return pdf.output('blob');
};

export const downloadComicPDF = async (
    panels: ComicPanel[],
    filename: string = 'comic-craft-comic.pdf',
    options?: PDFGenerationOptions
): Promise<void> => {
    try {
        const pdfBlob = await generateComicPDF(panels, options);

        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw new Error('Failed to download PDF');
    }
};
