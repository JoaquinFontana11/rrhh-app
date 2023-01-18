import brie from 'brie';

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

const ausenteRulesFactory = (data) => {
	console.log(data);
	console.log(new Date(data.ausenteActual.fechaInicio).getMonth());
	return {
		ausentesMaximos: {
			criteria: [
				{
					has: {
						trait: 'ausentesTotales',
						comparison: 'equals',
						value: 6
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
						value: new Date(data.ausenteActual.fechaInicio).getMonth()
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
		}
	},
	ausenteRules: (data) =>
		passRules(ausenteDataFormat(data), ausenteRulesFactory(ausenteDataFormat(data)))
};
