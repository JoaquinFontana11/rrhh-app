import type { IComponentObject, FunctionsObject } from './types';

export const diffDays = (date1: string, date2: string) =>
	Math.ceil((new Date(date1).getTime() - new Date(date2).getTime()) / (1000 * 3600 * 24));

export const diffMonths = (date1: string, date2: string) => {
	return (
		new Date(date1).getMonth() -
		new Date(date2).getMonth() +
		(new Date(date1).getFullYear() - new Date(date2).getFullYear()) * 12
	);
};

export const validateAllNomina = async (
	components: IComponentObject,
	extraValidations: FunctionsObject | boolean = false
) => {
	let error = { message: [], status: false };
	const formData = new FormData();
	for (const key in components) {
		// console.log(components);
		let resExtraValidations;
		for (const component of components[key]) {
			// console.log(component);
			let res;
			let status: boolean = false;
			// console.log(tipoLicencia);
			component.validators.forEach((validator) => {
				//res = component.required ? validator(component.value) : null;
				res = validator(component.value);
				if (res && res.message) error.message.push(`${component.name}: ${res.message}`);
				error.status = res && !res.status ? !res.status : status;
			});
			if (error.status) return { data: error, status: false };
		}
		resExtraValidations = extraValidations[key]
			? extraValidations[key](components[key])
			: { status: false };
		if (resExtraValidations.status) {
			error.message.push(resExtraValidations.message);
			error.status = resExtraValidations.status;
			return { data: error, status: false };
		}
		await Promise.all(
			components[key].map((component) => {
				component.name === 'equipo' ||
				component.name === 'direccion' ||
				component.name === 'superiorDirecto'
					? formData.append(component.name, component.value.id)
					: formData.append(component.name, component.value);
			})
		);
	}
	return { data: formData, status: true };
};

export const validateAllLicencia = async (
	components: IComponentObject,
	extraValidations: FunctionsObject | boolean = false
) => {
	let error = { message: [], status: false };
	const formData = new FormData();
	const iterator: Array<string> = ['datosGenerales', components.datosGenerales[5].value];
	console.log('componente: ', components);
	console.log(components.datosGenerales);
	iterator.forEach(async (key) => {
		// console.log(components);
		let resExtraValidations;
		for (const component of components[key]) {
			console.log('componente: ', component);
			// console.log(component);
			let res;
			let status: boolean = false;
			// console.log(tipoLicencia);
			component.validators.forEach((validator) => {
				//res = component.required ? validator(component.value) : null;
				res = validator(component.value);
				if (res && res.message) error.message.push(`${component.name}: ${res.message}`);
				error.status = res && !res.status ? !res.status : status;
			});
			if (error.status) return { data: error, status: false };
		}
		resExtraValidations = extraValidations[key]
			? extraValidations[key](components[key])
			: { status: false };
		if (resExtraValidations.status) {
			error.message.push(resExtraValidations.message);
			error.status = resExtraValidations.status;
			return { data: error, status: false };
		}
		await Promise.all(
			components[key].map((component) => {
				formData.append(component.name, component.value);
			})
		);
	});
	return { data: formData, status: true };
};
