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
	hidden?: boolean;
	[key: string]: any;
	validators: Array<Function>;
}

interface IComponentObject {
	[key: string]: IComponent[];
}

interface FunctionsObject {
	[key: string]: Function;
}

interface ErrorObject {
	error: string;
	description: string;
}

interface ErrorsArray {
	message: ErrorObject[];
	status: boolean;
}

export type { IComponent, IComponentObject, FunctionsObject, IOption, ErrorObject, ErrorsArray };

// tipos para las tablas que estan en supabase

type Nota = {
	modulo: string;
	nivel: string;
	contenido: string;
	titulo: string;
	id: number;
	created_at: number;
};

type LicenciaSupabase = {
	id: number;
	created_at: string;
	agente: number | AgenteSupabase;
	fechaInicio: string;
	fechaFin: string;
	tipo: 'ausente' | 'vacaciones' | 'otro' | 'teletrabajo' | 'academica' | 'salud';
	observaciones: string;
	autorizadoSiape: boolean;
	borrado: boolean;
	razonBorrado: string | null;
	datosAcademicos:
		| number
		| {
				id: number;
				created_at: string;
				ultimaMateria: boolean;
		  };
	datosSalud:
		| number
		| {
				id: number;
				created_at: string;
				concepto: string;
		  };
	datosTeletrabajo:
		| number
		| {
				id: number;
				created_at: string;
				mailAutorizado: boolean;
				comunicoInicio: boolean;
				comunicoInicioA: number;
				comunicoFin: boolean;
				comunicoFinA: number;
				conectadoATeams: boolean;
		  };
	datosVacaciones:
		| number
		| {
				id: number;
				created_at: string;
				periodo: number;
		  };
};
type FlatLicenciaSupabase = {
	id: number;
	created_at: string;
	agente: number | AgenteSupabase;
	fechaInicio: string;
	fechaFin: string;
	tipo: 'ausente' | 'vacaciones' | 'otro' | 'teletrabajo' | 'academica' | 'salud';
	observaciones: string;
	autorizadoSiape: boolean;
	borrado: boolean;
	razonBorrado: string | null;
	ultimaMateria: boolean;
	concepto: string;
	mailAutorizado: boolean;
	comunicoInicio: boolean;
	comunicoInicioA: number;
	comunicoFin: boolean;
	comunicoFinA: number;
	conectadoATeams: boolean;
	periodo: number;
};
type FlatAgenteSupabase = {
	id: number;
	created_at: string;
	DNI: number;
	CUIT: number;
	fechaNacimiento: string;
	emailPersonal: string;
	telefono: number;
	domicilio: string;
	curriculum: string;
	genero: string;
	activo: boolean;
	nombreCompleto: string;
	tieneHijos: boolean;
	beneficioGuarderia: boolean;
	asignacionFamiliar: boolean;
	rol: string;
	direccion: string;
	equipo: string;
	superiorDirecto: string;
	tipoSangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';
	medicamentos: string;
	consideracion: string;
	obraSocial: string;
	nombreContactoEmergencia: string;
	telefonoContactoEmergencia: number;
	obraSocialActiva: boolean;
	carreraUniversitaria: string;
	carreraPostgrado: string;
	carreraFinalizada: boolean;
	tipoContratacion: 'CLS' | 'PTT' | 'PP';
	emailInstitucional: string;
	fechaBajaCLS: string;
	referenciaBajaCLS: string;
	antiguedadExternaCLS: number;
	fechaAltaCLS: string;
	expedienteAltaCLS: string;
	actoAltaCLS: string;
	referenciaBajaPP: string;
	antiguedadExternaPP: number;
	categoriaPP: number;
	agrupamientoPP: 'tecnico' | 'adminsitrativo' | 'profesional';
	numSiapePP: number;
	fechaAltaPP: string;
	expedienteAltaPP: string;
	actoAltaPP: string;
	fechaBajaPP: string;
	agrupamientoPTT: 'tecnico' | 'adminsitrativo' | 'profesional';
	numSiapePTT: number;
	fechaAltaPTT: string;
	expedienteAltaPTT: string;
	actoAltaPTT: string;
	fechaBajaPTT: string;
	referenciaBajaPTT: string;
	categoriaPTT: number;
	antiguedadExternaPTT: number;
};

type AgenteSupabase = {
	id: number;
	created_at: string;
	DNI: number;
	CUIT: number;
	fechaNacimiento: string;
	emailPersonal: string;
	telefono: number;
	domicilio: string;
	curriculum: string;
	genero: string;
	activo: boolean;
	nombreCompleto: string;
	tieneHijos: boolean;
	beneficioGuarderia: boolean;
	asignacionFamiliar: boolean;
	superiorDirecto: string;
	emailInstitucional: string;
	rol: string;
	direccion:
		| number
		| {
				id: number;
				acronimo: string;
				direccion: string;
				created_at: string;
		  };
	equipo:
		| number
		| {
				id: number;
				equipo: string;
				created_at: string;
				direccion: number;
		  };

	datosSalud:
		| number
		| {
				id: number;
				created_at: string;
				tipoSangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';
				medicamentos: string;
				consideracion: string;
				obraSocial: string;
				telefonoContactoEmergencia: number;
				nombreContactoEmergencia: string;
				obraSocialActiva: boolean;
		  };

	datosAcademicos:
		| number
		| {
				id: number;
				created_at: string;
				carreraUniversitaria: string;
				carreraPostgrado: string;
				carreraFinalizada: boolean;
		  };

	datosRecorrido:
		| number
		| {
				id: number;
				created_at: string;
				tipoContratacion: 'CLS' | 'PTT' | 'PP';
				CLS:
					| number
					| {
							fechaBajaCLS: string;
							referenciaBajaCLS: string;
							antiguedadExternaCLS: number;
							fechaAltaCLS: string;
							expedienteAltaCLS: string;
							actoAltaCLS: string;
					  };
				PP:
					| number
					| {
							referenciaBajaPP: string;
							antiguedadExternaPP: number;
							categoriaPP: number;
							agrupamientoPP: 'tecnico' | 'adminsitrativo' | 'profesional';
							numSiapePP: number;
							fechaAltaPP: string;
							expedienteAltaPP: string;
							actoAltaPP: string;
							fechaBajaPP: string;
					  };
				PTT:
					| number
					| {
							agrupamientoPTT: 'tecnico' | 'adminsitrativo' | 'profesional';
							numSiapePTT: number;
							fechaAltaPTT: string;
							expedienteAltaPTT: string;
							actoAltaPTT: string;
							fechaBajaPTT: string;
							referenciaBajaPTT: string;
							categoriaPTT: number;
							antiguedadExternaPTT: number;
					  };
		  };
};

type DireccionSupabase = {
	id: number;
	acronimo: string;
	direccion: string;
	created_at: string;
};

type EquipoSupabase = {
	id: number;
	equipo: string;
	created_at: string;
	direccion: number;
};

type Usuario = {
	id: number;
	nombre: string;
	apellido: string;
	color: string;
	usuario: string;
	created_at: number;
};
type UsuarioEtiquetado = {
	id: number;
	nota: Nota;
	usuario: Usuario;
	created_at: number;
};

export type {
	Nota,
	AgenteSupabase,
	DireccionSupabase,
	EquipoSupabase,
	FlatAgenteSupabase,
	LicenciaSupabase,
	FlatLicenciaSupabase,
	Usuario,
	UsuarioEtiquetado
};

// tipos utilizados para los stores
export type Filter = {
	field: string;
	filter: 'lt' | 'lte' | 'eq' | 'gt' | 'gte' | 'ilike';
	value: string | number | number[];
};

export type Order = {
	field: string;
	direction: boolean;
};

export type Show = {
	field: string;
};

export type Agente = {
	id: number | null;
	DNI: number;
	CUIT: number;
	fechaNacimiento: string;
	emailPersonal: string;
	telefono: number;
	domicilio: string;
	curriculum: string;
	genero: string;
	activo: boolean;
	nombreCompleto: string;
	tieneHijos: boolean;
	beneficioGuarderia: boolean;
	asignacionFamiliar: boolean;
	superiorDirecto: string;

	tipoSangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';
	medicamentos: string;
	consideracion: string;
	obraSocial: string;
	nombreContactoEmergencia: string;
	telefonoContactoEmergencia: number;
	obraSocialActiva: boolean;

	carreraUniversitaria: string;
	carreraPostgrado: string;
	carreraFinalizada: boolean;

	tipoContratacion: 'CLS' | 'PTT' | 'PP';
	emailInstitucional: string;
	rol: string;
	direccion: string;
	equipo: string;

	fechaBajaCLS: string;
	referenciaBajaCLS: string;
	antiguedadExternaCLS: number;
	fechaAltaCLS: string;
	expedienteAltaCLS: string;
	actoAltaCLS: string;

	referenciaBajaPP: string;
	antiguedadExternaPP: number;
	categoriaPP: number;
	agrupamientoPP: 'tecnico' | 'adminsitrativo' | 'profesional';
	numSiapePP: number;
	fechaAltaPP: string;
	expedienteAltaPP: string;
	actoAltaPP: string;
	fechaBajaPP: string;

	agrupamientoPTT: 'tecnico' | 'adminsitrativo' | 'profesional';
	numSiapePTT: number;
	fechaAltaPTT: string;
	expedienteAltaPTT: string;
	actoAltaPTT: string;
	fechaBajaPTT: string;
	referenciaBajaPTT: string;
	categoriaPTT: number;
	antiguedadExternaPTT: number;
};

export type Licencia = {
	id: number;
	agente: number;
	fechaInicio: string;
	fechaFin: string;
	tipo: string;
	observaciones: Text;
	borrado: boolean;
	razonBorrado: string | null;
	autorizadoSiape: boolean;
	datosSalud: number | null;
	datosTeletrabajo: number | null;
	datosVacaciones: number | null;
	datosAcademicos: number | null;
};
