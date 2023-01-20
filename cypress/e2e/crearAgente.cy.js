describe('creacion de agente', () => {
	it('creacion de agente', () => {
		cy.visit('http://localhost:5173/nomina');

		// vamos a la pestaña de nomina
		//		cy.get('nav ul:nth-child(2) a:first-child').click();

		// abrimos el drawer con los input
		cy.get('.toolbar > div >  button:last-child').should('have.class', 'highligth').click();

		// desplegamos los inputs
		cy.get('form button[type="button"]').click({ multiple: true });

		// introducimos los valores

		// datos personales
		cy.get('input[name=DNI]').type('43521062');
		cy.get('input[name=CUIT]').type('20435210628');
		cy.get('input[name=nombreCompleto]').type('Camilo Di Paolo');
		cy.get('input[name=fechaNacimiento]').type('2001-06-26');
		cy.get('input[name=domicilio]').type('7 n2094');
		cy.get('input[name=emailPersonal]').type('camilodipaolo@gmail.com');
		cy.get('input[name=emailInstitucional]').type('camilo.dipaolo@gba.gob.ar');
		cy.get('input[name=telefono]').type('2216424127');
		cy.get('input[name=curriculum]').type('https://unaurl.com');
		cy.get('select[name=genero]').select('Masculino');
		cy.get('select[name=activo]').select('Si');
		cy.get('select[name=equipo]').select('Analisis y Desarrollo de Sistemas');
		cy.get('select[name=direccion]').select('Direccion Povincial de Mejora Administrativa');
		cy.get('input[name=rol]').type('empleado');
		cy.get('select[name=superiorDirecto]').select('TEST');
		cy.get('select[name=tieneHijos]').select('No');
		cy.get('select[name=asignacionFamiliar]').select('No');
		cy.get('select[name=beneficioGuarderia]').select('No');

		// datos de salud
		cy.get('select[name=tipoSangre]').select('A+');
		cy.get('select[name=obraSocial]').select('IOMA');
		cy.get('input[name=telefonoContactoEmergencia]').type('10000000');
		cy.get('input[name=nombreContactoEmergencia]').type('contacto emergencia');

		// datos academicos
		cy.get('select[name=carreraFinalizada]').select('No');

		// datos recorrido
		cy.get('select[name=tipoContratacion]').select('Contrato de locacion de servicios');
		cy.get('input[name=fechaAltaCLS]').type('2023-01-01');
		cy.get('input[name=expedienteAltaCLS]').type('EX-2023-26041414- -TESTGDEBA-GDEBA');
		cy.get('input[name=actoAltaCLS]').type('EX-2023-27051515-TESTGDEBA-GDEBA');

		// validamos todo again
		cy.get('form button[type="button"]').click({ multiple: true });
		// subimos el formulario
		cy.get('form button[type="submit"]').click();
	});
});
