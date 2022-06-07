import React, { ReactNode } from 'react'

type BestPracticesRuleProps = {
  recommendedUsage: ReactNode
  discourageUsage: ReactNode
  recommendedDescription: string
  discourageDescription: string
}

const BestPracticesRule = ({
  recommendedUsage,
  discourageUsage,
  recommendedDescription,
  discourageDescription,
}: BestPracticesRuleProps) => {
  return (
    <section className="sbdocs-best-practices-rule">
      <article>
        <div>{recommendedUsage}</div>
        <article className="sbdocs-best-practices-text">
          <h3 className="sbdocs sbdocs-h3">
            <span role="img" aria-label="Check Mark">
              &#9989;
            </span>{' '}
            Do
          </h3>
          <p>{recommendedDescription}</p>
        </article>
      </article>
      <article>
        <div>{discourageUsage}</div>
        <article className="sbdocs-best-practices-text">
          <h3 className="sbdocs sbdocs-h3">
            <span aria-label="Cross Mark">&#10060;</span> Don't
          </h3>
          <p>{discourageDescription}</p>
        </article>
      </article>
    </section>
  )
}

export default BestPracticesRule
