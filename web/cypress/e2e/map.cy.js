/// <reference types='Cypress' />

import data from '../fixtures/orphanages.json'

describe('Map', () => {
    it('Choose a orphanage in the map', () => {
        const orphanage = data.map
        cy.deleteMany({ name: orphanage.name }, { collection: 'orphanages' })
        cy.postOrphanage(orphanage)
        cy.goTo('/map')
        cy.accessOrphanage(orphanage.name)
        cy.googleMapsLink(orphanage.position)
    })
})