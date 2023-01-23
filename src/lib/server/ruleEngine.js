import brie from 'brie';
import { diffDays, diffMonths } from '$lib/helpers';
// modificamos los datos del ausente con aviso para trabajarlos de mejor forma
const ausenteDataFormat = (rawData) => {
	return {
		ausentesTotales: rawData.dataAusentes.length,
		ultimoAusente:
			rawData.dataAusentes.length !== 0
				? new Date(
						rawData.dataAusentes.sort((ausente1, ausente2) => {
							if (ausente1.fechaInicio > ausente2.fechaInicio) return -1;
							if (ausente1.fechaInicio < ausente2.fechaInicio) return 1;
							return 0;
						})[0].fechaInicio
				  ).getMonth()
				: -1,
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

const vacacionesDataFormat = (rawData) => {
	const recorrido = rawData.agente.datosRecorrido;
	let antiguedad = recorrido.antiguedadExterna;

	if (recorrido.fechaBajaPTT) {
		antiguedad += diffMonths(recorrido.fechaBajaPTT, recorrido.fechaAltaPTT);
	} else if (recorrido.fechaAltaPTT) {
		antiguedad += diffMonths(new Date().toDateString(), recorrido.fechaAltaPTT);
	}

	if (recorrido.fechaBajaPP) {
		antiguedad += diffMonths(recorrido.fechaBajaPP, recorrido.fechaAltaPP);
	} else if (recorrido.fechaAltaPP) {
		antiguedad += diffMonths(new Date().toDateString(), recorrido.fechaAltaPP);
	}

	const mesesActuales = new Date().getMonth() + 1;

	const vacacionesTomadasEsteAño = rawData.dataVacaciones.filter(
		(vacas) => new Date(vacas.fechaInicio).getFullYear() == new Date().getFullYear()
	);

	const vacacionesPrimerPeriodo = vacacionesTomadasEsteAño.find(
		(vacas) => vacas.datosVacaciones.periodo == 1
	);

	return {
		antiguedadTotal: antiguedad,
		diasVacaciones:
			antiguedad - mesesActuales >= 60 ? 21 : antiguedad - mesesActuales >= 120 ? 28 : 14,
		licencia: rawData.licencia,
		vacacionesTomadasEsteAño: vacacionesTomadasEsteAño.length,
		diasPrimerPeriodo: vacacionesPrimerPeriodo
			? diffDays(vacacionesPrimerPeriodo.fechaFin, vacacionesPrimerPeriodo.fechaInicio)
			: 0,
		diasPretendidos: diffDays(rawData.licencia.fechaFin, rawData.licencia.fechaInicio),
		periodo: rawData.datosVacacionesActual.periodo * 1,
		finPrimerPeriodo: new Date(vacacionesPrimerPeriodo?.fechaFin || '1997-01-01').getTime(),
		fechaInicio: new Date(rawData.licencia.fechaInicio).getTime()
	};
};

const vacacionesRulesFactory = (data) => {
	return {
		cantidadMaximaVacaciones: {
			criteria: [
				{
					has: {
						trait: 'vacacionesTomadasEsteAño',
						comparison: 'below',
						value: 1
					}
				}
			]
		},
		cantidadDiasCorrectos: {
			criteria: [
				{
					has: {
						trait: 'diasPretendidos',
						comparison: 'below',
						value: data.diasVacaciones + 1
					}
				}
			],
			criteriaLogic: 'and'
		},
		cantidadDiasSegundoPeriodoCorrectos: {
			criteria: [
				{
					has: {
						trait: 'diasPrimerPeriodo',
						comparison: 'equals',
						value: 0
					}
				},
				{
					has: {
						trait: 'diasPretendidos',
						comparison: 'equals',
						value: data.diasVacaciones - data.diasPrimerPeriodo
					}
				}
			],
			criteriaLogic: 'any'
		},
		cantidadPrimerPeriodo: {
			criteria: [
				{
					has: {
						trait: 'diasPrimerPeriodo',
						comparison: 'equals',
						value: 0
					}
				},
				{
					has: {
						trait: 'periodo',
						comparison: 'equals',
						value: 2
					}
				}
			],
			criteriaLogic: 'any'
		},
		periodoIncorrecto: {
			criteria: [
				{
					has: {
						trait: 'periodo',
						comparison: 'equals',
						value: 1
					}
				},
				{
					has: {
						trait: 'diasPrimerPeriodo',
						comparison: 'above',
						value: 1
					}
				}
			],
			criteriaLogic: 'any'
		},
		fechaSegundoPeriodo: {
			criteria: [
				{
					has: {
						trait: 'periodo',
						comparison: 'equals',
						value: 1
					}
				},
				{
					has: {
						trait: 'fechaInicio',
						comparison: 'above',
						value: data.finPrimerPeriodo
					}
				}
			],
			criteriaLogic: 'any'
		}
	};
};

const academicoRulesFactory = (data) => {
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
		},
		cantidadMaximaVacaciones: {
			error: 'Cantidad maxima de vacaciones',
			description: 'Este agente ya no puede tomar mas vacaciones este año'
		},
		cantidadDiasCorrectos: {
			error: 'Cantidad de dias incorrectos',
			description: 'Ingreso una cantidad de dias que exceden los que puede tomar este agente'
		},
		cantidadDiasSegundoPeriodoCorrectos: {
			error: 'Cantidad de dias del segundo periodo incorrectos',
			description:
				'La cantidad de dias de vacaciones del segundo periodo debe ser igual a la cantidad de dias restantes de vacaciones (dias totales - dias tomados en el primer periodo)'
		},
		cantidadPrimerPeriodo: {
			error: 'Cantidad de periodos exedida',
			description: 'El agente actual ya tomo el primer periodo de sus vacaciones'
		},
		periodoIncorrecto: {
			error: 'Periodo incorrecto',
			description:
				'El agente debe solicitar previamente el primer periodo antes de solicitar el segundo periodo'
		},
		fechaSegundoPeriodo: {
			error: 'Fecha de inicio del segundo periodo incorrecta',
			description:
				'La fecha de inicio del segundo periodo debe ser posterior a la fecha de inicio del primer periodo'
		}
	},
	ausenteRules: (data) =>
		passRules(ausenteDataFormat(data), ausenteRulesFactory(ausenteDataFormat(data))),
	academicoRules: (data) =>
		passRules(academicoDataFormat(data), academicoRulesFactory(academicoDataFormat(data))),
	vacacionesRules: (data) =>
		passRules(vacacionesDataFormat(data), vacacionesRulesFactory(vacacionesDataFormat(data)))
};
