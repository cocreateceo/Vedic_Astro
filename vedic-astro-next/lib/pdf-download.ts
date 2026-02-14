import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function downloadBirthChartPdf(
  element: HTMLElement,
  userName: string
): Promise<void> {
  const A4_W = 210; // mm
  const A4_H = 297;

  // Save original styles
  const orig = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    opacity: element.style.opacity,
    zIndex: element.style.zIndex,
    pointerEvents: element.style.pointerEvents,
  };

  // Make visible for html2canvas but keep OFF-SCREEN so user doesn't see it
  element.style.position = 'fixed';
  element.style.left = '-9999px';
  element.style.top = '0px';
  element.style.opacity = '1';
  element.style.zIndex = '-1';
  element.style.pointerEvents = 'none';

  try {
    // Find all page divs
    const pages = element.querySelectorAll<HTMLElement>('[data-pdf-page]');
    if (pages.length === 0) {
      throw new Error('No PDF pages found');
    }

    const totalPages = pages.length;
    const pdf = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFEFA',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgW = A4_W;
      const imgH = (canvas.height / canvas.width) * imgW;

      if (i > 0) pdf.addPage();

      // If page is taller than A4, scale to fit
      if (imgH > A4_H) {
        const scale = A4_H / imgH;
        const scaledW = imgW * scale;
        const xOffset = (A4_W - scaledW) / 2;
        pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledW, A4_H);
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgW, imgH);
      }

      // Footer: page number centered at bottom
      const pageNum = i + 1;
      const footerY = A4_H - 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(150, 130, 90); // muted gold
      pdf.text(
        `Page ${pageNum} of ${totalPages}`,
        A4_W / 2,
        footerY,
        { align: 'center' }
      );
      // Thin decorative line above page number
      pdf.setDrawColor(200, 180, 130);
      pdf.setLineWidth(0.3);
      pdf.line(30, footerY - 3, A4_W - 30, footerY - 3);
    }

    // Set PDF page labels so Adobe Reader "Go to page" starts at 1
    const pdfInternal = pdf.internal as Record<string, unknown>;
    const events = pdfInternal.events as { subscribe: (event: string, cb: () => void) => void };
    events.subscribe('putCatalog', function (this: void) {
      const out = pdfInternal.out as (s: string) => void;
      out('/PageLabels << /Nums [0 << /S /D /St 1 >>] >>');
    });

    // Download
    const safeName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    pdf.save(`${safeName}_Birth_Chart.pdf`);
  } finally {
    // Always restore original styles, even if an error occurs
    Object.assign(element.style, orig);
  }
}
