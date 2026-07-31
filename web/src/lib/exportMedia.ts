export function triggerPrintPdf(): void {
  window.print();
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

export function exportFirstCanvasAsPng(
  selector = 'canvas',
  filename = `nol-canvas-${new Date().toISOString().slice(0, 10)}.png`
): boolean {
  const canvas = document.querySelector(selector);
  if (!(canvas instanceof HTMLCanvasElement)) {
    return false;
  }

  downloadCanvasAsPng(canvas, filename);
  return true;
}
