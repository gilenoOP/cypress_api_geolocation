import popup from "../components/popup"

class CreatePage {
    constructor() {
        this.popup = popup
    }

    go() {
        cy.goTo('/orphanages/create')
        cy.get('legend')
            .should('be.visible')
            .should('have.text', 'Cadastro')
    }

    form(orphanage) {
        cy.setMapLocation(orphanage.position)
        cy.get('#name').as('fieldName')
        cy.get('#description').as('fieldDesc')
        cy.get('input[type=file]').as('fieldImage')
        cy.get('#opening_hours').as('fieldOpenHours')

        orphanage.name ?
            cy.get('@fieldName').should('be.visible').type(orphanage.name) :
            cy.log('Empty name')
        orphanage.description ?
            cy.get('@fieldDesc').should('be.visible').type(orphanage.description) :
            cy.log('Empty description')
        orphanage.image ?
            cy.get('@fieldImage').selectFile('cypress/fixtures/images/' + orphanage.image, { force: true }) :
            cy.log('Empty image')
        orphanage.opening_hours ?
            cy.get('@fieldOpenHours').should('be.visible').type(orphanage.opening_hours) :
            cy.log('Empty opening hours')
        cy.contains('button', orphanage.open_on_weekends ? "Sim" : "Não")
            .click()
    }

    submit() {
        cy.get('.save-button')
            .should('be.visible')
            .should('have.text', 'Confirmar')
            .click({ force: true })
    }
}

export default new CreatePage()