import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { SettingsErrorLogPanel } from '@/components/SettingsErrorLogPanel';
import { recordClientError } from '@/lib/observability/clientLogger';

describe('SettingsErrorLogPanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows empty state when there are no logs', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SettingsErrorLogPanel />
      </I18nextProvider>
    );

    expect(screen.getByText(/No client-side errors recorded yet/i)).toBeInTheDocument();
  });

  it('shows captured error entries', () => {
    recordClientError(new Error('panel error'));

    render(
      <I18nextProvider i18n={i18n}>
        <SettingsErrorLogPanel />
      </I18nextProvider>
    );

    expect(screen.getByText(/panel error/i)).toBeInTheDocument();
  });
});
