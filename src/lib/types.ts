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
	validators: Array<Function>;
}

interface IComponentObject {
	[key: string]: IComponent[];
}

interface FunctionsObject {
	[key: string]: Function;
}

export type { IComponent, IComponentObject, FunctionsObject };
