import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';





export const printIdCardsAsPDF = async (
  cardElements: HTMLElement[],
  filename: string = 'id-cards.pdf'
) => {
  try {
    // const html2canvas = (await import('html2canvas')).default;
    // const jsPDF = (await import('jspdf')).jsPDF;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;

    const pxToMm = (px: number) => px * 0.26458;

    const marginX = 10;
    const marginY = 10;
    const gapX = 5;
    const gapY = 5;

    let currentX = marginX;
    let currentY = marginY;
    let maxRowHeight = 0;

    for (let i = 0; i < cardElements.length; i++) {
      const element = cardElements[i];
     element.classList.add('print-layout');
      // Use real DOM size
      const rect = element.getBoundingClientRect();
      const cardWidthPx = rect.width;
      const cardHeightPx = rect.height;

      const cardWidth = pxToMm(cardWidthPx);
      const cardHeight = pxToMm(cardHeightPx);

      // Wrap row
      if (currentX + cardWidth > pageWidth - marginX) {
        currentX = marginX;
        currentY += maxRowHeight + gapY;
        maxRowHeight = 0;
      }

      // New page if overflows
      if (currentY + cardHeight > pageHeight - marginY) {
        pdf.addPage();
        currentX = marginX;
        currentY = marginY;
        maxRowHeight = 0;
      }

      // Slightly optimized scale
      const canvas = await html2canvas(element, {
        scale: 2, // ✨ Keeps good quality but lower than 3
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      // Use PNG for lossless quality
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', currentX, currentY, cardWidth, cardHeight);

      currentX += cardWidth + gapX;
      maxRowHeight = Math.max(maxRowHeight, cardHeight);
        element.classList.remove('print-layout');
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};






export const downloadCardAsImage = async (cardElement: HTMLElement, filename: string = 'id-card.png') => {
  try {
    // const html2canvas = (await import('html2canvas')).default;
    
    console.log(cardElement,"card");
    cardElement.classList.add('print-layout');
    const canvas = await html2canvas(cardElement, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true, // <-- THIS MUST BE TRUE
      logging: true, 
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
       cardElement.classList.remove('print-layout');
    
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    return false;
  }
};

export const printCardsDirectly = async (cardElements: HTMLElement[]) => {
  try {
    // const html2canvas = (await import('html2canvas')).default;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return false;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ID Cards</title>
          <style>
            body { margin: 0; padding: 20px; }
            .card-container { 
              display: inline-block; 
              margin: 10px; 
              page-break-inside: avoid;
            }
            @media print {
              .card-container { 
                width: 8.5cm; 
                height: 5.4cm; 
              }
            }
          </style>
        </head>
        <body>
    `);
    
    // Convert each card to image and add to print window
    for (const element of cardElements) {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      printWindow.document.write(`
        <div class="card-container">
          <img src="${imgData}" style="width: 100%; height: auto;" />
        </div>
      `);
    }
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Wait for images to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error printing cards:', error);
    return false;
  }
};