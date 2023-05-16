import type { Action, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

const create: Action = async ({ request }) => {
	const data = await request.formData();

	const CLS = {
		fechaBajaCLS: data.get('fechaBajaCLS') || null,
		referenciaBajaCLS: data.get('referenciaBajaCLS') || null,
		antiguedadExternaCLS: data.get('antiguedadExternaCLS') || null,
		fechaAltaCLS: data.get('fechaAltaCLS') || null,
		expedienteAltaCLS: data.get('expedienteAltaCLS') || null,
		actoAltaCLS: data.get('actoAltaCLS') || null
	};

	const PP = {
		fechaBajaPP: data.get('fechaBajaPP') || null,
		referenciaBajaPP: data.get('referenciaBajaPP') || null,
		antiguedadExternaPP: data.get('antiguedadExternaPP') || null,
		fechaAltaPP: data.get('fechaAltaPP') || null,
		expedienteAltaPP: data.get('expedienteAltaPP') || null,
		actoAltaPP: data.get('actoAltaPP') || null,
		categoriaPP: data.get('categoriaPP') || null,
		agrupamiento: data.get('agrupamientoPP') || null,
		numSiapePP: data.get('numSiapePP') || null
	};

	const PTT = {
		fechaBajaPTT: data.get('fechaBajaPTT') || null,
		referenciaBajaPTT: data.get('referenciaBajaPTT') || null,
		antiguedadExternaPTT: data.get('antiguedadExternaPTT') || null,
		fechaAltaPTT: data.get('fechaAltaPTT') || null,
		expedienteAltaPTT: data.get('expedienteAltaPTT') || null,
		actoAltaPTT: data.get('actoAltaPTT') || null,
		categoriaPTT: data.get('categoriaPTT') || null,
		agrupamiento: data.get('agrupamientoPTT') || null,
		numSiapePTT: data.get('numSiapePTT') || null
	};

	const { data: dataCLS, error: errorCLS }: { data: any; error: any } = await supabase
		.from('contratoCLS')
		.insert(CLS)
		.select();

	const { data: dataPP, error: errorPP }: { data: any; error: any } = await supabase
		.from('contratoPP')
		.insert(PP)
		.select();

	const { data: dataPTT, error: errorPTT }: { data: any; error: any } = await supabase
		.from('contratoPTT')
		.insert(PTT)
		.select();

	if (errorCLS || errorPP || errorPTT) {
		if (dataCLS) await supabase.from('CLS').delete().eq('id', dataCLS[0].id);
		if (dataPP) await supabase.from('PP').delete().eq('id', dataPP[0].id);
		if (dataPTT) await supabase.from('PTT').delete().eq('id', dataPTT[0].id);
		const message = errorCLS
			? {
					error: 'Contrato CLS',
					description: errorCLS.details ? errorCLS.details + '' : errorCLS.message + ''
			  }
			: errorPP
			? {
					error: 'Contrato PP',
					description: errorPP.details ? errorPP.details + '' : errorPP.message + ''
			  }
			: {
					error: 'Contrato PTT',
					description: errorPTT.details ? errorPTT.details + '' : errorPTT.message + ''
			  };
		throw error(400, { message: message });
	}

	const datosAcademicos = {
		carreraUniversitaria: data.get('carreraUniversitaria'),
		carreraPostgrado: data.get('carreraPostgrado'),
		carreraFinalizada: data.get('carreraFinalizada')
	};
	const datosSalud = {
		obraSocial: data.get('obraSocial'),
		tipoSangre: data.get('tipoSangre'),
		medicamentos: data.get('medicamentos'),
		consideracion: data.get('consideracion'),
		telefonoContactoEmergencia: data.get('telefonoContactoEmergencia'),
		nombreContactoEmergencia: data.get('nombreContactoEmergencia'),
		obraSocialActiva: data.get('obraSocialActiva')
	};
	const datosRecorrido = {
		tipoContratacion: data.get('tipoContratacion'),
		CLS: dataCLS[0].id,
		PP: dataPP[0].id,
		PTT: dataPTT[0].id
	};

	const { data: dataSalud, error: errorSalud }: { data: any; error: any } = await supabase
		.from('datosSalud')
		.insert(datosSalud)
		.select();
	const { data: dataAcademico, error: errorAcademico }: { data: any; error: any } = await supabase
		.from('datosAcademicos')
		.insert(datosAcademicos)
		.select();
	const { data: dataRecorrido, error: errorRecorrido }: { data: any; error: any } = await supabase
		.from('datosRecorrido')
		.insert(datosRecorrido)
		.select();
	console.log(dataSalud, errorSalud);
	console.log(dataAcademico, errorAcademico);
	console.log(dataRecorrido, errorRecorrido);

	if (errorSalud || errorAcademico || errorRecorrido) {
		if (dataSalud) await supabase.from('datosSalud').delete().eq('id', dataSalud[0].id);
		if (dataAcademico)
			await supabase.from('datosAcademicos').delete().eq('id', dataAcademico[0].id);
		if (dataRecorrido) await supabase.from('datosRecorrido').delete().eq('id', dataRecorrido[0].id);
		const message = errorSalud
			? {
					error: 'Datos de Salud',
					description: errorSalud.details ? errorSalud.details + '' : errorSalud.message + ''
			  }
			: errorAcademico
			? {
					error: 'Datos Academicos',
					description: errorAcademico.details
						? errorAcademico.details + ''
						: errorAcademico.message + ''
			  }
			: {
					error: 'Datos Institucionales',
					description: errorRecorrido.details
						? errorRecorrido.details + ''
						: errorRecorrido.message + ''
			  };
		throw error(400, { message: message });
	}

	const agente = {
		DNI: data.get('DNI'),
		CUIT: data.get('CUIT'),
		nombreCompleto: data.get('nombreCompleto'),
		fechaNacimiento: data.get('fechaNacimiento'),
		domicilio: data.get('domicilio'),
		emailPersonal: data.get('emailPersonal'),
		emailInstitucional: data.get('emailInstitucional'),
		telefono: data.get('telefono'),
		curriculum: data.get('curriculum'),
		genero: data.get('genero'),
		superiorDirecto: data.get('superiorDirecto'),
		datosSalud: dataSalud[0].id,
		datosAcademicos: dataAcademico[0].id,
		equipo: data.get('equipo'),
		datosRecorrido: dataRecorrido[0].id,
		rol: data.get('rol'),
		direccion: data.get('direccion'),
		activo: data.get('activo'),
		tieneHijos: data.get('tieneHijos'),
		asignacionFamiliar: data.get('asignacionFamiliar'),
		beneficioGuarderia: data.get('beneficioGuarderia')
	};

	const { data: dataAgente, error: errorAgente } = await supabase
		.from('agente')
		.insert(agente)
		.select();
	console.log(data);
	console.log(agente);
	console.log(dataAgente, errorAgente);
	if (errorAgente) {
		if (dataSalud) await supabase.from('datosSalud').delete().eq('id', dataSalud[0].id);
		if (dataAcademico)
			await supabase.from('datosAcademicos').delete().eq('id', dataAcademico[0].id);
		if (dataRecorrido) await supabase.from('datosRecorrido').delete().eq('id', dataRecorrido[0].id);
		const message = {
			error: 'Datos Personales',
			description: errorAgente.details ? errorAgente.details + '' : errorAgente.message + ''
		};
		throw error(400, { message: message });
	}
};

// TODO: ACTUALIZAR CON LOS NUEVOS DATOS
const update: Action = async ({ request }) => {
	const data = await request.formData();

	const CLS = {
		fechaBajaCLS: data.get('fechaBajaCLS') || null,
		referenciaBajaCLS: data.get('referenciaBajaCLS') || null,
		antiguedadExternaCLS: data.get('antiguedadExternaCLS') || null,
		fechaAltaCLS: data.get('fechaAltaCLS') || null,
		expedienteAltaCLS: data.get('expedienteAltaCLS') || null,
		actoAltaCLS: data.get('actoAltaCLS') || null
	};

	const PP = {
		fechaBajaPP: data.get('fechaBajaPP') || null,
		referenciaBajaPP: data.get('referenciaBajaPP') || null,
		antiguedadExternaPP: data.get('antiguedadExternaPP') || null,
		fechaAltaPP: data.get('fechaAltaPP') || null,
		expedienteAltaPP: data.get('expedienteAltaPP') || null,
		actoAltaPP: data.get('actoAltaPP') || null,
		categoriaPP: data.get('categoriaPP') || null,
		agrupamientoPP: data.get('agrupamientoPP') || null,
		numSiapePP: data.get('numSiapePP') || null
	};

	const PTT = {
		fechaBajaPTT: data.get('fechaBajaPTT') || null,
		referenciaBajaPTT: data.get('referenciaBajaPTT') || null,
		antiguedadExternaPTT: data.get('antiguedadExternaPTT') || null,
		fechaAltaPTT: data.get('fechaAltaPTT') || null,
		expedienteAltaPTT: data.get('expedienteAltaPTT') || null,
		actoAltaPTT: data.get('actoAltaPTT') || null,
		categoriaPTT: data.get('categoriaPTT') || null,
		agrupamientoPTT: data.get('agrupamientoPTT') || null,
		numSiapePTT: data.get('numSiapePTT') || null
	};

	const datosAcademicos = {
		carreraUniversitaria: data.get('carreraUniversitaria'),
		carreraPostgrado: data.get('carreraPostgrado'),
		carreraFinalizada: data.get('carreraFinalizada')
	};
	const datosSalud = {
		obraSocial: data.get('obraSocial'),
		tipoSangre: data.get('tipoSangre'),
		medicamentos: data.get('medicamentos'),
		consideracion: data.get('consideracion'),
		telefonoContactoEmergencia: data.get('telefonoContactoEmergencia'),
		nombreContactoEmergencia: data.get('nombreContactoEmergencia'),
		obraSocialActiva: data.get('obraSocialActiva')
	};
	const datosRecorrido = {
		tipoContratacion: data.get('tipoContratacion')
	};

	const agente = {
		DNI: data.get('DNI'),
		CUIT: data.get('CUIT'),
		nombreCompleto: data.get('nombreCompleto'),
		fechaNacimiento: data.get('fechaNacimiento'),
		domicilio: data.get('domicilio'),
		emailPersonal: data.get('emailPersonal'),
		emailInstitucional: data.get('emailInstitucional'),
		telefono: data.get('telefono'),
		curriculum: data.get('curriculum'),
		genero: data.get('genero'),
		superiorDirecto: data.get('superiorDirecto'),
		equipo: data.get('equipo'),
		rol: data.get('rol'),
		direccion: data.get('direccion'),
		activo: data.get('activo'),
		tieneHijos: data.get('tieneHijos'),
		asignacionFamiliar: data.get('asignacionFamiliar'),
		beneficioGuarderia: data.get('beneficioGuarderia')
	};
	console.log(datosSalud);

	const { data: currentAgente, error: errorAgente }: { data: any; error: any } = await supabase
		.from('agente')
		.select('*')
		.eq('DNI', data.get('DNI'));
	console.log(currentAgente);
	const { data: currentSalud, error: errorSalud }: { data: any; error: any } = await supabase
		.from('datosSalud')
		.select('*')
		.eq('id', currentAgente[0].datosSalud);
	const { data: currentAcademico, error: errorAcademico }: { data: any; error: any } =
		await supabase.from('datosAcademicos').select('*').eq('id', currentAgente[0].datosAcademicos);
	const { data: currentRecorrido, error: errorRecorrido }: { data: any; error: any } =
		await supabase.from('datosRecorrido').select('*').eq('id', currentAgente[0].datosRecorrido);

	if (errorAgente || errorSalud || errorAcademico || errorRecorrido) {
		const message = errorSalud
			? {
					error: 'Datos de Salud',
					description: errorSalud.details ? errorSalud.details + '' : errorSalud.message + ''
			  }
			: errorAcademico
			? {
					error: 'Datos Academicos',
					description: errorAcademico.details
						? errorAcademico.details + ''
						: errorAcademico.message + ''
			  }
			: errorRecorrido
			? {
					error: 'Datos Institucionales',
					description: errorRecorrido.details
						? errorRecorrido.details + ''
						: errorRecorrido.message + ''
			  }
			: {
					error: 'Datos Personales',
					description: errorAgente.details ? errorAgente.details + '' : errorAgente.message + ''
			  };
		throw error(400, { message: message });
	}

	const { data: currentCLS, error: errorCLS }: { data: any; error: any } = await supabase
		.from('contratoCLS')
		.select('*')
		.eq('id', currentRecorrido[0].CLS);
	const { data: currentPP, error: errorPP }: { data: any; error: any } = await supabase
		.from('contratoPP')
		.select('*')
		.eq('id', currentRecorrido[0].PP);
	const { data: currentPTT, error: errorPTT }: { data: any; error: any } = await supabase
		.from('contratoPTT')
		.select('*')
		.eq('id', currentRecorrido[0].PTT);

	if (errorCLS || errorPP || errorPTT) {
		const message = errorCLS
			? {
					error: 'Contrato CLS',
					description: errorCLS.details ? errorCLS.details + '' : errorCLS.message + ''
			  }
			: errorPP
			? {
					error: 'Contrato PP',
					description: errorPP.details ? errorPP.details + '' : errorPP.message + ''
			  }
			: errorPTT
			? {
					error: 'Contrato PTT',
					description: errorPTT.details ? errorPTT.details + '' : errorPTT.message + ''
			  }
			: {
					error: 'Datos Personales',
					description: errorAgente.details ? errorAgente.details + '' : errorAgente.message + ''
			  };
		throw error(400, { message: message });
	}

	// actualizamos los datos
	// TODO: estaria bueno hacer esto una transaccion, pero por el momento no se puede hacer con supabase
	// una alternativa es usar funciones PLSQL pero por el momento estan el alpha en supabase

	let newDataCLS,
		newDataPP,
		newDataPTT = false;
	let updateCLSError,
		updatePPError,
		updatePTTError = false;

	if (currentCLS[0].id !== 0) {
		const { data, error } = await supabase
			.from('contratoCLS')
			.update(CLS)
			.eq('id', currentCLS[0].id);
		newDataCLS = data;
		updateCLSError = error;
	} else if (CLS.fechaAltaCLS) {
		const { data, error }: { data: any; error: any } = await supabase
			.from('contratoCLS')
			.insert(CLS)
			.select();

		newDataCLS = data;
		updateCLSError = error;
	}
	if (currentPP[0].id !== 0) {
		const { data, error } = await supabase.from('contratoPP').update(PP).eq('id', currentPP[0].id);

		newDataPP = data;
		updatePPError = error;
	} else if (PP.fechaAltaPP) {
		const { data, error }: { data: any; error: any } = await supabase
			.from('contratoPP')
			.insert(PP)
			.select();

		newDataPP = data;
		updatePPError = error;
	}
	if (currentPTT[0].id !== 0) {
		const { data, error } = await supabase
			.from('contratoPTT')
			.update(PTT)
			.eq('id', currentPTT[0].id);

		newDataPTT = data;
		updatePTTError = error;
	} else if (PTT.fechaAltaPTT) {
		const { data, error }: { data: any; error: any } = await supabase
			.from('contratoPTT')
			.insert(PTT)
			.select();

		newDataPTT = data;
		updatePTTError = error;
	}
	if (updateCLSError || updatePPError || updatePTTError) {
		const message = updateCLSError
			? {
					error: 'Contrato CLS',
					description: updateCLSError.details
						? updateCLSError.details + ''
						: updateCLSError.message + ''
			  }
			: updatePPError
			? {
					error: 'Contrato PP',
					description: updatePPError.details
						? updatePPError.details + ''
						: updatePPError.message + ''
			  }
			: {
					error: 'Contrato PTT',
					description: updatePTTError.details
						? updatePTTError.details + ''
						: updatePTTError.message + ''
			  };
		throw error(400, { message: message });
	}

	datosRecorrido.CLS = newDataCLS ? newDataCLS[0].id : datosRecorrido.CLS;
	datosRecorrido.PP = newDataPP ? newDataPP[0].id : datosRecorrido.PP;
	datosRecorrido.PTT = newDataPTT ? newDataPTT[0].id : datosRecorrido.PTT;

	const { data: newDataSalud, error: updateSaludError } = await supabase
		.from('datosSalud')
		.update(datosSalud)
		.eq('id', currentSalud[0].id);
	const { data: newDataAcademico, error: updateAcademicoError } = await supabase
		.from('datosAcademicos')
		.update(datosAcademicos)
		.eq('id', currentAcademico[0].id);
	const { data: newDataRecorrido, error: updateRecorridoError } = await supabase
		.from('datosRecorrido')
		.update(datosRecorrido)
		.eq('id', currentRecorrido[0].id);
	const { error: updateAgenteError } = await supabase
		.from('agente')
		.update(agente)
		.eq('id', currentAgente[0].id);

	// chequeamos que todo se actualice bien sino hacemos rollback

	if (updateAcademicoError || updateAgenteError || updateRecorridoError || updateSaludError) {
		const message = updateSaludError
			? {
					error: 'Datos de Salud',
					description: updateSaludError.details
						? updateSaludError.details + ''
						: updateSaludError.message + ''
			  }
			: updateAcademicoError
			? {
					error: 'Datos Academicos',
					description: updateAcademicoError.details
						? updateAcademicoError.details + ''
						: updateAcademicoError.message + ''
			  }
			: updateRecorridoError
			? {
					error: 'Datos Institucionales',
					description: updateRecorridoError.details
						? updateRecorridoError.details + ''
						: updateRecorridoError.message + ''
			  }
			: {
					error: 'Datos Personales',
					description: updateAgenteError?.details
						? updateAgenteError?.details + ''
						: updateAgenteError?.message + ''
			  };
		throw error(400, { message: message });
	}
};
export const actions: Actions = { create, update };
