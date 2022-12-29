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
export type { datosPersonalesType };
