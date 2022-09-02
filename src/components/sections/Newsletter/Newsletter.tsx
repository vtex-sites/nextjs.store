import type { ComponentPropsWithRef, FormEvent, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import { Form, LoadingButton } from '@faststore/ui'

import InputText from 'src/components/ui/InputText'
import Select from 'src/components/ui/Select'
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
   * A subtitle for the section.
   */
  subtitle?: ReactNode
  /**
   * The card Variant
   */
  card?: boolean
  /**
   * The compact form of the Newsletter component
   */
  lite?: boolean
}

const Newsletter = forwardRef<HTMLFormElement, NewsletterProps>(
  function Newsletter({ title, subtitle, ...otherProps }, ref) {
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
      <Section data-fs-newsletter className={styles.fsNewsletter}>
        <Form
          data-fs-newsletter-form
          ref={ref}
          onSubmit={handleSubmit}
          {...otherProps}
        >
          <header data-fs-newsletter-header>
            <h3>{title}</h3>
            <span> {Boolean(subtitle) && subtitle}</span>
          </header>
          <div data-fs-newsletter-controls>
            <InputText
              inputRef={nameInputRef}
              id="newsletter-name"
              label="Your Name"
              required
            />
            <Select
              id="newsletter-options"
              options={{
                name_asc: 'Name, A-Z',
                name_desc: 'Name, Z-A',
              }}
              label="Area of Interest"
            />
            <InputText
              inputRef={emailInputRef}
              id="newsletter-email"
              label="Your Email"
              type="email"
              required
            />
            <LoadingButton type="submit" loading={loading}>
              Subscribe
            </LoadingButton>
          </div>
        </Form>
      </Section>
    )
  }
)

export default Newsletter
