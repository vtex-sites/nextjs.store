import React, { ReactNode } from 'react'

type BestPracticesRuleProps = {
  componentGood: ReactNode
  componentBad: ReactNode
  descriptionGood: string
  descriptionBad: string
}

const BestPracticesRule = ({
  componentGood,
  componentBad,
  descriptionGood,
  descriptionBad,
}: BestPracticesRuleProps) => {
  return (
    <section className="sbdocs-best-practices-rule">
      <article>
        <div>{componentGood}</div>
        <article className="sbdocs-best-practices-text">
          <h3 className="sbdocs sbdocs-h3">
            <span role="img" aria-label="Check Mark">
              &#9989;
            </span>{' '}
            Do
          </h3>
          <p>{descriptionGood}</p>
        </article>
      </article>
      <article>
        <div>{componentBad}</div>
        <article className="sbdocs-best-practices-text">
          <h3 className="sbdocs sbdocs-h3">
            <span aria-label="Cross Mark">&#10060;</span> Don't
          </h3>
          <p>{descriptionBad}</p>
        </article>
      </article>
    </section>
  )
}

export default BestPracticesRule
