// src/components/ErrorBoundary.tsx
// ─────────────────────────────────────
// اگه یه صفحه کرش کرد، کل اپ نمیره!
// ─────────────────────────────────────

import { Component, type ReactNode } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MODO Error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <AlertTriangle size={32} style={{ color: 'var(--color-danger)' }} />
          </div>

          <h1
            className="text-xl font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            یه مشکلی پیش اومد
          </h1>

          <p
            className="text-sm mb-6 max-w-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            نگران نباش، داده‌هات سالمه. صفحه رو رفرش کن.
          </p>

          <div className="flex gap-3">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all active:scale-95"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <RefreshCw size={18} />
              رفرش صفحه
            </button>

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              تلاش مجدد
            </button>
          </div>

          {/* نمایش خطا برای دیباگ */}
          {this.state.error && (
            <details className="mt-8 max-w-md w-full text-left" dir="ltr">
              <summary
                className="text-xs cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                جزئیات خطا (برای توسعه‌دهنده)
              </summary>
              <pre
                className="mt-2 p-3 rounded-xl text-[10px] overflow-x-auto"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-danger)',
                }}
              >
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}