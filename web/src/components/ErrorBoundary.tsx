import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryBase extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }: { error?: Error; onReset: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-2xl font-bold">{t('errors.generic')}</h1>
      {error && (
        <pre className="mb-6 max-w-xl overflow-auto rounded-md bg-slate-100 p-4 text-left text-sm dark:bg-slate-900">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={onReset}
        className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {t('errors.retry')}
      </button>
    </div>
  );
}

export function ErrorBoundary({ children }: Props) {
  return <ErrorBoundaryBase>{children}</ErrorBoundaryBase>;
}
