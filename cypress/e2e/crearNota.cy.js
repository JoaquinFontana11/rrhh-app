describe('creacion de notas', () => {
	it('creacion de nota', () => {
		cy.visit('http://localhost:5173/notas');

		cy.get('.toolbar > div > div >  button:last-child').should('have.class', 'highligth').click();

		cy.get('select[name=alerta]').select('urgente');
		cy.get('select[name=modulo]').select('nomina');
		cy.get('textArea[name=contenido]').type('nota de prueba pa probar cosas');

		cy.get('button[type=button]').click();
	});
});
