describe('creacion de licencias', () => {
	it('creacion de ausente', () => {
		cy.visit('http://localhost:5173/licencias');

		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button[type="button"]');

		cy.get('select[name=agente]').select('TEST');
		cy.get('input[name=fechaInicio]').type('2023-01-23');
		cy.get('input[name=fechaFin]').type('2023-01-23');
		cy.get('input[name=observaciones]').type('esto es todo una prueba');
		cy.get('select[name=autorizadoSiape]').select('Si');
		cy.get('select[name=tipo]').select('ausente con aviso');

		cy.get('form button[type=button]').click();

		cy.get('form button[type=submit]').click();
	});
	it('creacion de academica', () => {
		cy.visit('http://localhost:5173/licencias');

		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button[type="button"]');

		cy.get('select[name=agente]').select('TEST');
		cy.get('input[name=fechaInicio]').type('2023-01-23');
		cy.get('input[name=fechaFin]').type('2023-01-26');
		cy.get('input[name=observaciones]').type('esto es todo una prueba academica');
		cy.get('select[name=autorizadoSiape]').select('Si');
		cy.get('select[name=tipo]').select('academica');

		// Informacion adicional necesaria para licencia academica
		cy.get('select[name=ultimaMateria]').select('No');

		cy.get('form button[type=button]').click();

		cy.get('form button[type=submit]').click();
	});
	it('creacion de salud', () => {
		cy.visit('http://localhost:5173/licencias');

		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button[type="button"]');

		cy.get('select[name=agente]').select('TEST');
		cy.get('input[name=fechaInicio]').type('2023-01-23');
		cy.get('input[name=fechaFin]').type('2023-01-26');
		cy.get('input[name=observaciones]').type('esto es todo una prueba saludable');
		cy.get('select[name=autorizadoSiape]').select('Si');
		cy.get('select[name=tipo]').select('salud');

		// Informacion adicional necesaria para licencia de Salud
		cy.get('input[name=concepto]').type('Un buen Concepto');

		cy.get('form button[type=button]').click();

		cy.get('form button[type=submit]').click();
	});
	it('creacion de teletrabajo', () => {
		cy.visit('http://localhost:5173/licencias');

		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button[type="button"]');

		cy.get('select[name=agente]').select('TEST');
		cy.get('input[name=fechaInicio]').type('2023-01-23');
		cy.get('input[name=fechaFin]').type('2023-01-26');
		cy.get('input[name=observaciones]').type('esto es todo una prueba teletrabajada');
		cy.get('select[name=autorizadoSiape]').select('Si');
		cy.get('select[name=tipo]').select('teletrabajo');

		// Informacion adicional necesaria para licencia de Teletrabajo
		cy.get('select[name=mailAutorizado]').select('Si');
		cy.get('select[name=comunicacionInicio]').select('Si');
		cy.get('select[name=comunicacionFin]').select('Si');
		cy.get('select[name=comunicoInicioA]').select('TEST');
		cy.get('select[name=comunicoFinA]').select('TEST');
		cy.get('select[name=conectadoATeams]').select('Si');

		cy.get('form button[type=button]').click();

		cy.get('form button[type=submit]').click();
	});
	it('creacion de vacaiones', () => {
		cy.visit('http://localhost:5173/licencias');

		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button[type="button"]');

		cy.get('select[name=agente]').select('TEST');
		cy.get('input[name=fechaInicio]').type('2023-01-23');
		cy.get('input[name=fechaFin]').type('2023-01-26');
		cy.get('input[name=observaciones]').type('esto es todo una prueba vacacional');
		cy.get('select[name=autorizadoSiape]').select('Si');
		cy.get('select[name=tipo]').select('vacaciones');

		// Informacion adicional necesaria para licencia de Vacaciones
		cy.get('select[name=periodo]').select('primero');

		cy.get('form button[type=button]').click();

		cy.get('form button[type=submit]').click();
	});
	it('creacion de otro', () => {
		cy.visit('http://localhost:5173/licencias');

		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button[type="button"]');

		cy.get('select[name=agente]').select('TEST');
		cy.get('input[name=fechaInicio]').type('2023-01-23');
		cy.get('input[name=fechaFin]').type('2023-01-26');
		cy.get('input[name=observaciones]').type('esto es todo una prueba vacacional');
		cy.get('select[name=autorizadoSiape]').select('Si');
		cy.get('select[name=tipo]').select('otro');

		cy.get('form button[type=button]').click();

		cy.get('form button[type=submit]').click();
	});
});
