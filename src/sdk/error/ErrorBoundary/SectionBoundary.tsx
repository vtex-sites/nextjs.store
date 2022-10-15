import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

class SectionBoundary extends Component<{
  children: ReactNode
  name: string
}> {
  public state = { hasError: false, error: null }

  public static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  // We can't accurately type the error here, since it could vary depending on
  // what caused it. This is not standardized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error(
      `Error while rendering secttion ${this.props.name} with:\n${error.message} ${errorInfo.componentStack}`
    )

    // TODO: Add fetch in here so we can know which sections are failing on our dashboard
  }

  public render() {
    if (this.state.hasError && process.env.NODE_ENV === 'production') {
      return null
    }

    return <section data-fs-boundary>{this.props.children}</section>
  }
}

export default SectionBoundary
