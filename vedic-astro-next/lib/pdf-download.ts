import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function downloadBirthChartPdf(
  element: HTMLElement,
  userName: string
): Promise<void> {
  const A4_W = 210; // mm
  const A4_H = 297;

  // Temporarily make visible for capture
  const orig = {
    position: element.style.position,
    left: element.style.left,
    opacity: element.style.opacity,
    zIndex: element.style.zIndex,
    pointerEvents: element.style.pointerEvents,
  };
  element.style.position = 'absolute';
  element.style.left = '0px';
  element.style.opacity = '1';
  element.style.zIndex = '9999';
  element.style.pointerEvents = 'none';

  // Find all page divs
  const pages = element.querySelectorAll<HTMLElement>('[data-pdf-page]');
  if (pages.length === 0) {
    Object.assign(element.style, orig);
    throw new Error('No PDF pages found');
  }

  const pdf = new jsPDF('p', 'mm', 'a4');

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFEFA',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
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
  }

  // Restore
  Object.assign(element.style, orig);

  // Download
  const safeName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  pdf.save(`${safeName}_Birth_Chart.pdf`);
}
