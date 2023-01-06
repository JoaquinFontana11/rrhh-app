const factoryValidators = (type: string | null = null) => {
	return (value: any) => {
		let message = '';
		if (type == 'empty' && (value === '' || value === null))
			return {
				message: 'Debe completar este campo',
				status: false
			};
		if (type == 'email' && !/[@.]/.test(value))
			return {
				message: 'No se cumple el formato de email',
				status: false
			};
		return {
			message: '',
			status: true
		};
	};
};

const validateEmptyInput = factoryValidators('empty');
const validateInputEmail = factoryValidators('email');

export { validateEmptyInput, validateInputEmail };
