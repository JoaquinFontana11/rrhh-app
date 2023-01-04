import type { Action, Actions } from './$types';
import { supabase } from '$lib/supabaseClient';

const create: Action = async ({ request }) => {
	const data = await request.formData();

	const datosAcademicos = {
		carreraUniversitaria: data.get('carreraUniversitaria'),
		carreraPostgrado: data.get('carreraPostgrado'),
		carreraFinalizada: data.get('carreraFinalizada')
	};
	const datosSalud = {
		IOMA: data.get('IOMA'),
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

	console.log(recorrido);

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

	console.log(dataSalud, errorSalud);
	console.log(dataAcademico, errorAcademico);
	console.log(dataRecorrido, errorRecorrido);

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
		//superiorDirecto: data.get('superiorDirecto'),
		superiorDirecto: 1,
		datosSalud: dataSalud[0].id,
		datosAcademicos: dataAcademico[0].id,
		equipo: data.get('equipo'),
		recorrido: dataRecorrido[0].id,
		rol: data.get('rol'),
		direccion: data.get('direccion'),
		activo: data.get('activo')
	};

	const { data: dataAgente, error: errorAgente } = await supabase
		.from('agente')
		.insert(agente)
		.select();

	console.log(dataAgente, errorAgente);
};

export const actions: Actions = { create };