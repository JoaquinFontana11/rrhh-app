import type { Action, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import XLSX from 'xlsx';

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
		consideracion: data.get('consideracion'),
		telefonoContactoEmergencia: data.get('telefonoContactoEmergencia'),
		nombreContactoEmergencia: data.get('nombreContactoEmergencia')
	};
	const datosRecorrido = {
		categoria: data.get('categoria') || null,
		agrupamiento: data.get('agrupamiento') || null,
		numSiape: data.get('numSiape') || null,
		tipoContratacion: data.get('tipoContratacion'),
		referenciaBaja: data.get('referenciaBaja') || null,
		obraSocialActiva: data.get('obraSocialActiva') || null,
		fechaAltaCLS: data.get('fechaAltaCLS') || null,
		fechaBajaCLS: data.get('fechaBajaCLS') || null,
		expedienteAltaCLS: data.get('expedienteAltaCLS') || null,
		actoAltaCLS: data.get('actoAltaCLS') || null,
		fechaAltaPTT: data.get('fechaAltaPTT') || null,
		fechaBajaPTT: data.get('fechaBajaPTT') || null,
		expedienteAltaPTT: data.get('expedienteAltaPTT') || null,
		actoAltaPTT: data.get('actoAltaPTT') || null,
		fechaAltaPP: data.get('fechaAltaPP') || null,
		fechaBajaPP: data.get('fechaBajaPP') || null,
		expedienteAltaPP: data.get('expedienteAltaPP') || null,
		actoAltaPP: data.get('actoAltaPP') || null
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

	if (errorSalud || errorAcademico || errorRecorrido) {
		if (dataSalud) await supabase.from('datosSalud').delete().eq('id', dataSalud[0].id);
		if (dataAcademico)
			await supabase.from('datosAcademicos').delete().eq('id', dataAcademico[0].id);
		if (dataRecorrido) await supabase.from('datosRecorrido').delete().eq('id', dataRecorrido[0].id);
		return fail(400);
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

	if (errorAgente) return fail(400);
};

// TODO: ACTUALIZAR CON LOS NUEVOS DATOS
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
		consideracion: data.get('consideracion'),
		telefonoContactoEmergencia: data.get('telefonoContactoEmergencia'),
		nombreContactoEmergencia: data.get('nombreContactoEmergencia')
	};
	const datosRecorrido = {
		categoria: data.get('categoria') || null,
		agrupamiento: data.get('agrupamiento') || null,
		numSiape: data.get('numSiape') || null,
		tipoContratacion: data.get('tipoContratacion'),
		referenciaBaja: data.get('referenciaBaja') || null,
		obraSocialActiva: data.get('obraSocialActiva') || null,
		fechaAltaCLS: data.get('fechaAltaCLS') || null,
		fechaBajaCLS: data.get('fechaBajaCLS') || null,
		expedienteAltaCLS: data.get('expedienteAltaCLS') || null,
		actoAltaCLS: data.get('actoAltaCLS') || null,
		fechaAltaPTT: data.get('fechaAltaPTT') || null,
		fechaBajaPTT: data.get('fechaBajaPTT') || null,
		expedienteAltaPTT: data.get('expedienteAltaPTT') || null,
		actoAltaPTT: data.get('actoAltaPTT') || null,
		fechaAltaPP: data.get('fechaAltaPP') || null,
		fechaBajaPP: data.get('fechaBajaPP') || null,
		expedienteAltaPP: data.get('expedienteAltaPP') || null,
		actoAltaPP: data.get('actoAltaPP') || null
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
		await supabase.from('datosRecorrido').select('*').eq('id', currentAgente[0].datosRecorrido);

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
		.from('datosRecorrido')
		.update(datosRecorrido)
		.eq('id', currentRecorrido[0].id);
	const { data: newDataRecorrido, error: updateRecorridoError } = await supabase
		.from('agente')
		.update(agente)
		.eq('id', data.get('id'));

	// chequeamos que todo se actualice bien sino hacemos rollback

	if (updateAcademicoError || updateAgenteError || updateRecorridoError || updateSaludError)
		return fail(400);
};

const getDataForExport = async (options = {}) => {
	const { data } = await supabase.from('agente').select('*');
	return data;
};

const exportAgentesExcel: Action = async ({ request }) => {
	const data = await request.formData();
	console.log(data);

	//	const dataExcel = [{ name: 'juan', age: 1 }];
	const dataExcel = await getDataForExport();
	const workSheet = XLSX.utils.json_to_sheet(dataExcel);
	const workBook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja 1');

	const excel = XLSX.write(workBook, { type: 'base64' });
	return {
		excel
	};
};

export const actions: Actions = { create, update, exportAgentesExcel };
