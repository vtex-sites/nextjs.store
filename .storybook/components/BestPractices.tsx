import React, { ReactNode } from 'react'

type BestPracticesProps = {
  title?: string
  description?: string
  children: ReactNode
}

const BestPractices = ({ children }: BestPracticesProps) => {
  return <section className="sbdocs sbdocs-best-practices">{children}</section>
}

export default BestPractices
