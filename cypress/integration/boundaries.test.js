// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for a11y (accessibility)
 */

import { cypress } from '../../store.config'

const { pages } = cypress

describe('Accessibility tests', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  it('checks min sections for home page', () => {
    cy.visit(pages.home)
    cy.waitForHydration()

    cy.get(`[data-fs-boundary="true"]`)
      .should('exist')
      .should('have.length.above', 3)
  })
})
