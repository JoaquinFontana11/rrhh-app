import jsPDF, { AcroFormPasswordField } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (data: Array<Object>) => {
	const header = Object.keys(data[0]);
	let largo = header.reduce((acumulator, key) => acumulator + key.length, 0);

	const body: Array<Array<any>> = [];
	data.forEach((elem: { [key: string]: any }) => {
		let arrayData: Array<any> = [];
		Object.keys(elem).forEach((keys) => {
			arrayData.push(elem[keys]);
		});
		body.push(arrayData);
	});
	const pdf = new jsPDF();
	pdf.text('Hola que tal', 100, 100);
	pdf.addPage([largo * 2.5, 500], 'l');

	autoTable(pdf, {
		head: [header],
		body: body
	});

	pdf.save('table.pdf');
};
