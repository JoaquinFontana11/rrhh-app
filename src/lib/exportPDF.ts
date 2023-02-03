import jsPDF, { AcroFormPasswordField } from 'jspdf';
import autoTable from 'jspdf-autotable';

const portada = 'img/pdf/portada.png';

const getActualMonth = () =>
	[
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	][new Date().getMonth()];

export const generatePDF = (data: Array<Object>) => {
	const tableHeader = Object.keys(data[0]);
	let largo = tableHeader.reduce((acumulator, key) => acumulator + key.length, 0);

	const body: Array<Array<any>> = [];

	data.forEach((elem: { [key: string]: any }) => {
		let arrayData: Array<any> = [];
		Object.keys(elem).forEach((keys) => {
			typeof elem[keys] === 'object' && elem[keys] !== null
				? arrayData.push(elem[keys].value)
				: typeof elem[keys] === 'boolean' && elem[keys]
				? arrayData.push('Si')
				: typeof elem[keys] === 'boolean' && !elem[keys]
				? arrayData.push('No')
				: arrayData.push(elem[keys]);
		});
		body.push(arrayData);
	});

	let pdf = new jsPDF();
	pdf.addImage(portada, 'PNG', 0, 0, 210, 300);

	pdf.setTextColor(255, 255, 255);
	pdf.setFontSize(36);
	pdf.setFont('Times', 'times');
	pdf.text('Titulo', 10, 132);
	pdf.setTextColor(0, 0, 0);
	pdf.setFontSize(28);
	pdf.text('SubTitulo', 10, 152);
	pdf.setFontSize(18);
	pdf.text(getActualMonth(), 160, 34);
	pdf.text(new Date().getFullYear() + '', 182, 34);

	pdf.addPage([largo * 2.5, 500], 'l');

	autoTable(pdf, {
		head: [tableHeader],
		body: body
	});

	pdf.save('table.pdf');
};
