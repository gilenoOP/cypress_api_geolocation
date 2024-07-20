class Popup {
    haveText(text1, text2) {
        cy.get('#swal2-title')
            .should('be.visible')
        cy.get('#swal2-title')
            .then(($element1) => {
                const msg1 = $element1
                if (msg1 === text1) {
                    cy.get('#swal2-html-container')
                        .should('be.visible')
                    cy.get('#swal2-html-container')
                        .then(($element2) => {
                            const msg2 = $element2.text().trim()
                            expect(msg2).to.eq(text2)
                        })
                } else {
                    cy.get('#swal2-title')
                        .should('have.text', text1)
                    cy.get('#swal2-html-container')
                        .should('be.visible')
                    cy.get('#swal2-html-container')
                        .then(($element2) => {
                            const msg2 = $element2.text().trim()
                            expect(msg2).to.eq(text2)
                        })
                }
            })
    }
}

export default new Popup()