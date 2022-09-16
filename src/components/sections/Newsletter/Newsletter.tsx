import type { ComponentPropsWithRef, FormEvent, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import { Form } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'
import Button from 'src/components/ui/Button'
import InputText from 'src/components/ui/InputText'
import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'

import Section from '../Section'
import styles from './newsletter.module.scss'

export interface NewsletterProps
  extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit'> {
  /**
   * Title for the section.
   */
  title: ReactNode
  /**
   * A description for the section.
   */
  description?: ReactNode
  /**
   * The card Variant
   */
  card?: boolean
  /**
   * The compact version of the Newsletter component
   */
  lite?: boolean
}

const Newsletter = forwardRef<HTMLFormElement, NewsletterProps>(
  function Newsletter(
    { title, description, card = false, lite = false, ...otherProps },
    ref
  ) {
    const { subscribeUser, loading } = useNewsletter()
    const nameInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault()
      subscribeUser({
        data: {
          name: nameInputRef.current?.value ?? '',
          email: emailInputRef.current?.value ?? '',
        },
      })

      const formElement = event.currentTarget as HTMLFormElement

      formElement.reset()
    }

    return (
      <Section
        data-fs-newsletter={card ? 'card' : ''}
        className={`${styles.fsNewsletter} layout__section`}
      >
        <Form
          data-fs-newsletter-form
          ref={ref}
          onSubmit={handleSubmit}
          {...otherProps}
          className="layout__content"
        >
          <header data-fs-newsletter-header>
            <h3>
              <Icon name="Envelop" width={32} height={32} />
              {title}
            </h3>
            <span> {Boolean(description) && description}</span>
          </header>

          <div data-fs-newsletter-controls>
            {lite ? (
              <InputText
                inputRef={emailInputRef}
                id="newsletter-email"
                label="Your Email"
                type="email"
                required
                actionable
                onSubmit={() => {}}
                onClear={() => {}}
                buttonActionText="Subscribe"
                displayClearButton={false}
              />
            ) : (
              <>
                <InputText
                  inputRef={nameInputRef}
                  id="newsletter-name"
                  label="Your Name"
                  required
                />
                <InputText
                  inputRef={emailInputRef}
                  id="newsletter-email"
                  label="Your Email"
                  type="email"
                  required
                />
                <Button variant="secondary" inverse type="submit">
                  {loading ? 'Loading...' : 'Subscribe'}
                </Button>
              </>
            )}
          </div>
        </Form>
      </Section>
    )
  }
)

export default Newsletter
