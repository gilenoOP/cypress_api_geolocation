Cypress.Commands.add('setMapLocation', (position) => {
    window.localStorage.setItem('hope-qa:latitude', position.latitude)
    window.localStorage.setItem('hope-qa:longitude', position.longitude)
})

Cypress.Commands.add('postOrphanage', (orphanage) => {
    cy.fixture('images/' + orphanage.image, 'binary')
        .then((image) => Cypress.Blob.binaryStringToBlob(image, 'images/png'))
        .then((fileContent) => {
            const formData = new FormData();
            formData.append('name', orphanage.name);
            formData.append('description', orphanage.description);
            formData.append('latitude', orphanage.position.latitude);
            formData.append('longitude', orphanage.position.longitude);
            formData.append('opening_hours', orphanage.opening_hours);
            formData.append('open_on_weekends', orphanage.opening_hours);
            formData.append('images', fileContent, orphanage.image);

            cy.request({
                url: Cypress.env('baseApi') + '/orphanages',
                method: 'POST',
                headers: {
                    'content-type': 'multipart/form-data'
                },
                body: formData
            }).then(response => {
                expect(response.status).to.eq(201)
            })
        })
})

Cypress.Commands.add('goTo', (url, latitude = -22.79574300820038, longitude = -43.39738382826924) => {
    const mockGeolocation = (win, latitude, longitude) => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition', cb => {
            return cb({ coords: { latitude, longitude } })
        })
    }
    cy.visit(url, {
        onBeforeLoad: win => {
            mockGeolocation(win, latitude, longitude)
        }
    })
})

Cypress.Commands.add('accessOrphanage', (orphanageName) => {
    cy.get('.leaflet-marker-icon').as('orphList')
    cy.get('@orphList').each((ele, index, list) => {
        cy.get('@orphList').eq(index)
            .click({ force: true })
        cy.wait(500)
        cy.get('.leaflet-popup-content').as('divName')
        cy.get('@divName')
            .invoke('text')
            .then((txt) => {
                if (txt === orphanageName) {
                    cy.get('@divName')
                        .find('a')
                        .click({ force: true })
                    cy.contains('h1', orphanageName)
                        .should('be.visible')
                }
            })
    })
})

Cypress.Commands.add('googleMapsLink', (position) => {
    const googleLink = `https://www.google.com/maps/dir/?api=1&destination=${position.latitude},${position.longitude}`
    cy.contains('a', 'Ver rotas no Google Maps')
        .should('be.visible')
        .should('have.attr', 'href', googleLink)
        /*
        O CYPRESS NÃO FUNCIONA EM MAIS DE UMA ABA. A SOLUÇãO APLICADA ACIMA VALIDA SE O LINK QUE SERIA ABERTO EM OUTRA ABA ESTÁ CORRETO.
        EXISTEM OUTRAS SOLUÇÕES, COMO UTILIZAR A API DO `window.open`, UTILIZAR O PLUGIN DO CYPRESS `cypress-plugin-tab` OU RETIRAR O ATRIBUTO TARGET DO ELEMENTO, POIS QUANDO O ATRIBUTO TARGET É IGUAL A BLANK, ABRE OUTRA ABA.

        EXEMPLO DE RETIRADA DO ATRIBUTO TARGET DO ELEMENTO:
        .invoke('removeAttr', 'target')
        .click()
        */
})