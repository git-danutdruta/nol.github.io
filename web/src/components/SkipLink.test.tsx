import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { SkipLink } from '@/components/SkipLink';

describe('SkipLink', () => {
  it('renders a skip-to-content link', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkipLink />
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
    });
  });
});
