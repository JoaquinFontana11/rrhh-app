import { utils, write } from 'xlsx';

export const generateBlobExcel = async (data) => {
	console.log(data);

	const workSheet = utils.json_to_sheet(data);
	const workBook = utils.book_new();

	utils.book_append_sheet(workBook, workSheet, 'Hoja 1');

	const excel = write(workBook, { type: 'base64' });

	return b64toBlob(excel);
};

const b64toBlob = (b64, sliceSize = 512) => {
	const byteCharacters = atob(b64);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	});
	return blob;
};
