import { describe, expect, it, vi, afterEach } from 'vitest';
import { downloadCanvasAsPng, exportFirstCanvasAsPng, triggerPrintPdf } from '@/lib/exportMedia';

describe('exportMedia', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('calls window.print for PDF export', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    triggerPrintPdf();
    expect(printSpy).toHaveBeenCalledTimes(1);
  });

  it('returns false when no canvas exists', () => {
    expect(exportFirstCanvasAsPng()).toBe(false);
  });

  it('exports first canvas as png when present', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    const dataSpy = vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,stub');
    document.body.appendChild(canvas);

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    const result = exportFirstCanvasAsPng('canvas', 'test.png');

    expect(result).toBe(true);
    expect(dataSpy).toHaveBeenCalledWith('image/png');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('downloads a specific canvas as png', () => {
    const canvas = document.createElement('canvas');
    const dataSpy = vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,stub');
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    downloadCanvasAsPng(canvas, 'manual.png');

    expect(dataSpy).toHaveBeenCalledWith('image/png');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
