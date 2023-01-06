import type { Action, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

const create: Action = async ({ request }) => {
	const data = await request.formData();

	const datosAcademicos = {
		carreraUniversitaria: data.get('carreraUniversitaria'),
		carreraPostgrado: data.get('carreraPostgrado'),
		carreraFinalizada: data.get('carreraFinalizada')
	};
	const datosSalud = {
		obraSocial: data.get('obraSocial'),
		tipoSangre: data.get('tipoSangre'),
		medicamentos: data.get('medicamentos'),
		consideracion: data.get('consideracion')
	};
	const recorrido = {
		antiguedadCLS: data.get('antiguedadCLS') || null,
		antiguedadPPT: data.get('antiguedadPPT') || null,
		plantaTemporaria: data.get('plantaTemporaria') || null,
		ingresoPlantaTemporaria: data.get('ingresoPlantaTemporaria') || null,
		expTramitacionDesignacion: data.get('expTramitacionDesignacion') || null,
		resoDesignacion: data.get('resoDesignacion') || null,
		numSIAPE: data.get('numSIAPE') || null,
		bajaPTT: data.get('bajaPTT') || null,
		expBajaPPT: data.get('expBajaPPT') || null,
		ingresoCLS: data.get('ingresoCLS') || null,
		bajaCLS: data.get('bajaCLS') || null
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
		.from('recorrido')
		.insert(recorrido)
		.select();

	if (errorSalud || errorAcademico || errorRecorrido) {
		if (dataSalud) await supabase.from('datosSalud').delete().eq('id', dataSalud[0].id);
		if (dataAcademico)
			await supabase.from('datosAcademicos').delete().eq('id', dataAcademico[0].id);
		if (dataRecorrido) await supabase.from('recorrido').delete().eq('id', dataRecorrido[0].id);
		return fail(400);
	}

	const agente = {
		DNI: data.get('DNI'),
		CUIT: data.get('CUIT'),
		fechaNacimiento: data.get('fechaNacimiento'),
		domicilio: data.get('domicilio'),
		emailPersonal: data.get('emailPersonal'),
		emailInstitucional: data.get('emailInstitucional'),
		telefono: data.get('telefono'),
		categoria: data.get('categoria'),
		curriculum: data.get('curriculum'),
		agrupamiento: data.get('agrupamiento'),
		genero: data.get('genero'),
		superiorDirecto: 1,
		datosSalud: dataSalud[0].id,
		datosAcademicos: dataAcademico[0].id,
		equipo: data.get('equipo'),
		recorrido: dataRecorrido[0].id,
		rol: data.get('rol'),
		direccion: data.get('direccion'),
		activo: data.get('activo')
	};

	const { error: errorAgente } = await supabase.from('agente').insert(agente).select();

	if (errorAgente) return fail(400);
};

const update: Action = async ({ request }) => {
	const data = await request.formData();

	const datosAcademicos = {
		carreraUniversitaria: data.get('carreraUniversitaria'),
		carreraPostgrado: data.get('carreraPostgrado'),
		carreraFinalizada: data.get('carreraFinalizada')
	};
	const datosSalud = {
		obraSocial: data.get('obraSocial'),
		tipoSangre: data.get('tipoSangre'),
		medicamentos: data.get('medicamentos'),
		consideracion: data.get('consideracion')
	};
	const recorrido = {
		antiguedadCLS: data.get('antiguedadCLS') || null,
		antiguedadPPT: data.get('antiguedadPPT') || null,
		plantaTemporaria: data.get('plantaTemporaria') || null,
		ingresoPlantaTemporaria: data.get('ingresoPlantaTemporaria') || null,
		expTramitacionDesignacion: data.get('expTramitacionDesignacion') || null,
		resoDesignacion: data.get('resoDesignacion') || null,
		numSIAPE: data.get('numSIAPE') || null,
		bajaPTT: data.get('bajaPTT') || null,
		expBajaPPT: data.get('expBajaPPT') || null,
		ingresoCLS: data.get('ingresoCLS') || null,
		bajaCLS: data.get('bajaCLS') || null
	};
	const agente = {
		DNI: data.get('DNI'),
		CUIT: data.get('CUIT'),
		fechaNacimiento: data.get('fechaNacimiento'),
		domicilio: data.get('domicilio'),
		emailPersonal: data.get('emailPersonal'),
		emailInstitucional: data.get('emailInstitucional'),
		telefono: data.get('telefono'),
		categoria: data.get('categoria'),
		curriculum: data.get('curriculum'),
		agrupamiento: data.get('agrupamiento'),
		genero: data.get('genero'),
		equipo: data.get('equipo'),
		rol: data.get('rol'),
		direccion: data.get('direccion'),
		activo: data.get('activo')
	};
	const { data: currentAgente, error: errorAgente }: { data: any; error: any } = await supabase
		.from('agente')
		.select('*')
		.eq('id', data.get('id'));
	const { data: currentSalud, error: errorSalud }: { data: any; error: any } = await supabase
		.from('datosSalud')
		.select('*')
		.eq('id', currentAgente[0].datosSalud);
	const { data: currentAcademico, error: errorAcademico }: { data: any; error: any } =
		await supabase.from('datosAcademicos').select('*').eq('id', currentAgente[0].datosAcademicos);
	const { data: currentRecorrido, error: errorRecorrido }: { data: any; error: any } =
		await supabase.from('recorrido').select('*').eq('id', currentAgente[0].recorrido);

	if (errorAgente || errorSalud || errorAcademico || errorRecorrido) {
		return fail(400);
	}

	// actualizamos los datos
	// TODO: estaria bueno hacer esto una transaccion, pero por el momento no se puede hacer con supabase
	// una alternativa es usar funciones PLSQL pero por el momento estan el alpha en supabase
	const { data: newDataAgente, error: updateAgenteError } = await supabase
		.from('datosSalud')
		.update(datosSalud)
		.eq('id', currentSalud[0].id);

	const { data: newDataSalud, error: updateSaludError } = await supabase
		.from('datosAcademicos')
		.update(datosAcademicos)
		.eq('id', currentAcademico[0].id);
	const { data: newDataAcademico, error: updateAcademicoError } = await supabase
		.from('recorrido')
		.update(recorrido)
		.eq('id', currentRecorrido[0].id);
	const { data: newDataRecorrido, error: updateRecorridoError } = await supabase
		.from('agente')
		.update(agente)
		.eq('id', data.get('id'));

	// chequeamos que todo se actualice bien sino hacemos rollback

	if (updateAcademicoError || updateAgenteError || updateRecorridoError || updateSaludError)
		return fail(400);
};

export const actions: Actions = { create, update };
