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
	nombreCompleto: string;
	fechaNacimiento: string;
	domicilio: string;
	emailPersonal: string;
	emailInstitucional: string;
	telefono: number;
	curriculum: string;
	genero: string;
	activo: boolean;
	equipo: string;
	direccion: string;
	rol: string;
	superiorDirecto: string;
	tieneHijos: boolean;
	asignacionFamiliar: boolean;
	beneficioGuarderia: boolean;
	tipoSangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';
	medicamentos: string;
	consideracion: string;
	obraSocial: string;
	telefonoContactoEmergencia: number;
	nombreContactoEmergencia: string;
	carreraUniversitaria: string;
	carreraPostgrado: string;
	carreraFinalizada: boolean;
	categoria: number;
	agrupamiento: 'tecnico' | 'adminsitrativo' | 'profesional';
	numSiape: number;
	tipoContratacion: 'CLS' | 'PPT' | 'PP';
	referenciaBaja: string;
	obraSocialActiva: boolean;
	fechaAltaCLS: string;
	fechaBajaCLS: string;
	expedienteAltaCLS: string;
	actoAltaCLS: string;
	fechaAltaPTT: string;
	fechaBajaPTT: string;
	expedienteAltaPTT: string;
	actoAltaPTT: string;
	fechaAltaPP: string;
	fechaBajaPP: string;
	expedienteAltaPP: string;
	actoAltaPP: string;
	antiguedadExterna: number;
};

type AgenteSupabase = {
	id: number;
	created_at: string;
	DNI: number;
	CUIT: number;
	nombreCompleto: string;
	fechaNacimiento: string;
	domicilio: string;
	emailPersonal: string;
	emailInstitucional: string;
	telefono: number;
	curriculum: string;
	genero: string;
	activo: boolean;
	equipo:
		| number
		| {
				id: number;
				equipo: string;
				created_at: string;
		  };
	direccion:
		| number
		| {
				id: number;
				acronimo: string;
				direccion: string;
				created_at: string;
		  };
	rol: string;
	superiorDirecto: number | AgenteSupabase;
	tieneHijos: boolean;
	asignacionFamiliar: boolean;
	beneficioGuarderia: boolean;
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
				categoria: number;
				agrupamiento: 'tecnico' | 'adminsitrativo' | 'profesional';
				numSiape: number;
				tipoContratacion: 'CLS' | 'PPT' | 'PP';
				referenciaBaja: string;
				obraSocialActiva: boolean;
				fechaAltaCLS: string;
				fechaBajaCLS: string;
				expedienteAltaCLS: string;
				actoAltaCLS: string;
				fechaAltaPTT: string;
				fechaBajaPTT: string;
				expedienteAltaPTT: string;
				actoAltaPTT: string;
				fechaAltaPP: string;
				fechaBajaPP: string;
				expedienteAltaPP: string;
				actoAltaPP: string;
				antiguedadExterna: number;
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
};
export type {
	Nota,
	AgenteSupabase,
	DireccionSupabase,
	EquipoSupabase,
	FlatAgenteSupabase,
	LicenciaSupabase,
	FlatLicenciaSupabase
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
	nombreCompleto: string;
	fechaNacimiento: string;
	domicilio: string;
	emailPersonal: string;
	emailInstitucional: string;
	telefono: number;
	curriculum: string;
	genero: string;
	activo: boolean;
	equipo: number;
	direccion: number;
	rol: string;
	superiorDirecto: number;
	tieneHijos: boolean;
	asignacionFamiliar: boolean;
	beneficioGuarderia: boolean;
	tipoSangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';
	medicamentos: string;
	consideracion: string;
	obraSocial: string;
	telefonoContactoEmergencia: number;
	nombreContactoEmergencia: string;
	carreraUniversitaria: string;
	carreraPostgrado: string;
	carreraFinalizada: boolean;
	categoria: number;
	agrupamiento: 'tecnico' | 'adminsitrativo' | 'profesional';
	numSiape: number;
	tipoContratacion: 'CLS' | 'PPT' | 'PP';
	referenciaBaja: string;
	obraSocialActiva: boolean;
	fechaAltaCLS: string;
	fechaBajaCLS: string;
	expedienteAltaCLS: string;
	actoAltaCLS: string;
	fechaAltaPTT: string;
	fechaBajaPTT: string;
	expedienteAltaPTT: string;
	actoAltaPTT: string;
	fechaAltaPP: string;
	fechaBajaPP: string;
	expedienteAltaPP: string;
	actoAltaPP: string;
	antiguedadExterna: number;
};

export type Licencia = {
	id: number;
	agente: number;
	fechaInicio: string;
	fechaFin: string;
	tipo: string;
	observaciones: Text;
	autorizadoSiape: boolean;
	datosSalud: number | null;
	datosTeletrabajo: number | null;
	datosVacaciones: number | null;
	datosAcademicos: number | null;
};
