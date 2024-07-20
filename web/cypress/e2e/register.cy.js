/// <reference types='Cypress' />
import data from '../fixtures/orphanages.json'
import CreatePage from '../support/pages/create'

describe('Registration of orphanages', () => {
    context('Validate required fields', () => {
        it('register an orphanage without data', () => {
            CreatePage.go()
            CreatePage.submit()

            cy.contains('small', 'Informe a localizaçao no mapa')
                .should('be.visible')

            cy.contains('label', 'Nome')
                .parent()
                .find('small')
                .should('have.text', 'Campo obrigatório')

            cy.contains('label', 'Sobre')
                .parent()
                .find('small')
                .should('have.text', 'Campo obrigatório')

            cy.contains('label', 'Fotos')
                .parent()
                .find('small')
                .should('have.text', 'Envie pelo menos uma foto')

            cy.contains('label', 'Horário')
                .parent()
                .find('small')
                .should('have.text', 'Campo obrigatório')
        })

        it('register an orphanage without providing a location', () => {
            let orphanage = data.required
            orphanage.position.latitude = ''
            orphanage.position.longitude = ''
            CreatePage.go()
            CreatePage.form(orphanage)
            CreatePage.submit()
            cy.contains('.alert-error', 'Informe a localizaçao no mapa').should('be.visible')
        })

        it('register an orphanage without providing a name', () => {
            let orphanage = data.required
            orphanage.name = ''
            cy.setMapLocation(orphanage.position)
            CreatePage.go()
            CreatePage.form(orphanage)
            CreatePage.submit()
            cy.contains('.alert-error', 'Campo obrigatório')
                .should('be.visible')

        })

        it('register an orphanage without providing a description', () => {
            let orphanage = data.required
            orphanage.description = ''
            cy.setMapLocation(orphanage.position)
            CreatePage.go()
            CreatePage.form(orphanage)
            CreatePage.submit()
            cy.contains('.alert-error', 'Campo obrigatório')
                .should('be.visible')
        })

        it('register an orphanage without providing a description image', () => {
            let orphanage = data.required
            orphanage.image = ''
            cy.setMapLocation(orphanage.position)
            CreatePage.go()
            CreatePage.form(orphanage)
            CreatePage.submit()
            cy.contains('.alert-error', 'Envie pelo menos uma foto')
                .should('be.visible')
        })

        it('register an orphanage without providing an opening hours', () => {
            let orphanage = data.required
            orphanage.opening_hours = ''
            cy.setMapLocation(orphanage.position)
            CreatePage.go()
            CreatePage.form(orphanage)
            CreatePage.submit()
            cy.contains('.alert-error', 'Campo obrigatório')
                .should('be.visible')
        })

        it('register an orphanage', () => {
            const orphanage = data.create
            cy.deleteMany({ name: orphanage.name }, { collection: 'orphanages' })
            CreatePage.go()
            cy.setMapLocation(orphanage.position)
            CreatePage.form(orphanage)
            CreatePage.submit()
            CreatePage.popup.haveText('Uhull!', 'Orfanato cadastrado com sucesso.')
            cy.contains('button', 'Ok')
                .should('be.visible')
                .click()
            cy.get('.swal2-popup')
                .should('not.exist')
        })

        it('register a duplicate orphanage', () => {
            const orphanage = data.duplicate
            cy.deleteMany({ name: orphanage.name }, { collection: 'orphanages' })
            cy.postOrphanage(orphanage)
            CreatePage.go()
            cy.setMapLocation(orphanage.position)
            CreatePage.form(orphanage)
            CreatePage.submit()
            CreatePage.popup.haveText('Oops!', `Já existe um cadastro com o nome: ${orphanage.name}`)
            cy.contains('button', 'Voltar')
                .should('be.visible')
                .click()
            cy.get('.swal2-popup')
                .should('not.exist')
        })
    })
})