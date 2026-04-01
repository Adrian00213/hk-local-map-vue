import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-zinc-50 p-4">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-zinc-800 mb-2">發生錯誤</h2>
            <p className="text-sm text-zinc-600 mb-4">
              {this.state.error?.message || '未知錯誤'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium"
            >
              重新載入
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
