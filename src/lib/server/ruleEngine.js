import brie from 'brie';
import { diffDays } from '$lib/helpers';
// modificamos los datos del ausente con aviso para trabajarlos de mejor forma
const ausenteDataFormat = (rawData) => {
	return {
		ausentesTotales: rawData.dataAusentes.length,
		ultimoAusente: new Date(
			rawData.dataAusentes.sort((ausente1, ausente2) => {
				if (ausente1.fechaInicio > ausente2.fechaInicio) return -1;
				if (ausente1.fechaInicio < ausente2.fechaInicio) return 1;
				return 0;
			})[0]?.fechaInicio || 100
		).getMonth(),
		ausenteActual: rawData.licencia
	};
};

const academicoDataFormat = (rawData) => {
	return {
		diasPreExamenTotales:
			rawData.dataAcademica
				.filter((licencia) => !licencia.datosAcademicos.ultimaMateria)
				.reduce((count, licencia) => count + diffDays(licencia.fechaFin, licencia.fechaInicio), 0) +
			diffDays(rawData.licencia.fechaFin, rawData.licencia.fechaInicio),
		diasPreExamenActuales: diffDays(rawData.licencia.fechaFin, rawData.licencia.fechaInicio)
	};
};

const academicoRulesFactory = (data) => {
	console.log(data);
	return {
		diasPreExamenMaximos: {
			criteria: [
				{
					has: {
						trait: 'diasPreExamenTotales',
						comparison: 'below',
						value: 15
					}
				}
			]
		},
		diasPreExamenActuales: {
			criteria: [
				{
					has: {
						trait: 'diasPreExamenActuales',
						comparison: 'below',
						value: 5
					}
				}
			]
		}
	};
};

const ausenteRulesFactory = (data) => {
	console.log(data);
	console.log(new Date(data.ausenteActual.fechaInicio).getMonth());
	return {
		ausentesMaximos: {
			criteria: [
				{
					has: {
						trait: 'ausentesTotales',
						comparison: 'below',
						value: 5
					}
				}
			]
		},
		ausentesMismoMes: {
			criteria: [
				{
					has: {
						trait: 'ultimoAusente',
						comparison: 'below',
						value: new Date(data.ausenteActual.fechaInicio).getMonth() - 1
					}
				}
			]
		}
	};
};

const passRules = (data, rules) => {
	brie.setup({
		data: data,
		features: rules
	});

	const flags = brie.getAll();

	return flags;
};

export default {
	messages: {
		ausentesMaximos: {
			error: 'Cantidad maxima de ausente con avisos',
			description: 'Un agente no puede exceder la cantidad de 6 ausentes con aviso por año'
		},
		ausentesMismoMes: {
			error: 'Cantidad maxima de ausente el mismo mes',
			description: 'Debe existir un lapso de un mes entre cada ausente con aviso'
		},
		diasPreExamenMaximos: {
			error: 'Cantidad maxima de dias de examen',
			description: 'Un agente solo puede solicitar 15 dias pre examen al año'
		},
		diasPreExamenActuales: {
			error: 'Cantidad maxima de dias pre examen por licencia',
			description: 'Un agente solo puede pedirse 5 dias como maximo por licencia academica'
		}
	},
	ausenteRules: (data) =>
		passRules(ausenteDataFormat(data), ausenteRulesFactory(ausenteDataFormat(data))),
	academicoRules: (data) =>
		passRules(academicoDataFormat(data), academicoRulesFactory(academicoDataFormat(data)))
};
