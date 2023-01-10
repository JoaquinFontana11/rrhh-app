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

		cy.get('input[name=DNI]').type('43521062');
		cy.get('input[name=CUIT]').type('20435210628');
		cy.get('input[name=nombreCompleto]').type('Camilo Di Paolo');
		cy.get('input[name=fechaNacimiento]').type('2001-06-26');
		cy.get('input[name=domicilio]').type('7 n2094');
		cy.get('input[name=emailPersonal]').type('camilodipaolo@gmail.com');
		cy.get('input[name=emailInstitucional]').type('camilo.dipaolo@gba.gob.ar');
		cy.get('input[name=telefono]').type('2216424127');
		cy.get('input[name=categoria]').type('5');
		cy.get('input[name=curriculum]').type('https://unaurl.com');
		cy.get('input[name=agrupamiento]').type('agrupamiento');
		cy.get('select[name=genero]').select('Masculino');
		cy.get('select[name=activo]').select('Si');
		cy.get('select[name=equipo]').select('Analisis y Desarrollo de Sistemas');
		cy.get('select[name=direccion]').select('Direccion de Ingenieria de Procesos');
		cy.get('input[name=rol]').type('empleado');
		cy.get('select[name=superiorDirecto]').select('juan el director');

		cy.get('select[name=tipoSangre]').select('A+');
		cy.get('select[name=obraSocial]').select('IOMA');

		cy.get('select[name=carreraFinalizada]').select('No');

		cy.get('input[name=antiguedadCLS]').type('1');
		cy.get('input[name=antiguedadPPT]').type('1');
		cy.get('input[name=expTramitacionDesignacion]').type('EX-2022-123--GDEBA-TESTGDEBA');
		cy.get('input[name=expBajaPPT]').type('EX-2022-123--GDEBA-TESTGDEBA');
		cy.get('input[name=numSIAPE]').type('123456');
		cy.get('input[name=resoDesignacion]').type('EX-2022-123-GDEBA-TESTGDEBA');
		cy.get('select[name=plantaTemporaria]').select('Si');
		cy.get('input[name=ingresoPlantaTemporaria]').type('2001-06-26');
		cy.get('input[name=bajaPTT]').type('2001-06-26');
		cy.get('input[name=ingresoCLS]').type('2001-06-26');
		cy.get('input[name=bajaCLS]').type('2001-06-26');

		// validamos todo again
		cy.get('form button[type="button"]').click({ multiple: true });
		// subimos el formulario
		cy.get('form button[type="submit"]').click();
	});
});
