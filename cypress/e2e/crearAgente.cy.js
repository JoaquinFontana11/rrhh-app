describe('creacion de agente', () => {
	it('creacion de agente', () => {
		cy.visit('http://localhost:5173');

		// vamos a la pestaña de nomina
		cy.get('nav ul:nth-child(2) a:first-child').click();

		// abrimos el drawer con los input
		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button').click({ multiple: true });

		// introducimos los valores

		cy.get('input[name=DNI]').type('43521062');
		cy.get('input[name=CUIT]').type('20435210628');
		cy.get('input[name=fechaNacimiento]').type('2001-06-26');
		cy.get('input[name=domicilio]').type('7 n2094');
		cy.get('input[name=emailPersonal]').type('camilodipaolo@gmail.com');
		cy.get('input[name=emailInstitucional]').type('camilo.dipaolo@gba.gob.ar');
		cy.get('input[name=telefono]').type('2216424127');
		cy.get('input[name=categoria]').type('5');
		cy.get('input[name=curriculum]').type('https://unaurl.com');
		cy.get('input[name=agrupamiento]').type('agrupamiento');
		cy.get('input[name=genero]').type('masculino');
		cy.get('select[name=activo]').select('Si');
		cy.get('select[name=equipo]').select('equipo1');
		cy.get('select[name=direccion]').select('direccion1');
		cy.get('select[name=rol]').select('empleado');
		cy.get('input[name=superiorDirecto]').type('1');
		cy.get('select[name=tipoSangre]').select('A+');
		cy.get('select[name=IOMA]').select('Si');
		cy.get('select[name=carreraFinalizada]').select('No');
		cy.get('select[name=plantaTemporaria]').select('Si');
		cy.get('input[name=ingresoPlantaTemporaria]').type('2001-06-26');
		cy.get('input[name=bajaPTT]').type('2001-06-26');
		cy.get('input[name=ingresoCLS]').type('2001-06-26');
		cy.get('input[name=bajaCLS]').type('2001-06-26');

		// subimos el formulario
		cy.get('form input[type="submit"]').click();
	});
});
