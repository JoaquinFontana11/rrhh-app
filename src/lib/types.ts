interface datosPersonalesType {
	DNI: number | null;
	CUIT: number | null;
	fechaNacimiento: Date | null;
	domicilio: Date | null;
	emailPersonal: string | null;
	emailInstitucional: string | null;
	telefono: number | null;
	categoria: string | null;
	curriculum: string | null;
	agrupamiento: string | null;
	genero: string | null;
	activo: boolean | null;
}

interface IOption {
	name: string;
	value: string | boolean | number;
}
interface IComponent {
	type: string;
	label: string;
	name: string;
	value: any;
	required?: boolean;
	files?: FileList | Array<File>;
	options?: IOption[];
	images?: Array<Object>;
}

export type { datosPersonalesType, IComponent };
